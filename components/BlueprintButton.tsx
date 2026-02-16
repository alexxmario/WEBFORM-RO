"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { Button } from "./ui/button";

interface BlueprintButtonProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "icon" | "sm" | "md" | "lg";
  asChild?: boolean;
}

export function BlueprintButton({
  children,
  className,
  variant = "default",
  size,
  asChild = true
}: BlueprintButtonProps) {
  // Always link to /start - middleware handles auth/subscription redirects
  if (asChild) {
    return (
      <Button asChild variant={variant} size={size} className={className}>
        <Link href="/start">{children}</Link>
      </Button>
    );
  }

  return (
    <Button variant={variant} size={size} className={className}>
      <Link href="/start">{children}</Link>
    </Button>
  );
}