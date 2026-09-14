"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useAuthContext } from "@/lib/context/AuthContext";

export function Header() {
  const { user } = useAuthContext();
  const [open, setOpen] = useState(false);
  const links = [
    { href: "/#how-it-works", label: "Cum funcționează" },
    { href: "/templates", label: "Modele de site" },
    { href: "/#plans", label: "Prețuri" },
  ];
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link
          href="/"
          className="wordmark"
          aria-label="WebForm, pagina principală"
        >
          <span className="brand-logo-shell">
            <Image
              className="brand-logo"
              src="/logo.png"
              alt=""
              width={1137}
              height={314}
              priority
            />
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Navigare principală">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link className="account-link" href={user ? "/account" : "/login"}>
            {user ? "Contul meu" : "Intră în cont"}
          </Link>
          <Link
            className="action action-small action-dark"
            href={user ? "/start" : "/#plans"}
          >
            {user ? "Proiectul meu" : "Începem?"}
            <ArrowUpRight size={16} />
          </Link>
          <button
            className="menu-toggle"
            aria-label={open ? "Închide meniul" : "Deschide meniul"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-nav"
          className="mobile-nav"
          aria-label="Navigare mobilă"
        >
          {[
            ...links,
            {
              href: user ? "/account" : "/login",
              label: user ? "Contul meu" : "Intră în cont",
            },
            ...(user ? [{ href: "/chat", label: "Suport" }] : []),
          ].map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
              <ArrowUpRight size={16} />
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
