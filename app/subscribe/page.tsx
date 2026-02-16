"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { getPlansByTier, getMonthlyEquivalent, getPlan, type Plan } from "@/lib/pricing";

type BillingInterval = "month" | "year";

export default function SubscribePage() {
  const router = useRouter();
  const supabase = useMemo(supabaseBrowser, []);
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [billingInterval, setBillingInterval] = useState<BillingInterval>("year");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const plans = getPlansByTier();

  // Get user's current plan tier (if any)
  const currentPlan = user?.subscriptionPlan ? getPlan(user.subscriptionPlan) : null;
  const currentTier = currentPlan?.tier || null;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login?redirect=/subscribe");
    }
  }, [authLoading, isAuthenticated, router]);

  const handleSubscribe = async (plan: Plan) => {
    if (!user) {
      router.push("/login?redirect=/subscribe");
      return;
    }

    setLoadingPlan(plan.id);

    try {
      // Get the current session for the access token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        router.push("/login?redirect=/subscribe");
        return;
      }

      // Dynamically import and collect browser info for Netopia
      const { collectBrowserInfo } = await import("netopia-card");
      const browserInfo = collectBrowserInfo(navigator, window);

      const response = await fetch("/api/payments/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          planId: plan.id,
          browserData: browserInfo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Eroare la initierea platii");
      }

      // Redirect to Netopia payment page
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error("Nu s-a primit URL-ul de plata");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert(error instanceof Error ? error.message : "Eroare la procesarea platii");
      setLoadingPlan(null);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="container space-y-10 pb-16 pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <Badge>Abonament</Badge>
          <h1 className="mt-3 font-display text-4xl font-semibold">
            Alege planul potrivit pentru tine
          </h1>
          <p className="mt-2 text-muted-foreground">
            Acces complet la toate template-urile noastre profesionale. Anulezi oricand.
          </p>

          {/* Billing toggle */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => setBillingInterval("month")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                billingInterval === "month"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              Lunar
            </button>
            <button
              onClick={() => setBillingInterval("year")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                billingInterval === "year"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              Anual
              <span className="ml-1.5 rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
                -10%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {/* Standard Plan */}
          <PricingCard
            plan={billingInterval === "month" ? plans.standard.monthly : plans.standard.yearly}
            billingInterval={billingInterval}
            onSubscribe={handleSubscribe}
            loading={loadingPlan === (billingInterval === "month" ? plans.standard.monthly.id : plans.standard.yearly.id)}
            isCurrentPlan={currentTier === "standard"}
          />

          {/* Business Plan */}
          <PricingCard
            plan={billingInterval === "month" ? plans.business.monthly : plans.business.yearly}
            billingInterval={billingInterval}
            onSubscribe={handleSubscribe}
            loading={loadingPlan === (billingInterval === "month" ? plans.business.monthly.id : plans.business.yearly.id)}
            popular
            isCurrentPlan={currentTier === "business"}
          />
        </div>

        {/* Trust badges */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm text-muted-foreground">
            Platile sunt procesate securizat prin Netopia mobilPay. <br />
            Poti anula abonamentul oricand din contul tau.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

interface PricingCardProps {
  plan: Plan;
  billingInterval: BillingInterval;
  onSubscribe: (plan: Plan) => void;
  loading?: boolean;
  popular?: boolean;
  isCurrentPlan?: boolean;
}

function PricingCard({ plan, billingInterval, onSubscribe, loading, popular, isCurrentPlan }: PricingCardProps) {
  const monthlyEquivalent = getMonthlyEquivalent(plan);

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 shadow-lg transition ${
        isCurrentPlan
          ? "border-green-500/50 bg-card ring-2 ring-green-500/20"
          : popular
          ? "border-primary/50 bg-card shadow-glow"
          : "border-border/60 bg-card/70"
      }`}
    >
      {isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-green-500 text-white">Planul tău actual</Badge>
        </div>
      )}
      {!isCurrentPlan && popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground">Recomandat</Badge>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground">{plan.name.replace(" Anual", "")}</h3>
        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-4xl font-bold text-foreground">
            {monthlyEquivalent}
          </span>
          <span className="text-muted-foreground">RON/luna</span>
        </div>
        {billingInterval === "year" && (
          <p className="mt-1 text-sm text-muted-foreground">
            Facturat anual ({plan.price} RON/an)
          </p>
        )}
        {plan.savings && (
          <p className="mt-1 text-sm text-green-400">
            Economisesti {plan.savings}
          </p>
        )}
      </div>

      <ul className="mb-6 flex-1 space-y-3">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
            <Check className="h-4 w-4 shrink-0 text-green-400" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        onClick={() => onSubscribe(plan)}
        disabled={loading || isCurrentPlan}
        className={`w-full ${
          isCurrentPlan
            ? "bg-green-500/20 text-green-400 hover:bg-green-500/20 cursor-default"
            : popular
            ? ""
            : "bg-muted text-foreground hover:bg-muted/80"
        }`}
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Se procesează...
          </>
        ) : isCurrentPlan ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Planul tău actual
          </>
        ) : (
          "Abonează-te acum"
        )}
      </Button>
    </div>
  );
}
