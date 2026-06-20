import Image from "next/image";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BlueprintButton } from "@/components/BlueprintButton";
import { templateOptions } from "@/lib/templates";

export default function TemplatesPage() {
  return (
    <>
      <Header />
      <main className="container space-y-10 pb-16 pt-28">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="font-display text-display-md">
              Explorează librăria noastră de șabloane
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Alege din {templateOptions.length}+ șabloane proiectate profesional. Fiecare poate fi personalizat complet pentru a se potrivi brandului tău.
            </p>
          </div>
          <BlueprintButton size="lg">Completează Formularul</BlueprintButton>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templateOptions.map((template) => (
            <a
              key={template.id}
              href={template.preview}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
            >
              <div
                className="relative aspect-square w-full overflow-hidden rounded-xl bg-cover bg-center shadow-inner"
                style={{
                  backgroundImage: template.thumbnail
                    ? `url(${template.thumbnail})`
                    : "radial-gradient(circle at 20% 30%,hsl(var(--accent) / 0.35),transparent 40%),radial-gradient(circle at 80% 30%,hsl(var(--primary) / 0.35),transparent 40%),linear-gradient(120deg,hsl(var(--muted) / 0.6),hsl(var(--background) / 0.7))",
                  filter: "brightness(1.45) saturate(1.25)",
                }}
              >
                {template.thumbnail && (
                  <Image
                    src={template.thumbnail}
                    alt={template.name}
                    fill
                    className="object-cover brightness-125 saturate-125 transition group-hover:scale-105"
                  />
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-heading-sm text-foreground group-hover:text-primary transition">
                  {template.name}
                </h3>
                <p className="text-body-sm text-muted-foreground line-clamp-2">
                  {template.description}
                </p>
              </div>
            </a>
          ))}
        </div>

        <div className="sticky bottom-4 z-20">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
            <p className="text-body-sm text-muted-foreground">
              Gata să începi? Completează Formularul Website-ului și vom personaliza orice șablon pentru tine.
            </p>
            <BlueprintButton>Completează Formularul</BlueprintButton>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
