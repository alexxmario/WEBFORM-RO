import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FAQ } from "@/components/FAQ";
export default function FaqPage() {
  return (
    <>
      <Header />
      <main id="main" className="container max-w-4xl pb-24 pt-40">
        <p className="eyebrow">BINE DE ȘTIUT</p>
        <h1 className="text-display-md mt-4 mb-10">
          Întrebări mici. Răspunsuri clare.
        </h1>
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
