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
    NETOPIA_CONFIG.redirectUrl
  );
}

// Payment status codes from Netopia
export const PAYMENT_STATUS = {
  PENDING: 0,
  PENDING_AUTH: 1,
  CONFIRMED: 3,
  CONFIRMED_PENDING: 4,
  SCHEDULED: 5,
  CREDITED: 6,
  CANCELED: 7,
  CREDIT_PENDING: 8,
  ERROR: 10,
  DECLINED: 12,
  FRAUD: 15,
} as const;

// Helper to check if payment is successful
export function isPaymentSuccessful(status: number): boolean {
  return status === PAYMENT_STATUS.CONFIRMED || status === PAYMENT_STATUS.CONFIRMED_PENDING;
}

// Helper to check if payment is pending
export function isPaymentPending(status: number): boolean {
  return status === PAYMENT_STATUS.PENDING || status === PAYMENT_STATUS.PENDING_AUTH;
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
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `WF-${timestamp}-${random}`;
}

// Create a Netopia payment request
export interface CreatePaymentParams {
  userId: string;
  userEmail: string;
  userName: string;
  planId: string;
  browserData?: Record<string, string>;
  clientIp?: string;
}

export async function createPaymentRequest(params: CreatePaymentParams) {
  const { userEmail, userName, planId, browserData, clientIp } = params;

  const plan = getPlan(planId);
  if (!plan) {
    throw new Error(`Plan not found: ${planId}`);
  }

  if (!isNetopiaConfigured()) {
    throw new Error("Netopia is not configured. Please add your credentials.");
  }

  const netopia = new Netopia({
    apiKey: NETOPIA_CONFIG.apiKey,
    posSignature: NETOPIA_CONFIG.posSignature,
    notifyUrl: NETOPIA_CONFIG.notifyUrl,
    redirectUrl: NETOPIA_CONFIG.redirectUrl,
    sandbox: NETOPIA_CONFIG.sandbox,
    language: "ro",
  });

  const orderId = generateOrderId();
  const [firstName, ...lastNameParts] = userName.split(" ");
  const lastName = lastNameParts.join(" ") || firstName;

  // Set order data
  netopia.setOrderData({
    orderID: orderId,
    amount: plan.price,
    currency: "RON",
    description: `Abonament ${plan.name} - WebForm`,
    dateTime: new Date().toISOString(),
    billing: {
      email: userEmail,
      firstName: firstName || "Client",
      lastName: lastName || "WebForm",
      phone: "",
      city: "Bucuresti",
      country: 642, // Romania ISO code
      countryName: "Romania",
      state: "Bucuresti",
      postalCode: "000000",
      details: "",
    },
  });

  // Set product data
  netopia.setProductsData([
    {
      name: `Abonament ${plan.name}`,
      code: plan.id,
      category: "subscription",
      price: plan.price,
      vat: 19, // 19% TVA in Romania
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
  if (plan.interval === "year") {
    return new Date(now.setFullYear(now.getFullYear() + 1));
  }
  return new Date(now.setMonth(now.getMonth() + 1));
}
