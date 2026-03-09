import type { Metadata } from "next";

import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/context/AuthContext";
import { Toast } from "@/components/Toast";
import { AnalyticsScripts } from "@/components/analytics";
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
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        <a href="#main" className="sr-skip">
          Salt la continut
        </a>
        <ThemeProvider>
          <AuthProvider>
            <div className="relative min-h-screen overflow-hidden">
              <div
                className="noise pointer-events-none fixed inset-0 opacity-40 mix-blend-soft-light"
                aria-hidden
              />
              {children}
            </div>
            <Toast />
            <AnalyticsScripts />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
