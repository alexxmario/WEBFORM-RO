import { z } from "zod";

export const projectBriefSchema = z.object({
  businessName: z.string().trim().min(2, "Scrie numele afacerii.").max(160),
  offering: z
    .string()
    .trim()
    .min(10, "Descrie pe scurt serviciile sau produsele tale.")
    .max(3000),
  audience: z
    .string()
    .trim()
    .min(3, "Spune-ne cui te adresezi și în ce zonă.")
    .max(1000),
  goal: z
    .string()
    .trim()
    .min(3, "Spune-ne ce vrei să obții prin site.")
    .max(1000),
  contact: z
    .string()
    .trim()
    .min(5, "Adaugă telefonul, e-mailul sau linkul pentru cereri.")
    .max(500),
  existingPresence: z.string().trim().max(1000).default(""),
  notes: z.string().trim().max(3000).default(""),
  termsAccepted: z
    .boolean()
    .refine(Boolean, "Acceptă termenii pentru a continua."),
});
export type ProjectBriefValues = z.infer<typeof projectBriefSchema>;

// Preserve the established admin representation without inventing design choices.
export const projectBriefPayloadSchema = projectBriefSchema.transform(
  (brief) => ({
    briefVersion: 2,
    brief,
    identity: {
      businessName: brief.businessName,
      whatYouSell: brief.offering,
      oneLiner: brief.audience,
      brandPersonality: [] as string[],
    },
    vision: { mainGoal: "Other" as const, customMainGoal: brief.goal },
    look: {
      references: [],
      colorPreference: [],
      imageryVibe: [],
      assetsNote: [
        brief.existingPresence && `Prezență online: ${brief.existingPresence}`,
        brief.notes,
      ]
        .filter(Boolean)
        .join("\n\n"),
      assetUploads: [] as string[],
    },
    content: { pages: [] as string[], ctaDestination: brief.contact },
    technical: {
      domainStatus: null,
      currentSite: "",
      integrations: [] as string[],
    },
    confirmations: { termsAccepted: brief.termsAccepted },
  }),
);
