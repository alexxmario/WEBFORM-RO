import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ChatWelcomePopup } from "@/components/ChatWelcomePopup";
import { Check, MessageCircle } from "lucide-react";

export default function ThankYouPage() {
  return (
    <>
      <Header />
      <main id="main" className="container pb-20 pt-32">
        <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card p-6 sm:p-10">
          <span className="mb-6 grid h-14 w-14 place-items-center rounded-full bg-green-500/10 text-green-600">
            <Check className="h-7 w-7" />
          </span>
          <p className="eyebrow">FORMULAR PRIMIT</p>
          <h1 className="mt-3 font-display text-display-sm sm:text-display-md">
            Proiectul tău a început.
          </h1>
          <p className="mt-5 max-w-2xl text-body-lg text-muted-foreground">
            Am primit informațiile despre afacerea ta. În cel mult o zi
            lucrătoare revenim cu primele întrebări și pașii următori.
          </p>

          <div className="my-8 rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <div className="flex items-start gap-3">
              <MessageCircle className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
              <div>
                <h2 className="font-semibold">De acum, totul se întâmplă în chat</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Acolo clarificăm materialele, îți trimitem prima versiune,
                  primim feedbackul și gestionăm toate modificările site-ului.
                  Ai deja un mesaj de bun venit.
                </p>
              </div>
            </div>
          </div>

          <ol className="grid gap-3 text-sm sm:grid-cols-3">
            <li className="rounded-xl border border-border p-4"><strong>1. Analizăm</strong><br /><span className="text-muted-foreground">formularul și materialele</span></li>
            <li className="rounded-xl border border-border p-4"><strong>2. Construim</strong><br /><span className="text-muted-foreground">și trimitem versiunea în chat</span></li>
            <li className="rounded-xl border border-border p-4"><strong>3. Publicăm</strong><br /><span className="text-muted-foreground">după aprobarea ta</span></li>
          </ol>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/chat">Deschide chat-ul proiectului</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/account">Mergi la contul meu</Link>
            </Button>
          </div>
        </div>
      </main>
      <ChatWelcomePopup />
      <Footer />
    </>
  );
}
