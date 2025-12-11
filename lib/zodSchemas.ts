import { z } from "zod";

export const heroPromptSchema = z.object({
  whatYouDo: z.string().min(2, "Tell us what you do"),
});

const referenceSiteSchema = z.object({
  url: z.string(),
  notes: z.string().optional(),
});

export const blueprintSchema = z.object({
  identity: z.object({
    businessName: z.string().min(2, "Business name is required"),
    oneLiner: z.string().min(8, "Add a punchy one-liner"),
    whatYouSell: z.string().min(3, "What you sell is required"),
    brandPersonality: z
      .array(z.string())
      .nonempty("Pick at least one personality"),
  }),
  vision: z.object({
    mainGoal: z.enum(["Leads", "Bookings", "Trust", "Portfolio", "Sell"]),
  }),
  look: z.object({
    references: z
      .array(referenceSiteSchema)
      .optional()
      .default([]),
    colorPreference: z.array(z.string()).max(5, "You can add up to 5 colors"),
    imageryVibe: z.array(z.string()).optional().default([]),
    assetsNote: z.string().optional().default(""),
    assetUploads: z.array(z.string()).optional().default([]),
  }),
  content: z.object({
    pages: z
      .array(z.string())
      .nonempty("Select or add at least one page"),
    ctaDestination: z.string().min(5, "Where should your CTAs point?"),
  }),
  technical: z.object({
    domainStatus: z.enum(["have", "need"]),
    currentSite: z
      .string()
      .url("Share a valid URL")
      .optional()
      .or(z.literal("")),
    integrations: z.array(z.string()).optional().default([]),
  }),
  confirmations: z.object({
    termsAccepted: z
      .boolean()
      .refine((val) => val, {
        message: "Please accept the terms and conditions to continue",
      }),
  }),
});

export type BlueprintFormValues = z.infer<typeof blueprintSchema>;

export const blueprintSteps = [
  "Identity",
  "Vision",
  "Look & Feel",
  "Content & Structure",
  "Technical",
  "Confirmations",
] as const;
