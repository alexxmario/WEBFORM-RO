import type { BillingInfo } from "./schemas/billing";
export function processorBilling(info: BillingInfo, email: string) {
  const name =
    info.billingType === "individual"
      ? info.name
      : info.contactName || info.companyName;
  const [firstName, ...rest] = name.trim().split(/\s+/);
  return {
    email,
    firstName,
    lastName: rest.join(" ") || firstName,
    phone: info.billingType === "individual" ? info.phone : info.contactPhone,
    city: info.billingType === "individual" ? info.city : info.hqCity,
    country: 642,
    countryName: "Romania",
    state: info.billingType === "individual" ? info.county : info.hqCounty,
    postalCode: "",
    details:
      info.billingType === "individual"
        ? info.address
        : `${info.companyName}, ${info.cuiPrefix}${info.cui}, ${info.hqAddress}`,
  };
}
export function configuredVat(value = process.env.NETOPIA_VAT_RATE) {
  if (value === undefined || value.trim() === "") return null;
  const rate = Number(value);
  return Number.isFinite(rate) && rate >= 0 && rate <= 100 ? rate : null;
}
