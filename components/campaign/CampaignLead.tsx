"use client";
import { useEffect, useState } from "react";
import { LeadForm } from "./LeadForm";
export function CampaignLead({
  pixel,
  whatsapp,
}: {
  pixel: string;
  whatsapp: string;
}) {
  const [consent, setConsent] = useState(false),
    [choice, setChoice] = useState(false);
  useEffect(() => {
    const value = localStorage.getItem("webform-campaign-marketing");
    setConsent(value === "yes");
    setChoice(value !== null);
  }, []);
  useEffect(() => {
    if (!consent || !pixel) return;
    if (!window.fbq) {
      const fn: NonNullable<Window["fbq"]> = function (...args: unknown[]) {
        if (fn.callMethod) fn.callMethod(...args);
        else fn.queue?.push(args);
      };
      fn.queue = [];
      fn.loaded = true;
      fn.version = "2.0";
      window.fbq = fn;
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/fbevents.js";
      script.async = true;
      document.head.appendChild(script);
      window.fbq("init", pixel);
    }
    window.fbq("consent", "grant");
    window.fbq("track", "PageView");
    return () => window.fbq?.("consent", "revoke");
  }, [consent, pixel]);
  function choose(value: boolean) {
    localStorage.setItem("webform-campaign-marketing", value ? "yes" : "no");
    setConsent(value);
    setChoice(true);
  }
  return (
    <div>
      {pixel && (
        <aside className="campaign-tracking">
          <p>
            Putem folosi Meta Pixel pentru a măsura reclamele? Alegerea nu
            afectează cererea ta.
          </p>
          {!choice ? (
            <div>
              <button type="button" onClick={() => choose(true)}>
                Accept măsurarea
              </button>
              <button type="button" onClick={() => choose(false)}>
                Refuz
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => choose(!consent)}>
              {consent ? "Dezactivează măsurarea" : "Activează măsurarea"}
            </button>
          )}
        </aside>
      )}
      <LeadForm whatsapp={whatsapp} marketingConsent={consent} />
    </div>
  );
}
