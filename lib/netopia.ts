import { randomUUID } from "node:crypto";
import type { BillingInfo } from "./schemas/billing";
import { processorBilling, configuredVat } from "./payment-request";
import { Netopia } from "netopia-card";
import { getPlan, type Plan } from "./pricing";

// Netopia configuration
export const NETOPIA_CONFIG = {
  apiKey: process.env.NETOPIA_API_KEY || "",
  posSignature: process.env.NETOPIA_SIGNATURE || "",
  notifyUrl: process.env.NEXT_PUBLIC_NETOPIA_CONFIRM_URL || "",
  redirectUrl: process.env.NEXT_PUBLIC_NETOPIA_RETURN_URL || "",
  sandbox: process.env.NETOPIA_SANDBOX === "true",
};

// Check if Netopia is configured
export function isNetopiaConfigured(): boolean {
  return !!(
    NETOPIA_CONFIG.apiKey &&
    NETOPIA_CONFIG.posSignature &&
    NETOPIA_CONFIG.notifyUrl &&
    NETOPIA_CONFIG.redirectUrl &&
    process.env.NETOPIA_IPN_PUBLIC_KEY &&
    configuredVat() !== null
  );
}

// Payment status codes from Netopia
export const PAYMENT_STATUS = {
  PENDING: 1,
  PENDING_AUTH: 14,
  CONFIRMED: 3,
  CONFIRMED_PENDING: 5,
  SCHEDULED: 7,
  CREDITED: 8,
  CANCELED: 4,
  CREDIT_PENDING: 9,
  ERROR: 11,
  DECLINED: 12,
  FRAUD: 13,
} as const;

// Helper to check if payment is successful
export function isPaymentSuccessful(status: number): boolean {
  return (
    status === PAYMENT_STATUS.CONFIRMED ||
    status === PAYMENT_STATUS.CONFIRMED_PENDING
  );
}

// Helper to check if payment is pending
export function isPaymentPending(status: number): boolean {
  return [1, 2, 6, 7, 14, 15, 18].includes(status);
}

// Helper to get human-readable status
export function getPaymentStatusText(status: number): string {
  switch (status) {
    case PAYMENT_STATUS.PENDING:
    case PAYMENT_STATUS.PENDING_AUTH:
      return "In asteptare";
    case PAYMENT_STATUS.CONFIRMED:
    case PAYMENT_STATUS.CONFIRMED_PENDING:
      return "Confirmat";
    case PAYMENT_STATUS.CANCELED:
      return "Anulat";
    case PAYMENT_STATUS.ERROR:
      return "Eroare";
    case PAYMENT_STATUS.DECLINED:
      return "Respins";
    case PAYMENT_STATUS.FRAUD:
      return "Fraudă";
    default:
      return "Necunoscut";
  }
}

// Generate unique order ID
export function generateOrderId(): string {
  return `WF-${randomUUID()}`;
}

// Create a Netopia payment request
export interface CreatePaymentParams {
  userId: string;
  userEmail: string;
  orderId: string;
  billingInfo: BillingInfo;
  planId: string;
  browserData?: Record<string, string>;
  clientIp?: string;
}

export async function createPaymentRequest(params: CreatePaymentParams) {
  const { userEmail, orderId, billingInfo, planId, browserData, clientIp } =
    params;

  const plan = getPlan(planId);
  if (!plan) {
    throw new Error(`Plan not found: ${planId}`);
  }

  if (!isNetopiaConfigured()) {
    throw new Error("Netopia is not configured. Please add your credentials.");
  }

  const returnUrl = new URL(NETOPIA_CONFIG.redirectUrl);
  returnUrl.searchParams.set("orderId", orderId);
  const netopia = new Netopia({
    apiKey: NETOPIA_CONFIG.apiKey,
    posSignature: NETOPIA_CONFIG.posSignature,
    notifyUrl: NETOPIA_CONFIG.notifyUrl,
    redirectUrl: returnUrl.toString(),
    sandbox: NETOPIA_CONFIG.sandbox,
    language: "ro",
  });

  // Set order data
  netopia.setOrderData({
    orderID: orderId,
    amount: plan.price,
    currency: "RON",
    description: `Abonament ${plan.name} - WebForm`,
    dateTime: new Date().toISOString(),
    billing: processorBilling(billingInfo, userEmail),
  });

  // Set product data
  netopia.setProductsData([
    {
      name: `Abonament ${plan.name}`,
      code: plan.id,
      category: "subscription",
      price: plan.price,
      vat: configuredVat()!, // Explicit merchant configuration; never infer tax registration.
    },
  ]);

  // Set browser data if available
  if (browserData && clientIp) {
    netopia.setBrowserData(browserData, clientIp);
  }

  try {
    const response = await netopia.startPayment();
    return {
      success: true,
      orderId,
      paymentUrl: response?.payment?.paymentURL,
      ntpId: response?.payment?.ntpID,
      response,
    };
  } catch (error) {
    console.error("Netopia payment error:", error);
    throw error;
  }
}

// Process notification from Netopia
export interface ProcessNotificationParams {
  payment: {
    ntpID: string;
    status: number;
    amount: number;
    currency: string;
    token?: string;
    code?: string;
    message?: string;
  };
  order: {
    orderID: string;
    data?: Record<string, unknown>;
  };
}

export function processNotification(notification: ProcessNotificationParams) {
  const { payment, order } = notification;

  return {
    orderId: order.orderID,
    ntpId: payment.ntpID,
    status: payment.status,
    isSuccessful: isPaymentSuccessful(payment.status),
    isPending: isPaymentPending(payment.status),
    amount: payment.amount,
    currency: payment.currency,
    token: payment.token, // For recurring payments
    errorCode: payment.code,
    errorMessage: payment.message,
    statusText: getPaymentStatusText(payment.status),
  };
}

// Calculate subscription expiry date
export function calculateExpiryDate(plan: Plan): Date {
  const now = new Date();
  const day = now.getUTCDate();
  now.setUTCDate(1);
  if (plan.interval === "year") now.setUTCFullYear(now.getUTCFullYear() + 1);
  else now.setUTCMonth(now.getUTCMonth() + 1);
  const lastDay = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0),
  ).getUTCDate();
  now.setUTCDate(Math.min(day, lastDay));
  return now;
}
