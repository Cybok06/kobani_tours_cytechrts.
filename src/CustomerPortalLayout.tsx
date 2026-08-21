import { useState, type ReactNode } from "react"
import type { Page } from "./App"
import { useAuth } from "./AuthContext"
import CustomerSidebar from "./CustomerSidebar"

export default function CustomerPortalLayout({ title, subtitle, active, onNavigate, children }: { title: string; subtitle: string; active: string; onNavigate: (page: Page) => void; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()
  const initials = user?.fullName?.split(/\s+/).map(x => x[0]).slice(0, 2).join("").toUpperCase() || "KT"
  const sidebar = <CustomerSidebar active={active} onNavigate={onNavigate} onClose={() => setOpen(false)}/>
  return <div className="flex min-h-screen bg-[#F8F4EA] text-[#0B0B0B]">
    <div className="fixed inset-y-0 left-0 hidden w-64 lg:block">{sidebar}</div>
    {open && <><button aria-label="Close menu" onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/45 lg:hidden"/><div className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden">{sidebar}</div></>}
    <div className="min-w-0 flex-1 lg:ml-64"><header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-[#E6DFD2] bg-white px-4 sm:px-7">
      <button onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl border border-[#E6DFD2] lg:hidden" aria-label="Open menu">☰</button>
      <div><h1 className="font-serif text-xl font-bold">{title}</h1><p className="hidden text-[10px] text-[#9A9590] sm:block">{subtitle}</p></div>
      <button onClick={() => onNavigate("customer-notifications")} aria-label="Open notifications" className="ml-auto grid h-10 w-10 place-items-center rounded-xl border border-[#E6DFD2]">🔔</button>
      <span title={user?.fullName} className="grid h-10 w-10 place-items-center rounded-full bg-[#C6A15B] text-sm font-bold">{initials}</span>
    </header>{children}</div>
  </div>
}
