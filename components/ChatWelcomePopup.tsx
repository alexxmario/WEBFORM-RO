"use client";

import Link from "next/link";
import { MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

export function ChatWelcomePopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 500);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <aside
      className="fixed bottom-20 left-5 z-50 w-[calc(100%-2.5rem)] max-w-sm rounded-2xl border border-border bg-card p-4 shadow-2xl"
      aria-label="Mesaj nou în chat"
    >
      <div className="flex items-start gap-3">
        <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
          <MessageCircle className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-card bg-red-500" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="font-semibold">Mesaj nou · Echipa WebForm</p>
            <button
              type="button"
              onClick={() => setVisible(false)}
              aria-label="Închide notificarea"
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Bine ai venit! Am primit formularul. Următorii pași și toate
            actualizările proiectului sunt în chat.
          </p>
          <Link
            href="/chat"
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary"
          >
            Deschide conversația →
          </Link>
        </div>
      </div>
    </aside>
  );
}
