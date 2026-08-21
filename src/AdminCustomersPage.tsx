import { useEffect, useState } from "react"
import type { Page } from "./App"
import { AdminShell } from "./AdminProductsPage"
import { ApiError, adminCustomerApi, type AdminCustomer } from "./api"

const money = (minor = 0) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(minor / 100)
const date = (value?: string) => value ? new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"
const initials = (name: string) => name.split(/\s+/).map(x => x[0]).join("").slice(0, 2).toUpperCase()

export default function AdminCustomersPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [items, setItems] = useState<AdminCustomer[]>([]), [summary, setSummary] = useState<Record<string, number>>({})
  const [search, setSearch] = useState(""), [status, setStatus] = useState(""), [country, setCountry] = useState("")
  const [loading, setLoading] = useState(true), [error, setError] = useState("")
  const load = async () => {
    setLoading(true); setError("")
    try { const r = await adminCustomerApi.list({ search, status, country }); setItems(r.data.customers); setSummary(r.data.summary) }
    catch (e) { setError(e instanceof ApiError ? e.code.replaceAll("_", " ") : "Could not load customers") }
    finally { setLoading(false) }
  }
  useEffect(() => { const timer = setTimeout(() => void load(), 250); return () => clearTimeout(timer) }, [search, status, country])
  const open = (customer: AdminCustomer) => { sessionStorage.setItem("kobani_admin_customer_id", customer.id); window.history.pushState({}, "", `/admin/customers/${customer.id}`); onNavigate("admin-customer-profile") }
  const changeStatus = async (customer: AdminCustomer) => { await adminCustomerApi.action(customer.id, customer.status === "inactive" ? "restore" : "deactivate"); await load() }
  const countries = [...new Set(items.map(x => x.country).filter(Boolean))].sort()
  return <AdminShell title="Customers" active="Customers" onNavigate={onNavigate}>
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"><div><p className="eyebrow">Customer relationships</p><h1 className="page-title">Customers</h1><p className="sub">Live customer profiles, bookings and account balances.</p></div><button onClick={() => void load()} className="admin-outline">Refresh</button></div>
    <div className="grid grid-cols-2 xl:grid-cols-5 gap-3 mt-6">
      {[["Total customers", summary.total || 0], ["Active", summary.active || 0], ["Guest checkouts", summary.guests || 0], ["Lifetime value", money(summary.lifetime_value_minor)], ["Outstanding", money(summary.outstanding_minor)]].map(x => <div className="admin-metric" key={x[0]}><p>{x[0]}</p><b>{x[1]}</b></div>)}
    </div>
    <div className="filter-card"><input value={search} onChange={e => setSearch(e.target.value)} className="admin-input flex-1 min-w-52" placeholder="Search name, email or phone..."/><select value={status} onChange={e => setStatus(e.target.value)} className="admin-input"><option value="">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option><option value="guest">Guest</option></select><select value={country} onChange={e => setCountry(e.target.value)} className="admin-input"><option value="">All countries</option>{countries.map(x => <option key={x}>{x}</option>)}</select></div>
    {error && <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 p-4 text-sm mb-4">{error}</div>}
    <section className="admin-table-card"><div className="table-top flex justify-between"><b>Customer directory</b><span className="text-xs text-[#777]">{items.length} result{items.length === 1 ? "" : "s"}</span></div><div className="overflow-x-auto"><table className="admin-table min-w-[1050px]"><thead><tr>{["Customer", "Contact", "Country", "Bookings", "Upcoming", "Lifetime value", "Outstanding", "Status", "Actions"].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>
      {loading ? <tr><td colSpan={9} className="text-center py-14">Loading customers…</td></tr> : items.length === 0 ? <tr><td colSpan={9} className="text-center py-14 text-[#888]">No customers match these filters.</td></tr> : items.map(c => <tr key={c.id}><td><div className="flex items-center gap-3"><span className="w-9 h-9 rounded-full bg-[#EAD9B4] grid place-items-center font-bold text-xs">{initials(c.full_name)}</span><div><button onClick={() => open(c)} className="font-bold hover:text-[#987437]">{c.full_name}</button><small className="block text-[#999]">Joined {date(c.created_at)}</small></div></div></td><td>{c.email}<small className="block text-[#999]">{c.phone || "No phone"}</small></td><td>{c.country || "—"}</td><td>{c.total_bookings}</td><td>{c.upcoming_bookings}</td><td><b>{money(c.lifetime_value_minor)}</b></td><td className={c.outstanding_minor ? "text-amber-700 font-bold" : ""}>{money(c.outstanding_minor)}</td><td><span className={`pill ${c.status === "active" ? "success" : c.status === "inactive" ? "warning" : "neutral"}`}>{c.status}</span></td><td><div className="flex gap-2"><button onClick={() => open(c)} className="admin-outline !px-3 !py-2">View</button><button onClick={() => void changeStatus(c)} className="admin-outline !px-3 !py-2">{c.status === "inactive" ? "Restore" : "Deactivate"}</button></div></td></tr>)}
    </tbody></table></div></section>
  </AdminShell>
}
