"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const waitlistSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  businessType: z.string().min(2, "Tell us your business type"),
  tier: z.enum(["Starter", "Business", "Premium"]),
});

type WaitlistValues = z.infer<typeof waitlistSchema>;

export function WaitlistForm() {
  const form = useForm<WaitlistValues>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      name: "",
      email: "",
      businessType: "",
      tier: "Business",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (values: WaitlistValues) => {
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Save failed");
      toast.success("Cererea ta a fost salvată. Îți vom scrie când serviciul este disponibil.");
      form.reset();
    } catch {
      toast.error("Nu am putut salva cererea. Încearcă din nou sau contactează-ne.");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <Field label="Name" error={errors.name?.message}>
        <Input placeholder="Your name" {...register("name")} />
      </Field>
      <Field label="Email" error={errors.email?.message}>
        <Input placeholder="you@company.com" type="email" {...register("email")} />
      </Field>
      <Field label="Business type" error={errors.businessType?.message}>
        <Input placeholder="Dental clinic, SaaS, studio, etc." {...register("businessType")} />
      </Field>
      <Field label="Desired tier" error={errors.tier?.message}>
        <input type="hidden" {...register("tier")} />
        <Select
          defaultValue="Business"
          onValueChange={(v) => setValue("tier", v as WaitlistValues["tier"])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose a tier" />
          </SelectTrigger>
          <SelectContent>
            {["Starter", "Business", "Premium"].map((tier) => (
              <SelectItem key={tier} value={tier}>
                {tier}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Join waitlist
      </Button>
    </form>
  );
}

type FieldProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

function Field({ label, error, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
