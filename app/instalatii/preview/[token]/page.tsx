import Link from "next/link";
import { previewLead } from "@/lib/campaign/server";
import { ApiError } from "@/lib/api";
export const dynamic = "force-dynamic";
export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  let lead;
  try {
    lead = await previewLead(token);
  } catch (e) {
    if (!(e instanceof ApiError)) throw e;
    return (
      <main id="main" className="campaign shell campaign-section">
        <h1>Previzualizare indisponibilă</h1>
        <p>{e.message}</p>
        <Link href="/contact">Contactează-ne pentru prelungire</Link>
      </main>
    );
  }
  return (
    <main id="main">
      <div className="campaign-preview-banner">
        <strong>Previzualizare – site-ul tău nu e încă live</strong>
        <Link
          href={`/instalatii/checkout/${token}`}
          className="action action-dark"
        >
          {lead.paid_at ? "Vezi confirmarea" : "Îmi place – activează site-ul"}{" "}
          ↗
        </Link>
      </div>
      <iframe
        className="campaign-preview-frame"
        src={lead.preview_url}
        title="Previzualizarea site-ului tău"
        sandbox="allow-scripts"
        referrerPolicy="no-referrer"
      />
    </main>
  );
}
