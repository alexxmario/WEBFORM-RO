"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/start");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <>
      <Header />
      <main className="container flex min-h-[80vh] flex-col items-center justify-center pb-16 pt-28">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>

          <h1 className="font-display text-3xl font-semibold text-foreground">
            Plata a fost procesata cu succes!
          </h1>

          <p className="mt-3 text-muted-foreground">
            Multumim pentru abonament! Acum poti incepe sa iti creezi website-ul.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4">
            <Button asChild size="lg" className="w-full max-w-xs">
              <Link href="/start">
                Incepe Blueprint-ul
              </Link>
            </Button>

            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Redirectionare in {countdown} secunde...
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
