"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { statuses, statusLabels } from "@/lib/campaign/schema";
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
    [status, setStatus] = useState(""),
    [page, setPage] = useState(1),
    [total, setTotal] = useState(0),
    [selected, setSelected] = useState<Lead | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [loading, setLoading] = useState(true),
    [refresh, setRefresh] = useState(0),
    [message, setMessage] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/admin/campaign?status=${status}&page=${page}`, {
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
  }, [status, page, refresh]);
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
      if (d.row) setSelected(d.row);
      setRefresh((n) => n + 1);
      setMessage("Salvat.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Salvarea a eșuat.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="admin-app">
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
            <p className="admin-overline">CAMPANIE + HOMEPAGE</p>
            <h1>Lead-uri de sunat</h1>
            <p>Primul apel în 5 minute.</p>
          </div>
          <button
            className="admin-button"
            onClick={() => setRefresh((n) => n + 1)}
          >
            Actualizează
          </button>
        </div>
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
        {error && <p role="alert">{error}</p>}
        {message && <p role="status">{message}</p>}
        <section className="admin-list">
          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nume / telefon</th>
                  <th>Sursă / status</th>
                  <th>Creat / primul apel</th>
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
                      {row.source}
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
                      <button
                        className="admin-open"
                        onClick={() => {
                          setSelected(row);
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
          <section className="admin-detail">
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
            <form
              className="admin-edit"
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                void update({
                  ...(selected.paid_at ? {} : { status: f.get("status") }),
                  notes: f.get("notes"),
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
              <label>
                Notițe
                <textarea
                  name="notes"
                  maxLength={10000}
                  rows={5}
                  defaultValue={selected.notes}
                />
              </label>
              <button className="admin-button primary" disabled={busy}>
                Salvează
              </button>
            </form>
            <button
              className="admin-button"
              disabled={
                busy || !!selected.first_called_at || !!selected.paid_at
              }
              onClick={() => update({ status: "called" })}
            >
              Marchează primul apel
            </button>
            <button
              className="admin-button"
              disabled={busy}
              onClick={() => update({ retryNotification: true })}
            >
              Retrimite notificările restante
            </button>
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
              <button className="admin-button" disabled={busy}>
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
                    disabled={busy}
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
          </section>
        )}
      </main>
    </div>
  );
}
