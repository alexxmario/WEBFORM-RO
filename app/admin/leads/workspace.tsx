"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { leadSourceLabel } from "@/lib/campaign/lead-source";
import { statuses, statusLabels } from "@/lib/campaign/schema";
import { localDateTime } from "@/lib/campaign/admin-schema";
import "../workspace.css";
type Lead = {
  id: string;
  revision: string;
  name: string;
  phone: string;
  source: string;
  company: boolean | null;
  city: string;
  services: string[];
  business_type: string;
  status: string;
  notes: string;
  assigned_page: string | null;
  next_follow_up_at: string | null;
  created_at: string;
  first_called_at: string | null;
  preview_url: string | null;
  preview_token: string | null;
  preview_expires_at: string | null;
  notification_sent_at: string | null;
  paid_at: string | null;
  payment_notification_sent_at: string | null;
  attribution: Record<string, string>;
};
export function CampaignAdmin() {
  const [rows, setRows] = useState<Lead[]>([]),
    [search, setSearch] = useState(""),
    [query, setQuery] = useState(""),
    [followUp, setFollowUp] = useState(""),
    [status, setStatus] = useState(""),
    [page, setPage] = useState(1),
    [total, setTotal] = useState(0),
    [selected, setSelected] = useState<Lead | null>(null),
    [error, setError] = useState(""),
    [dirty, setDirty] = useState(false),
    [busy, setBusy] = useState(false),
    [loading, setLoading] = useState(true),
    [refresh, setRefresh] = useState(0),
    [message, setMessage] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => { setQuery(search); setPage(1); }, 300);
    return () => clearTimeout(timer);
  }, [search]);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/admin/campaign?status=${status}&page=${page}&q=${encodeURIComponent(query)}&followUp=${followUp}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.message);
        setRows(d.rows);
        setTotal(d.total);
        setError("");
      })
      .catch((e) => {
        if (!controller.signal.aborted) setError(e.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [status, page, refresh, query, followUp]);
  async function update(patch: Record<string, unknown>) {
    if (!selected || busy) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const r = await fetch("/api/admin/campaign", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selected.id,
          revision: selected.revision,
          ...patch,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message);
      if (d.row) { setSelected(d.row); setDirty(false); }
      setRefresh((n) => n + 1);
      setMessage("Salvat.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Salvarea a eșuat.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="admin-app lead-workspace">
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-brand">
          webform
        </Link>
        <nav>
          <Link href="/admin">← Panoul principal</Link>
        </nav>
      </aside>
      <main id="main" className="admin-main">
        <div className="admin-title">
          <div>
            <p className="admin-overline">CAMPANII · ARTICOLE · HOMEPAGE</p>
            <h1>Gestionare lead-uri</h1>
            <p>De la primul apel la site-ul clientului. Toate detaliile, într-un singur loc.</p>
          </div>
          <button
            className="admin-button"
            onClick={() => setRefresh((n) => n + 1)}
          >
            Actualizează
          </button>
        </div>
        <div className="lead-filters">
        <label>Caută un lead
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nume sau telefon" maxLength={150} />
        </label>
        <label>Apeluri de revenire
          <select value={followUp} onChange={(e) => { setFollowUp(e.target.value); setPage(1); }}>
            <option value="">Toate lead-urile</option>
            <option value="due">De sunat acum / restante</option>
            <option value="scheduled">Cu revenire programată</option>
            <option value="unscheduled">Fără revenire programată</option>
          </select>
        </label>
        <label>
          Filtrează după status{" "}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Toate</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {statusLabels[s]}
              </option>
            ))}
          </select>
        </label>
        </div>
        {error && <p role="alert">{error}</p>}
        {message && <p role="status">{message}</p>}
        <section className="admin-list">
          <div className="admin-list-title"><h2>{total} lead-uri</h2><span>Apelurile sunt afișate în ora locală</span></div>
          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nume / telefon</th>
                  <th>Sursă / status</th>
                  <th>Creat / primul apel</th>
                  <th>Următorul apel / pagină</th>
                  <th>Detalii</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <strong>{row.name}</strong>
                      <a href={`tel:${row.phone}`}>{row.phone}</a>
                    </td>
                    <td>
                      {leadSourceLabel(row.source, row.attribution)}
                      <small>{statusLabels[row.status]}</small>
                    </td>
                    <td>
                      {new Date(row.created_at).toLocaleString("ro-RO")}
                      <small>
                        {row.first_called_at
                          ? `${Math.max(0, Math.round((Date.parse(row.first_called_at) - Date.parse(row.created_at)) / 60000))} minute până la primul apel`
                          : "Încă nesunat"}
                      </small>
                    </td>
                    <td>
                      {row.next_follow_up_at ? <span className={Date.parse(row.next_follow_up_at) <= Date.now() && !["paid", "lost"].includes(row.status) ? "lead-due" : ""}>{new Date(row.next_follow_up_at).toLocaleString("ro-RO", { dateStyle: "medium", timeStyle: "short" })}</span> : <span>Fără apel programat</span>}
                      {row.assigned_page && <a className="lead-page" href={row.assigned_page} target="_blank" rel="noreferrer">{row.assigned_page} ↗</a>}
                      {row.notes && <small className="lead-note" title={row.notes}>{row.notes}</small>}
                    </td>
                    <td>
                      <button
                        className="admin-open"
                        disabled={busy}
                        onClick={() => {
                          if (dirty && !window.confirm("Ai modificări nesalvate. Vrei să le abandonezi?")) return;
                          setDirty(false);
                          setSelected(row);
                          setTimeout(() => document.getElementById("lead-detail")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
                          setMessage("");
                        }}
                      >
                        Deschide ↗
                      </button>
                      {(!row.notification_sent_at ||
                        (row.paid_at && !row.payment_notification_sent_at)) && (
                        <small>Notificare în așteptare</small>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {loading && <p role="status">Se încarcă…</p>}
          {!loading && !rows.length && <p>Niciun lead pentru acest filtru.</p>}
          <div className="admin-pagination">
            <button
              disabled={page === 1 || loading}
              onClick={() => setPage((n) => n - 1)}
            >
              ← Înapoi
            </button>
            <span>
              {page} / {Math.max(1, Math.ceil(total / 25))}
            </span>
            <button
              disabled={page * 25 >= total || loading}
              onClick={() => setPage((n) => n + 1)}
            >
              Înainte →
            </button>
          </div>
        </section>
        {selected && (
          <section className="admin-detail" id="lead-detail">
            <div className="admin-record">
            <h2>{selected.name}</h2>
            <p>
              <a href={`tel:${selected.phone}`}>{selected.phone}</a> ·{" "}
              {selected.city || selected.business_type} · Firmă/PFA:{" "}
              {selected.company === null ? "—" : selected.company ? "Da" : "Nu"}
            </p>
            <p>{selected.services.join(", ")}</p>
            <p>
              {Object.entries(selected.attribution)
                .map(([k, v]) => `${k}: ${v}`)
                .join(" · ")}
            </p>
            </div>
            <form
              className="admin-edit"
              onChange={() => setDirty(true)}
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                void update({
                  ...(selected.paid_at ? {} : { status: f.get("status") }),
                  notes: f.get("notes"),
                  assignedPage: String(f.get("assignedPage") || "").trim() || null,
                  nextFollowUpAt: f.get("nextFollowUpAt") ? new Date(String(f.get("nextFollowUpAt"))).toISOString() : null,
                });
              }}
              key={selected.id + selected.revision}
            >
              <label>
                Status
                <select
                  name="status"
                  defaultValue={selected.status}
                  disabled={!!selected.paid_at}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s} disabled={s === "paid"}>
                      {statusLabels[s]}
                    </option>
                  ))}
                </select>
              </label>
              <div className="lead-edit-grid">
                <label>Pagina făcută pentru client
                  <input name="assignedPage" defaultValue={selected.assigned_page || ""} placeholder="/numele-clientului" maxLength={300} pattern="/[a-zA-Z0-9_\-]+(/[a-zA-Z0-9_\-]+)*/?" />
                  <small>Atribuie o pagină existentă pe acest domeniu. Lasă gol pentru a elimina atribuirea.</small>
                </label>
                <label>Când revii cu un apel
                  <input name="nextFollowUpAt" type="datetime-local" defaultValue={localDateTime(selected.next_follow_up_at)} />
                  <small>Ora locală a dispozitivului. Șterge data după apel sau stabilește următoarea revenire.</small>
                </label>
              </div>
              <label>
                Notițe
                <textarea
                  name="notes"
                  maxLength={10000}
                  rows={5}
                  defaultValue={selected.notes}
                  placeholder="Ce ați discutat, ce își dorește clientul, ce ai de făcut înainte de următorul apel…"
                />
              </label>
              <button className="admin-button primary" disabled={busy}>
                Salvează
              </button>
            </form>
            {selected.assigned_page && <div className="lead-actions">
              <a className="admin-button" href={selected.assigned_page} target="_blank" rel="noreferrer">Deschide pagina ↗</a>
              <button className="admin-button" onClick={async () => {
                try { await navigator.clipboard.writeText(`${location.origin}${selected.assigned_page}`); setMessage("Linkul paginii a fost copiat."); }
                catch { setError("Nu am putut copia linkul. Deschide pagina și copiază adresa."); }
              }}>Copiază linkul paginii</button>
            </div>}
            {dirty && <p className="admin-record">Ai modificări nesalvate. Apasă Salvează înainte de alte acțiuni.</p>}
            <div className="lead-actions">
            <button
              className="admin-button"
              disabled={
                busy || dirty || !!selected.first_called_at || !!selected.paid_at
              }
              onClick={() => update({ status: "called" })}
            >
              Marchează primul apel
            </button>
            <button
              className="admin-button"
              disabled={busy || dirty}
              onClick={() => update({ retryNotification: true })}
            >
              Retrimite notificările restante
            </button>
            </div>
            <details className="lead-preview"><summary>Preview cu expirare și notificări</summary>
            <form
              className="admin-edit"
              onSubmit={(e) => {
                e.preventDefault();
                void update({
                  previewUrl: new FormData(e.currentTarget).get("previewUrl"),
                });
              }}
              key={`preview-${selected.id}-${selected.revision}`}
            >
              <label>
                URL HTTPS al site-ului clientului
                <input
                  name="previewUrl"
                  type="url"
                  required
                  defaultValue={selected.preview_url || ""}
                  placeholder="https://preview.exemplu.ro"
                />
              </label>
              <button className="admin-button" disabled={busy || dirty}>
                Publică preview pentru 14 zile
              </button>
            </form>
            {selected.preview_token && (
              <>
                <p>
                  Expiră:{" "}
                  {new Date(selected.preview_expires_at!).toLocaleString(
                    "ro-RO",
                  )}
                </p>
                <a
                  href={`/instalatii/preview/${selected.preview_token}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Deschide preview ↗
                </a>
                <div>
                  <button
                    className="admin-button"
                    disabled={busy || dirty}
                    onClick={() => update({ extend: true })}
                  >
                    Prelungește cu 14 zile
                  </button>
                  <button
                    className="admin-button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(
                          `Salut ${selected.name}, uite site-ul tău: ${location.origin}/instalatii/preview/${selected.preview_token}. Dacă îți place, îl punem live azi.`,
                        );
                        setMessage("Mesaj copiat pentru WhatsApp.");
                      } catch {
                        setError(
                          "Copierea nu a reușit. Deschide preview și copiază adresa.",
                        );
                      }
                    }}
                  >
                    Copiază linkul pentru WhatsApp
                  </button>
                </div>
              </>
            )}
            </details>
            {error && <p role="alert">{error}</p>}
            {message && <p role="status">{message}</p>}
          </section>
        )}
      </main>
    </div>
  );
}
