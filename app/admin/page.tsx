import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { ApiError } from "@/lib/api";
import { AdminWorkspace } from "./workspace";
export const dynamic = "force-dynamic";
export const metadata = { title: "Administrare | WebForm", robots: {index:false,follow:false} };
export default async function AdminPage() {
  let message = "";
  try { await requireAdmin(); }
  catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect("/login?redirect=%2Fadmin");
    message = error instanceof ApiError && error.status === 403 ? "Această zonă este disponibilă doar administratorilor." : "Nu putem verifica accesul momentan. Verifică conexiunea și configurarea Supabase.";
  }
  if (message) return <main className="shell py-24"><p className="eyebrow">WEBFORM / ADMIN</p><h1 className="text-3xl mb-5">Acces indisponibil</h1><p className="mb-8">{message}</p><Link href="/account" className="action action-dark">Înapoi la cont</Link></main>;
  return <AdminWorkspace />;
}
