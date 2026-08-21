import { useEffect, useState } from "react"
import type { Page } from "./App"
import BrandLogo from "./BrandLogo"
import { adminNavSections, navigateAdmin } from "./adminNavigation"
import { API_BASE, adminDashboardApi } from "./api"

const iconPaths: Record<string, React.ReactNode> = {
  Dashboard: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
  Tours: <path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15"/>,
  Hotels: <path d="M4 21V4h16v17M8 8h2M14 8h2M8 12h2M14 12h2M10 21v-5h4v5"/>,
  "Tour Dates": <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
  Bookings: <path d="M4 4h7a3 3 0 013 3v13a3 3 0 00-3-3H4zM20 4h-3a3 3 0 00-3 3v13a3 3 0 013-3h3z"/>,
  Travellers: <><circle cx="9" cy="8" r="4"/><path d="M3 21v-2a6 6 0 0112 0v2M17 11a4 4 0 014 4v2"/></>,
  Customers: <><circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0116 0v2"/></>,
  Payments: <><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></>,
  Refunds: <path d="M4 9V4l3 3a8 8 0 11-2 8"/>,
  "African Market": <><path d="M3 9l2-6h14l2 6M5 13v8h14v-8"/><path d="M3 9a3 3 0 006 0 3 3 0 006 0 3 3 0 006 0"/></>,
  "Product Orders": <path d="M5 8h14l-1 13H6L5 8zM9 8a3 3 0 016 0"/>,
  Inventory: <path d="M21 8l-9 5-9-5 9-5 9 5zM3 8v9l9 5 9-5V8M12 13v9"/>,
  Articles: <path d="M5 3h10l4 4v14H5zM15 3v5h4"/>,
  Contributions: <path d="M12 20h9M16.5 3.5a2 2 0 013 3L8 18l-4 1 1-4z"/>,
  Gallery: <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="2"/><path d="M21 15l-5-5L5 20"/></>,
  FAQs: <><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 014.8 1c0 2-2.3 2.1-2.3 4M12 18h.01"/></>,
  Testimonials: <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6z"/>,
  Subscribers: <><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M16 11h6"/></>,
  Messages: <><path d="M3 5h18v14H3z"/><path d="M3 7l9 7 9-7"/></>,
  Reports: <path d="M4 20V10M10 20V4M16 20v-7M22 20V7"/>,
  "Visitor Analytics": <><path d="M3 20V10M9 20V4M15 20v-7M21 20V7"/><path d="M2 20h20"/></>,
  Users: <><circle cx="9" cy="8" r="4"/><path d="M3 21v-2a6 6 0 0112 0v2M17 11a4 4 0 014 4v2"/></>,
  Roles: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
  "Audit Logs": <><path d="M6 3h12v18H6z"/><path d="M9 8h6M9 12h6M9 16h4"/></>,
  "Payment Settings": <><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M16 15h2"/></>,
}

function NavIcon({ label }: { label: string }) {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{iconPaths[label]}</svg>
}

