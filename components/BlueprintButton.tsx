"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { Button } from "./ui/button";
import { useAuth } from "@/lib/hooks/useAuth";

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
  const { isAuthenticated, loading } = useAuth();

  // Show login link while loading or not authenticated
  const href = loading || !isAuthenticated ? "/login" : "/start";

  if (asChild) {
    return (
      <Button asChild variant={variant} size={size} className={className}>
        <Link href={href}>{children}</Link>
      </Button>
    );
  }

  return (
    <Button variant={variant} size={size} className={className}>
      <Link href={href}>{children}</Link>
    </Button>
  );
}