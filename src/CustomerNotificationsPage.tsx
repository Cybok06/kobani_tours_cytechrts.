import { useEffect, useState } from "react"
import type { Page } from "./App"
import CustomerPortalLayout from "./CustomerPortalLayout"
import { customerNotificationApi, type CustomerNotification } from "./api"

const formatTime = (value?: string | null) => value ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "Recently"

export default function CustomerNotificationsPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [items, setItems] = useState<CustomerNotification[]>([]), [loading, setLoading] = useState(true), [error, setError] = useState("")
  useEffect(() => { customerNotificationApi.list().then(result => setItems(result.data.notifications)).catch(error => setError(error instanceof Error ? error.message : "Could not load notifications")).finally(() => setLoading(false)) }, [])
  const open = async (item: CustomerNotification) => { if (!item.is_read) { await customerNotificationApi.markRead(item.id); setItems(current => current.map(value => value.id === item.id ? { ...value, is_read: true } : value)) } if (item.action_page) onNavigate(item.action_page as Page) }
  const allRead = async () => { await customerNotificationApi.markAllRead(); setItems(current => current.map(item => ({ ...item, is_read: true }))) }
  const remove = async (id: string) => { await customerNotificationApi.remove(id); setItems(current => current.filter(item => item.id !== id)) }
  const unread = items.filter(item => !item.is_read).length
  return <CustomerPortalLayout title="Notifications" subtitle="Stay updated on your bookings, payments and orders." active="Notifications" onNavigate={onNavigate}><main className="mx-auto max-w-[950px] p-4 sm:p-7">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#C6A15B]">Your updates</p><h2 className="mt-1 font-serif text-3xl font-bold">Notifications</h2><p className="mt-1 text-xs text-[#6F6B63]">{unread ? `${unread} unread notification${unread === 1 ? "" : "s"}` : "You’re all caught up"}</p></div>{unread>0&&<button onClick={()=>void allRead()} className="rounded-xl border border-[#D8D0C3] bg-white px-4 py-2.5 text-xs font-bold">Mark all as read</button>}</div>
    {error&&<div role="alert" className="mt-5 rounded-xl bg-[#C84A4A]/10 p-4 text-xs text-[#C84A4A]">{error}</div>}
    <section className="mt-6 overflow-hidden rounded-2xl border border-[#E6DFD2] bg-white">{loading?<p className="p-10 text-center text-sm text-[#777]">Loading notifications…</p>:items.length===0?<div className="p-12 text-center"><div className="text-3xl">✓</div><h3 className="mt-3 font-serif text-xl font-bold">No notifications</h3><p className="mt-1 text-xs text-[#777]">Updates about your activity will appear here.</p></div>:items.map(item=><article key={item.id} className={`flex gap-4 border-b border-[#EEE8DD] p-5 last:border-0 ${item.is_read?"bg-white":"bg-[#FFF9EC]"}`}><button onClick={()=>void open(item)} className="min-w-0 flex-1 text-left"><div className="flex items-center gap-2"><h3 className="text-sm font-bold">{item.title}</h3>{!item.is_read&&<span className="h-2 w-2 rounded-full bg-[#C6A15B]"/>}</div><p className="mt-1 text-xs leading-5 text-[#6F6B63]">{item.message}</p><p className="mt-2 text-[9px] uppercase tracking-wide text-[#9A9590]">{formatTime(item.created_at)}</p></button><button onClick={()=>void remove(item.id)} aria-label={`Delete ${item.title}`} className="self-start rounded-lg px-3 py-2 text-xs text-[#9A9590] hover:bg-[#C84A4A]/10 hover:text-[#C84A4A]">Delete</button></article>)}</section>
  </main></CustomerPortalLayout>
}
