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
    name: "Start",
    price: 180,
    interval: "month",
    tier: "standard",
    features: [
      "Până la 3 pagini, adaptate afacerii tale",
      "Design optimizat pentru mobil",
      "Domeniu, găzduire și SSL incluse",
      "Actualizări în 7 zile · 1 cerere activă",
      "SEO de bază și formular de contact",
      "Suport prin chat, în română",
    ],
  },
  // Standard Plan - Yearly
  standard_anual: {
    id: "standard_anual",
    name: "Start Anual",
    price: 1620, // 180 * 12 * 0.75 = 25% off
    interval: "year",
    tier: "standard",
    savings: "25%",
    features: [
      "Până la 3 pagini, adaptate afacerii tale",
      "Design optimizat pentru mobil",
      "Domeniu, găzduire și SSL incluse",
      "Actualizări în 7 zile · 1 cerere activă",
      "SEO de bază și formular de contact",
      "Suport prin chat, în română",
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
      "Până la 7 pagini personalizate",
      "Tot ce include planul Start",
      "Actualizări în 3 zile · 2 cereri active",
      "Configurare SEO avansată și analiză trafic",
      "Integrări și formulare personalizate",
      "Blog opțional și suport prioritar",
    ],
  },
  // Business Plan - Yearly
  business_anual: {
    id: "business_anual",
    name: "Business Anual",
    price: 3150, // 350 * 12 * 0.75 = 25% off
    interval: "year",
    tier: "business",
    savings: "25%",
    features: [
      "Până la 7 pagini personalizate",
      "Tot ce include planul Start",
      "Actualizări în 3 zile · 2 cereri active",
      "Configurare SEO avansată și analiză trafic",
      "Integrări și formulare personalizate",
      "Blog opțional și suport prioritar",
    ],
  },
};

// Helper to get plan by ID
export function getPlan(planId: string): Plan | undefined {
  return Object.prototype.hasOwnProperty.call(PLANS, planId)
    ? PLANS[planId]
    : undefined;
}

// Helper to get monthly price equivalent for display
export function getMonthlyEquivalent(plan: Plan): number {
  if (plan.interval === "year") {
    return plan.price / 12;
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

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("ro-RO", { maximumFractionDigits: 2 }).format(
    value,
  );
}
