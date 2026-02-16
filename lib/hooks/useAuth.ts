"use client";

import { useEffect, useState, useCallback } from "react";
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
  const supabase = supabaseBrowser();

  const fetchProfile = useCallback(async (userId: string, email: string) => {
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
  }, [supabase]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await fetchProfile(session.user.id, session.user.email || "");
        }
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setLoading(false);
      }
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session?.user) {
          await fetchProfile(session.user.id, session.user.email || "");
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error on auth state change:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, fetchProfile]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    hasActiveSubscription: user?.subscriptionStatus === "active",
  };
}