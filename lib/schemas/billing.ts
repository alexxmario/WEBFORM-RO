import { z } from "zod";

// Individual billing schema - all fields mandatory
export const individualBillingSchema = z.object({
  billingType: z.literal("individual"),
  name: z.string().min(2, "Numele este obligatoriu"),
  phone: z.string().min(10, "Numarul de telefon este obligatoriu"),
  county: z.string().min(1, "Judetul este obligatoriu"),
  city: z.string().min(1, "Localitatea este obligatorie"),
  address: z.string().min(5, "Adresa este obligatorie"),
});

// Company billing schema - some fields optional
export const companyBillingSchema = z.object({
  billingType: z.literal("company"),
  // Company details (required)
  companyName: z.string().min(2, "Numele firmei este obligatoriu"),
  cuiPrefix: z.enum(["", "RO"]).default(""),
  cui: z.string().min(2, "CUI-ul este obligatoriu"),
  // Trade registry (optional)
  regComCounty: z.string().optional().default(""),
  regComType: z.string().optional().default(""),
  regComNumber: z.string().optional().default(""),
  regComYear: z.string().optional().default(""),
  // Bank (optional)
  bankName: z.string().optional().default(""),
  iban: z.string().optional().default(""),
  // Headquarters (required county and address)
  hqCounty: z.string().min(1, "Judetul sediului social este obligatoriu"),
  hqCity: z.string().optional().default(""),
  hqAddress: z.string().min(5, "Adresa sediului social este obligatorie"),
  // Contact (optional)
  contactName: z.string().optional().default(""),
  contactPhone: z.string().optional().default(""),
  // Delivery (optional)
  deliveryCounty: z.string().optional().default(""),
  deliveryCity: z.string().optional().default(""),
  deliveryAddress: z.string().optional().default(""),
});

// Combined billing schema using discriminated union
export const billingSchema = z.discriminatedUnion("billingType", [
  individualBillingSchema,
  companyBillingSchema,
]);

// Type exports
export type IndividualBilling = z.infer<typeof individualBillingSchema>;
export type CompanyBilling = z.infer<typeof companyBillingSchema>;
export type BillingInfo = z.infer<typeof billingSchema>;

// Default values for forms
export const defaultIndividualBilling: IndividualBilling = {
  billingType: "individual",
  name: "",
  phone: "",
  county: "",
  city: "",
  address: "",
};

export const defaultCompanyBilling: CompanyBilling = {
  billingType: "company",
  companyName: "",
  cuiPrefix: "",
  cui: "",
  regComCounty: "",
  regComType: "",
  regComNumber: "",
  regComYear: "",
  bankName: "",
  iban: "",
  hqCounty: "",
  hqCity: "",
  hqAddress: "",
  contactName: "",
  contactPhone: "",
  deliveryCounty: "",
  deliveryCity: "",
  deliveryAddress: "",
};
