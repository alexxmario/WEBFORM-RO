"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { projectBriefSchema, ProjectBriefValues } from "@/lib/project-brief";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const questions = [
  {
    name: "businessName",
    label: "Cum se numește afacerea?",
    placeholder: "Ex: Atelier Luna",
    hint: "Numele pe care vrei să îl vadă clienții.",
    multiline: false,
    max: 160,
  },
  {
    name: "offering",
    label: "Ce servicii sau produse oferi?",
    placeholder:
      "Ex: Facem mobilier la comandă pentru bucătării și dormitoare.",
    hint: "Două-trei propoziții sunt suficiente.",
    multiline: true,
    max: 3000,
  },
  {
    name: "audience",
    label: "Cui te adresezi și în ce zonă?",
    placeholder: "Ex: Proprietari de apartamente din București și Ilfov.",
    hint: "Poți menționa un oraș, o regiune sau că lucrezi online / în toată țara.",
    multiline: false,
    max: 1000,
  },
  {
    name: "goal",
    label: "Ce vrei să obții prin site?",
    placeholder: "Ex: Cereri de ofertă, programări sau prezentarea lucrărilor.",
    hint: "Spune-ne ce ai vrea să facă un vizitator interesat.",
    multiline: false,
    max: 1000,
  },
  {
    name: "contact",
    label: "Unde vrei să primești cererile?",
    placeholder: "Ex: WhatsApp 07xx xxx xxx sau contact@afacerea.ro",
    hint: "Datele de contact care pot apărea pe site: telefon, e-mail sau link de rezervare.",
    multiline: false,
    max: 500,
  },
] as const;

export function ProjectBriefForm({ planId }: { planId: string }) {
  const router = useRouter();
  const submissionKey = useRef<string | null>(null);
  const [submitError, setSubmitError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectBriefValues>({
    resolver: zodResolver(projectBriefSchema),
    defaultValues: {
      businessName: "",
      offering: "",
      audience: "",
      goal: "",
      contact: "",
      existingPresence: "",
      notes: "",
      termsAccepted: false,
    },
    mode: "onBlur",
  });
  async function submit(values: ProjectBriefValues) {
    setSubmitError("");
    try {
      const response = await fetch("/api/blueprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          briefVersion: 2,
          submissionKey:
            submissionKey.current ||
            (submissionKey.current = crypto.randomUUID()),
        }),
      });
      if (!response.ok) throw new Error("save");
      router.push(`/project-ready?planId=${encodeURIComponent(planId)}`);
    } catch {
      setSubmitError(
        "Nu am putut salva proiectul. Răspunsurile sunt încă aici; încearcă din nou.",
      );
    }
  }
  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-8" noValidate>
      <div className="space-y-2 border-b border-border pb-6">
        <p className="text-sm font-medium text-primary">
          Cinci răspunsuri și putem începe
        </p>
        <h2 className="text-2xl font-semibold">
          Povestește-ne despre afacerea ta
        </h2>
        <p className="text-sm text-muted-foreground">
          Scrie simplu, în cuvintele tale. Noi propunem structura și designul
          potrivit.
        </p>
      </div>
      <fieldset disabled={isSubmitting} className="space-y-7">
        <legend className="sr-only">Informații necesare despre afacere</legend>
        {questions.map(
          ({ name, label, placeholder, hint, multiline, max }, index) => {
            const props = {
              id: name,
              placeholder,
              maxLength: max,
              "aria-invalid": !!errors[name],
              "aria-describedby": `${name}-hint${errors[name] ? ` ${name}-error` : ""}`,
              ...register(name),
            };
            return (
              <div key={name} className="space-y-2">
                <label htmlFor={name} className="block text-sm font-medium">
                  <span className="mr-2 text-muted-foreground">
                    0{index + 1}
                  </span>
                  {label}
                </label>
                <p
                  id={`${name}-hint`}
                  className="text-sm text-muted-foreground"
                >
                  {hint}
                </p>
                {multiline ? (
                  <Textarea {...props} rows={3} />
                ) : (
                  <Input {...props} />
                )}
                {errors[name] && (
                  <p
                    id={`${name}-error`}
                    role="alert"
                    className="text-sm text-red-600"
                  >
                    {errors[name]?.message}
                  </p>
                )}
              </div>
            );
          },
        )}
        <details className="rounded-xl border border-border p-4">
          <summary className="cursor-pointer text-sm font-medium">
            Ai deja un site sau alte detalii?{" "}
            <span className="font-normal text-muted-foreground">
              (opțional)
            </span>
          </summary>
          <div className="mt-5 space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="existingPresence"
                className="block text-sm font-medium"
              >
                Site, domeniu sau pagină de social media
              </label>
              <Input
                id="existingPresence"
                placeholder="Ex: afacerea.ro sau pagina de Instagram"
                maxLength={1000}
                {...register("existingPresence")}
              />
              {errors.existingPresence && (
                <p role="alert">{errors.existingPresence.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="notes" className="block text-sm font-medium">
                Ce altceva ar trebui să știm de la început?
              </label>
              <Textarea
                id="notes"
                rows={3}
                placeholder="Ex: Un termen important sau un serviciu pe care vrei să îl evidențiem."
                maxLength={3000}
                {...register("notes")}
              />
              {errors.notes && <p role="alert">{errors.notes.message}</p>}
            </div>
          </div>
        </details>
        <div className="flex gap-3 rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
          <MessageCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            Logo-ul, fotografiile și textele le poți trimite mai târziu în chat.
            După salvare, activezi planul ales și discutăm detaliile
            proiectului.
          </p>
        </div>
        <div>
          <div className="flex items-start gap-3">
            <input
              id="termsAccepted"
              type="checkbox"
              className="mt-1 h-4 w-4 shrink-0 accent-current"
              aria-invalid={!!errors.termsAccepted}
              aria-describedby={
                errors.termsAccepted ? "terms-error" : undefined
              }
              {...register("termsAccepted")}
            />
            <label htmlFor="termsAccepted" className="text-sm">
              Sunt de acord cu{" "}
              <a
                href="/legal/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                termenii și condițiile
              </a>
              .
            </label>
          </div>
          {errors.termsAccepted && (
            <p
              id="terms-error"
              role="alert"
              className="mt-2 text-sm text-red-600"
            >
              {errors.termsAccepted.message}
            </p>
          )}
        </div>
      </fieldset>
      {submitError && (
        <p role="alert" className="text-sm text-red-600">
          {submitError}
        </p>
      )}
      <div className="space-y-3 border-t border-border pt-6">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="w-full gap-2 sm:w-auto"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
          {isSubmitting ? "Salvăm proiectul…" : "Salvează și continuă"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Acest pas salvează răspunsurile. Plata se face separat, prin Stripe.
        </p>
      </div>
    </form>
  );
}
