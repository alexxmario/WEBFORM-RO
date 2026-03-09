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
      setUser({ id: userId, email });
    }
  }, [supabase]);

  useEffect(() => {
    let isMounted = true;

    // Immediately check for existing session
    const checkSession = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (isMounted && authUser) {
          await fetchProfile(authUser.id, authUser.email || "");
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkSession();

    // Also listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email || "");
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
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
