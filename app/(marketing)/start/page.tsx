"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, MessageCircle } from "lucide-react";

import { ProjectBriefForm } from "@/components/ProjectBriefForm";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { getPlan } from "@/lib/pricing";

export default function StartPage() {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [hasBlueprint, setHasBlueprint] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [planId, setPlanId] = useState("standard_lunar");

  useEffect(() => {
    async function checkBlueprint() {
      try {
        const requestedPlan = new URLSearchParams(window.location.search).get(
          "planId",
        );
        if (requestedPlan && getPlan(requestedPlan)) setPlanId(requestedPlan);
        const response = await fetch("/api/blueprint");
        if (!response.ok) throw new Error("Blueprint unavailable");
        const data = await response.json();
        setHasBlueprint(data.hasBlueprint || false);
        setHasSubscription(data.hasSubscription || false);
      } catch (error) {
        console.error("Error checking blueprint status:", error);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    }
    checkBlueprint();
  }, []);

  if (loadError)
    return (
      <>
        <Header />
        <main id="main" className="container pt-40 text-center">
          <h1 className="text-2xl">Nu am putut verifica proiectul.</h1>
          <p className="my-5 text-muted-foreground">
            Conexiunea cu serviciul este temporar indisponibilă.
          </p>
          <button
            className="action action-dark"
            onClick={() => window.location.reload()}
          >
            Încearcă din nou
          </button>
        </main>
      </>
    );

  if (loading) {
    return (
      <div className="relative isolate min-h-screen overflow-hidden">
        <Header />
        <main className="relative z-10 flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (hasBlueprint) {
    return (
      <div className="relative isolate min-h-screen overflow-hidden">
        <Header />
        <main
          id="main"
          className="relative z-10 mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-8 px-4 pt-32 pb-12 text-center"
        >
          <div className="space-y-4">
            <h1 className="font-display text-display-sm sm:text-display-md">
              Formularul a fost deja completat
            </h1>
            <p className="text-body-lg text-muted-foreground">
              {hasSubscription
                ? "Proiectul este activ. Pentru întrebări, materiale sau modificări, folosește chat-ul proiectului."
                : "Proiectul tău este salvat. Mai rămâne să activezi planul ales, apoi intri direct în chat-ul proiectului."}
            </p>
          </div>
          <Button asChild size="lg" className="gap-2">
            <Link
              href={
                hasSubscription
                  ? "/chat"
                  : `/project-ready?planId=${encodeURIComponent(planId)}`
              }
            >
              <MessageCircle className="h-5 w-5" />
              {hasSubscription
                ? "Deschide chat-ul proiectului"
                : "Continuă către activarea planului"}
            </Link>
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      <Header />
      <main
        id="main"
        className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col gap-10 px-4 pt-32 pb-12 sm:px-8 lg:pt-36 lg:pb-16"
      >
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <h1
            className="font-display text-display-md sm:text-display-lg"
            style={{ textWrap: "balance" }}
          >
            Spune-ne pe scurt de ce are nevoie afacerea ta.
          </h1>
          <p className="text-muted-foreground">
            Cinci întrebări scurte despre afacerea ta. Salvăm proiectul,
            activezi planul ales, apoi intri direct în chat-ul proiectului.
          </p>
          <p className="text-sm font-medium">
            Plan ales: {getPlan(planId)?.name}
          </p>
        </div>

        <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-card">
          <div className="px-5 py-6 sm:px-10 sm:py-10">
            <ProjectBriefForm planId={planId} />
          </div>
        </div>
      </main>
    </div>
  );
}
