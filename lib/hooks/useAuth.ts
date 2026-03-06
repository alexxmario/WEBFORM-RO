"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  subscriptionStatus?: string | null;
  subscriptionPlan?: string | null;
  subscriptionExpiresAt?: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(supabaseBrowser, []);
  const initialized = useRef(false);

  const fetchProfile = useCallback(async (userId: string, email: string) => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("name, subscription_status, subscription_plan, subscription_expires_at")
        .eq("id", userId)
        .single();

      setUser({
        id: userId,
        email,
        name: profile?.name || undefined,
        subscriptionStatus: profile?.subscription_status || null,
        subscriptionPlan: profile?.subscription_plan || null,
        subscriptionExpiresAt: profile?.subscription_expires_at || null,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Still set basic user info even if profile fetch fails
      setUser({ id: userId, email });
    }
  }, [supabase]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Safety timeout - never hang forever
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    const checkUser = async () => {
      try {
        // Use getUser() instead of getSession() to validate with server
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await fetchProfile(user.id, user.email || "");
        }
      } catch (error) {
        console.error("Error getting user:", error);
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session?.user) {
          await fetchProfile(session.user.id, session.user.email || "");
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error on auth state change:", error);
      }
    });

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    hasActiveSubscription: user?.subscriptionStatus === "active",
  };
}