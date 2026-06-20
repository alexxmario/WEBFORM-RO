import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WaitlistForm } from "@/components/WaitlistForm";

export default function WaitlistPage() {
  return (
    <>
      <Header />
      <main className="container space-y-10 pb-16 pt-28">
        <div className="max-w-2xl space-y-3">
          <h1 className="font-display text-display-md">
            We cap at 1,000 clients for quality.
          </h1>
          <p className="text-muted-foreground">
            Join the list and we’ll invite you when a slot opens. No spam — only a clear invite
            with next steps and timelines.
          </p>
        </div>
        <div className="section max-w-2xl">
          <WaitlistForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
