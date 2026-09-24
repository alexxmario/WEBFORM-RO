"use client";

import { useEffect, useState } from "react";
import styles from "./ad-article.module.css";

export function StickyLeadButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const offer = document.getElementById("oferta-initiala");
    const form = document.getElementById("formular");
    if (!offer || !form) return;
    let scrolled = false;
    let frame = 0;
    const update = () => {
      frame = 0;
      const offerRect = offer.getBoundingClientRect();
      const formRect = form.getBoundingClientRect();
      const formVisible = formRect.top < window.innerHeight && formRect.bottom > 0;
      setVisible(scrolled && offerRect.bottom <= 0 && !formVisible);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onScroll = () => {
      scrolled = true;
      schedule();
    };
    const observer = new IntersectionObserver(schedule, { threshold: [0, 1] });
    observer.observe(offer);
    observer.observe(form);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <nav className={styles.sticky} data-visible={visible} aria-label="Cerere site" aria-hidden={!visible}>
      <a href="#formular" tabIndex={visible ? 0 : -1}>Vreau site-ul meu</a>
    </nav>
  );
}
