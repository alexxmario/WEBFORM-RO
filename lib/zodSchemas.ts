import { z } from "zod";

export const heroPromptSchema = z.object({
  whatYouDo: z.string().min(2, "Spune-ne ce faci"),
});

const referenceSiteSchema = z.object({
  url: z.string(),
  notes: z.string().optional(),
});

export const blueprintSchema = z.object({
  identity: z.object({
    businessName: z.string().min(2, "Numele afacerii este necesar"),
    oneLiner: z.string().optional(),
    whatYouSell: z.string().min(3, "Trebuie să specifici ce vinzi"),
    brandPersonality: z
      .array(z.string())
      .nonempty("Alege cel puțin o personalitate"),
  }),
  vision: z.object({
    mainGoal: z.enum(["Leads", "Bookings", "Trust", "Portfolio", "Sell", "Other"]),
    customMainGoal: z.string().optional(),
  }).refine(
    (data) => {
      if (data.mainGoal === "Other") {
        return data.customMainGoal && data.customMainGoal.trim().length >= 3;
      }
      return true;
    },
    {
      message: "Te rugăm să descrii obiectivul principal (min 3 caractere)",
      path: ["customMainGoal"],
    }
  ),
  look: z.object({
    references: z
      .array(referenceSiteSchema)
      .optional()
      .default([]),
    colorPreference: z.array(z.string()).max(5, "Poți adăuga până la 5 culori"),
    imageryVibe: z.array(z.string()).optional().default([]),
    assetsNote: z.string().optional().default(""),
    assetUploads: z.array(z.string()).optional().default([]),
  }),
  content: z.object({
    pages: z
      .array(z.string())
      .nonempty("Selectează sau adaugă cel puțin o pagină"),
    ctaDestination: z.string().min(5, "Unde ar trebui să direcționeze CTA-urile tale?"),
  }),
  technical: z.object({
    domainStatus: z.enum(["have", "need"]),
    currentSite: z
      .string()
      .url("Introdu un URL valid")
      .optional()
      .or(z.literal("")),
    integrations: z.array(z.string()).optional().default([]),
  }),
  confirmations: z.object({
    termsAccepted: z
      .boolean()
      .refine((val) => val, {
        message: "Te rugăm să accepți termenii și condițiile pentru a continua",
      }),
  }),
});

export type BlueprintFormValues = z.infer<typeof blueprintSchema>;

export const blueprintSteps = [
  "Identitate",
  "Viziune",
  "Aspect & Stil",
  "Conținut & Structură",
  "Tehnic",
  "Confirmări",
] as const;
