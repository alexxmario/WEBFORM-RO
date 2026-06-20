import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";

export default function ThankYouPage() {
  return (
    <>
      <Header />
      <main className="container space-y-8 pb-16 pt-28">
        <div className="section space-y-4">
          <h1 className="font-display text-display-sm">Thanks — your Blueprint is on its way.</h1>
          <p className="text-muted-foreground">
            We’ll reply within 24 hours with an async “alignment check.” No meetings — just your
            next steps and timeline. If you want a quick async review, reply to the confirmation
            email with any files or Looms.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/">Back to home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/pricing">Review pricing</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
