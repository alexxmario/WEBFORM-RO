"use client";

import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  ArrowLeft,
  Building2,
  User,
  BadgePercent,
} from "lucide-react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { type Plan, getMonthlyEquivalent } from "@/lib/pricing";
import {
  getPromotion,
  normalizePromotionCode,
  promotionPrice,
} from "@/lib/promotions";
import {
  JUDETE,
  getLocalitatiByJudet,
  REG_COM_JUDETE,
} from "@/lib/data/romania-locations";
import {
  type BillingInfo,
  type IndividualBilling,
  type CompanyBilling,
  billingSchema,
  defaultIndividualBilling,
  defaultCompanyBilling,
} from "@/lib/schemas/billing";

interface BillingClientProps {
  plan: Plan;
  initialName: string;
  initialPhone: string;
}

type BillingType = "individual" | "company";

export function BillingClient({
  plan,
  initialName,
  initialPhone,
}: BillingClientProps) {
  const router = useRouter();
  const supabase = useMemo(supabaseBrowser, []);
  const [loading, setLoading] = useState(false);
  const [billingType, setBillingType] = useState<BillingType>("individual");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const promotion = getPromotion(appliedPromoCode);
  const discounted = promotion ? promotionPrice(plan, promotion) : null;

  // Individual form state
  const [individual, setIndividual] = useState<IndividualBilling>({
    ...defaultIndividualBilling,
    name: initialName,
    phone: initialPhone,
  });

  // Company form state
  const [company, setCompany] = useState<CompanyBilling>(defaultCompanyBilling);

  // Get cities based on selected county
  const individualCities = getLocalitatiByJudet(individual.county);
  const hqCities = getLocalitatiByJudet(company.hqCounty);
  const deliveryCities = getLocalitatiByJudet(company.deliveryCounty);

  const requestKey = useRef<string | null>(null);
  const requestFingerprint = useRef<string | null>(null);
  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});

    try {
      // Build billing data based on type
      const billingData: BillingInfo =
        billingType === "individual" ? individual : company;

      // Validate with zod
      const result = billingSchema.safeParse(billingData);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          const path = err.path.join(".");
          fieldErrors[path] = err.message;
        });
        setErrors(fieldErrors);
        setLoading(false);
        return;
      }

      // Get session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        router.push(`/login?redirect=/subscribe/billing?planId=${plan.id}`);
        return;
      }

      const digest = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(
          JSON.stringify({
            user: session.user.id,
            planId: plan.id,
            amount: plan.price,
            promoCode: appliedPromoCode,
            billingInfo: result.data,
          }),
        ),
      );
      const fingerprint = Array.from(new Uint8Array(digest), (b) =>
        b.toString(16).padStart(2, "0"),
      ).join("");
      const storageKey = `webform-checkout-${fingerprint}`;
      let checkoutKey =
        requestFingerprint.current === fingerprint && requestKey.current
          ? requestKey.current
          : crypto.randomUUID();
      requestFingerprint.current = fingerprint;
      try {
        checkoutKey = sessionStorage.getItem(storageKey) || checkoutKey;
        sessionStorage.setItem(storageKey, checkoutKey);
      } catch {
        /* Private browsing may disable storage; the mounted form still retains its key. */
      }
      requestKey.current = checkoutKey;

      // Collect browser info for Netopia
      const { collectBrowserInfo } = await import("netopia-card");
      const browserInfo = collectBrowserInfo(navigator, window);

      // Call payment API with billing info
      const response = await fetch("/api/payments/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          planId: plan.id,
          requestKey: checkoutKey,
          browserData: browserInfo,
          billingInfo: result.data,
          promoCode: appliedPromoCode || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Eroare la initierea platii");
      }

      // Redirect to Netopia payment page
      if (data.paymentUrl) {
        try {
          sessionStorage.setItem(
            `webform-checkout-order-${data.orderId}`,
            storageKey,
          );
        } catch {}
        window.location.href = data.paymentUrl;
      } else {
        throw new Error("Nu s-a primit URL-ul de plata");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setErrors({
        payment:
          error instanceof Error
            ? error.message
            : "Eroare la procesarea plății",
      });
      setLoading(false);
    }
  };

  const monthlyEquivalent = getMonthlyEquivalent(plan);
  const discountedMonthlyEquivalent = discounted
    ? plan.interval === "year"
      ? discounted.finalPrice / 12
      : discounted.finalPrice
    : null;

  return (
    <>
      <Header />
      <main className="container pb-16 pt-28">
        <div className="mx-auto max-w-2xl">
          {/* Back button */}
          <button
            onClick={() => router.push("/subscribe")}
            className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Inapoi la alegerea planului
          </button>

          {/* Plan summary */}
          <div className="mb-8 rounded-xl border border-border/60 bg-card/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Planul selectat</p>
                <p className="text-lg font-semibold">{plan.name}</p>
              </div>
              <div className="text-right">
                {discounted ? (
                  <>
                    <p className="text-sm text-muted-foreground line-through">
                      {monthlyEquivalent} RON
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {discountedMonthlyEquivalent} RON
                    </p>
                  </>
                ) : (
                  <p className="text-2xl font-bold">{monthlyEquivalent} RON</p>
                )}
                <p className="text-sm text-muted-foreground">
                  {plan.interval === "year"
                    ? `/luna (facturat anual ${discounted?.finalPrice ?? plan.price} RON)`
                    : "/luna"}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8 rounded-xl border border-border/60 bg-card/50 p-4">
            <label
              htmlFor="promo-code"
              className="mb-2 flex items-center gap-2 text-sm font-medium"
            >
              <BadgePercent className="h-4 w-4 text-primary" />
              Ai un cod promoțional?
            </label>
            <div className="flex gap-2">
              <Input
                id="promo-code"
                value={promoCode}
                onChange={(event) => {
                  setPromoCode(event.target.value);
                  setErrors((current) => ({ ...current, promoCode: "" }));
                }}
                placeholder="Introdu codul"
                autoCapitalize="characters"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const normalized = normalizePromotionCode(promoCode);
                  if (!getPromotion(normalized)) {
                    setAppliedPromoCode(null);
                    setErrors((current) => ({
                      ...current,
                      promoCode: "Codul promoțional nu este valid.",
                    }));
                    return;
                  }
                  setPromoCode(normalized);
                  setAppliedPromoCode(normalized);
                  setErrors((current) => ({ ...current, promoCode: "" }));
                }}
              >
                Aplică
              </Button>
            </div>
            {errors.promoCode && (
              <p className="mt-2 text-sm text-red-500">{errors.promoCode}</p>
            )}
            {promotion && discounted && (
              <p className="mt-2 text-sm text-green-400">
                Cod aplicat: {promotion.code}. Economisești {discounted.discount}{" "}
                RON la această plată.
              </p>
            )}
          </div>

          <p className="mb-6 text-sm text-muted-foreground">
            Plătești perioada selectată. Reînnoirea se face din cont, printr-o
            plată nouă; nu debităm automat cardul. Dacă treci la alt nivel
            (Start/Business), noua perioadă începe imediat, fără calcul
            proporțional pentru perioada anterioară.
          </p>
          {/* Billing type selection */}
          <h2 className="mb-4 text-xl font-semibold">Vreau factura pe:</h2>
          <div className="mb-8 grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setBillingType("individual")}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-6 transition ${
                billingType === "individual"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-border/80"
              }`}
            >
              <User
                className={`h-8 w-8 ${billingType === "individual" ? "text-primary" : "text-muted-foreground"}`}
              />
              <span
                className={`font-medium ${billingType === "individual" ? "text-primary" : ""}`}
              >
                Persoana fizica
              </span>
            </button>
            <button
              type="button"
              onClick={() => setBillingType("company")}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-6 transition ${
                billingType === "company"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-border/80"
              }`}
            >
              <Building2
                className={`h-8 w-8 ${billingType === "company" ? "text-primary" : "text-muted-foreground"}`}
              />
              <span
                className={`font-medium ${billingType === "company" ? "text-primary" : ""}`}
              >
                Persoana juridica
              </span>
            </button>
          </div>

          {errors.payment && (
            <p
              role="alert"
              className="mb-6 rounded-lg border border-red-500/30 p-4 text-red-700"
            >
              {errors.payment}
            </p>
          )}
          {/* Individual form */}
          {billingType === "individual" && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Nume
                  </label>
                  <Input
                    value={individual.name}
                    onChange={(e) =>
                      setIndividual({ ...individual, name: e.target.value })
                    }
                    placeholder="ex: Popescu Alexandru"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Numar de telefon
                  </label>
                  <Input
                    value={individual.phone}
                    onChange={(e) =>
                      setIndividual({ ...individual, phone: e.target.value })
                    }
                    placeholder="07xxxxxxxx"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Judet
                  </label>
                  <Select
                    value={individual.county}
                    onValueChange={(value) =>
                      setIndividual({ ...individual, county: value, city: "" })
                    }
                  >
                    <SelectTrigger
                      className={errors.county ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Selectati" />
                    </SelectTrigger>
                    <SelectContent>
                      {JUDETE.map((judet) => (
                        <SelectItem key={judet.code} value={judet.code}>
                          {judet.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.county && (
                    <p className="mt-1 text-sm text-red-500">{errors.county}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Localitate
                  </label>
                  <Select
                    value={individual.city}
                    onValueChange={(value) =>
                      setIndividual({ ...individual, city: value })
                    }
                    disabled={!individual.county}
                  >
                    <SelectTrigger
                      className={errors.city ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Selectati" />
                    </SelectTrigger>
                    <SelectContent>
                      {individualCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Adresa
                </label>
                <Input
                  value={individual.address}
                  onChange={(e) =>
                    setIndividual({ ...individual, address: e.target.value })
                  }
                  placeholder="ex: Strada, numar, bloc, scara, etaj, apartament"
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                )}
              </div>
            </div>
          )}

          {/* Company form */}
          {billingType === "company" && (
            <div className="space-y-8">
              {/* Company details section */}
              <section>
                <h3 className="mb-4 font-semibold">Detalii companie</h3>
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">
                        Nume firma
                      </label>
                      <Input
                        value={company.companyName}
                        onChange={(e) =>
                          setCompany({
                            ...company,
                            companyName: e.target.value,
                          })
                        }
                        className={errors.companyName ? "border-red-500" : ""}
                      />
                      {errors.companyName && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.companyName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">
                        Cod unic de Inregistrare
                      </label>
                      <div className="flex gap-2">
                        <Select
                          value={company.cuiPrefix || undefined}
                          onValueChange={(value) =>
                            setCompany({
                              ...company,
                              cuiPrefix: (value === "_none" ? "" : value) as
                                | ""
                                | "RO",
                            })
                          }
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue placeholder="-" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="_none">-</SelectItem>
                            <SelectItem value="RO">RO</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          value={company.cui}
                          onChange={(e) =>
                            setCompany({ ...company, cui: e.target.value })
                          }
                          className={`flex-1 ${errors.cui ? "border-red-500" : ""}`}
                        />
                      </div>
                      {errors.cui && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.cui}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Numar de inregistrare in Registrul Comertului
                    </label>
                    <div className="flex gap-2">
                      <Select
                        value={company.regComCounty || undefined}
                        onValueChange={(value) =>
                          setCompany({
                            ...company,
                            regComCounty: value === "_none" ? "" : value,
                          })
                        }
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue placeholder="-" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="_none">-</SelectItem>
                          {REG_COM_JUDETE.map((j) => (
                            <SelectItem key={j.code} value={j.code}>
                              J{j.code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={company.regComType || undefined}
                        onValueChange={(value) =>
                          setCompany({
                            ...company,
                            regComType: value === "_none" ? "" : value,
                          })
                        }
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue placeholder="--" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="_none">--</SelectItem>
                          {Array.from({ length: 99 }, (_, i) => i + 1).map(
                            (n) => (
                              <SelectItem key={n} value={String(n)}>
                                {n}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      <Input
                        value={company.regComNumber}
                        onChange={(e) =>
                          setCompany({
                            ...company,
                            regComNumber: e.target.value,
                          })
                        }
                        className="flex-1"
                        placeholder=""
                      />
                      <Select
                        value={company.regComYear || undefined}
                        onValueChange={(value) =>
                          setCompany({
                            ...company,
                            regComYear: value === "_none" ? "" : value,
                          })
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="----" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="_none">----</SelectItem>
                          {Array.from({ length: 35 }, (_, i) => 2026 - i).map(
                            (year) => (
                              <SelectItem key={year} value={String(year)}>
                                {year}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">
                        Banca
                      </label>
                      <Input
                        value={company.bankName}
                        onChange={(e) =>
                          setCompany({ ...company, bankName: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">
                        Cont IBAN
                      </label>
                      <Input
                        value={company.iban}
                        onChange={(e) =>
                          setCompany({ ...company, iban: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Headquarters section */}
              <section>
                <h3 className="mb-4 font-semibold">Sediu social</h3>
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">
                        Judet
                      </label>
                      <Select
                        value={company.hqCounty}
                        onValueChange={(value) =>
                          setCompany({
                            ...company,
                            hqCounty: value,
                            hqCity: "",
                          })
                        }
                      >
                        <SelectTrigger
                          className={errors.hqCounty ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Selectati" />
                        </SelectTrigger>
                        <SelectContent>
                          {JUDETE.map((judet) => (
                            <SelectItem key={judet.code} value={judet.code}>
                              {judet.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.hqCounty && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.hqCounty}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">
                        Localitate
                      </label>
                      <Select
                        value={company.hqCity}
                        onValueChange={(value) =>
                          setCompany({ ...company, hqCity: value })
                        }
                        disabled={!company.hqCounty}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selectati" />
                        </SelectTrigger>
                        <SelectContent>
                          {hqCities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Adresa
                    </label>
                    <Input
                      value={company.hqAddress}
                      onChange={(e) =>
                        setCompany({ ...company, hqAddress: e.target.value })
                      }
                      placeholder="ex: Strada, numar, bloc, scara, etaj, apartament"
                      className={errors.hqAddress ? "border-red-500" : ""}
                    />
                    {errors.hqAddress && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.hqAddress}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* Contact person section */}
              <section>
                <h3 className="mb-4 font-semibold">Persoana de contact</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Nume
                    </label>
                    <Input
                      value={company.contactName}
                      onChange={(e) =>
                        setCompany({ ...company, contactName: e.target.value })
                      }
                      placeholder="ex: Popescu Alexandru"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Numar de telefon
                    </label>
                    <Input
                      value={company.contactPhone}
                      onChange={(e) =>
                        setCompany({ ...company, contactPhone: e.target.value })
                      }
                      placeholder="07xxxxxxxx"
                    />
                  </div>
                </div>
              </section>

              {/* Delivery address section */}
              <section>
                <h3 className="mb-4 font-semibold">Adresa de livrare</h3>
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">
                        Judet
                      </label>
                      <Select
                        value={company.deliveryCounty}
                        onValueChange={(value) =>
                          setCompany({
                            ...company,
                            deliveryCounty: value,
                            deliveryCity: "",
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selectati" />
                        </SelectTrigger>
                        <SelectContent>
                          {JUDETE.map((judet) => (
                            <SelectItem key={judet.code} value={judet.code}>
                              {judet.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">
                        Localitate
                      </label>
                      <Select
                        value={company.deliveryCity}
                        onValueChange={(value) =>
                          setCompany({ ...company, deliveryCity: value })
                        }
                        disabled={!company.deliveryCounty}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selectati" />
                        </SelectTrigger>
                        <SelectContent>
                          {deliveryCities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Adresa
                    </label>
                    <Input
                      value={company.deliveryAddress}
                      onChange={(e) =>
                        setCompany({
                          ...company,
                          deliveryAddress: e.target.value,
                        })
                      }
                      placeholder="ex: Strada, numar, bloc, scara, etaj, apartament"
                    />
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Submit button */}
          <div className="mt-8">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Se proceseaza...
                </>
              ) : (
                "Salveaza"
              )}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
