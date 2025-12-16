"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

import { supabaseBrowser } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function LoginPage() {
  const supabase = useMemo(supabaseBrowser, []);
  const router = useRouter();
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
    setError("");

    if (authMode === "signup") {
      if (!name.trim() || !business.trim()) {
        setError("Please fill in all required fields");
        return;
      }
      if (password !== passwordConfirm) {
        setError("Passwords don't match");
        return;
      }
      if (!agree) {
        setError("Please agree to the terms of service");
        return;
      }
    }

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password");
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

        // Success! Switch to sign in mode
        setLoading(false);
        setAuthMode("signin");
        setError("");
        // Clear the form fields
        setName("");
        setBusiness("");
        setPassword("");
        setPasswordConfirm("");
        setAgree(false);
        // Show success message
        toast.success("Cont creat cu succes! Te rugăm să te autentifici cu credențialele tale.");
        return;
      }

      const { data: signInData, error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);

      if (error) {
        console.error("Supabase sign in error:", error);
        setError(`Sign in failed: ${error.message}`);
        return;
      }

      if (signInData.session?.user) {
        const user = signInData.session.user;
        await initRoom(user.id, user.email || "");
        router.replace("/");
      } else {
        setError("No session created");
      }
    } catch (err) {
      setLoading(false);
      setError(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <main className="container flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-12">
      <div className="w-full max-w-md space-y-4 rounded-3xl border border-border/60 bg-card/80 p-6 shadow-lg shadow-black/20">
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
        <Button className="w-full" onClick={handleAuth} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {authMode === "signup" ? "Creează cont" : "Autentifică-te"}
        </Button>
        <button
          className="text-sm text-muted-foreground underline"
          onClick={() => setAuthMode(authMode === "signup" ? "signin" : "signup")}
        >
          {authMode === "signup" ? "Ai deja un cont? Autentifică-te" : "Ai nevoie de un cont? Înregistrează-te"}
        </button>
      </div>
    </main>
  );
}
