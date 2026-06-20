"use client";

import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

import { Header } from "@/components/Header";
import { HeroInteractive } from "@/components/HeroInteractive";
import { LazySpline } from "@/components/LazySpline";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { homePageJsonLd } from "@/lib/schema";
import { toast } from "sonner";

type BillingInterval = "month" | "year";

export default function HomePage() {
  const [notifyDialogOpen, setNotifyDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [billingInterval, setBillingInterval] = useState<BillingInterval>("month");
  const missionSectionRef = useRef<HTMLElement>(null);

  const handleNotifySubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would send the email to your backend
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success("Vei fi notificat când e-commerce va fi disponibil!");
      setEmail("");
      setNotifyDialogOpen(false);
    } catch {
      toast.error("Ceva nu a mers bine. Te rugăm să încerci din nou.");
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  useEffect(() => {
    const el = missionSectionRef.current;
    if (!el) return;

    el.classList.add("animate-in");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.remove("animate-in");
            el.classList.add("visible");
            observer.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Header />
      <main id="main" className="relative z-10 space-y-32 pb-32 pt-16">
        <HeroInteractive />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .mission-section {
                opacity: 1;
                transform: translateY(0);
                transition: opacity 700ms ease, transform 700ms ease;
              }
              .mission-section.animate-in {
                opacity: 0;
                transform: translateY(16px);
              }
              .mission-section.visible {
                opacity: 1;
                transform: translateY(0);
              }
            `,
          }}
        />
        <section ref={missionSectionRef} className="mission-section section-blur section-fade container max-w-5xl text-center">
          <h2 className="text-display-sm md:text-display-md text-foreground" style={{ textWrap: "balance" }}>
            Construim, găzduim și actualizăm site&#8209;ul tău. Tu te concentrezi pe afacere.
          </h2>
        </section>

        <section
          className="relative z-10 w-screen max-w-none px-0 -mb-16"
          style={{
            marginLeft: "calc(50% - 50vw)",
            marginRight: "calc(50% - 50vw)",
            width: "100vw",
          }}
        >
          <LazySpline />
        </section>

        {/* Features */}
        <section className="section-blur section-fade py-20">
          <div className="container max-w-5xl space-y-16">
            <div className="mx-auto max-w-2xl text-center space-y-4">
              <h2 className="text-display-md text-foreground" style={{ textWrap: "balance" }}>Tot ce ai nevoie pentru lansare</h2>
              <p className="text-body-lg text-muted-foreground">
                Dezvoltare bazată pe șabloane, verificări asincrone și găzduire de producție—fără întâlniri.
              </p>
            </div>

            <div className="space-y-px rounded-xl border border-border overflow-hidden">
              {[
                { title: "Bibliotecă de șabloane", desc: "20+ layout-uri premium. Schimbă oricând fără timp de nefuncționare." },
                { title: "Verificări asincrone", desc: "Wireframe → design → previzualizare finală fără apeluri necesare." },
                { title: "Găzduire & domeniu", desc: "SSL, domenii și analiză incluse. Gestionăm infrastructura pentru tine." },
                { title: "Actualizări în 3 zile", desc: "Modificări bazate pe coadă cu previzualizări clare și aprobări." },
                { title: "Integrări", desc: "Calendly, formulare, taguri CRM și scripturi personalizate făcute pentru tine." },
                { title: "Export disponibil", desc: "Export complet disponibil ca serviciu plătit dacă ai nevoie să muți." },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col gap-1 border-b border-border last:border-b-0 bg-card px-6 py-5 sm:flex-row sm:items-baseline sm:gap-8"
                >
                  <h3 className="text-heading-sm text-foreground sm:w-56 sm:shrink-0">{item.title}</h3>
                  <p className="text-body-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="section-blur section-fade py-20">
          <div className="container max-w-5xl space-y-20">
            <div className="mx-auto max-w-2xl text-center space-y-4">
              <h2 className="text-display-md text-foreground" style={{ textWrap: "balance" }}>Cum Funcționează WebForm</h2>
              <p className="text-body-lg text-muted-foreground">
                Trimiți un Blueprint, alegi un aspect, livrăm în 7 zile — apoi gestionăm și actualizăm pentru totdeauna.
              </p>
            </div>

            {/* Step 1 */}
            <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
              <div className="space-y-4">
                <p className="text-body-sm font-medium text-primary">Pasul 1</p>
                <h3 className="text-display-sm text-foreground">Trimite Formularul & alege un șablon</h3>
                <p className="text-body-md text-muted-foreground">
                  Completează Formularul Website-ului cu obiectivele, paginile și integrările tale. Alege din 100+ șabloane profesionale. Fără întâlniri — doar trimite și aprobă.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-body-sm font-semibold text-foreground">WB</div>
                    <div>
                      <p className="text-body-sm font-semibold text-foreground">Blueprint Website</p>
                      <p className="text-body-sm text-muted-foreground">Obiective · Pagini · Integrări</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { name: "Orbit", img: "/templates/orbit.png" },
                      { name: "Aether", img: "/templates/aether.png" },
                      { name: "Forward", img: "/templates/forward.png" },
                      { name: "Cognitive", img: "/templates/cognitive.png" },
                      { name: "Flux", img: "/templates/flux.png" },
                      { name: "Lexora", img: "/templates/lexora.png" },
                    ].map((template) => (
                      <div
                        key={template.name}
                        className="aspect-video rounded-lg border border-border overflow-hidden"
                      >
                        <Image
                          src={template.img}
                          alt={template.name}
                          width={200}
                          height={113}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
              <div className="rounded-xl border border-border bg-card p-5 order-2 lg:order-1">
                <div className="flex items-center justify-between text-body-sm text-muted-foreground mb-4">
                  <span>Status Construcție</span>
                  <span className="rounded-lg bg-primary/10 px-2 py-0.5 text-body-sm text-primary">În Progres</span>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Wireframe aprobat", done: true },
                    { label: "Design în lucru", done: false },
                    { label: "Previzualizare live", done: false },
                    { label: "Integrări configurate", done: false },
                  ].map((step) => (
                    <div key={step.label} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5">
                      <div className={`h-2 w-2 rounded-full ${step.done ? "bg-primary" : "bg-muted-foreground/30"}`} />
                      <span className={`text-body-sm ${step.done ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4 order-1 lg:order-2">
                <p className="text-body-sm font-medium text-primary">Pasul 2</p>
                <h3 className="text-display-sm text-foreground">Construim totul în 7 zile</h3>
                <p className="text-body-md text-muted-foreground">
                  Întregul site este construit pentru tine. Ne aliniem asincron cu previzualizări clare — poți trimite mesaje oricând în chat-ul integrat.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
              <div className="space-y-4">
                <p className="text-body-sm font-medium text-primary">Pasul 3</p>
                <h3 className="text-display-sm text-foreground">Gestionat pentru totdeauna</h3>
                <p className="text-body-md text-muted-foreground">
                  Trimite modificări oricând. Livrăm în 3 zile pe Business, 7 pe Start. Actualizări nelimitate, găzduire, SSL și monitorizare — totul inclus.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="space-y-2">
                  {[
                    "Conținut nou hero — livrat",
                    "Schimbare șablon — previzualizare gata",
                    "Integrare Calendly + Stripe — configurată",
                    "SSL, analiză, uptime — monitorizat",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-body-sm text-foreground/80">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Plans */}
        <section id="plans" className="section-blur section-fade py-20">
          <div className="container max-w-5xl space-y-12">
            <div className="mx-auto max-w-2xl text-center space-y-4">
              <h2 className="text-display-md text-foreground" style={{ textWrap: "balance" }}>Alege-ți planul</h2>
              <p className="text-body-lg text-muted-foreground">
                Începe gratuit cu un Blueprint. Upgrade când ești gata să lansezi.
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
                  <span className="ml-1.5 rounded-full bg-secondary/15 px-2 py-0.5 text-xs text-secondary">
                    -25%
                  </span>
                </button>
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {[
                {
                  name: "WEBFORM START",
                  monthlyPrice: 180,
                  yearlyPrice: 1620, // 180 * 12 * 0.75
                  desc: "Pentru proprietarii de afaceri mici care au nevoie de un website simplu și curat rapid.",
                  items: [
                    "Până la 3 pagini (Acasă, Despre, Contact sau Servicii)",
                    "Alege din 100+ șabloane",
                    "Construit în 7 zile",
                    "Gestionat pentru totdeauna (găzduire + domeniu incluse)",
                    "Actualizări în 7 zile",
                    "1 cerere activă la un moment dat",
                    "SEO de bază",
                    "Optimizare mobilă",
                    "Formular de contact / link de rezervare",
                    "Securitate SSL",
                  ],
                  primary: false,
                  cta: "Alege Start",
                },
                {
                  name: "WEBFORM BUSINESS",
                  monthlyPrice: 350,
                  yearlyPrice: 3150, // 350 * 12 * 0.75
                  desc: "Cel mai popular — acoperă 70%+ din clienți.",
                  items: [
                    "Până la 7 pagini",
                    "100+ șabloane cu personalizare",
                    "Construit în 7 zile",
                    "Actualizări în 3 zile (prioritate)",
                    "2 cereri active",
                    "Configurare SEO avansată",
                    "Sistem de blog opțional",
                    "Dashboard de analiză",
                    "Integrări (Calendly, Stripe, Mailchimp, CRM, etc.)",
                    "Formulare personalizate",
                    "Copywriting ușor (asistat AI 1-2 secțiuni)",
                    "Găzduire + domeniu + gestionare completă",
                  ],
                  primary: true,
                  cta: "Începe Business",
                },
                {
                  name: "WEBFORM COMMERCE",
                  monthlyPrice: null,
                  yearlyPrice: null,
                  desc: "Pentru afaceri care vând produse sau rezervări.",
                  items: [
                    "Tot ce e în Business",
                    "Configurare e-commerce completă (Stripe, Sellfy, Snipcart, Shopify Lite, etc.)",
                    "Produse nelimitate sau până la 50 — alegerea ta",
                    "Timp de execuție actualizări 48h",
                    "Coadă de cereri nelimitată",
                    "Automatizări (coș abandonat, email-uri clienți, fluxuri CRM)",
                    "Optimizare performanță",
                    "SEO avansat",
                    "Secțiuni personalizate / elemente UI",
                    "Integrări API",
                    "Suport prioritar (cele mai rapide răspunsuri)",
                  ],
                  primary: false,
                  cta: "Contactează-ne",
                },
              ].map((plan) => {
                const isCommerce = plan.name === "WEBFORM COMMERCE";
                return (
                  <div
                    key={plan.name}
                    className={`rounded-xl border p-6 relative ${
                      plan.primary
                        ? "border-primary/50 bg-card"
                        : isCommerce
                        ? "border-border bg-card opacity-60 pointer-events-none"
                        : "border-border bg-card"
                    }`}
                  >
                    {isCommerce && (
                      <div className="absolute -top-3 -right-3 z-10 pointer-events-auto">
                        <Badge className="bg-accent text-accent-foreground px-3 py-1 text-xs font-semibold rotate-12">
                          E-commerce Vine Curând
                        </Badge>
                      </div>
                    )}
                    <div className="text-body-sm font-medium text-muted-foreground">{plan.name}</div>
                    <div className="mt-2 text-display-sm text-foreground">
                      {plan.monthlyPrice === null
                        ? "Personalizat"
                        : billingInterval === "year"
                        ? `${Math.round(plan.yearlyPrice! / 12)} RON/lună`
                        : `${plan.monthlyPrice} RON/lună`}
                    </div>
                    {plan.monthlyPrice !== null && billingInterval === "year" && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        Facturat anual ({plan.yearlyPrice} RON/an)
                      </p>
                    )}
                    {plan.monthlyPrice !== null && billingInterval === "year" && (
                      <p className="mt-1 text-sm text-secondary">
                        Economisești 25%
                      </p>
                    )}
                    <p className="mt-2 text-body-sm text-muted-foreground">{plan.desc}</p>
                    <ul className="mt-4 space-y-2 text-body-sm text-muted-foreground">
                      {plan.items.map((it) => (
                        <li key={it} className="flex gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary"></span>
                          {it}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6">
                      {isCommerce ? (
                        <Button
                          className="w-full pointer-events-auto"
                          variant="outline"
                          onClick={() => setNotifyDialogOpen(true)}
                        >
                          Anunță-mă
                        </Button>
                      ) : (
                        <Button
                          className="w-full"
                          variant={plan.primary ? "default" : "outline"}
                          asChild
                        >
                          <Link href="/subscribe">{plan.cta}</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </main>
      <Footer />

      <Dialog open={notifyDialogOpen} onOpenChange={setNotifyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Primește Notificări</DialogTitle>
            <DialogDescription>
              Introdu email-ul tău și te vom notifica imediat ce<br />funcționalitatea e-commerce va fi disponibilă.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleNotifySubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Adresă email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@exemplu.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setNotifyDialogOpen(false)}
                disabled={isSubmitting}
              >
                Anulează
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Se trimite..." : "Notifică-mă"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {homePageJsonLd.map((schema, index) => (
        <Script
          key={index}
          type="application/ld+json"
          id={`jsonld-${index}`}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
