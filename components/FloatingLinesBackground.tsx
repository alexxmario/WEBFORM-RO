"use client";

export function FloatingLinesBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="floating-lines" aria-hidden />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 18% 20%, hsl(var(--primary) / 0.14), transparent 32%), radial-gradient(circle at 78% 0%, hsl(var(--secondary) / 0.12), transparent 28%)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-transparent to-background/85" />
    </div>
  );
}
