import { useEffect, useState } from "react";
import type { Page } from "./App";
import { ApiError, customerBookingApi, type Booking } from "./api";
import CustomerPortalLayout from "./CustomerPortalLayout";

const money = (booking: Booking, minor: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: booking.currency,
  }).format(minor / 100);
export default function CustomerBookingDetailPage({
  onNavigate,
}: {
  onNavigate: (page: Page) => void;
}) {
  const id = sessionStorage.getItem("kobani:selected-booking-id") || "",
    [booking, setBooking] = useState<Booking>(),
    [loading, setLoading] = useState(true),
    [notice, setNotice] = useState(""),
    [reply, setReply] = useState(""),
    [busy, setBusy] = useState(false);
  const load = async () => {
    if (!id) {
      setNotice("Choose a booking first.");
      setLoading(false);
      return;
    }
    try {
      setBooking((await customerBookingApi.get(id)).data.booking);
    } catch (error) {
      setNotice(
        error instanceof ApiError ? error.code : "Could not load this booking.",
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load();
  }, [id]);
  const send = async () => {
    if (!reply.trim()) return;
    setBusy(true);
    try {
      await customerBookingApi.sendMessage(id, reply);
      setReply("");
      await load();
    } catch {
      setNotice("Your reply could not be sent.");
    } finally {
      setBusy(false);
    }
  };
  const payInvoice = async (invoiceId: string) => {
    setBusy(true);
    try {
      location.assign(
        (await customerBookingApi.payInvoice(id, invoiceId)).data
          .authorization_url,
      );
    } catch {
      setNotice("We could not start your payment. Please try again.");
      setBusy(false);
    }
  };
  if (loading || !booking)
    return (
      <CustomerPortalLayout
        title="Booking Details"
        subtitle="Loading your booking"
        active="My Bookings"
        onNavigate={onNavigate}
      >
        <div className="p-20 text-center">{notice || "Loading booking…"}</div>
      </CustomerPortalLayout>
    );
  if (booking.workflow !== "flyer_request")
    return (
      <CustomerPortalLayout
        title="Booking Details"
        subtitle={booking.booking_reference}
        active="My Bookings"
        onNavigate={onNavigate}
      >
        <main className="mx-auto max-w-5xl p-5">
          <button onClick={() => onNavigate("customer-bookings")}>
            ← My Bookings
          </button>
          <section className="mt-5 rounded-2xl border bg-white p-7">
            <p className="eyebrow">{booking.booking_reference}</p>
            <h1 className="mt-2 font-serif text-3xl font-bold">
              {booking.tour.title}
            </h1>
            <p className="mt-2 text-[#777]">
              {booking.departure.start_date} ·{" "}
              {booking.traveller_summary.spaces} travellers
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                ["Total", money(booking, booking.total_minor)],
                ["Paid", money(booking, booking.paid_minor)],
                ["Balance", money(booking, booking.balance_minor)],
              ].map((item) => (
                <div className="rounded-xl bg-[#F8F4EA] p-4" key={item[0]}>
                  <small>{item[0]}</small>
                  <b className="block">{item[1]}</b>
                </div>
              ))}
            </div>
            {booking.balance_minor > 0 && (
              <button
                onClick={async () =>
                  location.assign(
                    (await customerBookingApi.payOutstanding(booking.id)).data
                      .authorization_url,
                  )
                }
                className="admin-gold mt-6"
              >
                Pay Remaining Balance
              </button>
            )}
          </section>
        </main>
      </CustomerPortalLayout>
    );
  return (
    <CustomerPortalLayout
      title="Booking Details"
      subtitle={booking.booking_reference}
      active="My Bookings"
      onNavigate={onNavigate}
    >
      <main className="mx-auto max-w-6xl p-4 sm:p-7">
        <button
          onClick={() => onNavigate("customer-bookings")}
          className="text-xs text-[#777]"
        >
          ← Back to My Bookings
        </button>
        <header className="mt-5 rounded-2xl bg-[#171511] p-6 text-white">
          <p className="text-xs text-[#C6A15B]">{booking.booking_reference}</p>
          <h1 className="mt-2 font-serif text-3xl font-bold">
            {booking.tour.title}
          </h1>
          <p className="mt-2 text-sm text-white/60">
            {booking.tour.destination}, {booking.tour.country}
          </p>
          <div className="mt-5 flex gap-2">
            <span className="pill warning capitalize">
              {booking.booking_status.replaceAll("_", " ")}
            </span>
            <span className="pill neutral capitalize">
              {booking.payment_status.replaceAll("_", " ")}
            </span>
          </div>
        </header>
        {notice && (
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {notice}
          </p>
        )}
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
          <div className="space-y-5">
            <section className="rounded-2xl border bg-white p-5">
              <h2 className="font-serif text-xl font-bold">Your Request</h2>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-6">
                {booking.request_details}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {booking.preferred_date && (
                  <div className="rounded-xl bg-[#F8F4EA] p-3">
                    <small>Preferred date</small>
                    <b className="block">{booking.preferred_date}</b>
                  </div>
                )}
                {booking.traveller_count && (
                  <div className="rounded-xl bg-[#F8F4EA] p-3">
                    <small>Travellers</small>
                    <b className="block">{booking.traveller_count}</b>
                  </div>
                )}
              </div>
              {booking.special_requests && (
                <p className="mt-4 whitespace-pre-wrap text-sm text-[#666]">
                  {booking.special_requests}
                </p>
              )}
              <button
                onClick={() => {
                  sessionStorage.setItem(
                    "kobani_selected_tour_slug",
                    booking.tour.slug,
                  );
                  window.history.pushState(
                    {},
                    "",
                    `/tours/${encodeURIComponent(booking.tour.slug)}`,
                  );
                  onNavigate("tour-details");
                }}
                className="admin-outline mt-5"
              >
                View Tour & Flyer
              </button>
            </section>
            <section className="rounded-2xl border bg-white p-5">
              <h2 className="font-serif text-xl font-bold">Conversation</h2>
              <div className="mt-4 space-y-3">
                {booking.messages?.map((item) => (
                  <div
                    key={item.id}
                    className={`max-w-[85%] rounded-xl p-3 text-sm ${item.sender_type === "customer" ? "ml-auto bg-[#C6A15B]/20" : item.sender_type === "admin" ? "bg-[#F1ECE2]" : "mx-auto text-center text-xs text-[#888]"}`}
                  >
                    <b className="block text-[10px] uppercase">
                      {item.sender_type}
                    </b>
                    <p className="whitespace-pre-wrap">{item.message}</p>
                    <small className="text-[#888]">
                      {new Date(item.created_at).toLocaleString()}
                    </small>
                  </div>
                ))}
              </div>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="admin-input mt-5 min-h-24 w-full"
                placeholder="Reply to KOBANI…"
              />
              <button
                disabled={busy || !reply.trim()}
                onClick={() => void send()}
                className="admin-gold mt-3 disabled:opacity-50"
              >
                {busy ? "Sending…" : "Send Reply"}
              </button>
            </section>
          </div>
          <aside>
            <section className="rounded-2xl border bg-white p-5">
              <h2 className="font-serif text-xl font-bold">Invoices</h2>
              <div className="mt-4 space-y-3">
                {booking.invoices?.map((invoice) => (
                  <article key={invoice.id} className="rounded-xl border p-4">
                    <div className="flex justify-between">
                      <b>{invoice.invoice_number}</b>
                      <span className="text-xs capitalize">
                        {invoice.status}
                      </span>
                    </div>
                    <p className="mt-2 capitalize text-sm">
                      {invoice.purpose.replaceAll("_", " ")}
                    </p>
                    <b className="mt-2 block font-serif text-2xl">
                      {invoice.currency} {invoice.amount}
                    </b>
                    {invoice.description && (
                      <p className="mt-2 text-xs text-[#777]">
                        {invoice.description}
                      </p>
                    )}
                    {["sent", "partially_paid"].includes(invoice.status) && (
                      <button
                        disabled={busy}
                        onClick={() => void payInvoice(invoice.id)}
                        className="admin-gold mt-4 w-full"
                      >
                        Pay Now
                      </button>
                    )}
                  </article>
                ))}
                {!booking.invoices?.length && (
                  <p className="text-sm text-[#777]">
                    No invoice has been issued yet.
                  </p>
                )}
              </div>
            </section>
          </aside>
        </div>
      </main>
    </CustomerPortalLayout>
  );
}
