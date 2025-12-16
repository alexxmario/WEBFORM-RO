"use client";

import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { FormEvent, useEffect, useState } from "react";

import { heroPlaceholders } from "@/lib/content-generator";
import { loadFromStorage, saveToStorage } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/useAuth";
import { FloatingLines } from "./FloatingLines";
import { Button } from "./ui/button";

const storageKey = "webform-hero-answer";

export function HeroInteractive() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const prefersReducedMotion = useReducedMotion();
  const [answer] = useState(() =>
    loadFromStorage(storageKey, heroPlaceholders[0]),
  );

  useEffect(() => {
    saveToStorage(storageKey, answer);
  }, [answer]);

  const handleStart = (event?: FormEvent) => {
    event?.preventDefault();
    saveToStorage(storageKey, answer);

    // Redirect based on authentication status
    const destination = loading || !isAuthenticated ? "/login" : "/start";
    router.push(destination);
  };

  return (
    <section
      className="relative isolate -mt-16 flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pb-16 pt-0 sm:-mt-20 sm:px-8 sm:pb-20 sm:pt-0"
      id="top"
    >
      <div className="absolute inset-0 -z-20">
        <div className="relative h-full min-h-[600px] w-full">
          <FloatingLines
            enabledWaves={["top", "middle", "bottom"]}
            lineCount={[5, 8, 10]}
            lineDistance={[3, 2.5, 2]}
            topWavePosition={{ x: 7, y: 0.15, rotate: -0.6 }}
            middleWavePosition={{ x: 3.5, y: -0.08, rotate: 0.15 }}
            bottomWavePosition={{ x: 0.3, y: -0.9, rotate: 0.3 }}
            linesGradient={["#9c4dff", "#6b6bff", "#4fc3ff"]}
            bendRadius={4.0}
            bendStrength={-0.25}
            interactive
            parallax
          />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background/60 via-background/55 to-background/90" />

      <div className="container mt-20 flex flex-col items-center gap-8 text-center sm:mt-28">
        <motion.h1
          initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl font-display text-4xl leading-tight text-foreground sm:text-5xl"
        >
          Un formular simplu pentru a-ți lansa site-ul.
        </motion.h1>

        <motion.div
          initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Button
            size="lg"
            className="rounded-full px-8 py-6 text-lg"
            onClick={handleStart}
          >
            Începe Blueprint-ul
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
