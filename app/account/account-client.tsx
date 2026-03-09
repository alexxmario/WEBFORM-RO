"use client";

import { useState, useMemo } from "react";
import { Loader2, User, CreditCard, LogOut, AlertTriangle } from "lucide-react";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { getPlan } from "@/lib/pricing";

interface UserProfile {
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
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Get current plan details
  const currentPlan = initialUser.subscriptionPlan ? getPlan(initialUser.subscriptionPlan) : null;
  const hasActiveSubscription = initialUser.subscriptionStatus === "active";

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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch("/api/subscription/cancel", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
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
      alert(error instanceof Error ? error.message : "Eroare la anularea abonamentului");
    } finally {
      setCancellingSubscription(false);
      setShowCancelConfirm(false);
    }
  };

  return (
    <>
      <Header initialUser={initialUser} />
      <main className="container pb-16 pt-28">
        <div className="mx-auto max-w-2xl space-y-8">
          <div>
            <h1 className="font-display text-3xl font-semibold">Contul meu</h1>
            <p className="mt-1 text-muted-foreground">
              Gestioneaza contul si abonamentul tau
            </p>
          </div>

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
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Plan curent</p>
                    <p className="text-foreground font-medium">{currentPlan.name}</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">Activ</Badge>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Pret</p>
                  <p className="text-foreground">
                    {currentPlan.price} RON / {currentPlan.interval === "year" ? "an" : "luna"}
                  </p>
                </div>

                {initialUser.subscriptionExpiresAt && (
                  <div>
                    <p className="text-sm text-muted-foreground">Expira la</p>
                    <p className="text-foreground">{formatDate(initialUser.subscriptionExpiresAt)}</p>
                  </div>
                )}

                <div className="pt-4 border-t border-border/60">
                  {!showCancelConfirm ? (
                    <Button
                      variant="outline"
                      className="text-red-400 border-red-400/30 hover:bg-red-400/10 hover:text-red-400"
                      onClick={() => setShowCancelConfirm(true)}
                    >
                      Anuleaza abonamentul
                    </Button>
                  ) : (
                    <div className="space-y-3 rounded-xl bg-red-500/10 border border-red-500/20 p-4">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-400">Esti sigur?</p>
                          <p className="text-sm text-muted-foreground">
                            Abonamentul va ramane activ pana la {formatDate(initialUser.subscriptionExpiresAt)},
                            dar nu se va reinnoi automat.
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
                <p className="text-muted-foreground">
                  Nu ai un abonament activ. Aboneaza-te pentru a accesa toate template-urile.
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
