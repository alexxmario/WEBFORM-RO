"use client";

import { useEffect, useRef, useState } from "react";

export function LazySpline() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "200px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (shouldLoad && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay prevented
      });
    }
  }, [shouldLoad]);

  return (
    <div
      ref={containerRef}
      className="relative z-10 w-screen max-w-none overflow-hidden flex items-center justify-center"
      style={{ width: "100vw", minHeight: "100vh" }}
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-auto"
        style={{
          display: "block",
          width: "100vw",
          maxWidth: "100vw",
          height: "720px",
          objectFit: "contain",
        }}
      >
        <source src="/spline.mov" type="video/quicktime" />
        <source src="/spline.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
