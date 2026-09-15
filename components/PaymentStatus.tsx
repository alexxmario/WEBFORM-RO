"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock3, AlertCircle } from "lucide-react";
export function PaymentStatus({
  orderId,
  initialStatus,
}: {
  orderId: string;
  initialStatus: string;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [delayed, setDelayed] = useState(false);
  useEffect(() => {
    if (!["completed", "failed", "refunded"].includes(status)) return;
    try {
      const mapping = `webform-checkout-order-${orderId}`;
      const key = sessionStorage.getItem(mapping);
      if (key) sessionStorage.removeItem(key);
      sessionStorage.removeItem(mapping);
    } catch {}
  }, [orderId, status]);
  useEffect(() => {
    if (status !== "completed") return;
    let redirectTimer: number | undefined;
    void fetch("/api/chat/welcome", { method: "POST" }).finally(() => {
      redirectTimer = window.setTimeout(() => {
        window.location.href = "/chat";
      }, 2500);
    });
    return () => {
      if (redirectTimer) window.clearTimeout(redirectTimer);
    };
  }, [status]);
  useEffect(() => {
    if (status !== "pending") return;
    const controller = new AbortController();
    let attempts = 0;
    const timer = setInterval(async () => {
      if (++attempts > 20) {
        clearInterval(timer);
        setDelayed(true);
        return;
      }
      try {
        const r = await fetch(
          `/api/payments/status?orderId=${encodeURIComponent(orderId)}`,
          { signal: controller.signal, cache: "no-store" },
        );
        if (r.ok) {
          const data = await r.json();
          setStatus(data.status);
        }
      } catch {
        /* A failed status check never reports a successful payment. */
      }
    }, 3000);
    return () => {
      clearInterval(timer);
      controller.abort();
    };
  }, [orderId, status]);
  const paid = status === "completed",
    pending = status === "pending";
  const Icon = paid ? CheckCircle2 : pending ? Clock3 : AlertCircle;
  return (
    <div className="max-w-md text-center">
      <Icon className="mx-auto mb-6 h-14 w-14 text-primary" />
      <h1 className="text-3xl font-semibold">
        {paid
          ? "Plata este confirmată."
          : pending
            ? "Așteptăm confirmarea plății."
            : "Plata nu a fost finalizată."}
      </h1>
      <p className="mt-4 text-muted-foreground">
        {paid
          ? "Planul este activ. Pregătim chat-ul proiectului și te trimitem acolo automat."
          : pending
            ? delayed
              ? "Confirmarea durează mai mult. Nu plăti din nou; contactează-ne cu numărul comenzii."
              : "Verificăm automat starea comenzii. Poate dura câteva momente."
            : "Nu am activat un abonament pentru această comandă. Poți reveni la planuri."}
      </p>
      <p className="mt-4 break-all text-xs text-muted-foreground">
        Comanda: {orderId}
      </p>
      <Link
        className="action action-dark mt-8"
        href={paid ? "/chat" : pending ? "/contact" : "/subscribe"}
      >
        {paid
          ? "Intră în chat-ul proiectului"
          : pending
            ? "Contactează-ne"
            : "Înapoi la planuri"}
      </Link>
    </div>
  );
}
