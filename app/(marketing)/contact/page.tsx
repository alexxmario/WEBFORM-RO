import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Mail, MapPin, Phone } from "lucide-react";

import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactează echipa WebForm pentru un site, un magazin online sau o întrebare despre proiectul tău.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main id="main" className="container pb-20 pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <p className="eyebrow">CONTACT WEBFORM</p>
            <h1 className="mt-4 font-display text-display-sm sm:text-display-md">Spune-ne cu ce te putem ajuta.</h1>
            <p className="mt-4 text-body-lg text-muted-foreground">Completează formularul și mesajul ajunge direct la echipa WebForm.</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-3xl border border-border bg-card p-5 sm:p-8"><ContactForm /></div>
            <aside className="space-y-6 rounded-3xl border border-border bg-card p-6 sm:p-8">
              <div><h2 className="text-xl font-semibold">Date de contact</h2><p className="mt-2 text-sm text-muted-foreground">Dacă ai deja un proiect activ, folosește chat-ul proiectului pentru un răspuns mai rapid.</p><Link href="/chat" className="mt-3 inline-flex text-sm font-semibold text-primary">Deschide chat-ul proiectului →</Link></div>
              <div className="space-y-4 border-t border-border pt-6 text-sm">
                <a className="flex items-start gap-3" href="mailto:alexionescu870@gmail.com"><Mail className="mt-0.5 h-4 w-4 text-primary" /><span><strong className="block">E-mail</strong>alexionescu870@gmail.com</span></a>
                <a className="flex items-start gap-3" href="tel:+40764902801"><Phone className="mt-0.5 h-4 w-4 text-primary" /><span><strong className="block">Telefon</strong>+40 764 902 801</span></a>
                <div className="flex items-start gap-3"><Building2 className="mt-0.5 h-4 w-4 text-primary" /><span><strong className="block">Firmă</strong>IONESCU ALEXANDRU-MARIO PFA<br />CUI: 52801591<br />F2025043137007</span></div>
                <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 text-primary" /><span><strong className="block">Sediu</strong>Bd. Bucureștii Noi 136, parter, ap. 5<br />Sector 1, București, România</span></div>
              </div>
              <div className="border-t border-border pt-6 text-sm">
                <h3 className="font-semibold">Informații legale</h3>
                <div className="mt-3 grid gap-2 text-muted-foreground">
                  <Link href="/legal/terms">Termeni și condiții</Link>
                  <Link href="/legal/privacy">Politica de confidențialitate</Link>
                  <Link href="/legal/delivery">Politica de livrare</Link>
                  <Link href="/legal/cancellation">Politica de anulare</Link>
                  <a href="https://anpc.ro/ce-spune-legea/sal/" target="_blank" rel="noopener noreferrer">ANPC · Soluționarea alternativă a litigiilor</a>
                </div>
              </div>
              <p className="border-t border-border pt-6 text-xs text-muted-foreground">Plățile online sunt procesate securizat prin NETOPIA Payments.</p>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
