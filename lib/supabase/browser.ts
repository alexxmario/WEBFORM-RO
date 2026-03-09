"use client";

import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseBrowser = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL:", supabaseUrl ? "Present" : "Missing");
    console.error("Supabase Key:", supabaseAnonKey ? "Present" : "Missing");
    throw new Error("Supabase environment variables are missing. Check Vercel environment variables.");
  }

  // Create a fresh client each time to ensure cookies are read properly
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};
