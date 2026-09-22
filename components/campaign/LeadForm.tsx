"use client";
import { useRef, useState } from "react";
import { hasMetaConsent, trackMetaLead } from "@/lib/meta-pixel";
import { leadSchema } from "@/lib/campaign/schema";
export function LeadForm({
  source = "instalatii",
  whatsapp = "",
}: {
  source?: "instalatii" | "homepage";
  whatsapp?: string;
}) {
  const [busy, setBusy] = useState(false),
    [done, setDone] = useState(false),
    [error, setError] = useState("");
  const eventId = useRef("");
  const submitting = useRef(false);
  const completed = useRef(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || completed.current) return;
    setError("");
    const f = new FormData(event.currentTarget);
    if (!eventId.current) eventId.current = crypto.randomUUID();
    const params = new URLSearchParams(location.search);
    const attribution = Object.fromEntries(
      [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_term",
        "utm_content",
        "fbclid",
      ].flatMap((k) => (params.get(k) ? [[k, params.get(k)!]] : [])),
    );
    const payload = {
      source,
      name: f.get("name"),
      phone: f.get("phone"),
      consent: f.get("consent") === "on",
      website: f.get("website") || "",
      eventId: eventId.current,
      attribution,
      marketingConsent: hasMetaConsent(),
      ...(source === "instalatii"
        ? {
            company: f.get("company"),
            city: f.get("city"),
            services: f.getAll("services"),
          }
        : { businessType: f.get("businessType") }),
    };
    const parsed = leadSchema.safeParse(payload);
    if (!parsed.success) {
      setError(
        "Verifică numele, numărul românesc de telefon și câmpurile obligatorii.",
      );
      return;
    }
    submitting.current = true;
    setBusy(true);
    try {
      const response = await fetch("/api/campaign/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      completed.current = true;
      setDone(true);
      if (parsed.data.source === "instalatii" && parsed.data.marketingConsent) {
        trackMetaLead(eventId.current, parsed.data);
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Trimiterea a eșuat. Încearcă din nou.",
      );
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }
  if (done)
    return (
      <div className="campaign-success" role="status">
        <h3>Gata! Te sunăm în câteva minute.</h3>
        <p>Am primit cererea ta.</p>
        {whatsapp && (
          <a className="action action-dark" href={`https://wa.me/${whatsapp}`}>
            Scrie-ne pe WhatsApp ↗
          </a>
        )}
      </div>
    );
  return (
    <form onSubmit={submit} className="campaign-form">
      <div className="campaign-fields">
        <label>
          Nume
          <input
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={150}
          />
        </label>
        <label>
          Telefon
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            maxLength={30}
            placeholder="07xx xxx xxx"
          />
        </label>
        {source === "instalatii" ? (
          <>
            <label>
              Ai firmă sau PFA?
              <select name="company" required defaultValue="">
                <option value="" disabled>
                  Alege o opțiune
                </option>
                <option value="yes">Da</option>
                <option value="no">Nu</option>
              </select>
            </label>
            <label>
              Orașul în care lucrezi
              <input
                name="city"
                autoComplete="address-level2"
                required
                minLength={2}
                maxLength={150}
              />
            </label>
          </>
        ) : (
          <label>
            Tipul afacerii
            <input
              name="businessType"
              required
              minLength={2}
              maxLength={150}
              placeholder="De exemplu: service auto"
            />
          </label>
        )}
      </div>
      {source === "instalatii" && (
        <fieldset>
          <legend>Ce servicii faci?</legend>
          <div className="campaign-services">
            {["Sanitare", "Termice", "Centrale", "Altele"].map((s) => (
              <label key={s}>
                <input type="checkbox" name="services" value={s} />
                {s}
              </label>
            ))}
          </div>
        </fieldset>
      )}
      <label className="campaign-honey" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="campaign-consent">
        <input name="consent" type="checkbox" required />
        <span>
          Sunt de acord să fiu contactat pentru această cerere și am citit{" "}
          <a href="/legal/privacy" target="_blank" rel="noreferrer">
            politica de confidențialitate
          </a>
          .
        </span>
      </label>
      {error && <p role="alert">{error}</p>}
      <button className="action action-dark" disabled={busy}>
        {busy ? "Se trimite…" : "Vreau site-ul meu – te sunăm azi"} ↗
      </button>
      <p className="campaign-small">
        30 de secunde. Fără plată și fără obligații acum.
      </p>
    </form>
  );
}
declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & {
      queue?: unknown[][];
      loaded?: boolean;
      version?: string;
      callMethod?: (...args: unknown[]) => void;
    };
  }
}
