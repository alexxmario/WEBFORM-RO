import type { Metadata } from "next";

import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/context/AuthContext";
import { Toast } from "@/components/Toast";
import { AnalyticsScripts } from "@/components/analytics";
import { MetaConsent } from "@/components/meta-consent";
import { defaultMetadata } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <head>
        <meta name="facebook-domain-verification" content="iy3oll847cutgnrb0wl5hy1hsf6yrb" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        <a href="#main" className="sr-skip">
          Salt la continut
        </a>
        <ThemeProvider>
          <AuthProvider>
            <div className="relative min-h-screen overflow-hidden">
              {children}
            </div>
            <Toast />
            <AnalyticsScripts />
            <MetaConsent />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
