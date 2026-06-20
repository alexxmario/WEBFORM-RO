"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, MessageCircle } from "lucide-react";

import { BlueprintForm } from "@/components/BlueprintForm";
import { FloatingLinesBackground } from "@/components/FloatingLinesBackground";
import { Button } from "@/components/ui/button";

export default function StartPage() {
  const [loading, setLoading] = useState(true);
  const [hasBlueprint, setHasBlueprint] = useState(false);

  useEffect(() => {
    async function checkBlueprint() {
      try {
        const response = await fetch("/api/blueprint");
        const data = await response.json();
        setHasBlueprint(data.hasBlueprint || false);
      } catch (error) {
        console.error("Error checking blueprint status:", error);
      } finally {
        setLoading(false);
      }
    }
    checkBlueprint();
  }, []);

  if (loading) {
    return (
      <div className="relative isolate min-h-screen overflow-hidden">
        <FloatingLinesBackground />
        <main className="relative z-10 flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (hasBlueprint) {
    return (
      <div className="relative isolate min-h-screen overflow-hidden">
        <FloatingLinesBackground />
        <main
          id="main"
          className="relative z-10 mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-8 px-4 py-12 text-center"
        >
          <div className="space-y-4">
            <h1 className="font-display text-display-sm sm:text-display-md">
              Formularul a fost deja completat
            </h1>
            <p className="text-body-lg text-muted-foreground">
              Formularul tău este la echipa noastră și lucrăm la site-ul tău.
              Pentru orice modificare sau întrebare, te rugăm să ne contactezi prin suport.
            </p>
          </div>
          <Button asChild size="lg" className="gap-2">
            <Link href="/chat">
              <MessageCircle className="h-5 w-5" />
              Mergi la Suport
            </Link>
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      <FloatingLinesBackground />
      <main
        id="main"
        className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-4 py-12 sm:px-8 lg:py-16"
      >
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <h1 className="font-display text-display-md sm:text-display-lg" style={{ textWrap: "balance" }}>
            Un formular pentru a lansa și gestiona site-ul tău.
          </h1>
        </div>

        <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-card">
          <div className="px-5 py-6 sm:px-10 sm:py-10">
            <BlueprintForm />
          </div>
        </div>
      </main>
    </div>
  );
}
