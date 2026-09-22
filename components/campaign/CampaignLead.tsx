"use client";
import { LeadForm } from "./LeadForm";

export function CampaignLead({ whatsapp }: { whatsapp: string }) {
  return <LeadForm whatsapp={whatsapp} />;
}
