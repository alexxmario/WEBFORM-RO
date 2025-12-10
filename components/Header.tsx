"use client";

import { User, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { BlueprintButton } from "./BlueprintButton";
import { useAuth } from "@/lib/hooks/useAuth";

const navLinks = [
  { href: "/#how", label: "How it works" },
  { href: "/#plans", label: "Plans" },
  { href: "/status", label: "Status" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const supabase = supabaseBrowser();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-x-0 top-0 z-40 flex justify-center pt-4"
    >
      <div className="glass flex w-[95%] items-center justify-between gap-4 rounded-full border border-white/10 px-5 py-3 shadow-lg shadow-black/20 md:w-[88%] lg:w-[82%]">
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
                "rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition hover:text-foreground",
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
                "rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition hover:text-foreground",
                pathname === "/chat" && "text-foreground",
              )}
            >
              Chat
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="hidden items-center gap-2 text-sm text-foreground/80 sm:flex">
                <User className="h-4 w-4" />
                <span className="max-w-[120px] truncate">{user.email}</span>
              </div>
              <Button size="sm" variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </>
          ) : (
            <>
              <Button asChild size="sm" variant="outline">
                <Link href="/login">Log in</Link>
              </Button>
              <BlueprintButton size="sm" className="hidden sm:inline-flex">
                Start the Website Blueprint
              </BlueprintButton>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}
