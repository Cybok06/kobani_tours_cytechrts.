import { useCallback, useEffect, useMemo, useState } from "react"
import type { Page } from "./App"
import { useAuth } from "./AuthContext"
import CustomerPortalLayout from "./CustomerPortalLayout"
import { ApiError, customerBookingApi, customerNotificationApi, customerProductOrderApi, savedTourApi, type Booking, type CustomerNotification, type CustomerPaymentSummary, type CustomerProductOrder, type Tour } from "./api"

const date = (value?: string) => value ? new Intl.DateTimeFormat(undefined, { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value)) : "—"
const money = (minor: number, currency: string) => currency ? new Intl.NumberFormat(undefined, { style: "currency", currency }).format(minor / 100) : minor ? "Multiple currencies" : "—"
const emptyPayments: CustomerPaymentSummary = { currency: "", paid_minor: 0, outstanding_minor: 0, successful_count: 0, outstanding_count: 0 }

export default function CustomerDashboard({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [orders, setOrders] = useState<CustomerProductOrder[]>([])
  const [saved, setSaved] = useState<Tour[]>([])
  const [notifications, setNotifications] = useState<CustomerNotification[]>([])
  const [unread, setUnread] = useState(0)
  const [payments, setPayments] = useState(emptyPayments)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState("")

  const load = useCallback(async (quiet = false) => {
    quiet ? setRefreshing(true) : setLoading(true); setError("")
    const results = await Promise.allSettled([customerBookingApi.list(), customerBookingApi.payments(), customerProductOrderApi.list(), savedTourApi.list(), customerNotificationApi.list()])
    const failed = results.filter((result) => result.status === "rejected")
    if (results[0].status === "fulfilled") setBookings(results[0].value.data.bookings)
    if (results[1].status === "fulfilled") setPayments(results[1].value.data.summary)
    if (results[2].status === "fulfilled") setOrders(results[2].value.data.orders)
    if (results[3].status === "fulfilled") setSaved(results[3].value.data.tours)
    if (results[4].status === "fulfilled") { setNotifications(results[4].value.data.notifications); setUnread(results[4].value.data.unread_count) }
    if (failed.length) { const reason = failed[0].status === "rejected" ? failed[0].reason : null; setError(reason instanceof ApiError ? reason.code.replaceAll("_", " ") : "Some dashboard information could not be updated.") }
    setLoading(false); setRefreshing(false)
  }, [])

  useEffect(() => {
    void load()
    const timer = window.setInterval(() => void load(true), 30000)
    const focus = () => void load(true)
    window.addEventListener("focus", focus)
    return () => { window.clearInterval(timer); window.removeEventListener("focus", focus) }
  }, [load])

  const activeBookings = useMemo(() => bookings.filter((booking) => !["cancelled", "expired"].includes(booking.booking_status)), [bookings])
  const upcoming = useMemo(() => activeBookings.filter((booking) => new Date(booking.departure.start_date).getTime() >= Date.now()).sort((a, b) => +new Date(a.departure.start_date) - +new Date(b.departure.start_date)), [activeBookings])
  const next = upcoming[0]
  const inTransit = orders.filter((order) => ["processing", "shipped"].includes(order.status)).length
  const openBooking = (booking: Booking) => { sessionStorage.setItem("kobani:selected-booking-id", booking.id); onNavigate("customer-booking-detail") }
  const firstName = user?.fullName?.split(/\s+/)[0] || "Traveller"
  const paidPercent = next?.total_minor ? Math.min(100, Math.round((next.paid_minor / next.total_minor) * 100)) : 0

  return <CustomerPortalLayout title={`Welcome back, ${firstName}`} subtitle={`${new Intl.DateTimeFormat(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date())} · Your account updates automatically.`} active="Overview" onNavigate={onNavigate}>
    <main className="mx-auto max-w-[1450px] p-4 sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Customer dashboard</p><h1 className="page-title">Overview</h1><p className="sub">Live bookings, balances, orders and account activity.</p></div><div className="flex gap-2"><button onClick={() => void load(true)} disabled={refreshing} className="admin-outline disabled:opacity-50">{refreshing ? "Updating…" : "Refresh"}</button><button onClick={() => onNavigate("tours")} className="admin-black">Explore Tours</button></div></div>
      {error && <div role="alert" className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">{error}<button onClick={() => void load()} className="ml-2 underline">Try again</button></div>}
      {loading ? <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[1,2,3,4].map((item) => <div key={item} className="h-32 animate-pulse rounded-2xl bg-white" />)}</div> : <>
        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[
          ["Upcoming Tours", String(upcoming.length), next ? `Next: ${date(next.departure.start_date)}` : "No upcoming journey", "#356A9A", () => onNavigate("customer-bookings")],
          ["Total Bookings", String(bookings.length), `${activeBookings.length} active`, "#27855C", () => onNavigate("customer-bookings")],
          ["Outstanding Balance", (payments.by_currency?.length || 0) > 1 ? `${payments.by_currency?.length} currencies` : money(payments.outstanding_minor, payments.currency), `${payments.outstanding_count} unpaid booking${payments.outstanding_count === 1 ? " or order" : "s or orders"}`, "#C84A4A", () => { sessionStorage.setItem("kobani:payments-view", "outstanding"); onNavigate("customer-payments") }],
          ["Product Orders", String(orders.length), `${inTransit} being processed or shipped`, "#C6A15B", () => onNavigate("customer-product-orders")],
        ].map(([label, value, note, color, action]) => <button onClick={action as () => void} key={label as string} className="rounded-2xl border border-[#E6DFD2] bg-white p-5 text-left hover:shadow-md"><small className="uppercase tracking-wider text-[#888]">{label as string}</small><b className="mt-3 block font-serif text-2xl" style={{ color: color as string }}>{value as string}</b><p className="mt-1 text-xs text-[#888]">{note as string}</p></button>)}</section>
        {next ? <section className="mt-5 overflow-hidden rounded-2xl border border-[#E6DFD2] bg-white"><div className="grid lg:grid-cols-[1fr_420px]"><div className="relative min-h-72 bg-[#25211C]">{next.tour.featured_image?.url && <img src={next.tour.featured_image.url} alt={next.tour.title} className="absolute inset-0 h-full w-full object-cover" />}<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"/><div className="absolute bottom-6 left-6 right-6 text-white"><p className="eyebrow text-[#E9D6A8]">Your next journey</p><h2 className="font-serif text-3xl font-bold">{next.tour.title}</h2><p className="mt-2 text-sm text-white/75">{date(next.departure.start_date)} · {next.tour.destination}, {next.tour.country}</p></div></div><div className="p-6"><small className="text-[#888]">Booking reference</small><b className="block">{next.booking_reference}</b><div className="mt-7 flex justify-between text-sm"><b>Payment progress</b><span>{paidPercent}% paid</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E9E3D8]"><div className="h-full rounded-full bg-[#C6A15B]" style={{ width: `${paidPercent}%` }}/></div><div className="mt-2 flex justify-between text-xs"><span className="text-green-700">{money(next.paid_minor, next.currency)} paid</span><span className="text-red-700">{money(next.balance_minor, next.currency)} outstanding</span></div><p className="mt-6 rounded-xl bg-[#F8F4EA] p-3 text-sm capitalize">Booking: {next.booking_status.replaceAll("_", " ")} · Payment: {next.payment_status.replaceAll("_", " ")}</p><button onClick={() => openBooking(next)} className="admin-black mt-4 w-full">View Booking Details</button></div></div></section> : <section className="mt-5 rounded-2xl border border-dashed bg-white p-12 text-center"><h2 className="font-serif text-2xl font-bold">No upcoming tours</h2><p className="mt-2 text-sm text-[#777]">Your next confirmed journey will appear here automatically.</p><button onClick={() => onNavigate("tours")} className="admin-gold mt-5">Explore Tours</button></section>}
        <div className="mt-5 grid gap-5 xl:grid-cols-[1.5fr_.8fr]"><section className="overflow-hidden rounded-2xl border bg-white"><div className="flex justify-between border-b p-5"><h2 className="font-serif text-xl font-bold">Recent Bookings</h2><button onClick={() => onNavigate("customer-bookings")} className="text-sm font-bold text-[#9A702B]">View all</button></div><div className="overflow-x-auto"><table className="admin-table min-w-[700px]"><thead><tr>{["Reference", "Tour", "Travel date", "Amount", "Status", ""].map((heading) => <th key={heading}>{heading}</th>)}</tr></thead><tbody>{bookings.slice(0, 5).map((booking) => <tr key={booking.id}><td><b>{booking.booking_reference}</b></td><td>{booking.tour.title}</td><td>{date(booking.departure.start_date)}</td><td>{money(booking.total_minor, booking.currency)}</td><td><span className="pill neutral capitalize">{booking.booking_status.replaceAll("_", " ")}</span></td><td><button onClick={() => openBooking(booking)} className="admin-outline !py-2">View</button></td></tr>)}{!bookings.length && <tr><td colSpan={6} className="py-12 text-center">No bookings yet.</td></tr>}</tbody></table></div></section>
        <aside className="rounded-2xl border bg-white p-5"><div className="flex justify-between"><div><p className="eyebrow">Account activity</p><h2 className="font-serif text-xl font-bold">Notifications</h2></div>{unread > 0 && <span className="pill warning">{unread} unread</span>}</div><div className="mt-4 space-y-3">{notifications.slice(0, 5).map((item) => <button key={item.id} onClick={() => onNavigate("customer-notifications")} className={`block w-full rounded-xl border p-3 text-left ${item.is_read ? "bg-white" : "bg-[#FFF9EA]"}`}><b className="text-sm">{item.title}</b><p className="mt-1 line-clamp-2 text-xs text-[#777]">{item.message}</p><small>{date(item.created_at || undefined)}</small></button>)}{!notifications.length && <p className="py-10 text-center text-sm text-[#777]">No notifications yet.</p>}</div><button onClick={() => onNavigate("customer-notifications")} className="admin-outline mt-4 w-full">View notifications</button><div className="mt-5 grid grid-cols-2 gap-3 border-t pt-5"><button onClick={() => onNavigate("customer-saved-tours")} className="rounded-xl bg-[#F8F4EA] p-3 text-left"><b className="block text-xl">{saved.length}</b><small>Saved tours</small></button><button onClick={() => onNavigate("customer-product-orders")} className="rounded-xl bg-[#F8F4EA] p-3 text-left"><b className="block text-xl">{orders.length}</b><small>Market orders</small></button></div></aside></div>
      </>}
    </main>
  </CustomerPortalLayout>
}
