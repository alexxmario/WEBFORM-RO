"use client";

import { useEffect } from "react";
import { throttle } from "@/lib/throttle";

export function Spotlight() {
  useEffect(() => {
    const handler = throttle((event: PointerEvent) => {
      const x = Math.round((event.clientX / window.innerWidth) * 100);
      const y = Math.round((event.clientY / window.innerHeight) * 100);
      document.documentElement.style.setProperty("--x", `${x}%`);
      document.documentElement.style.setProperty("--y", `${y}%`);
    }, 16); // ~60fps max

    window.addEventListener("pointermove", handler);
    return () => window.removeEventListener("pointermove", handler);
  }, []);

  return null;
}
