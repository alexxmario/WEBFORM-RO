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
      toast.success("You'll be notified when e-commerce is available!");
      setEmail("");
      setNotifyDialogOpen(false);
    } catch {
      toast.error("Something went wrong. Please try again.");
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
            We’re designers and engineers who build, host, and update your site without meetings. We ship in days,
            manage the stack end-to-end, and surface only the decisions you need —
            <span className="italic text-muted-foreground"> so you can stay focused on your business.</span>
          </h2>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Launch fast. Iterate async. Always on.
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
                Powerful Features
              </div>
              <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">Everything you need to launch</h2>
              <p className="mx-auto max-w-3xl text-lg text-white/70">
                Library-driven builds, async checkpoints, and production hosting—without the meetings.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Template library", desc: "20+ premium layouts. Swap anytime without downtime." },
                { title: "Async checkpoints", desc: "Wireframe → design → final preview with no calls required." },
                { title: "Hosting & domain", desc: "SSL, domains, and analytics bundled. We run the stack for you." },
                { title: "3-day updates", desc: "Queue-based changes with clear previews and approvals." },
                { title: "Integrations", desc: "Calendly, forms, CRM tags, and custom scripts done for you." },
                { title: "Export ready", desc: "Full export available as a paid service if you need to move." },
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
                Simple Setup
              </div>
              <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">How WebForm Works</h2>
              <p className="text-lg text-white/70 max-w-3xl mx-auto">
                A subscription website platform. You submit a Blueprint, pick a look, we ship in 7 days—then manage and update it forever.
              </p>
            </div>

            {/* Step 1 */}
            <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
              <div className="space-y-4">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#9EF0A0]/20 text-sm font-semibold text-[#9EF0A0]">
                  1
                </div>
                <h3 className="text-2xl sm:text-3xl font-semibold">Submit your Blueprint & pick a template</h3>
                <p className="text-white/70">
                  Fill out the Website Blueprint (goals, pages, integrations, tone) and choose from our Template Gallery (100+ pro styles shown as thumbnails).
                </p>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#9EF0A0]"></span>
                    Website Blueprint captures copy needs, pages, and integrations.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#9EF0A0]"></span>
                    Template Gallery: 100+ premium looks (thumbnails only).
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#9EF0A0]"></span>
                    No meetings, no builders—just submit and approve.
                  </li>
                </ul>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_80px_-30px_rgba(0,0,0,0.6)] backdrop-blur">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">WB</div>
                    <div>
                      <p className="text-sm font-semibold">Website Blueprint</p>
                      <p className="text-xs text-white/60">Goals • Pages • Integrations</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4 space-y-3">
                    <div className="flex items-center justify-between text-sm text-white/80">
                      <span>Template Gallery</span>
                      <span className="text-xs rounded-full bg-white/10 px-2 py-0.5 text-white/60">100+ styles</span>
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
                      <span className="text-sm text-white/80">Blueprint submitted • Template selected</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_80px_-30px_rgba(0,0,0,0.6)] backdrop-blur">
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span>Build Status</span>
                  <span className="rounded-full bg-[#9EF0A0]/20 px-2 py-0.5 text-xs text-[#9EF0A0]">In Progress</span>
                </div>
                <div className="mt-4 space-y-3 text-sm text-white/80">
                  <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-3">
                    <p className="font-semibold">Website build in progress — 7 days</p>
                    <p className="text-white/60">Wireframe → design → live preview</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-3">
                    <p className="font-semibold">Async checkpoints</p>
                    <p className="text-white/60">Approve key moments without meetings</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-3">
                    <p className="font-semibold">Integrations configured</p>
                    <p className="text-white/60">Forms, analytics, booking, payments</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#B2A5FE]/20 text-sm font-semibold text-[#B2A5FE]">
                  2
                </div>
                <h3 className="text-2xl sm:text-3xl font-semibold">We build everything in 7 days</h3>
                <p className="text-white/70">
                  Your entire site is built for you. We align asynchronously with clear previews—and you can message us anytime in the built-in chat.
                </p>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#9EF0A0]"></span>
                    Full build in 7 days with async approvals.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#9EF0A0]"></span>
                    Copy, layout, and integrations handled; questions answered via in-app chat.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#9EF0A0]"></span>
                    Status card: “Website build in progress — 7 days.”
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
                <h3 className="text-2xl sm:text-3xl font-semibold">Managed forever with unlimited updates</h3>
                <p className="text-white/70">
                  WebForm runs your site end-to-end. Submit changes anytime; we ship in 3 days (7 on Start).
                </p>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#9EF0A0]"></span>
                    Unlimited updates with clear queue and turnaround.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#9EF0A0]"></span>
                    3-day turnaround on Business/Commerce; 7-day on Start.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#9EF0A0]"></span>
                    Dashboard shows activity, approvals, and live status.
                  </li>
                </ul>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_80px_-30px_rgba(0,0,0,0.6)] backdrop-blur">
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span>Managed Forever</span>
                  <span className="text-xs text-white/50">Queue live</span>
                </div>
                <div className="mt-4 space-y-3 text-sm text-white/80">
                  <div className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#9EF0A0]"></span>
                    Update scheduled: new hero copy (3-day SLA)
                  </div>
                  <div className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#60A5FA]"></span>
                    Template swap preview ready
                  </div>
                  <div className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#C084FC]"></span>
                    Integration added: Calendly + Stripe
                  </div>
                  <div className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#FACC15]"></span>
                    SSL, analytics, and uptime monitored
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
                Pricing
              </div>
              <h3 className="text-4xl font-semibold tracking-tight sm:text-5xl">Choose your plan</h3>
              <p className="text-lg text-white/70">
                Start free with a Blueprint. Upgrade when you’re ready to launch.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {[
                {
                  name: "WEBFORM START",
                  price: "$100/mo",
                  desc: "For small business owners who need a simple, clean website fast.",
                  items: [
                    "Up to 3 pages (Home, About, Contact or Services)",
                    "Choose from 100+ templates",
                    "Built in 7 days",
                    "Managed forever (hosting + domain included)",
                    "Updates in 7 days",
                    "1 active request at a time",
                    "Basic SEO",
                    "Mobile optimization",
                    "Contact form / booking link",
                    "SSL security",
                  ],
                  primary: false,
                  cta: "Choose Start",
                },
                {
                  name: "WEBFORM BUSINESS",
                  price: "$250/mo",
                  desc: "Our most popular — covers 70%+ of customers.",
                  items: [
                    "Up to 7 pages",
                    "100+ templates with customization",
                    "Built in 7 days",
                    "Updates in 3 days (priority)",
                    "2 active requests",
                    "Advanced SEO setup",
                    "Optional blog system",
                    "Analytics dashboard",
                    "Integrations (Calendly, Stripe, Mailchimp, CRM, etc.)",
                    "Custom forms",
                    "Light copywriting (AI-assisted 1–2 sections)",
                    "Hosting + domain + full management",
                  ],
                  primary: true,
                  cta: "Start Business",
                },
                {
                  name: "WEBFORM COMMERCE",
                  price: "Custom",
                  desc: "For businesses selling products or bookings.",
                  items: [
                    "Everything in Business",
                    "Full e-commerce setup (Stripe, Sellfy, Snipcart, Shopify Lite, etc.)",
                    "Unlimited products or up to 50 — your choice",
                    "48h update turnaround",
                    "Unlimited request queue",
                    "Automations (abandoned cart, customer emails, CRM flows)",
                    "Performance optimization",
                    "Advanced SEO",
                    "Custom sections / UI elements",
                    "API integrations",
                    "Priority support (fastest responses)",
                  ],
                  primary: false,
                  cta: "Talk to us",
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
                          E-commerce Coming Soon
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
                          Notify Me
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
            <DialogTitle className="text-2xl font-semibold">Get Notified</DialogTitle>
            <DialogDescription>
              Enter your email and we&apos;ll notify you as soon as<br />e-commerce functionality is available.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleNotifySubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
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
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Notify Me"}
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
