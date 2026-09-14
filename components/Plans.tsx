"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import {
  getPlansByTier,
  getMonthlyEquivalent,
  formatPrice,
} from "@/lib/pricing";
export function Plans({ compact = false }: { compact?: boolean }) {
  const [annual, setAnnual] = useState(false);
  const plans = getPlansByTier();
  return (
    <div className={compact ? "plans compact" : "plans"}>
      <div
        className="billing-toggle"
        role="group"
        aria-label="Perioada de facturare"
      >
        <button aria-pressed={!annual} onClick={() => setAnnual(false)}>
          Lunar
        </button>
        <button aria-pressed={annual} onClick={() => setAnnual(true)}>
          Anual <span>−25%</span>
        </button>
      </div>
      <div className="plan-grid">
        {[plans.standard, plans.business].map((tier, i) => {
          const plan = annual ? tier.yearly : tier.monthly;
          return (
            <article
              className={`plan-card ${i === 1 ? "plan-featured" : ""}`}
              key={plan.id}
            >
              <div className="plan-heading">
                <h3>{i === 0 ? "Start" : "Business"}</h3>
                {i === 1 && (
                  <span className="plan-tag">MAI MULT LOC DE CREȘTERE</span>
                )}
              </div>
              <p>
                {i === 0
                  ? "Esențialul pentru o prezență online profesionistă."
                  : "Pentru afaceri cu mai multe servicii și idei."}
              </p>
              <div className="plan-price">
                {formatPrice(getMonthlyEquivalent(plan))}
                <span>lei / lună</span>
              </div>
              <p className="billing-detail">
                {annual
                  ? `${formatPrice(plan.price)} lei facturați anual. Economisești 25%.`
                  : "Facturare lunară. Reînnoire din cont."}
              </p>
              <p className="promo-code-note">
                Cod <strong>WEBFORM20</strong> · −20% la prima plată
              </p>
              <Link
                className={`action ${i === 1 ? "action-orange" : "action-outline"}`}
                href={`/subscribe/billing?planId=${plan.id}`}
              >
                Alege {i === 0 ? "Start" : "Business"}
                <ArrowUpRight size={18} />
              </Link>
              <div className="plan-divider" />
              <ul>
                {plan.features.map((f) => (
                  <li key={f}>
                    <Check size={17} />
                    {f}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
        <article className="plan-card plan-commerce">
          <div className="plan-heading">
            <h3>Magazin online</h3>
            <span className="plan-tag">OFERTĂ PERSONALIZATĂ</span>
          </div>
          <p>Pentru catalog, plăți, livrare și integrările afacerii tale.</p>
          <div className="plan-price plan-price-custom">
            La cerere
          </div>
          <p className="billing-detail">
            Discutăm cerințele și primești un preț clar înainte să începem.
          </p>
          <Link className="action action-outline" href="/oferta-magazin-online">
            Cere ofertă <ArrowUpRight size={18} />
          </Link>
          <div className="plan-divider" />
          <ul>
            {["Pagini de produs și categorii", "Plată online și livrare", "Integrări pentru stocuri și facturare", "Lansare și suport gestionate de noi"].map((feature) => (
              <li key={feature}><Check size={17} />{feature}</li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  );
}
