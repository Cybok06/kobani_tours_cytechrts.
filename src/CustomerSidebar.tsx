import { useEffect, useState } from "react"
import type { Page } from "./App"
import { useAuth } from "./AuthContext"
import BrandLogo from "./BrandLogo"
import { customerNotificationApi } from "./api"

const links: Array<[string, Page]> = [
  ["Overview", "dashboard"], ["Tours", "tours"], ["My Bookings", "customer-bookings"], ["Payments", "customer-payments"],
  ["Outstanding Balances", "customer-payments"], ["Product Orders", "customer-product-orders"],
  ["Saved Tours", "customer-saved-tours"], ["Notifications", "customer-notifications"],
  ["Profile", "customer-profile"], ["Account Settings", "customer-settings"],
]

export default function CustomerSidebar({ active, onNavigate, onClose }: { active: string; onNavigate: (page: Page) => void; onClose?: () => void }) {
  const { logout } = useAuth()
  const [unread, setUnread] = useState(0)
  useEffect(() => {
    const refresh = () => customerNotificationApi.list().then(result => setUnread(result.data.unread_count)).catch(() => undefined)
    void refresh()
    const timer = window.setInterval(() => void refresh(), 30000)
    window.addEventListener("focus", refresh)
    return () => { window.clearInterval(timer); window.removeEventListener("focus", refresh) }
  }, [])
  const go = (label: string, page: Page) => {
    if (label === "Outstanding Balances") sessionStorage.setItem("kobani:payments-view", "outstanding")
    onNavigate(page); onClose?.()
  }
  return <aside className="flex h-full flex-col bg-[#0B0B0B] text-white">
    <button onClick={() => go("Home", "home")} className="flex h-20 items-center gap-3 border-b border-white/10 px-6 text-left">
      <BrandLogo className="h-9 w-9"/><span><b className="font-serif text-lg">KOBANI</b><small className="block text-[8px] tracking-[.18em] text-[#777]">CUSTOMER PORTAL</small></span>
    </button>
    <nav className="flex-1 overflow-y-auto px-3 py-5">{links.map(([label, page]) => <button key={label} onClick={() => go(label, page)} className={`relative mb-1 flex w-full items-center rounded-xl px-4 py-3 text-left text-xs transition ${active === label ? "bg-[#C6A15B]/15 text-[#E9D6A8]" : "text-[#999] hover:bg-white/5"}`}>{active === label&&<span className="absolute left-0 h-5 w-0.5 rounded bg-[#C6A15B]"/>}<span>{label}</span>{label === "Notifications"&&unread>0&&<span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-[#C6A15B] px-1 text-[9px] font-bold text-black">{unread>99?"99+":unread}</span>}</button>)}</nav>
    <button onClick={() => void logout().finally(() => onNavigate("home"))} className="m-3 border-t border-white/10 px-4 py-4 text-left text-xs text-[#999]">Log out</button>
  </aside>
}
