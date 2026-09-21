import { MessageCircle } from "lucide-react";

const whatsappUrl =
  "https://wa.me/40764902801?text=Bun%C4%83%21%20A%C8%99%20vrea%20s%C4%83%20aflu%20mai%20multe%20despre%20un%20site%20WebForm.";

export function WhatsAppButton() {
  return (
    <a
      className="whatsapp-button"
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Scrie-ne pe WhatsApp"
    >
      <MessageCircle aria-hidden="true" size={22} strokeWidth={2.25} />
      <span>Scrie-ne pe WhatsApp</span>
    </a>
  );
}
