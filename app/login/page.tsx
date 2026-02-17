"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Suspense, useMemo, useState } from "react";

import { supabaseBrowser } from "@/lib/supabase/browser";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

function LoginForm() {
  const supabase = useMemo(supabaseBrowser, []);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/subscribe";
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const initRoom = async (userId: string, userEmail: string, fullName?: string, businessName?: string) => {
    await fetch("/api/chat/init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, email: userEmail, name: fullName, businessName }),
    });
  };

  const handleAuth = async () => {
    console.log("handleAuth called", { authMode, email, password: password ? "[hidden]" : "" });
    setError("");

    if (authMode === "signup") {
      if (!name.trim() || !business.trim()) {
        setError("Te rugăm să completezi toate câmpurile");
        return;
      }
      if (password !== passwordConfirm) {
        setError("Parolele nu se potrivesc");
        return;
      }
      if (!agree) {
        setError("Te rugăm să accepți termenii și condițiile");
        return;
      }
    }

    if (!email.trim() || !password.trim()) {
      setError("Te rugăm să introduci email și parola");
      return;
    }

    setLoading(true);

    try {
      if (authMode === "signup") {
        // Use our custom signup API that bypasses email confirmation
        const signupResponse = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            name,
            businessName: business,
          }),
        });

        const signupResult = await signupResponse.json();

        if (!signupResponse.ok) {
          setError(signupResult.error || "Signup failed");
          setLoading(false);
          return;
        }

        // Auto sign-in after signup
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          // If auto sign-in fails, show success and ask to sign in manually
          setLoading(false);
          setAuthMode("signin");
          toast.success("Cont creat cu succes! Te rugăm să te autentifici.");
          return;
        }

        if (signInData.session?.user) {
          const user = signInData.session.user;
          await initRoom(user.id, user.email || "", name, business);
          // Redirect to subscribe page after signup
          router.replace("/subscribe");
        }
        return;
      }

      const { data: signInData, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setLoading(false);
        console.error("Supabase sign in error:", error);
        // Translate common Supabase errors to Romanian
        if (error.message.includes("Invalid login credentials")) {
          setError("Email sau parolă incorectă");
        } else if (error.message.includes("Email not confirmed")) {
          setError("Te rugăm să îți confirmi adresa de email");
        } else {
          setError(`Autentificare eșuată: ${error.message}`);
        }
        return;
      }

      if (signInData.session?.user) {
        const user = signInData.session.user;
        await initRoom(user.id, user.email || "");

        // Check subscription status
        const { data: profile } = await supabase
          .from("profiles")
          .select("subscription_status")
          .eq("id", user.id)
          .single();

        // Redirect based on subscription status
        if (profile?.subscription_status === "active") {
          // If there's a redirect param and user has subscription, use it
          router.replace(redirectTo === "/subscribe" ? "/templates" : redirectTo);
        } else {
          // No active subscription - go to subscribe page
          router.replace("/subscribe");
        }
      } else {
        setLoading(false);
        setError("Nu s-a putut crea sesiunea");
      }
    } catch (err) {
      setLoading(false);
      setError(`Eroare neașteptată: ${err instanceof Error ? err.message : 'Eroare necunoscută'}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAuth();
  };

  return (
    <main className="container flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-12">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 rounded-3xl border border-border/60 bg-card/80 p-6 shadow-lg shadow-black/20">
        <h1 className="text-2xl font-semibold text-foreground">
          {authMode === "signup" ? "Creează un cont" : "Autentifică-te pentru chat"}
        </h1>
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
            {error}
          </div>
        )}
        {authMode === "signup" && (
          <>
            <Input placeholder="Nume complet" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Numele afacerii" value={business} onChange={(e) => setBusiness(e.target.value)} />
          </>
        )}
        <Input type="email" placeholder="tu@exemplu.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input
          type="password"
          placeholder="Parolă"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {authMode === "signup" && (
          <Input
            type="password"
            placeholder="Confirmă parola"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
        )}
        {authMode === "signup" && (
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Checkbox checked={agree} onCheckedChange={(v) => setAgree(Boolean(v))} />
            <span>
              Sunt de acord cu{" "}
              <a className="text-primary underline" href="/legal/terms" target="_blank">
                Termenii și Condițiile
              </a>
            </span>
          </label>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 px-5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 inline-flex items-center justify-center gap-2 text-sm font-medium"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {authMode === "signup" ? "Creează cont" : "Autentifică-te"}
        </button>
        <button
          type="button"
          className="text-sm text-muted-foreground underline"
          onClick={() => setAuthMode(authMode === "signup" ? "signin" : "signup")}
        >
          {authMode === "signup" ? "Ai deja un cont? Autentifică-te" : "Ai nevoie de un cont? Înregistrează-te"}
        </button>
      </form>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="container flex min-h-screen flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
