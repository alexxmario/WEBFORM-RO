"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";
import { BlueprintButton } from "./BlueprintButton";

const plans = [
  {
    name: "Start",
    setup: "699 RON",
    monthly: "449 RON/lună",
    summary: "Site de prezentare gata de lansare pentru echipe mici.",
    perks: ["Până la 3 pagini", "Actualizări în 3 zile", "1 cerere activă", "Găzduire + domeniu"],
  },
  {
    name: "Business",
    setup: "1.799 RON",
    monthly: "899 RON/lună",
    summary: "Pentru companii în creștere care au nevoie de viteză.",
    perks: [
      "Până la 7 pagini",
      "2 cereri active",
      "Prioritate 2 zile",
      "Analytics + SEO",
    ],
    highlighted: true,
  },
  {
    name: "Premium",
    setup: "3.999 RON",
    monthly: "1.799 RON/lună",
    summary: "Site-uri complexe, rezervări sau e-commerce.",
    perks: [
      "10+ pagini sau e-com",
      "3 cereri active",
      "Prioritate 24h",
      "Integrări incluse",
    ],
  },
];

type PlansProps = {
  compact?: boolean;
};

export function Plans({ compact = false }: PlansProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={cn("grid gap-8", compact ? "md:grid-cols-3" : "lg:grid-cols-3")}>
      {plans.map((plan, idx) => (
        <motion.div
          key={plan.name}
          initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.05, duration: 0.45 }}
        >
          <Card
            className={cn(
              "h-full border-border/60 bg-card/60 backdrop-blur transition duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-lg",
              plan.highlighted && "border-primary/60 shadow-lg shadow-primary/20",
            )}
          >
            <CardContent className="flex h-full flex-col gap-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{plan.summary}</p>
                </div>
                {plan.highlighted && <Badge>Cel mai popular</Badge>}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inițial</p>
                <p className="text-2xl font-semibold">{plan.setup}</p>
                <p className="mt-1 text-sm text-muted-foreground">{plan.monthly}</p>
              </div>
              <ul className="space-y-2 text-sm text-foreground/90">
                {plan.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
              <BlueprintButton variant={plan.highlighted ? "default" : "outline"} className="mt-auto">
                Începe Formularul
                <ArrowRight className="ml-2 h-4 w-4" />
              </BlueprintButton>
              {!compact && (
                <p className="text-xs text-muted-foreground">
                  Lansare în 7 zile • Actualizări în 3 zile • Găzduire și domeniu incluse.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
