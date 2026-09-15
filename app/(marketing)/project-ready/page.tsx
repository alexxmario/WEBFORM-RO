import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProjectReadyTransition } from "@/components/ProjectReadyTransition";
import { getPlan } from "@/lib/pricing";
import { getServerUser } from "@/lib/server-user";
import { supabaseServerAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ProjectReadyPage({ searchParams }: { searchParams: Promise<{ planId?: string }> }) {
  const { planId = "" } = await searchParams;
  const plan = getPlan(planId);
  if (!plan) redirect("/subscribe");

  const user = await getServerUser();
  if (!user) redirect(`/login?redirect=${encodeURIComponent(`/project-ready?planId=${plan.id}`)}`);

  const { data: blueprint } = await supabaseServerAdmin()
    .from("blueprints")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();
  if (!blueprint) redirect(`/start?planId=${encodeURIComponent(plan.id)}`);

  return (
    <>
      <Header />
      <main id="main" className="container flex min-h-screen items-center justify-center px-4 pb-20 pt-32">
        <ProjectReadyTransition plan={plan} />
      </main>
      <Footer />
    </>
  );
}
