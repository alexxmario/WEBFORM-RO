"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { FormEvent, memo, useCallback } from "react";

import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "./ui/button";

export const HeroInteractive = memo(function HeroInteractive() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const prefersReducedMotion = useReducedMotion();

  const handleStart = useCallback((event?: FormEvent) => {
    event?.preventDefault();
    const destination = loading || !isAuthenticated ? "/login" : "/start";
    router.push(destination);
  }, [loading, isAuthenticated, router]);

  return (
    <section
      className="relative flex min-h-[85vh] flex-col items-center justify-center px-6 py-24"
      id="top"
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M60 0H0v60' fill='none' stroke='%23fff' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container flex max-w-3xl flex-col items-center gap-8 text-center">
        {/* Small label */}
        <motion.p
          initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-sm font-medium text-muted-foreground"
        >
          Website-uri profesionale în 7 zile
        </motion.p>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-display-lg text-foreground sm:text-display-xl"
        >
          Un formular simplu pentru a-ți lansa site-ul.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-xl text-body-lg text-muted-foreground"
        >
          Completezi Formularul, alegi un șablon, și primești site-ul tău în 7
          zile. Fără întâlniri, fără complicații.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <Button size="lg" onClick={handleStart}>
            Începe Formularul
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#how-it-works">Cum funcționează</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
});
