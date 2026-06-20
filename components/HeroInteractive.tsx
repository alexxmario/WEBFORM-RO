"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { FormEvent, memo, useCallback } from "react";

import { useAuthContext } from "@/lib/context/AuthContext";
import { Button } from "./ui/button";

export const HeroInteractive = memo(function HeroInteractive() {
  const router = useRouter();
  const { user, loading } = useAuthContext();
  const prefersReducedMotion = useReducedMotion();

  const handleStart = useCallback((event?: FormEvent) => {
    event?.preventDefault();
    const destination = loading || !user ? "/login" : "/start";
    router.push(destination);
  }, [loading, user, router]);

  return (
    <section
      className="relative flex min-h-[85vh] flex-col items-center justify-center px-6 py-24"
      id="top"
    >
      <div className="container flex max-w-3xl flex-col items-center gap-8 text-center">
        {/* Main headline */}
        <motion.h1
          initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-display text-display-lg text-foreground sm:text-display-xl"
          style={{ textWrap: "balance" }}
        >
          Un formular simplu pentru a-ți lansa site-ul.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-xl text-body-lg text-muted-foreground"
        >
          Completezi Formularul, alegi un șablon, și primești site-ul tău în 7
          zile. Fără întâlniri, fără complicații.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
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
