"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { contactSchema, contactSubjects } from "@/lib/contact";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

type Values = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      businessName: "",
      subject: "site",
      message: "",
      consent: false,
    },
  });

  async function submit(values: Values) {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("send");
      setSent(true);
    } catch {
      setError("root", {
        message: "Mesajul nu a putut fi trimis. Încearcă din nou sau scrie-ne direct pe e-mail.",
      });
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-green-600/20 bg-green-500/5 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
        <h2 className="mt-4 text-2xl font-semibold">Mesajul a ajuns la noi.</h2>
        <p className="mt-2 text-muted-foreground">Vă vom contacta curând.</p>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(submit)} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Numele tău" error={errors.name?.message}>
          <Input autoComplete="name" {...register("name")} />
        </Field>
        <Field label="Numele afacerii (opțional)" error={errors.businessName?.message}>
          <Input autoComplete="organization" {...register("businessName")} />
        </Field>
        <Field label="E-mail" error={errors.email?.message}>
          <Input type="email" autoComplete="email" {...register("email")} />
        </Field>
        <Field label="Telefon (opțional)" error={errors.phone?.message}>
          <Input type="tel" autoComplete="tel" {...register("phone")} />
        </Field>
      </div>
      <Field label="Cu ce te putem ajuta?" error={errors.subject?.message}>
        <select className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm" {...register("subject")}>
          {Object.entries(contactSubjects).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </Field>
      <Field label="Mesaj" error={errors.message?.message}>
        <Textarea rows={6} placeholder="Spune-ne pe scurt de ce ai nevoie…" {...register("message")} />
      </Field>
      <Controller control={control} name="consent" render={({ field }) => (
        <div>
          <label className="flex items-start gap-3 text-sm text-muted-foreground">
            <Checkbox className="mt-0.5" checked={field.value} onCheckedChange={(checked) => field.onChange(Boolean(checked))} />
            <span>Sunt de acord ca WebForm să folosească datele de mai sus pentru a răspunde solicitării, conform <a className="text-primary underline" href="/legal/privacy" target="_blank" rel="noreferrer">politicii de confidențialitate</a>.</span>
          </label>
          {errors.consent && <p className="mt-2 text-sm text-red-500">{errors.consent.message}</p>}
        </div>
      )} />
      {errors.root && <p className="text-sm text-red-500" role="alert">{errors.root.message}</p>}
      <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Trimite mesajul
      </Button>
      <p className="text-center text-xs text-muted-foreground">Vă vom contacta curând.</p>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label>{label}</Label>{children}{error && <p className="text-sm text-red-500">{error}</p>}</div>;
}
