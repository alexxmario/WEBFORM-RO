"use client";

import { motion, useReducedMotion } from "framer-motion";

const blobConfigs = [
  {
    x: [-28, 32],
    y: [-22, 26],
    scale: [0.95, 1.08],
    opacity: [0.12, 0.22],
    duration: 12,
    left: "-6%",
    top: "-8%",
    size: "16rem",
  },
  {
    x: [-20, 25],
    y: [-18, 22],
    scale: [0.98, 1.05],
    opacity: [0.15, 0.25],
    duration: 13,
    left: "65%",
    top: "15%",
    size: "18rem",
  },
  {
    x: [-25, 30],
    y: [-20, 24],
    scale: [0.96, 1.06],
    opacity: [0.13, 0.23],
    duration: 11,
    left: "25%",
    top: "70%",
    size: "17rem",
  },
];

export function HeroBackground() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      {blobConfigs.map((config, idx) => (
        <motion.div
          key={idx}
          className="hero-orb"
          style={{
            left: config.left,
            top: config.top,
            width: config.size,
            height: config.size,
            willChange: "transform, opacity",
          }}
          animate={
            prefersReducedMotion
              ? {}
              : {
                  x: config.x,
                  y: config.y,
                  scale: config.scale,
                  opacity: config.opacity,
                }
          }
          transition={{
            duration: config.duration,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: idx * 0.35,
          }}
        />
      ))}
    </div>
  );
}
