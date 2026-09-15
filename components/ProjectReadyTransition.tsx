"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Check, FileCheck2, Lightbulb, MessageCircle, Palette, PanelsTopLeft } from "lucide-react";
import type { Plan } from "@/lib/pricing";

export function ProjectReadyTransition({ plan }: { plan: Plan }) {
  const router = useRouter();
  const [seconds, setSeconds] = useState(7);
  const billingUrl = `/subscribe/billing?planId=${encodeURIComponent(plan.id)}`;

  useEffect(() => {
    const countdown = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    const redirectTimer = window.setTimeout(() => router.push(billingUrl), 7000);
    return () => {
      window.clearInterval(countdown);
      window.clearTimeout(redirectTimer);
    };
  }, [billingUrl, router]);

  const ideas = [
    { label: "Strategie", Icon: Lightbulb },
    { label: "Conținut", Icon: FileCheck2 },
    { label: "Design", Icon: Palette },
  ];

  return (
    <div className="mx-auto w-full max-w-3xl text-center">
      <div className="mb-8 flex flex-wrap justify-center gap-2 text-xs font-medium sm:text-sm">
        {["Plan ales", "Formular salvat", "Plată", "Chat proiect"].map((step, index) => (
          <span key={step} className={`rounded-full border px-3 py-2 ${index < 2 ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>
            {index < 2 && <Check className="mr-1 inline h-3.5 w-3.5" />} {index + 1}. {step}
          </span>
        ))}
      </div>

      <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="eyebrow">
        PROIECT SALVAT
      </motion.p>
      <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-3 font-display text-display-sm sm:text-display-md">
        Avem punctul de plecare.
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
        Brief-ul este în atelierul nostru. Direcția site-ului începe deja să prindă contur.
      </motion.p>

      <div className="relative mx-auto my-10 flex min-h-48 max-w-2xl items-center justify-between overflow-hidden rounded-3xl border border-border bg-card px-5 py-8 sm:px-10">
        <div className="z-10 flex flex-col gap-3">
          {ideas.map(({ label, Icon }, index) => (
            <motion.div key={label} initial={{ opacity: 0, x: -25 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + index * 0.18 }} className="flex items-center gap-2 rounded-xl border bg-background px-3 py-2 text-sm shadow-sm">
              <Icon className="h-4 w-4 text-primary" /> {label}
            </motion.div>
          ))}
        </div>
        <motion.div className="absolute inset-y-0 left-[34%] right-[34%] my-auto h-px origin-left bg-primary/50" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.8, duration: 1 }} />
        <motion.div initial={{ opacity: 0, scale: 0.82, rotate: -3 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: 1.05, type: "spring" }} className="z-10 rounded-2xl border bg-background p-3 shadow-xl">
          <div className="mb-2 flex gap-1"><i className="h-1.5 w-1.5 rounded-full bg-primary" /><i className="h-1.5 w-1.5 rounded-full bg-primary/50" /><i className="h-1.5 w-1.5 rounded-full bg-primary/25" /></div>
          <PanelsTopLeft className="h-20 w-24 text-primary sm:h-24 sm:w-32" strokeWidth={1.2} />
        </motion.div>
      </div>

      <p className="text-base text-muted-foreground">Mai rămâne un singur pas: activează planul <strong className="text-foreground">{plan.name}</strong>.</p>
      <Link href={billingUrl} className="action action-dark mt-6">
        Continuă către plata securizată <ArrowRight size={18} />
      </Link>
      <p className="mt-4 text-xs text-muted-foreground">Te trimitem automat la plată în {seconds} secunde.</p>
      <div className="mx-auto mt-3 h-1 w-52 overflow-hidden rounded-full bg-muted">
        <motion.div className="h-full origin-left bg-primary" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 7, ease: "linear" }} />
      </div>

      <motion.aside
        initial={{ opacity: 0, x: -24, y: 12 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.15, type: "spring" }}
        className="fixed bottom-5 left-5 z-50 flex w-[calc(100%-2.5rem)] max-w-sm items-start gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-2xl"
        aria-label="Mesaj nou de la echipa WebForm"
      >
        <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
          <MessageCircle className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-card bg-red-500" />
        </span>
        <div>
          <p className="font-semibold">Mesaj nou · Echipa WebForm</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Formularul este salvat. Activează planul, iar după confirmarea plății continuăm direct în chat-ul proiectului.
          </p>
        </div>
      </motion.aside>
    </div>
  );
}
