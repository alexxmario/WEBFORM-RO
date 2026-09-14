"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";

import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

const schema = z.object({
  name: z.string().min(2, "Introdu numele tău."),
  businessName: z.string().min(2, "Introdu numele afacerii."),
  email: z.string().email("Introdu o adresă de e-mail validă."),
  phone: z.string().min(7, "Introdu un număr de telefon valid."),
  productCount: z.enum(["1-20", "21-100", "101-500", "500+"]),
  needs: z.array(z.string()).default([]),
  currentSite: z.string().url("Introdu adresa completă, inclusiv https://").or(z.literal("")),
  notes: z.string().max(1500).default(""),
  consent: z.boolean().refine(Boolean, {
    message: "Avem nevoie de acordul tău pentru a te suna.",
  }),
});

type Values = z.infer<typeof schema>;

const needs = [
  "Plată online",
  "Livrare prin curier",
  "Facturare",
  "Stocuri",
  "Import produse",
  "Integrare marketplace",
];

export function CommerceQuoteForm() {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      businessName: "",
      email: "",
      phone: "",
      productCount: "1-20",
      needs: [],
      currentSite: "",
      notes: "",
      consent: false,
    },
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (values: Values) => {
    try {
      const response = await fetch("/api/commerce-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Cererea nu a putut fi trimisă.");
      reset();
      setSubmitted(true);
    } catch {
      setError("root", {
        message: "Cererea nu a putut fi trimisă. Încearcă din nou sau scrie-ne la contact@joinwebform.com.",
      });
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-green-600/20 bg-green-500/5 p-6 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
        <h2 className="mt-4 text-2xl font-semibold">Cererea a fost trimisă.</h2>
        <p className="mt-2 text-muted-foreground">
          Te sunăm în cel mult o zi lucrătoare pentru a înțelege magazinul și
          pentru a pregăti oferta potrivită.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Numele tău" error={errors.name?.message}>
          <Input autoComplete="name" {...register("name")} />
        </Field>
        <Field label="Numele afacerii" error={errors.businessName?.message}>
          <Input autoComplete="organization" {...register("businessName")} />
        </Field>
        <Field label="Telefon" error={errors.phone?.message}>
          <Input autoComplete="tel" type="tel" {...register("phone")} />
        </Field>
        <Field label="E-mail" error={errors.email?.message}>
          <Input autoComplete="email" type="email" {...register("email")} />
        </Field>
      </div>

      <Field label="Câte produse estimezi că vei avea?" error={errors.productCount?.message}>
        <select
          className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm"
          {...register("productCount")}
        >
          <option value="1-20">1–20 produse</option>
          <option value="21-100">21–100 produse</option>
          <option value="101-500">101–500 produse</option>
          <option value="500+">Peste 500 de produse</option>
        </select>
      </Field>

      <Field label="De ce funcționalități ai nevoie?">
        <Controller
          control={control}
          name="needs"
          render={({ field }) => (
            <div className="grid gap-3 sm:grid-cols-2">
              {needs.map((item) => (
                <label key={item} className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm">
                  <Checkbox
                    checked={field.value.includes(item)}
                    onCheckedChange={(checked) =>
                      field.onChange(
                        checked
                          ? [...field.value, item]
                          : field.value.filter((value) => value !== item),
                      )
                    }
                  />
                  {item}
                </label>
              ))}
            </div>
          )}
        />
      </Field>

      <Field label="Site actual (opțional)" error={errors.currentSite?.message}>
        <Input placeholder="https://..." {...register("currentSite")} />
      </Field>
      <Field label="Ce ar trebui să mai știm?" error={errors.notes?.message}>
        <Textarea
          rows={5}
          placeholder="Spune-ne pe scurt ce vinzi, ce îți dorești și dacă ai un termen limită."
          {...register("notes")}
        />
      </Field>

      <Controller
        control={control}
        name="consent"
        render={({ field }) => (
          <div>
            <label className="flex items-start gap-3 text-sm text-muted-foreground">
              <Checkbox
                className="mt-0.5"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(Boolean(checked))}
              />
              Sunt de acord să fiu contactat telefonic de WebForm pentru
              această cerere de ofertă.
            </label>
            {errors.consent && <p className="mt-2 text-sm text-red-500">{errors.consent.message}</p>}
          </div>
        )}
      />

      {errors.root && <p className="text-sm text-red-500">{errors.root.message}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Trimite cererea de ofertă
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
