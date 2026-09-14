import type { Metadata } from "next";
import { Check } from "lucide-react";

import { CommerceQuoteForm } from "@/components/CommerceQuoteForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Cerere ofertă magazin online",
  description:
    "Spune-ne ce magazin online îți dorești și te contactăm pentru o ofertă personalizată.",
};

export default function CommerceQuotePage() {
  return (
    <>
      <Header />
      <main id="main" className="container pb-20 pt-32">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">MAGAZIN ONLINE · OFERTĂ PERSONALIZATĂ</p>
            <h1 className="mt-4 font-display text-display-sm sm:text-display-md">
              Spune-ne ce vrei să vinzi. Noi pregătim soluția.
            </h1>
            <p className="mt-5 text-body-lg text-muted-foreground">
              Magazinele online diferă mult prin numărul de produse, plăți,
              livrare și integrări. Completează formularul, apoi te sunăm
              pentru clarificări și ofertă.
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              {["Discuție telefonică scurtă", "Ofertă adaptată magazinului", "Fără obligația de a cumpăra"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-border bg-card p-5 sm:p-8">
            <CommerceQuoteForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
