import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { redirect } from "next/navigation";
import { AccountClient } from "./account-client";

export default async function AccountPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Redirect if not authenticated
  if (!user) {
    redirect("/login?redirect=/account");
  }

  // Fetch profile with subscription info
  const { data: profile } = await supabase
    .from("profiles")
    .select("name, subscription_status, subscription_plan, subscription_expires_at")
    .eq("id", user.id)
    .single();

  const initialUser = {
    id: user.id,
    email: user.email || "",
    name: profile?.name || undefined,
    subscriptionStatus: profile?.subscription_status || null,
    subscriptionPlan: profile?.subscription_plan || null,
    subscriptionExpiresAt: profile?.subscription_expires_at || null,
  };

  return <AccountClient initialUser={initialUser} />;
}
