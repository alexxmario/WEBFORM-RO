"use client";

import { useEffect, useState } from "react";
import styles from "./meta-consent.module.css";
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
    <section aria-label="Preferințe cookie-uri" className={styles.banner}>
      <p>Accepți Meta Pixel pentru măsurarea și personalizarea reclamelor?</p>
      <details className={styles.details}>
        <summary>Detalii</summary>
        <p>Poți refuza și folosi în continuare formularul.</p>
        <p>La trimiterea cererii, folosim numele, telefonul și orașul pentru potrivirea cu un cont Meta, numai cu acordul tău.</p>
        <a href="/legal/privacy">Politica de confidențialitate</a>
      </details>
      <div className={styles.actions}>
        <button onClick={() => choose(false)}>{accepted ? "Retrag acordul" : "Refuz"}</button>
        <button onClick={() => choose(true)}>Accept</button>
        {accepted && <button onClick={() => setOpen(false)}>Închide</button>}
      </div>
      {storageError && <p role="alert">Preferința nu poate fi salvată în acest browser. Pixel-ul rămâne dezactivat.</p>}
    </section>
  ) : (
    <div className={styles.settings}>
      <button onClick={() => setOpen(true)}>Setări cookie-uri</button>
    </div>
  );
}
