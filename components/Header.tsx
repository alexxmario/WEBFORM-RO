"use client";

import { User, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { memo, useCallback } from "react";

import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { BlueprintButton } from "./BlueprintButton";
import { useAuth } from "@/lib/hooks/useAuth";

const navLinks = [
  { href: "/#how-it-works", label: "Cum funcționează" },
  { href: "/templates", label: "Librărie" },
  { href: "/#plans", label: "Planuri" },
];

export const Header = memo(function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const supabase = supabaseBrowser();

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    router.push("/");
  }, [supabase, router]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-x-0 top-0 z-40 px-4 pt-2"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-xl border border-border bg-background/95 px-4 py-3 backdrop-blur-sm">
        <Link href="/" className="flex items-center px-2 py-1">
          <Image
            src="/logo.png"
            alt="WebForm Logo"
            width={100}
            height={100}
            className="max-h-14"
          />
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground",
                pathname === link.href && "text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <Link
              href="/chat"
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground",
                pathname === "/chat" && "text-foreground",
              )}
            >
              Suport
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                href="/account"
                className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground/80 transition-colors hover:text-foreground sm:flex"
              >
                <User className="h-4 w-4" />
                <span className="max-w-[120px] truncate">Contul meu</span>
              </Link>
              <Button size="sm" variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Deconectare</span>
              </Button>
            </>
          ) : (
            <>
              <Button asChild size="sm" variant="outline">
                <Link href="/login">Autentificare</Link>
              </Button>
              <BlueprintButton size="sm" className="hidden sm:inline-flex">
                Începe Blueprint-ul
              </BlueprintButton>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
});
