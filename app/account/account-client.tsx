"use client";
import { hasSubscriptionAccess } from "@/lib/subscription";

import { useState, useMemo } from "react";
import {
  Loader2,
  User,
  CreditCard,
  LogOut,
  AlertTriangle,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { getPlan } from "@/lib/pricing";

interface UserProfile {
  isAdmin?: boolean;
  hasStripeBilling?: boolean;
  id: string;
  email: string;
  name?: string;
  subscriptionStatus?: string | null;
  subscriptionPlan?: string | null;
  subscriptionExpiresAt?: string | null;
}

interface AccountClientProps {
  initialUser: UserProfile;
}

export function AccountClient({ initialUser }: AccountClientProps) {
  const supabase = useMemo(supabaseBrowser, []);
  const [cancellingSubscription, setCancellingSubscription] = useState(false);
  const [portalBusy, setPortalBusy] = useState(false);
  const [portalError, setPortalError] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  async function openPortal() {
    setPortalBusy(true);
    setPortalError("");
    try {
      const response = await fetch("/api/subscription/portal", {
        method: "POST",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      window.location.assign(data.url);
    } catch (error) {
      setPortalError(
        error instanceof Error
          ? error.message
          : "Nu putem deschide administrarea plăților.",
      );
      setPortalBusy(false);
    }
  }
  // Get current plan details
  const currentPlan = initialUser.subscriptionPlan
    ? getPlan(initialUser.subscriptionPlan)
    : null;
  const hasActiveSubscription = hasSubscriptionAccess({
    subscription_status: initialUser.subscriptionStatus,
    subscription_expires_at: initialUser.subscriptionExpiresAt,
  });

  // Format expiry date
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("ro-RO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handleCancelSubscription = async () => {
    setCancellingSubscription(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch("/api/subscription/cancel", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Eroare la anularea abonamentului");
      }

      // Refresh the page to update subscription status
      window.location.reload();
    } catch (error) {
      console.error("Cancel error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Eroare la anularea abonamentului",
      );
    } finally {
      setCancellingSubscription(false);
      setShowCancelConfirm(false);
    }
  };

  return (
    <>
      <Header />
      <main className="container pb-16 pt-28">
        <div className="mx-auto max-w-2xl space-y-8">
          <div>
            <h1 className="font-display text-3xl font-semibold">Contul meu</h1>
            <p className="mt-1 text-muted-foreground">
              Gestionează proiectul și abonamentul tău
            </p>
          </div>

          {initialUser.isAdmin && (
            <Link href="/admin" className="action action-dark">
              Deschide panoul de administrare ↗
            </Link>
          )}

          <Link
            href="/chat"
            className="flex items-center gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-6 transition hover:border-primary/50"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Chat-ul proiectului</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Întrebări, versiuni ale site-ului, modificări și aprobarea
                finală.
              </p>
            </div>
          </Link>

          {/* Profile Section */}
          <div className="rounded-2xl border border-border/60 bg-card/80 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">Profil</h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-foreground">{initialUser.email}</p>
              </div>
              {initialUser.name && (
                <div>
                  <p className="text-sm text-muted-foreground">Nume</p>
                  <p className="text-foreground">{initialUser.name}</p>
                </div>
              )}
            </div>
          </div>

          {initialUser.hasStripeBilling && (
            <section className="rounded-2xl border border-border/60 bg-card/80 p-6 space-y-4">
              <h2 className="text-lg font-semibold">Plăți și facturi Stripe</h2>
              <p className="text-sm text-muted-foreground">
                Poți actualiza cardul și descărca facturile. Dacă o reînnoire a
                eșuat, actualizează metoda de plată; accesul se reactivează după
                confirmarea plății.
              </p>
              <Button
                variant="outline"
                onClick={openPortal}
                disabled={portalBusy}
              >
                {portalBusy
                  ? "Se deschide…"
                  : "Gestionează cardul și facturile"}
              </Button>
              {portalError && <p role="alert">{portalError}</p>}
              {!hasActiveSubscription && (
                <Button
                  variant="outline"
                  onClick={handleCancelSubscription}
                  disabled={cancellingSubscription}
                >
                  Oprește reînnoirea abonamentului
                </Button>
              )}
            </section>
          )}
          {/* Subscription Section */}
          <div className="rounded-2xl border border-border/60 bg-card/80 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">Abonament</h2>
            </div>

            {hasActiveSubscription && currentPlan ? (
              <div className="space-y-4">
                <Link href="/start" className="text-primary underline">
                  Deschide proiectul
                </Link>
                <Link href="/chat" className="ml-4 text-primary underline">
                  Chat proiect
                </Link>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Plan curent</p>
                    <p className="text-foreground font-medium">
                      {currentPlan.name}
                    </p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">
                    {initialUser.subscriptionStatus === "cancelled"
                      ? "Anulat · acces până la expirare"
                      : "Activ"}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Pret</p>
                  <p className="text-foreground">
                    {currentPlan.price} RON /{" "}
                    {currentPlan.interval === "year" ? "an" : "luna"}
                  </p>
                </div>

                {initialUser.subscriptionExpiresAt && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {initialUser.hasStripeBilling &&
                      initialUser.subscriptionStatus !== "cancelled"
                        ? "Perioadă plătită până la"
                        : "Expiră la"}
                    </p>
                    <p className="text-foreground">
                      {formatDate(initialUser.subscriptionExpiresAt)}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-border/60">
                  {!showCancelConfirm ? (
                    <Button
                      variant="outline"
                      className="text-red-400 border-red-400/30 hover:bg-red-400/10 hover:text-red-400"
                      disabled={initialUser.subscriptionStatus === "cancelled"}
                      onClick={() => setShowCancelConfirm(true)}
                    >
                      Anuleaza abonamentul
                    </Button>
                  ) : (
                    <div className="space-y-3 rounded-xl bg-red-500/10 border border-red-500/20 p-4">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-400">
                            Esti sigur?
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Abonamentul va ramane activ pana la{" "}
                            {formatDate(initialUser.subscriptionExpiresAt)}, iar
                            serviciul se încheie la expirarea perioadei plătite.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowCancelConfirm(false)}
                          disabled={cancellingSubscription}
                        >
                          Renunta
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-500 hover:bg-red-600 text-white"
                          onClick={handleCancelSubscription}
                          disabled={cancellingSubscription}
                        >
                          {cancellingSubscription ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Se anuleaza...
                            </>
                          ) : (
                            "Da, anuleaza"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Link href="/start" className="text-primary underline">
                  Deschide proiectul
                </Link>
                <Link href="/chat" className="ml-4 text-primary underline">
                  Chat proiect
                </Link>
                <p className="text-muted-foreground">
                  Nu ai un abonament activ. Aboneaza-te pentru a accesa toate
                  template-urile.
                </p>
                <Button asChild>
                  <Link href="/subscribe">Vezi planurile</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Sign Out */}
          <div className="rounded-2xl border border-border/60 bg-card/80 p-6">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Deconecteaza-te
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
