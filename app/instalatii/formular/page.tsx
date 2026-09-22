import type { Metadata } from "next";
import { CampaignLead } from "@/components/campaign/CampaignLead";
import { campaignConfig } from "@/lib/campaign/config";
import styles from "./formular.module.css";

export const metadata: Metadata = {
  title: "Hai să povestim | WebForm",
  description: "Lasă-ne datele tale și povestim despre site-ul pentru afacerea ta.",
};

export default function FormularPage() {
  return (
    <main id="main" className={styles.page}>
      <h1 className="sr-only">Hai să povestim despre site-ul tău</h1>
      <div className={styles.form}>
        <CampaignLead whatsapp={campaignConfig().whatsapp} />
      </div>
    </main>
  );
}
