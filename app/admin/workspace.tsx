"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Users, Layers, CreditCard, Inbox, MessageCircle, RefreshCw, X } from "lucide-react";
import "./workspace.css";

type Row = Record<string, unknown> & {id:string};
type View = "projects" | "clients" | "orders" | "leads";
const views = [{id:"projects",label:"Proiecte",icon:Layers},{id:"clients",label:"Clienți",icon:Users},{id:"orders",label:"Comenzi",icon:CreditCard},{id:"leads",label:"Lista de interes",icon:Inbox}] as const;
const statuses: Record<string,string> = {new:"Nou",in_progress:"În lucru",review:"La aprobare",published:"Publicat",active:"Activ",cancelled:"Anulat",completed:"Plătit",pending:"În așteptare",failed:"Eșuat",refunded:"Rambursat"};
const str = (value: unknown) => value == null ? "—" : String(value);
const date = (value:unknown) => value && !Number.isNaN(Date.parse(String(value))) ? new Intl.DateTimeFormat("ro-RO",{dateStyle:"medium"}).format(new Date(String(value))) : "—";
function Fields({value}:{value:unknown}) {
  if (Array.isArray(value)) return <div className="admin-values">{value.map((item,i)=><div key={i}><Fields value={item}/></div>)}</div>;
  if (value && typeof value === "object") return <dl className="admin-fields">{Object.entries(value).map(([key,item])=><div key={key}><dt>{key.replace(/[_-]/g," ")}</dt><dd><Fields value={item}/></dd></div>)}</dl>;
  const text = str(value);
  if (/^\/api\/assets\/[0-9a-f-]{36}$/i.test(text)) return <a href={text} target="_blank" rel="noreferrer">Deschide fișierul ↗</a>;
  return <span>{typeof value === "boolean" ? value ? "Da" : "Nu" : text}</span>;
}
export function AdminWorkspace() {
  const detail = useRef<HTMLElement>(null);
  const [view,setView] = useState<View>("projects");
  const [page,setPage] = useState(1);
  const [rows,setRows] = useState<Row[]>([]);
  const [total,setTotal] = useState(0);
  const [counts,setCounts] = useState<number[]>([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState("");
  const [refresh,setRefresh] = useState(0);
  const [selected,setSelected] = useState<Row|null>(null);
  const [status,setStatus] = useState("new");
  const [notes,setNotes] = useState("");
  const [saving,setSaving] = useState(false);
  const [saveError,setSaveError] = useState("");
  const [saved,setSaved] = useState(false);
  const selectedId = selected?.id;
  useEffect(()=>{if(selectedId) {detail.current?.scrollIntoView({block:"start"});detail.current?.focus({preventScroll:true});}},[selectedId]);
  const close = useCallback(()=>{ if (!saving) setSelected(null); },[saving]);
  useEffect(()=>{
    const controller = new AbortController();
    setLoading(true); setError(""); setRows([]);
    fetch(`/api/admin?view=${view}&page=${page}`,{signal:controller.signal,cache:"no-store"}).then(async response=>{
      const data=await response.json(); if(!response.ok) throw new Error(data.error || "Încărcarea a eșuat.");
      if(!controller.signal.aborted) { setRows(data.rows);setTotal(data.total);setCounts(data.counts); }
    }).catch(reason=>{if(!controller.signal.aborted)setError(reason.message || "Conexiune indisponibilă.");}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});
    return ()=>controller.abort();
  },[view,page,refresh]);
  const open = (row:Row)=>{setSelected(row);setStatus(str(row.workflow_status));setNotes(String(row.admin_notes||""));setSaveError("");setSaved(false);};
  async function save() {
    if (!selected || saving) return;
    setSaving(true);setSaveError("");setSaved(false);
    try {
      const response=await fetch("/api/admin",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:selected.id,status,notes,revision:selected.admin_revision})});
      const data=await response.json();if(!response.ok)throw new Error(data.error||"Salvarea a eșuat.");
      setSelected({...selected,...data.project});setRows(current=>current.map(row=>row.id===selected.id?{...row,...data.project}:row));setSaved(true);setRefresh(value=>value+1);
    } catch(reason) {setSaveError(reason instanceof Error ? reason.message : "Salvarea a eșuat.");} finally {setSaving(false);}
  }
  return <div className="admin-app">
    <aside className="admin-sidebar"><Link href="/" className="admin-brand"><span>w.</span> webform</Link><p className="admin-overline">SPAȚIU DE ADMINISTRARE</p><nav aria-label="Administrare">{views.map(item=><button key={item.id} aria-current={view===item.id?"page":undefined} onClick={()=>{setView(item.id);setPage(1);setSelected(null);}}><item.icon size={18}/>{item.label}</button>)}<Link href="/chat"><MessageCircle size={18}/>Conversații<ArrowUpRight size={14}/></Link></nav><Link href="/" className="admin-back">Vezi site-ul <ArrowUpRight size={16}/></Link></aside>
    <main className="admin-main"><header className="admin-top"><span>WEBFORM / OPERAȚIUNI</span><Link href="/account">Contul meu ↗</Link></header>
      <div className="admin-title"><div><p className="admin-overline">TOTUL, ÎNTR-UN SINGUR LOC</p><h1>{views.find(item=>item.id===view)?.label}</h1><p>De la primul contact la un site publicat.</p></div><button onClick={()=>setRefresh(value=>value+1)} disabled={loading} className="admin-button"><RefreshCw size={16}/>Actualizează</button></div>
      <div className="admin-stats">{["Clienți","Proiecte deschise","Plăți în așteptare","Persoane interesate"].map((label,index)=><article key={label}><span>{label}</span><strong>{counts[index]??"—"}</strong><small>{index===2?"Necesită confirmare NETOPIA":"În baza de date"}</small></article>)}</div>
      <section className="admin-list"><div className="admin-list-title"><h2>{view==="projects"?"Dosarele proiectelor":"Înregistrări"}</h2><span>{loading?"Se încarcă…":`${total} în total`}</span></div>
      {error?<div className="admin-empty" role="alert"><h3>Datele nu au putut fi încărcate</h3><p>{error}</p><button className="admin-button" onClick={()=>setRefresh(value=>value+1)}>Încearcă din nou</button></div>:loading?<div className="admin-empty" role="status">Se încarcă datele…</div>:rows.length===0?<div className="admin-empty"><Inbox size={30}/><h3>Nicio înregistrare încă</h3><p>Înregistrările vor apărea aici după ce sunt create pe site.</p></div>:<div className="admin-table-wrap"><table><thead><tr><th>{view==="orders"?"Comandă":"Nume / afacere"}</th><th>{view==="orders"?"Valoare":"Detalii"}</th><th>Stare / plan</th><th>Creat la</th><th><span className="sr-only">Acțiuni</span></th></tr></thead><tbody>{rows.map(row=><tr key={row.id}><td><strong>{str(row.business_name||row.name||row.email||row.id.slice(0,8))}</strong><small>{str(row.email||row.user_id||row.id)}</small></td><td>{view==="orders"?`${str(row.amount)} ${str(row.currency)}`:str(row.one_liner||row.subscription_plan||row.business_type)}</td><td><span className="admin-badge">{statuses[str(row.workflow_status||row.status||row.subscription_status)]||str(row.tier||row.role)}</span></td><td>{date(row.created_at)}</td><td><button className="admin-open" onClick={()=>open(row)} aria-label={`Deschide ${str(row.business_name||row.name||row.id)}`}>Detalii ↗</button></td></tr>)}</tbody></table></div>}
      <div className="admin-pagination"><button disabled={page===1||loading} onClick={()=>setPage(value=>value-1)}>← Înapoi</button><span>Pagina {page} din {Math.max(1,Math.ceil(total/25))}</span><button disabled={page*25>=total||loading} onClick={()=>setPage(value=>value+1)}>Înainte →</button></div></section>
      {selected&&<section ref={detail} tabIndex={-1} className="admin-detail" aria-label="Detalii înregistrare"><div className="admin-list-title"><h2>{str(selected.business_name||selected.name||selected.id)}</h2><button aria-label="Închide detaliile" onClick={close} disabled={saving}><X/></button></div>
      {view==="projects"&&<form className="admin-edit" onSubmit={event=>{event.preventDefault();void save();}}><label>Etapa proiectului<select value={status} onChange={event=>{setStatus(event.target.value);setSaved(false);}} disabled={saving}>{["new","in_progress","review","published"].map(item=><option key={item} value={item}>{statuses[item]}</option>)}</select></label><label>Notițe interne<textarea value={notes} onChange={event=>{setNotes(event.target.value);setSaved(false);}} maxLength={10000} rows={4} disabled={saving} placeholder="Următorii pași, observații, detalii pentru echipă…"/></label>{saveError&&<p role="alert">{saveError}</p>}{saved&&<p role="status">Modificările au fost salvate.</p>}<button className="admin-button primary" disabled={saving}>{saving?"Se salvează…":"Salvează modificările"}</button></form>}
      <div className="admin-record"><Fields value={Object.fromEntries(Object.entries(selected).filter(([key])=>!["admin_notes","admin_revision","workflow_status"].includes(key)))}/></div></section>}
    </main></div>;
}
