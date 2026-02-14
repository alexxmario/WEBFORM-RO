import Image from "next/image";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { BlueprintButton } from "@/components/BlueprintButton";
import { templateOptions } from "@/lib/templates";

export default function TemplatesPage() {
  return (
    <>
      <Header />
      <main className="container space-y-10 pb-16 pt-28">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Badge>Librărie</Badge>
            <h1 className="mt-3 font-display text-4xl font-semibold">
              Explorează librăria noastră de șabloane
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Alege din {templateOptions.length}+ șabloane proiectate profesional. Fiecare poate fi personalizat complet pentru a se potrivi brandului tău.
            </p>
          </div>
          <BlueprintButton size="lg">Completează Blueprint-ul</BlueprintButton>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templateOptions.map((template) => (
            <Link
              key={template.id}
              href={template.preview}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/70 p-4 shadow-sm transition hover:border-primary/50 hover:shadow-glow"
            >
              <div
                className="relative aspect-square w-full overflow-hidden rounded-xl bg-cover bg-center shadow-inner"
                style={{
                  backgroundImage: template.thumbnail
                    ? `url(${template.thumbnail})`
                    : "radial-gradient(circle at 20% 30%,rgba(156,77,255,0.35),transparent 40%),radial-gradient(circle at 80% 30%,rgba(79,195,255,0.35),transparent 40%),linear-gradient(120deg,rgba(40,50,70,0.6),rgba(20,26,38,0.7))",
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
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition">
                  {template.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {template.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="sticky bottom-4 z-20">
          <div className="glass flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 px-4 py-3 shadow-lg">
            <p className="text-sm text-muted-foreground">
              Gata să începi? Completează Blueprint-ul Website-ului și vom personaliza orice șablon pentru tine.
            </p>
            <BlueprintButton>Completează Blueprint-ul</BlueprintButton>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
