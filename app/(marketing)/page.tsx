"use client";

import Script from "next/script";
import { useState } from "react";

import { Header } from "@/components/Header";
import { HeroInteractive } from "@/components/HeroInteractive";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { organizationJsonLd, productJsonLd } from "@/lib/schema";
import { toast } from "sonner";

export default function HomePage() {
  const [notifyDialogOpen, setNotifyDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNotifySubmit = async (e: React.FormEvent) => {
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
  };

  return (
    <>
      <Header />
      <main id="main" className="space-y-24 pb-28 pt-16">
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
        <section className="mission-section container max-w-5xl space-y-6 text-center" id="mission-section">
          <h2 className="text-3xl md:text-4xl font-semibold leading-tight text-foreground">
            Suntem designeri și ingineri care construiesc, găzduiesc și actualizează site-ul tău fără întâlniri. Livrăm în zile,
            gestionăm întreaga infrastructură și te implicăm doar în deciziile importante —
            <span className="italic text-muted-foreground"> astfel încât tu să te concentrezi pe afacerea ta.</span>
          </h2>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Lansare rapidă. Iterare asincronă. Mereu disponibili.
          </p>
        </section>
        <Script
          id="mission-animate"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const el = document.getElementById("mission-section");
                if (!el) return;
                el.classList.add("animate-in");
                const io = new IntersectionObserver((entries) => {
                  entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                      el.classList.remove("animate-in");
                      el.classList.add("visible");
                      io.disconnect();
                    }
                  });
                }, { threshold: 0.35 });
                io.observe(el);
              })();
            `,
          }}
        />

        <section
          className="hidden w-screen max-w-none px-0 md:block"
          style={{
            marginLeft: "calc(50% - 50vw)",
            marginRight: "calc(50% - 50vw)",
            width: "100vw",
          }}
        >
          <Script
            type="module"
            src="https://unpkg.com/@splinetool/viewer@1.12.3/build/spline-viewer.js"
            strategy="afterInteractive"
          />
          <div
            className="relative w-screen max-w-none overflow-hidden"
            style={{ width: "100vw", minHeight: "400px" }}
          >
            <spline-viewer
              id="hero-spline"
              loading-anim-type="spinner-small-dark"
              url="https://prod.spline.design/w-aLrHUI4pNxOgrP/scene.splinecode"
              style={{
                display: "block",
                width: "100vw",
                maxWidth: "100vw",
                height: "720px",
              }}
            />
          </div>
        </section>

        {/* Features */}
        <section className="bg-[#0A0A0A] text-white py-16">
          <div className="container max-w-6xl space-y-10">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/70">
                Funcționalități Puternice
              </div>
              <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">Tot ce ai nevoie pentru lansare</h2>
              <p className="mx-auto max-w-3xl text-lg text-white/70">
                Dezvoltare bazată pe șabloane, verificări asincrone și găzduire de producție—fără întâlniri.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur transition hover:border-white/20"
                >
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-white/70">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="bg-[#0A0A0A] text-white py-20">
          <div className="container max-w-6xl space-y-12">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/70">
                Configurare Simplă
              </div>
              <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">Cum Funcționează WebForm</h2>
              <p className="text-lg text-white/70 max-w-3xl mx-auto">
                O platformă de website prin abonament. Trimiți un Blueprint, alegi un aspect, livrăm în 7 zile—apoi gestionăm și actualizăm pentru totdeauna.
              </p>
            </div>

            {/* Step 1 */}
            <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
              <div className="space-y-4">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#9EF0A0]/20 text-sm font-semibold text-[#9EF0A0]">
                  1
                </div>
                <h3 className="text-2xl sm:text-3xl font-semibold">Trimite Blueprint-ul & alege un șablon</h3>
                <p className="text-white/70">
                  Completează Blueprint-ul Website-ului (obiective, pagini, integrări, tonalitate) și alege din Galeria de Șabloane (100+ stiluri profesionale afișate ca miniaturi).
                </p>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#9EF0A0]"></span>
                    Blueprint-ul Website-ului captează nevoile de conținut, pagini și integrări.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#9EF0A0]"></span>
                    Galeria de Șabloane: 100+ aspecte premium (doar miniaturi).
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#9EF0A0]"></span>
                    Fără întâlniri, fără constructori—doar trimite și aprobă.
                  </li>
                </ul>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_80px_-30px_rgba(0,0,0,0.6)] backdrop-blur">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">WB</div>
                    <div>
                      <p className="text-sm font-semibold">Blueprint Website</p>
                      <p className="text-xs text-white/60">Obiective • Pagini • Integrări</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4 space-y-3">
                    <div className="flex items-center justify-between text-sm text-white/80">
                      <span>Galerie de Șabloane</span>
                      <span className="text-xs rounded-full bg-white/10 px-2 py-0.5 text-white/60">100+ stiluri</span>
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
                          className="aspect-video rounded-lg border border-white/10 bg-white/5 overflow-hidden"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={template.img}
                            alt={template.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-3 py-2">
                      <div className="h-2 w-2 rounded-full bg-[#9EF0A0]"></div>
                      <span className="text-sm text-white/80">Blueprint trimis • Șablon selectat</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_80px_-30px_rgba(0,0,0,0.6)] backdrop-blur">
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span>Status Construcție</span>
                  <span className="rounded-full bg-[#9EF0A0]/20 px-2 py-0.5 text-xs text-[#9EF0A0]">În Progres</span>
                </div>
                <div className="mt-4 space-y-3 text-sm text-white/80">
                  <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-3">
                    <p className="font-semibold">Construcția website-ului în progres — 7 zile</p>
                    <p className="text-white/60">Wireframe → design → previzualizare live</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-3">
                    <p className="font-semibold">Verificări asincrone</p>
                    <p className="text-white/60">Aprobă momentele cheie fără întâlniri</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-3">
                    <p className="font-semibold">Integrări configurate</p>
                    <p className="text-white/60">Formulare, analiză, rezervări, plăți</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#B2A5FE]/20 text-sm font-semibold text-[#B2A5FE]">
                  2
                </div>
                <h3 className="text-2xl sm:text-3xl font-semibold">Construim totul în 7 zile</h3>
                <p className="text-white/70">
                  Întregul tău site este construit pentru tine. Ne aliniem asincron cu previzualizări clare—și poți să ne trimiti mesaje oricând în chat-ul integrat.
                </p>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#9EF0A0]"></span>
                    Construcție completă în 7 zile cu aprobări asincrone.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#9EF0A0]"></span>
                    Conținut, layout și integrări gestionate; întrebări răspunse prin chat-ul din aplicație.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#9EF0A0]"></span>
                    Card status: "Construcția website-ului în progres — 7 zile."
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
              <div className="space-y-4">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#FBBF24]/20 text-sm font-semibold text-[#FBBF24]">
                  3
                </div>
                <h3 className="text-2xl sm:text-3xl font-semibold">Gestionat pentru totdeauna cu actualizări nelimitate</h3>
                <p className="text-white/70">
                  WebForm gestionează site-ul tău de la un capăt la altul. Trimite modificări oricând; livrăm în 3 zile (7 pe Start).
                </p>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#9EF0A0]"></span>
                    Actualizări nelimitate cu coadă clară și timp de execuție.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#9EF0A0]"></span>
                    Timp de execuție de 3 zile pe Business/Commerce; 7 zile pe Start.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#9EF0A0]"></span>
                    Dashboard-ul arată activitatea, aprobările și status-ul live.
                  </li>
                </ul>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_80px_-30px_rgba(0,0,0,0.6)] backdrop-blur">
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span>Gestionat Pentru Totdeauna</span>
                  <span className="text-xs text-white/50">Coadă live</span>
                </div>
                <div className="mt-4 space-y-3 text-sm text-white/80">
                  <div className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#9EF0A0]"></span>
                    Actualizare programată: conținut nou hero (SLA 3 zile)
                  </div>
                  <div className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#60A5FA]"></span>
                    Previzualizare schimbare șablon gata
                  </div>
                  <div className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#C084FC]"></span>
                    Integrare adăugată: Calendly + Stripe
                  </div>
                  <div className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#FACC15]"></span>
                    SSL, analiză și uptime monitorizate
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Plans */}
        <section id="plans" className="bg-[#0A0A0A] text-white py-16">
          <div className="container max-w-6xl space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.16em] text-white/70">
                Prețuri
              </div>
              <h3 className="text-4xl font-semibold tracking-tight sm:text-5xl">Alege-ți planul</h3>
              <p className="text-lg text-white/70">
                Începe gratuit cu un Blueprint. Upgrade când ești gata să lansezi.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {[
                {
                  name: "WEBFORM START",
                  price: "$100/lună",
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
                  price: "$250/lună",
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
                  price: "Personalizat",
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
                    className={`rounded-2xl border p-6 shadow-lg relative ${
                      plan.primary
                        ? "border-[#9EF0A0]/60 bg-white/10"
                        : isCommerce
                        ? "border-white/10 bg-white/5 grayscale opacity-60 pointer-events-none"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    {isCommerce && (
                      <div className="absolute -top-3 -right-3 z-10 pointer-events-auto">
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 text-xs font-semibold shadow-lg rotate-12">
                          E-commerce Vine Curând
                        </Badge>
                      </div>
                    )}
                    <div className="text-sm font-semibold text-white/70">{plan.name}</div>
                    <div className="mt-2 text-3xl font-semibold text-white">{plan.price}</div>
                    <p className="mt-2 text-sm text-white/70">{plan.desc}</p>
                    <ul className="mt-4 space-y-2 text-sm text-white/70">
                      {plan.items.map((it) => (
                        <li key={it} className="flex gap-2">
                          <span className="mt-1 h-2 w-2 rounded-full bg-[#9EF0A0]"></span>
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
                          Notifică-mă
                        </Button>
                      ) : (
                        <Button
                          className="w-full"
                          variant={plan.primary ? "default" : "outline"}
                        >
                          {plan.cta}
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

      <Script
        type="application/ld+json"
        id="organization-jsonld"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Script
        type="application/ld+json"
        id="product-jsonld"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
    </>
  );
}
