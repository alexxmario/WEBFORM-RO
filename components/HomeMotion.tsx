"use client";
import { useEffect, useRef } from "react";

/** Progressive enhancement: content remains visible without JS or with reduced motion. */
export function HomeMotion() {
  const progress = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;
    const sections = document.querySelectorAll<HTMLElement>(
      ".home-section, .final-cta, .benefit-strip",
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -35px 0px" },
    );
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top > window.innerHeight)
        section.classList.add("will-reveal");
      observer.observe(section);
    });
    let frame = 0;
    const scroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const distance =
          document.documentElement.scrollHeight - window.innerHeight;
        if (progress.current)
          progress.current.style.transform = `scaleX(${distance > 0 ? window.scrollY / distance : 0})`;
      });
    };
    const revealAll = () => {
      if (reduced.matches)
        sections.forEach((s) => s.classList.remove("will-reveal"));
    };
    window.addEventListener("scroll", scroll, { passive: true });
    reduced.addEventListener("change", revealAll);
    scroll();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scroll);
      reduced.removeEventListener("change", revealAll);
      sections.forEach((s) => s.classList.remove("will-reveal"));
    };
  }, []);
  return <div ref={progress} className="reading-progress" aria-hidden="true" />;
}
