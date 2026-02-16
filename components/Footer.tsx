"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamic import to avoid SSR issues
const NTPLogo = dynamic(() => import("ntp-logo-react"), {
  ssr: false,
  loading: () => <div className="h-12 w-24 bg-neutral-800 rounded animate-pulse" />
});

const footerNavLeft = [
  { label: "Prețuri", href: "/#plans" },
  { label: "Șabloane", href: "/templates" },
  { label: "Formular", href: "/start" },
  { label: "Întrebări frecvente", href: "/faq" },
];

const footerNavRight = [
  { label: "Termeni și Condiții", href: "/legal/terms" },
  { label: "Confidențialitate", href: "/legal/privacy" },
  { label: "Politica de Livrare", href: "/legal/delivery" },
  { label: "Politica de Anulare", href: "/legal/cancellation" },
];

export function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden text-white bg-[#050505] border-neutral-800 border-t pt-24">
      <div
        className="text-center w-full mb-20 pr-4 pl-4"
        style={{
          maskImage: "linear-gradient(180deg, transparent, black 0%, black 55%, transparent)",
          WebkitMaskImage: "linear-gradient(180deg, transparent, black 0%, black 55%, transparent)",
        }}
      >
        <h1 className="text-[16vw] leading-[0.7] select-none font-bold text-[#141414] tracking-tighter mix-blend-screen scale-y-110">
          WEBFORM
        </h1>
      </div>
      <div className="border-t border-neutral-900 grid grid-cols-1 lg:grid-cols-2">
        <div className="p-8 md:p-16 grid grid-cols-2 gap-12 border-r border-neutral-900">
          <div className="flex flex-col gap-6">
            {footerNavLeft.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-medium text-neutral-500 uppercase tracking-widest hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-6">
            {footerNavRight.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-medium text-neutral-500 uppercase tracking-widest hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="lg:h-auto lg:border-t-0 flex overflow-hidden w-full border-neutral-900 border-t relative p-8 md:p-16">
          <div className="flex flex-col gap-4 text-xs text-neutral-500">
            <p className="font-medium text-neutral-400 uppercase tracking-widest">Date de Contact</p>
            <div className="space-y-2">
              <p>IONESCU ALEXANDRU-MARIO PFA</p>
              <p>CUI: 52801591</p>
              <p>Nr. Reg.: F2025043137007</p>
              <p>Bulevardul Bucureștii Noi, Nr. 136, Parter, Ap. 5</p>
              <p>Sector 1, București, România</p>
              <p>
                <Link href="tel:+40764902801" className="hover:text-white transition-colors">
                  +40 764 902 801
                </Link>
              </p>
              <p>
                <Link href="mailto:alexionescu870@gmail.com" className="hover:text-white transition-colors">
                  alexionescu870@gmail.com
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Payment & Consumer Protection Logos */}
      <div className="border-t border-neutral-900 py-8 px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          {/* Netopia Logo */}
          <div className="flex flex-col items-center gap-2">
            <NTPLogo color="#3890bc" version="vertical" secret="160895" />
          </div>

          {/* ANPC - SAL */}
          <Link
            href="https://anpc.ro/ce-spune-legea/sal/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 text-neutral-500 hover:text-white transition-colors"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://wpfitness.eu/wp-content/uploads/2022/10/anpc-sal.png"
              alt="ANPC SAL"
              width={150}
              height={50}
              className="opacity-80 hover:opacity-100 transition-opacity"
            />
          </Link>

          {/* ANPC - SOL */}
          <Link
            href="https://ec.europa.eu/consumers/odr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 text-neutral-500 hover:text-white transition-colors"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://wpfitness.eu/wp-content/uploads/2022/10/anpc-sol.png"
              alt="ANPC SOL - EU ODR"
              width={150}
              height={50}
              className="opacity-80 hover:opacity-100 transition-opacity"
            />
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto border-t border-neutral-900 pt-4 px-8 text-sm text-neutral-500 text-center pb-8">
        © {new Date().getFullYear()} IONESCU ALEXANDRU-MARIO PFA. Toate drepturile rezervate.
      </div>
    </footer>
  );
}
