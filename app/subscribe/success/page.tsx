import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerUser } from "@/lib/server-user";
import { supabaseServerAdmin } from "@/lib/supabase/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PaymentStatus } from "@/components/PaymentStatus";
export const dynamic = "force-dynamic";
export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;
  const user = await getServerUser();
  if (!user)
    redirect(
      `/login?redirect=${encodeURIComponent(`/subscribe/success${orderId ? `?orderId=${encodeURIComponent(orderId)}` : ""}`)}`,
    );
  const { data } = orderId
    ? await supabaseServerAdmin()
        .from("orders")
        .select("id,status")
        .eq("id", orderId)
        .eq("user_id", user.id)
        .maybeSingle()
    : { data: null };
  return (
    <>
      <Header />
      <main
        id="main"
        className="container flex min-h-[80vh] flex-col items-center justify-center pb-16 pt-32"
      >
        {data ? (
          <PaymentStatus orderId={data.id} initialStatus={data.status} />
        ) : (
          <div className="text-center">
            <h1 className="text-3xl">Verifică abonamentul în contul tău.</h1>
            <p className="text-muted-foreground my-5">
              Nu am identificat o comandă asociată acestui link.
            </p>
            <Link href="/account" className="action action-dark">
              Contul meu
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
