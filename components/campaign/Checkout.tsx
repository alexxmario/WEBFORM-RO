"use client";
import { useRef, useState, useEffect } from "react";
import { PLANS, formatPrice } from "@/lib/pricing";
import { useRouter } from "next/navigation";
export function Checkout({
  token,
  version,
  terms,
  bonus,
  ready,
  pending,
}: {
  token: string;
  version: string;
  terms: string;
  bonus: string;
  ready: boolean;
  pending: boolean;
}) {
  const [planId, setPlanId] = useState("standard_anual"),
    [accepted, setAccepted] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const attempt = useRef("");
  const router = useRouter();
  useEffect(() => {
    if (!pending) return;
    let count = 0;
    const timer = window.setInterval(() => {
      router.refresh();
      if (++count >= 12) clearInterval(timer);
    }, 5000);
    return () => clearInterval(timer);
  }, [pending, router]);
  async function pay(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    if (!attempt.current) attempt.current = crypto.randomUUID();
    try {
      const response = await fetch("/api/campaign/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          planId,
          accepted,
          version,
          attempt: attempt.current,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      location.assign(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Plata nu a putut fi pornită.");
      setBusy(false);
    }
  }
  return (
    <form onSubmit={pay}>
      {pending && (
        <p role="status">
          Așteptăm confirmarea securizată a plății. Pagina se actualizează
          automat. Dacă ai plătit, nu iniția o nouă plată.
        </p>
      )}
      <div className="campaign-price-grid">
        {Object.values(PLANS).map((plan) => (
          <label key={plan.id}>
            <input
              type="radio"
              name="planId"
              value={plan.id}
              checked={planId === plan.id}
              onChange={() => {
                setPlanId(plan.id);
                setAccepted(false);
                attempt.current = "";
              }}
              disabled={busy}
            />{" "}
            {plan.name}
            {plan.interval === "month" ? " · Lunar" : " · Anual"}
            <strong>
              {formatPrice(plan.price)} lei/
              {plan.interval === "year" ? "an" : "lună"}
            </strong>
            <small>{plan.features[0]}</small>
            <small>
              {plan.features.find((feature) =>
                feature.startsWith("Actualizări"),
              )}
            </small>
            {plan.interval === "year" && (
              <small>25% reducere{bonus ? ` + ${bonus}` : ""}</small>
            )}
          </label>
        ))}
      </div>
      <div className="campaign-terms">
        {ready
          ? terms
          : "Oferta este în curs de configurare. Îți vom confirma termenii înainte de plată."}
      </div>
      <label className="campaign-consent">
        <input
          type="checkbox"
          required
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
        />
        <span>
          Accept termenii abonamentului de mai sus (versiunea {version}) și{" "}
          <a href="/legal/terms" target="_blank" rel="noreferrer">
            termenii serviciului
          </a>
          .
        </span>
      </label>
      {error && <p role="alert">{error}</p>}
      <button
        className="action action-dark"
        disabled={!ready || busy || !accepted || pending}
      >
        {busy ? "Se deschide plata…" : "Continuă la plata securizată ↗"}
      </button>
    </form>
  );
}
