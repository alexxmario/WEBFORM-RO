import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Introdu numele tău.").max(150),
  email: z.string().trim().email("Introdu o adresă de e-mail validă.").max(254),
  phone: z.string().trim().max(30).default(""),
  businessName: z.string().trim().max(150).default(""),
  subject: z.enum(["site", "ecommerce", "existing", "other"]),
  message: z.string().trim().min(10, "Scrie-ne cel puțin 10 caractere.").max(3000),
  consent: z.boolean().refine(Boolean, {
    message: "Trebuie să accepți politica de confidențialitate.",
  }),
});

export const contactSubjects: Record<z.infer<typeof contactSchema>["subject"], string> = {
  site: "Vreau un site de prezentare",
  ecommerce: "Vreau un magazin online",
  existing: "Am deja un proiect WebForm",
  other: "Am o altă întrebare",
};
