export type PlanInterval = "month" | "year";
export type PlanTier = "standard" | "business";

export interface Plan {
  id: string;
  name: string;
  price: number; // RON
  interval: PlanInterval;
  tier: PlanTier;
  savings?: string;
  features: string[];
  popular?: boolean;
}

export const PLANS: Record<string, Plan> = {
  // Standard Plan - Monthly
  standard_lunar: {
    id: "standard_lunar",
    name: "Standard",
    price: 180,
    interval: "month",
    tier: "standard",
    features: [
      "Acces la toate template-urile",
      "Suport via chat",
      "Actualizări gratuite",
      "Export cod sursă",
    ],
  },
  // Standard Plan - Yearly
  standard_anual: {
    id: "standard_anual",
    name: "Standard Anual",
    price: 1944, // 180 * 12 * 0.9 = 10% off
    interval: "year",
    tier: "standard",
    savings: "10%",
    features: [
      "Acces la toate template-urile",
      "Suport via chat",
      "Actualizări gratuite",
      "Export cod sursă",
    ],
    popular: true,
  },
  // Business Plan - Monthly
  business_lunar: {
    id: "business_lunar",
    name: "Business",
    price: 350,
    interval: "month",
    tier: "business",
    features: [
      "Tot ce include Standard",
      "Suport prioritar 24/7",
      "Consultanță dedicată",
      "Personalizări la cerere",
      "Hosting gestionat",
    ],
  },
  // Business Plan - Yearly
  business_anual: {
    id: "business_anual",
    name: "Business Anual",
    price: 3780, // 350 * 12 * 0.9 = 10% off
    interval: "year",
    tier: "business",
    savings: "10%",
    features: [
      "Tot ce include Standard",
      "Suport prioritar 24/7",
      "Consultanță dedicată",
      "Personalizări la cerere",
      "Hosting gestionat",
    ],
  },
};

// Helper to get plan by ID
export function getPlan(planId: string): Plan | undefined {
  return PLANS[planId];
}

// Helper to get monthly price equivalent for display
export function getMonthlyEquivalent(plan: Plan): number {
  if (plan.interval === "year") {
    return Math.round(plan.price / 12);
  }
  return plan.price;
}

// Group plans by tier for display
export function getPlansByTier() {
  return {
    standard: {
      monthly: PLANS.standard_lunar,
      yearly: PLANS.standard_anual,
    },
    business: {
      monthly: PLANS.business_lunar,
      yearly: PLANS.business_anual,
    },
  };
}
