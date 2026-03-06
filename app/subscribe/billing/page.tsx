import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { redirect } from "next/navigation";
import { getPlan } from "@/lib/pricing";
import { BillingClient } from "./billing-client";

interface BillingPageProps {
  searchParams: Promise<{ planId?: string }>;
}

export default async function BillingPage({ searchParams }: BillingPageProps) {
  const params = await searchParams;
  const planId = params.planId;

  // Validate plan exists
  if (!planId) {
    redirect("/subscribe");
  }

  const plan = getPlan(planId);
  if (!plan) {
    redirect("/subscribe");
  }

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
    redirect(`/login?redirect=/subscribe/billing?planId=${planId}`);
  }

  // Fetch profile for pre-filling
  const { data: profile } = await supabase
    .from("profiles")
    .select("name, phone")
    .eq("id", user.id)
    .single();

  return (
    <BillingClient
      plan={plan}
      initialName={profile?.name || ""}
      initialPhone={profile?.phone || ""}
      initialUser={{ id: user.id, email: user.email || "" }}
    />
  );
}
