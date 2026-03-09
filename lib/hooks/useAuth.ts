"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
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
    let isMounted = true;

    // Listen for auth state changes - this is the primary source of truth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      try {
        if (session?.user) {
          await fetchProfile(session.user.id, session.user.email || "");
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error on auth state change:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    });

    // Safety timeout - never hang forever
    const timeout = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 5000);

    return () => {
      isMounted = false;
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
