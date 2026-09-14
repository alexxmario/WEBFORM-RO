import type { Plan } from "./pricing";

export interface Promotion {
  code: string;
  percentOff: number;
  firstPaymentOnly: boolean;
}

const PROMOTIONS: Record<string, Promotion> = {
  WEBFORM20: {
    code: "WEBFORM20",
    percentOff: 20,
    firstPaymentOnly: true,
  },
};

export function normalizePromotionCode(value?: string | null): string {
  return (value || "").trim().toUpperCase();
}

export function getPromotion(value?: string | null): Promotion | undefined {
  const code = normalizePromotionCode(value);
  return code ? PROMOTIONS[code] : undefined;
}

export function promotionPrice(plan: Plan, promotion: Promotion) {
  const discount = Number(
    (plan.price * (promotion.percentOff / 100)).toFixed(2),
  );
  return {
    originalPrice: plan.price,
    discount,
    finalPrice: Number((plan.price - discount).toFixed(2)),
  };
}