export default function AdminSidebar({ active, onNavigate, onClose, onItemSelect }: { active: string; onNavigate: (page: Page) => void; onClose?: () => void; onItemSelect?: (label: string) => boolean }) {
  const [unread, setUnread] = useState(() => Number(sessionStorage.getItem("kobani_admin_inbox_unread") || 0))
  const [query, setQuery] = useState("")
  const [counts, setCounts] = useState<Record<string, number>>(() => { try { return JSON.parse(sessionStorage.getItem("kobani_admin_navigation_counts") || "{}") } catch { return {} } })
  useEffect(() => {
    const load=()=>fetch(`${API_BASE}/admin/messages/unread-count`,{credentials:"include"}).then(r=>r.ok?r.json():null).then(x=>{if(x){const value=x.data?.unread_count||0;setUnread(value);sessionStorage.setItem("kobani_admin_inbox_unread",String(value))}}).catch(()=>{})
    load(); const timer=window.setInterval(load,30000); window.addEventListener("kobani:messages-count",load)
    return()=>{clearInterval(timer);window.removeEventListener("kobani:messages-count",load)}
  },[])
  useEffect(() => {
    const load = () => adminDashboardApi.navigationCounts().then(result => { setCounts(result.data.counts); sessionStorage.setItem("kobani_admin_navigation_counts", JSON.stringify(result.data.counts)) }).catch(() => {})
    load(); const timer = window.setInterval(load, 15000); const visible = () => { if (!document.hidden) load() }
    window.addEventListener("kobani:navigation-counts", load); document.addEventListener("visibilitychange", visible)
    return () => { clearInterval(timer); window.removeEventListener("kobani:navigation-counts", load); document.removeEventListener("visibilitychange", visible) }
  }, [])
  return (
    <aside className="flex h-full flex-col bg-[#090909] text-white">
      <button onClick={() => onNavigate("admin-dashboard")} className="flex h-20 shrink-0 items-center gap-3 border-b border-white/10 px-5 text-left">
        <BrandLogo className="h-9 w-9" />
        <span><b className="font-serif tracking-wide">KOBANI</b><small className="block text-[7px] uppercase tracking-[.16em] text-[#666]">Admin Command Center</small></span>
      </button>
      <div className="shrink-0 px-3 pt-4">
        <label className="relative block">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search menu…" aria-label="Search admin navigation" className="h-10 w-full rounded-xl border border-white/10 bg-white/[.04] pl-9 pr-8 text-[10px] text-white outline-none placeholder:text-[#666] focus:border-[#C6A15B]/60" />
          {query && <button onClick={() => setQuery("")} aria-label="Clear navigation search" className="absolute right-2 top-1/2 -translate-y-1/2 px-1 text-[#777] hover:text-white">×</button>}
        </label>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {adminNavSections.map((section) => ({...section, items: section.items.filter(label => label.toLowerCase().includes(query.trim().toLowerCase()))})).filter(section => section.items.length).map((section) => (
          <div key={section.title} className="mb-4">
            <p className="mb-1 px-3 text-[7px] uppercase tracking-[.2em] text-[#4F4F4F]">{section.title}</p>
            {section.items.map((label) => {
              const selected = label === active || (active === "Users & Roles" && (label === "Users" || label === "Roles"))
              return <button key={label} onClick={() => { if (!onItemSelect?.(label)) navigateAdmin(label, onNavigate); onClose?.() }} className="relative mb-0.5 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[10px]" style={{ background: selected ? "rgba(198,161,91,.13)" : "transparent", color: selected ? "#E9D6A8" : "#8A8A8A" }}>
                {selected && <i className="absolute left-0 h-4 w-0.5 bg-[#C6A15B]" />}
                <NavIcon label={label} /><span>{label}</span>
                {(label === "Messages" ? unread > 0 : (counts[label] || 0) > 0) && <span className={`ml-auto grid h-4 min-w-4 place-items-center rounded-full bg-[#C6A15B] px-1 text-[7px] text-black ${label === "Bookings" ? "animate-pulse" : ""}`}>{Math.min(99, label === "Messages" ? unread : counts[label])}{(label === "Messages" ? unread : counts[label]) > 99 ? "+" : ""}</span>}
              </button>
            })}
          </div>
        ))}
        {query && !adminNavSections.some(section => section.items.some(label => label.toLowerCase().includes(query.trim().toLowerCase()))) && <p className="px-3 py-8 text-center text-[10px] text-[#666]">No matching links</p>}
      </nav>
      <button onClick={() => onNavigate("home")} className="m-3 flex shrink-0 items-center gap-3 border-t border-white/10 px-3 py-3 text-[10px] text-[#777]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 17l5-5-5-5M15 12H3M14 3h7v18h-7"/></svg>Logout
      </button>
    </aside>
  )
}
