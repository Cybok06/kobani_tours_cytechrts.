import { useEffect, useMemo, useState } from "react"
import type { Page } from "./App"
import { AdminShell } from "./AdminProductsPage"
import { ApiError, auditLogsApi, type AuditLogEvent } from "./api"

const label = (value: string) =>
  value.replaceAll("_", " ").replaceAll(".", " · ").replace(/\b\w/g, (x) => x.toUpperCase())

const initials = (event: AuditLogEvent) =>
  (event.actor_name || event.actor_email || "System")
    .split(/[\s@]+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")

export default function AdminAuditLogsPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [events, setEvents] = useState<AuditLogEvent[]>([])
  const [query, setQuery] = useState("")
  const [outcome, setOutcome] = useState("all")
  const [action, setAction] = useState("all")
  const [selected, setSelected] = useState<AuditLogEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = async () => {
    setLoading(true)
    setError("")
    try {
      setEvents((await auditLogsApi.list()).data.events)
    } catch (err) {
      setError(err instanceof ApiError ? err.code.replaceAll("_", " ") : "Audit logs could not be loaded.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return events.filter((event) =>
      (outcome === "all" || event.outcome === outcome) &&
      (action === "all" || event.action === action) &&
      (!needle || [event.actor_name, event.actor_email, event.ip_address, event.user_agent, event.action]
        .some((value) => String(value || "").toLowerCase().includes(needle))))
  }, [events, query, outcome, action])

  const exportLogs = () => {
    const escape = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`
    const rows = [["Timestamp", "User", "Email", "Role", "Action", "Outcome", "IP address", "Device"],
      ...shown.map((event) => [event.created_at, event.actor_name, event.actor_email, event.actor_type, event.action, event.outcome, event.ip_address, event.user_agent])]
    const blob = new Blob([rows.map((row) => row.map(escape).join(",")).join("\n")], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `kobani-audit-logs-${new Date().toISOString().slice(0, 10)}.csv`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return <AdminShell title="Audit Logs" active="Audit Logs" onNavigate={onNavigate}>
    <div className="flex justify-between items-end gap-4 flex-wrap">
      <div><p className="eyebrow">Security & compliance</p><h1 className="page-title">Audit Logs</h1><p className="sub">Live login and administrative activity, including user, IP address and device details.</p></div>
      <div className="flex gap-2"><button onClick={() => void load()} className="admin-outline">Refresh</button><button onClick={exportLogs} disabled={!shown.length} className="admin-outline disabled:opacity-50">⇩ Export Logs</button></div>
    </div>
    <div className="filter-card">
      <input value={query} onChange={(e) => setQuery(e.target.value)} className="admin-input flex-1" placeholder="Search user, email, IP, device or action..." />
      <select value={outcome} onChange={(e) => setOutcome(e.target.value)} className="admin-input"><option value="all">All outcomes</option><option value="success">Successful</option><option value="failed">Failed</option></select>
      <select value={action} onChange={(e) => setAction(e.target.value)} className="admin-input"><option value="all">All actions</option>{[...new Set(events.map((event) => event.action))].sort().map((value) => <option value={value} key={value}>{label(value)}</option>)}</select>
    </div>
    {error && <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700">{error}<button onClick={() => void load()} className="underline ml-2">Try again</button></div>}
    <div className="admin-table-card"><div className="table-top flex justify-between"><span>System activity</span><span><b>{shown.length}</b> events</span></div><div className="overflow-x-auto"><table className="admin-table min-w-[1050px]"><thead><tr>{["Timestamp", "User", "Role", "Action", "Outcome", "IP Address", "Device", "Details"].map((heading) => <th key={heading}>{heading}</th>)}</tr></thead><tbody>
      {loading ? <tr><td colSpan={8}>Loading audit activity…</td></tr> : shown.length === 0 ? <tr><td colSpan={8}>No matching audit events.</td></tr> : shown.map((event) => <tr key={event.id}>
        <td className="whitespace-nowrap">{new Date(event.created_at).toLocaleString()}</td>
        <td><div className="flex items-center gap-2"><span className="w-8 h-8 rounded-full bg-[#E9DCBC] grid place-items-center text-[10px] font-bold">{initials(event)}</span><div><b className="block">{event.actor_name || event.actor_email || "Unknown user"}</b>{event.actor_name && <small>{event.actor_email}</small>}</div></div></td>
        <td><span className="pill neutral">{label(event.actor_type)}</span></td><td><b>{label(event.action)}</b></td>
        <td><span className={`pill ${event.outcome === "failed" ? "danger" : "success"}`}>{label(event.outcome)}</span></td><td className="font-mono text-xs">{event.ip_address || "—"}</td><td className="max-w-[260px] truncate" title={event.user_agent || ""}>{event.user_agent || "—"}</td>
        <td><button onClick={() => setSelected(event)} className="admin-outline !py-2 !px-3">View Details</button></td></tr>)}
    </tbody></table></div></div>
    {selected && <div className="fixed inset-0 z-[80] bg-black/60 p-4 grid place-items-center" onMouseDown={() => setSelected(null)}><div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden" onMouseDown={(e) => e.stopPropagation()}><header className="p-6 border-b flex justify-between"><div><p className="eyebrow">Audit event</p><h2 className="font-serif text-2xl font-bold">{label(selected.action)}</h2><p className="text-xs text-[#888] mt-1">{new Date(selected.created_at).toLocaleString()}</p></div><button onClick={() => setSelected(null)}>×</button></header><div className="p-6 grid sm:grid-cols-2 gap-5 text-sm"><p><small className="block text-[#999]">User</small><b>{selected.actor_name || "Unknown"}</b><span className="block">{selected.actor_email || "—"}</span></p><p><small className="block text-[#999]">Role and outcome</small><b>{label(selected.actor_type)} · {label(selected.outcome)}</b></p><p><small className="block text-[#999]">IP address</small><b>{selected.ip_address || "—"}</b></p><p><small className="block text-[#999]">Request</small><b>{selected.request_path || "—"}</b></p><p className="sm:col-span-2"><small className="block text-[#999]">Device / browser</small><span className="break-words">{selected.user_agent || "—"}</span></p><div className="sm:col-span-2"><small className="block text-[#999] mb-2">Event details</small><pre className="bg-[#F8F4EA] rounded-xl p-4 text-xs whitespace-pre-wrap">{JSON.stringify(selected.details, null, 2)}</pre></div></div><footer className="p-5 border-t bg-[#FAF8F3] flex justify-end"><button onClick={() => setSelected(null)} className="admin-gold">Close</button></footer></div></div>}
  </AdminShell>
}
