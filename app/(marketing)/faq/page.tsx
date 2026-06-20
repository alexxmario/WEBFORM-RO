import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { buildFaqJsonLd } from "@/lib/schema";
import Script from "next/script";

export default function FaqPage() {
  const faqItems = [
    {
      question: "What happens if I cancel?",
      answer:
        "Hosting and management stop; your site goes offline. You can export content; a full site export is available as a paid service.",
    },
    {
      question: "Do I need meetings?",
      answer:
        "No meetings required. The Blueprint covers everything; optional async checkpoints are included.",
    },
    {
      question: "Turnaround?",
      answer:
        "First build in 7 days after complete Blueprint; changes in 3 days, queue-based.",
    },
    {
      question: "What counts as a change?",
      answer:
        "Small updates under ~1 hour. Larger work may require a plan upgrade or scoped add-on.",
    },
  ];

  const faqJsonLd = buildFaqJsonLd(faqItems);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-16">
        <section className="section-blur section-fade py-16">
          <div className="container max-w-4xl space-y-8">
            <div className="space-y-3 text-center">
              <h1 className="text-display-md text-foreground" style={{ textWrap: "balance" }}>Întrebări Frecvente</h1>
              <p className="text-body-lg text-muted-foreground">
                Fără surprize: anulare, exporturi, domenii și SLA sunt integrate în platformă.
              </p>
            </div>
            <div className="grid gap-4">
              {faqItems.map((item) => (
                <details
                  key={item.question}
                  className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors"
                >
                  <summary className="cursor-pointer text-heading-sm text-foreground">
                    {item.question}
                  </summary>
                  <p className="mt-3 text-body-md text-muted-foreground leading-relaxed">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <Script
        type="application/ld+json"
        id="faq-jsonld"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
