"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { hasMetaConsent, META_CONSENT_KEY, saveMetaConsent, trackMetaPageView } from "@/lib/meta-pixel";

export function MetaConsent() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    const sync = () => {
      const consent = hasMetaConsent();
      setAccepted(consent);
      try { setOpen(localStorage.getItem(META_CONSENT_KEY) === null); }
      catch { setOpen(true); }
      if (consent) trackMetaPageView(pathname);
      else if (window.fbq) window.location.reload();
    };
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [pathname]);

  function choose(value: boolean) {
    try { saveMetaConsent(value); }
    catch { setStorageError(true); return; }
    setAccepted(value);
    setOpen(false);
    if (value) trackMetaPageView(pathname);
  }

  return open ? (
    <section aria-label="Preferințe cookie-uri" className="fixed bottom-4 left-4 right-4 z-[100] mx-auto max-w-xl rounded-2xl border border-border bg-background p-5 text-foreground shadow-xl">
      <h2 className="text-lg font-semibold">Cookie-uri pentru publicitate</h2>
      <p className="mt-2 text-sm">Cu acordul tău, folosim Meta Pixel pentru măsurarea și personalizarea reclamelor. La trimiterea cererii, folosim numele, telefonul și orașul pentru potrivirea cu un cont Meta. Refuzul nu afectează formularul.</p>
      <a className="mt-2 inline-block text-sm underline" href="/legal/privacy">Politica de confidențialitate</a>
      <div className="mt-4 flex flex-wrap gap-3">
        <button className="rounded-lg border border-border px-4 py-2" onClick={() => choose(false)}>{accepted ? "Retrag acordul" : "Refuz"}</button>
        <button className="rounded-lg border border-border px-4 py-2" onClick={() => choose(true)}>Accept</button>
        {accepted && <button className="px-4 py-2 underline" onClick={() => setOpen(false)}>Închide</button>}
      </div>
      {storageError && <p role="alert" className="mt-2 text-sm">Preferința nu poate fi salvată în acest browser. Pixel-ul rămâne dezactivat.</p>}
    </section>
  ) : (
    <button className="fixed bottom-3 left-3 z-[100] rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground shadow" onClick={() => setOpen(true)}>Setări cookie-uri</button>
  );
}
