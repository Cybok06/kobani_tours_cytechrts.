import { useEffect, useMemo, useState } from "react"
import type { Page } from "./App"
import {
  ApiError,
  customerBookingApi,
  type Booking,
  type CustomerPayment,
  type CustomerPaymentSummary,
} from "./api"
import CustomerPortalLayout from "./CustomerPortalLayout"

const formatMinor = (minor: number, currency: string) =>
  currency
    ? new Intl.NumberFormat(undefined, { style: "currency", currency }).format(
        minor / 100,
      )
    : `${(minor / 100).toFixed(2)} (multiple currencies)`
const formatDate = (value?: string) =>
  value
    ? new Intl.DateTimeFormat(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(value))
    : "—"
const emptySummary: CustomerPaymentSummary = {
  currency: "",
  paid_minor: 0,
  outstanding_minor: 0,
  successful_count: 0,
  outstanding_count: 0,
  by_currency: [],
}

export default function CustomerPaymentsPage({
  onNavigate,
}: {
  onNavigate: (page: Page) => void
}) {
  const [payments, setPayments] = useState<CustomerPayment[]>([]),
    [outstanding, setOutstanding] = useState<Booking[]>([]),
    [summary, setSummary] = useState(emptySummary),
    [loading, setLoading] = useState(true),
    [message, setMessage] = useState(""),
    [filter, setFilter] = useState("all"),
    [selected, setSelected] = useState<CustomerPayment | null>(null)
  useEffect(() => {
    const load = async () => {
      try {
        const data = (await customerBookingApi.payments()).data
        setPayments(data.payments)
        setOutstanding(data.outstanding_bookings)
        setSummary(data.summary)
        if (sessionStorage.getItem("kobani:payments-view") === "outstanding") {
          sessionStorage.removeItem("kobani:payments-view")
          setTimeout(
            () =>
              document
                .getElementById("outstanding-balances")
                ?.scrollIntoView({ behavior: "smooth" }),
            50,
          )
        }
      } catch (e) {
        setMessage(
          e instanceof ApiError
            ? e.message
            : "Could not load payment information.",
        )
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])
  const shown = useMemo(
    () => payments.filter((p) => filter === "all" || p.status === filter),
    [payments, filter],
  )
  const openBooking = (booking: Booking) => {
    sessionStorage.setItem("kobani:selected-booking-id", booking.id)
    onNavigate("customer-booking-detail")
  }
  const pay = async (booking: Booking) => {
    setMessage("")
    try {
      window.location.assign(
        (await customerBookingApi.payOutstanding(booking.id)).data
          .authorization_url,
      )
    } catch (e) {
      setMessage(
        e instanceof ApiError ? e.message : "Payment could not be started.",
      )
    }
  }
  const receipt = (p: CustomerPayment) => {
    const body = `KOBANI TOURS PAYMENT RECEIPT\nPayment reference: ${p.payment_reference}\nType: ${p.kind === "product_order" ? "African Market order" : "Tour booking"}\nRelated reference: ${p.booking_reference}\nDescription: ${p.tour_title}\nDate: ${formatDate(p.paid_at || p.created_at)}\nMethod: ${p.method}\nAmount: ${p.currency} ${p.amount}\nStatus: ${p.status}`
    const url = URL.createObjectURL(new Blob([body], { type: "text/plain" }))
    const a = document.createElement("a")
    a.href = url
    a.download = `${p.payment_reference}-receipt.txt`
    a.click()
    URL.revokeObjectURL(url)
  }
  return (
    <CustomerPortalLayout
      title="Payments"
      subtitle="View transactions, receipts and outstanding balances."
      active="Payments"
      onNavigate={onNavigate}
    >
      <main className="mx-auto max-w-[1300px] p-4 sm:p-7">
        <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#C6A15B]">
          Billing center
        </p>
        <h2 className="mt-1 font-serif text-3xl font-bold">Payment Overview</h2>
        <p className="mt-1 text-xs text-[#6F6B63]">
          Amounts are shown in the original booking currency.
        </p>
        {message && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-[#C84A4A]/30 bg-white p-4 text-sm text-[#C84A4A]"
          >
            {message}
          </div>
        )}
        {loading ? (
          <div className="py-20 text-center text-sm text-[#6F6B63]">
            Loading payments…
          </div>
        ) : (
          <>
            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                [
                  "Total Paid",
                  summary.by_currency?.length === 1 ? formatMinor(summary.by_currency[0].paid_minor, summary.by_currency[0].currency) : `${summary.by_currency?.length || 0} currencies`,
                  `${summary.successful_count} successful payments`,
                ],
                [
                  "Outstanding",
                  summary.by_currency?.length === 1 ? formatMinor(summary.by_currency[0].outstanding_minor, summary.by_currency[0].currency) : `${summary.by_currency?.length || 0} currencies`,
                  `${summary.outstanding_count} unpaid bookings or orders`,
                ],
                [
                  "Transactions",
                  String(payments.length),
                  `${summary.tour_payment_count || 0} tour · ${summary.product_payment_count || 0} market`,
                ],
                [
                  "Currencies",
                  String(summary.by_currency?.length || 0),
                  "Totals kept separate",
                ],
              ].map((m, i) => (
                <article
                  key={m[0]}
                  className="rounded-2xl border border-[#E6DFD2] bg-white p-5"
                >
                  <span
                    className={`grid h-10 w-10 place-items-center rounded-xl ${
                      i === 1
                        ? "bg-[#C84A4A]/10 text-[#C84A4A]"
                        : "bg-[#27855C]/10 text-[#27855C]"
                    }`}
                  >
                    {i === 1 ? "!" : "✓"}
                  </span>
                  <small className="mt-4 block uppercase tracking-wider text-[#9A9590]">
                    {m[0]}
                  </small>
                  <b className="mt-1 block font-serif text-2xl">{m[1]}</b>
                  <p className="mt-1 text-[10px] text-[#9A9590]">{m[2]}</p>
                </article>
              ))}
            </section>
            <section className="mt-5 rounded-2xl border border-[#E6DFD2] bg-white p-5"><div><p className="text-[9px] font-bold uppercase tracking-[.16em] text-[#C6A15B]">Currency totals</p><h3 className="mt-1 font-serif text-xl font-bold">Payments by currency</h3><p className="text-xs text-[#777]">Tour and African Market payments are grouped without mixing currencies.</p></div><div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{(summary.by_currency || []).map((total) => <article key={total.currency} className="rounded-xl bg-[#F8F4EA] p-4"><b className="text-lg">{total.currency}</b><p className="mt-2 text-sm text-green-700">Paid: <b>{formatMinor(total.paid_minor, total.currency)}</b></p><p className="text-sm text-red-700">Outstanding: <b>{formatMinor(total.outstanding_minor, total.currency)}</b></p></article>)}{!summary.by_currency?.length && <p className="text-sm text-[#777]">No currency totals yet.</p>}</div></section>
            <section
              id="outstanding-balances"
              className="mt-5 rounded-2xl bg-[#221E18] p-5 text-white sm:p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[9px] uppercase tracking-[.16em] text-[#C6A15B]">
                    Tour outstanding balances
                  </p>
                  <h3 className="mt-1 font-serif text-2xl font-bold">
                    {outstanding.length} active booking{outstanding.length === 1 ? "" : "s"}
                  </h3>
                  <p className="mt-1 text-xs text-[#999]">
                    Product-order balances are included in the currency totals above.
                  </p>
                </div>
                <span className="text-3xl text-[#C6A15B]">◈</span>
              </div>
              {outstanding.length ? (
                <div className="mt-5 space-y-3">
                  {outstanding.map((b) => (
                    <div
                      key={b.id}
                      className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center"
                    >
                      <div className="flex-1">
                        <b className="text-sm">{b.tour.title}</b>
                        <p className="mt-1 text-[10px] text-[#999]">
                          {b.booking_reference} · Departure{" "}
                          {formatDate(b.departure.start_date)}
                        </p>
                      </div>
                      <b className="text-[#C6A15B]">
                        {formatMinor(b.balance_minor, b.currency)}
                      </b>
                      <button
                        onClick={() => openBooking(b)}
                        className="rounded-lg border border-white/15 px-4 py-2 text-xs"
                      >
                        View
                      </button>
                      <button
                        onClick={() => void pay(b)}
                        className="rounded-lg bg-[#C6A15B] px-4 py-2 text-xs font-bold text-black"
                      >
                        Pay Balance
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-5 rounded-xl bg-white/5 p-4 text-sm text-[#BDB7AD]">
                  You have no outstanding balances.
                </p>
              )}
            </section>
            <section className="mt-5 overflow-hidden rounded-2xl border border-[#E6DFD2] bg-white">
              <div className="flex items-center justify-between border-b border-[#F0EBE0] p-5">
                <div>
                  <h3 className="font-serif text-lg font-bold">
                    Payment history
                  </h3>
                  <p className="text-[10px] text-[#9A9590]">
                    Completed and pending transactions.
                  </p>
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="rounded-xl border border-[#E6DFD2] px-3 py-2 text-xs"
                >
                  <option value="all">All transactions</option>
                  <option value="success">Successful</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-xs">
                  <thead className="bg-[#FFFDF8] text-[9px] uppercase text-[#9A9590]">
                    <tr>
                      {[
                        "Reference",
                        "Booking",
                        "Date",
                        "Method",
                        "Amount",
                        "Status",
                        "Receipt",
                      ].map((x) => (
                        <th key={x} className="px-5 py-3">
                          {x}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {shown.map((p) => (
                      <tr key={p.id} className="border-t border-[#F2EEE7]">
                        <td className="px-5 py-4 font-semibold">
                          {p.payment_reference}
                        </td>
                        <td className="px-5 py-4">
                              <b>{p.tour_title}</b>
                              <span className="pill neutral ml-2">{p.kind === "product_order" ? "Market" : "Tour"}</span>
                          <small className="block text-[#9A9590]">
                            {p.booking_reference}
                          </small>
                        </td>
                        <td className="px-5 py-4">
                          {formatDate(p.paid_at || p.created_at)}
                        </td>
                        <td className="px-5 py-4 capitalize">
                          {p.method.replaceAll("_", " ")}
                        </td>
                        <td className="px-5 py-4 font-bold">
                          {formatMinor(p.amount_minor, p.currency)}
                        </td>
                        <td className="px-5 py-4 capitalize">{p.status}</td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => setSelected(p)}
                            className="mr-2 rounded-lg border px-3 py-2"
                          >
                            View
                          </button>
                          {p.status === "success" && (
                            <button
                              onClick={() => receipt(p)}
                              className="rounded-lg border px-3 py-2"
                            >
                              Download
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {!shown.length && (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-5 py-12 text-center text-[#6F6B63]"
                        >
                          No payment records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
        {selected && (
          <div
            className="fixed inset-0 z-[80] grid place-items-center bg-black/55 p-4"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setSelected(null)
            }}
          >
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white">
              <div className="flex justify-between bg-[#0B0B0B] p-5 text-white">
                <div>
                  <small className="text-[#C6A15B]">PAYMENT DETAILS</small>
                  <h3 className="font-serif text-lg font-bold">
                    {selected.payment_reference}
                  </h3>
                </div>
                <button onClick={() => setSelected(null)}>✕</button>
              </div>
              <div className="space-y-3 p-5 text-sm">
                <p className="text-center font-serif text-3xl font-bold">
                  {formatMinor(selected.amount_minor, selected.currency)}
                </p>
                {[
                  ["Type", selected.kind === "product_order" ? "African Market order" : "Tour booking"],
                  ["Description", selected.tour_title],
                  ["Reference", selected.booking_reference],
                  ["Method", selected.method],
                  ["Date", formatDate(selected.paid_at || selected.created_at)],
                  ["Status", selected.status],
                ].map((x) => (
                  <div
                    key={x[0]}
                    className="flex justify-between gap-4 border-b border-[#F0EBE0] py-2"
                  >
                    <span className="text-[#6F6B63]">{x[0]}</span>
                    <b className="text-right capitalize">{x[1]}</b>
                  </div>
                ))}
                {selected.status === "success" && (
                  <button
                    onClick={() => receipt(selected)}
                    className="w-full rounded-xl bg-[#C6A15B] py-3 text-xs font-bold"
                  >
                    Download Receipt
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </CustomerPortalLayout>
  )
}
