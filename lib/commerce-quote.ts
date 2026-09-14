import { z } from "zod";

export const commerceQuoteSchema = z.object({
  name: z.string().trim().min(2).max(150),
  businessName: z.string().trim().min(2).max(150),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(30),
  productCount: z.enum(["1-20", "21-100", "101-500", "500+"]),
  needs: z.array(z.string().trim().min(2).max(80)).max(10).default([]),
  currentSite: z.string().trim().url().max(500).optional().or(z.literal("")),
  notes: z.string().trim().max(1500).default(""),
  consent: z.literal(true),
});
