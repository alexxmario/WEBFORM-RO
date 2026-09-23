import { z } from "zod";
export const statuses = [
  "new",
  "called",
  "in_progress",
  "preview_sent",
  "paid",
  "lost",
] as const;
export const statusLabels: Record<string, string> = {
  new: "Nou",
  called: "Sunat",
  in_progress: "În lucru",
  preview_sent: "Preview trimis",
  paid: "Plătit",
  lost: "Pierdut",
};
export const phoneSchema = z
  .string()
  .trim()
  .transform((v) =>
    v
      .replace(/[\s().-]/g, "")
      .replace(/^0040/, "+40")
      .replace(/^0/, "+40"),
  )
  .pipe(
    z.string().regex(/^\+40[237]\d{8}$/, "Introdu un număr românesc valid."),
  );
const common = {
  name: z.string().trim().min(2).max(150),
  phone: phoneSchema,
  consent: z.literal(true),
  website: z.string().max(0).default(""),
  eventId: z.string().uuid(),
  marketingConsent: z.boolean().default(false),
  attribution: z
    .object({
      article_slug: z.string().max(150).regex(/^[a-z0-9-]+$/).optional(),
      utm_source: z.string().max(300).optional(),
      utm_medium: z.string().max(300).optional(),
      utm_campaign: z.string().max(300).optional(),
      utm_term: z.string().max(300).optional(),
      utm_content: z.string().max(300).optional(),
      fbclid: z.string().max(500).optional(),
    })
    .default({}),
};
export const leadSchema = z.discriminatedUnion("source", [
  z.object({
    ...common,
    source: z.literal("instalatii"),
    company: z.enum(["yes", "no"]),
    city: z.string().trim().min(2).max(150),
    services: z
      .array(z.enum(["Sanitare", "Termice", "Centrale", "Altele"]))
      .max(4),
  }),
  z.object({
    ...common,
    source: z.literal("homepage"),
    businessType: z.string().trim().min(2).max(150),
  }),
]);
export const tokenSchema = z.string().regex(/^[a-f0-9]{64}$/);
