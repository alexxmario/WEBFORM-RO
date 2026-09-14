import { describe, expect, it } from "vitest";

import { blueprintSchema } from "@/lib/zodSchemas";
import { commerceQuoteSchema } from "@/lib/commerce-quote";

const validBlueprint = {
  identity: {
    businessName: "Atlas Dental",
    oneLiner: "Dental care that puts families first.",
    whatYouSell: "Family dental services",
    brandPersonality: ["Friendly", "Calm"],
  },
  vision: {
    mainGoal: "Bookings",
    primaryAction: "Book an appointment",
    visitorFeel: "Confident, safe, cared for",
    dreamClient: "Parents who want an easy, modern way to book family visits.",
  },
  look: {
    references: [
      { url: "https://linear.app", notes: "Clean layout" },
      { url: "https://stripe.com", notes: "Trustworthy design" },
    ],
    colorPreference: ["#0EA5E9"],
    imageryVibe: ["Minimal"],
    assetsNote: "",
  },
  content: {
    pages: ["Home", "About", "Services", "Contact"],
    ctaDestination: "hello@atlasdental.com",
    homeCopy: "Gentle dental for modern families.",
  },
  technical: {
    domainStatus: "have",
    currentSite: "https://atlasdental.com",
    integrations: ["Calendly", "GA4"],
  },
  operations: {
    updateTypes: ["Copy swaps"],
    contactPerson: "Alex",
    timezone: "EST",
  },
  confirmations: {
    termsAccepted: true,
  },
};

describe("blueprintSchema", () => {
  it("accepts a complete blueprint", () => {
    const parsed = blueprintSchema.safeParse(validBlueprint);
    expect(parsed.success).toBe(true);
  });

  it("rejects when confirmations are missing", () => {
    const parsed = blueprintSchema.safeParse({
      ...validBlueprint,
      confirmations: { termsAccepted: false },
    });
    expect(parsed.success).toBe(false);
  });

  it("allows clients to proceed without reference sites", () => {
    const parsed = blueprintSchema.safeParse({
      ...validBlueprint,
      look: { ...validBlueprint.look, references: [] },
    });
    expect(parsed.success).toBe(true);
  });
});

describe("commerceQuoteSchema", () => {
  const quote = {
    name: "Ana Popescu",
    businessName: "Magazinul Anei",
    email: "ana@example.com",
    phone: "+40 700 000 000",
    productCount: "21-100",
    needs: ["Plată online", "Livrare prin curier"],
    currentSite: "",
    notes: "Avem deja fotografiile produselor.",
    consent: true,
  };

  it("accepts a complete online-store quote request", () => {
    expect(commerceQuoteSchema.safeParse(quote).success).toBe(true);
  });

  it("requires explicit consent for the phone call", () => {
    expect(commerceQuoteSchema.safeParse({ ...quote, consent: false }).success).toBe(false);
  });
});
