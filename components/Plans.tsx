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
      </div>
    </div>
  );
}
