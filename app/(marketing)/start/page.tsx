import { BlueprintForm } from "@/components/BlueprintForm";
import { FloatingLinesBackground } from "@/components/FloatingLinesBackground";
import { Badge } from "@/components/ui/badge";

export default function StartPage() {
  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      <FloatingLinesBackground />
      <main
        id="main"
        className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-4 py-12 sm:px-8 lg:py-16"
      >
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <Badge
            variant="outline"
            className="border-primary/50 bg-primary/10 text-primary"
          >
            Website Blueprint
          </Badge>
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">
            Un formular pentru a lansa și gestiona site-ul tău.
          </h1>
        </div>

        <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-background/80 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="px-5 py-6 sm:px-10 sm:py-10">
            <BlueprintForm />
          </div>
        </div>
      </main>
    </div>
  );
}
