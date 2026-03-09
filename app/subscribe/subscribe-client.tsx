"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPlansByTier, getMonthlyEquivalent, getPlan, type Plan } from "@/lib/pricing";

type BillingInterval = "month" | "year";

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  subscriptionStatus?: string | null;
  subscriptionPlan?: string | null;
  subscriptionExpiresAt?: string | null;
}

interface SubscribeClientProps {
  initialUser: UserProfile;
}

export function SubscribeClient({ initialUser }: SubscribeClientProps) {
  const router = useRouter();
  const [billingInterval, setBillingInterval] = useState<BillingInterval>("month");

  const plans = getPlansByTier();

  // Get user's current plan tier (if any)
  const currentPlan = initialUser.subscriptionPlan ? getPlan(initialUser.subscriptionPlan) : null;
  const currentTier = currentPlan?.tier || null;

  const handleSubscribe = async (plan: Plan) => {
    // Redirect to billing page with plan ID
    router.push(`/subscribe/billing?planId=${plan.id}`);
  };

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
            isCurrentPlan={currentTier === "standard"}
          />

          {/* Business Plan */}
          <PricingCard
            plan={billingInterval === "month" ? plans.business.monthly : plans.business.yearly}
            billingInterval={billingInterval}
            onSubscribe={handleSubscribe}
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
  popular?: boolean;
  isCurrentPlan?: boolean;
}

function PricingCard({ plan, billingInterval, onSubscribe, popular, isCurrentPlan }: PricingCardProps) {
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
        disabled={isCurrentPlan}
        className={`w-full ${
          isCurrentPlan
            ? "bg-green-500/20 text-green-400 hover:bg-green-500/20 cursor-default"
            : popular
            ? ""
            : "bg-muted text-foreground hover:bg-muted/80"
        }`}
        size="lg"
      >
        {isCurrentPlan ? (
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
