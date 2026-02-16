"use client";

import { createBrowserClient } from "@supabase/ssr";
import { type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let browserSupabase: SupabaseClient | null = null;

export const supabaseBrowser = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL:", supabaseUrl ? "Present" : "Missing");
    console.error("Supabase Key:", supabaseAnonKey ? "Present" : "Missing");
    throw new Error("Supabase environment variables are missing. Check Vercel environment variables.");
  }

  if (browserSupabase) return browserSupabase;

  // Use createBrowserClient from @supabase/ssr to ensure cookies are synced
  // This allows the middleware to read the session from cookies
  browserSupabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

  return browserSupabase;
};
