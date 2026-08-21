import { useEffect, useState } from "react";
import type { Page } from "./App";
import { AdminShell } from "./AdminProductsPage";
import {
  adminBookingApi,
  adminCustomerApi,
  Booking,
  type AdminCustomer,
} from "./api";

const Card = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="overflow-hidden rounded-2xl border bg-white">
    <h2 className="border-b px-5 py-4 font-serif text-xl font-bold">{title}</h2>
    <div className="p-5">{children}</div>
  </section>
);

const ClientProfileModal = ({
  customer,
  loading,
  error,
  fallback,
  onClose,
}: {
  customer: AdminCustomer | null;
  loading: boolean;
  error: string;
  fallback: Booking["customer"];
  onClose: () => void;
}) => (
  <div
    className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-black/65 p-4"
    role="dialog"
    aria-modal="true"
    aria-label="Client profile"
    onClick={onClose}
  >
    <section
      className="my-6 w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Booking client</p>
          <h2 className="font-serif text-3xl font-bold">Client Profile</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="grid h-10 w-10 place-items-center rounded-full border text-xl"
          aria-label="Close client profile"
        >
          ×
        </button>
      </div>
      {loading ? (
        <p className="py-16 text-center text-sm text-[#777]">
          Loading client profile…
        </p>
      ) : (
        <>
          {error && (
            <p className="mt-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
              {error}
            </p>
          )}
          <div className="mt-6 rounded-2xl bg-[#171511] p-5 text-white">
            <h3 className="font-serif text-2xl font-bold">
              {customer?.full_name || fallback.full_name}
            </h3>
            <p className="mt-2 text-sm text-white/70">
              {customer?.email || fallback.email}
            </p>
            <p className="text-sm text-white/70">
              {customer?.phone || fallback.phone || "No phone number provided"}
            </p>
          </div>
          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ["Country", customer?.country || "Not provided"],
              ["Account status", customer?.status || "Active"],
              ["Account type", customer?.account_type || "Customer"],
              ["Email verified", customer?.email_verified ? "Yes" : "No"],
              ["Total bookings", customer?.total_bookings ?? "—"],
              ["Confirmed bookings", customer?.confirmed_bookings ?? "—"],
              ["Upcoming bookings", customer?.upcoming_bookings ?? "—"],
              ["Cancelled bookings", customer?.cancelled_bookings ?? "—"],
              [
                "Lifetime value",
                customer ? `GHS ${customer.lifetime_value}` : "—",
              ],
              ["Outstanding", customer ? `GHS ${customer.outstanding}` : "—"],
              [
                "Member since",
                customer?.created_at
                  ? new Date(customer.created_at).toLocaleDateString()
                  : "—",
              ],
              [
                "Last booking",
                customer?.last_booking_at
                  ? new Date(customer.last_booking_at).toLocaleString()
                  : "—",
              ],
            ].map(([label, value]) => (
              <div
                key={String(label)}
                className="rounded-xl border bg-[#FAF8F3] p-3"
              >
                <dt className="text-[10px] font-bold uppercase tracking-wider text-[#888]">
                  {label}
                </dt>
                <dd className="mt-1 text-sm font-semibold capitalize">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </>
      )}
    </section>
  </div>
);

export default function AdminBookingDetailPage({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  const id = window.location.pathname.startsWith("/admin/bookings/")
      ? window.location.pathname.split("/").filter(Boolean)[2] || ""
      : sessionStorage.getItem("kobani_admin_booking_id") || "",
    [booking, setBooking] = useState<Booking>(),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [paymentOpen, setPaymentOpen] = useState(false),
    [clientOpen, setClientOpen] = useState(false),
    [client, setClient] = useState<AdminCustomer | null>(null),
    [clientLoading, setClientLoading] = useState(false),
    [clientError, setClientError] = useState(""),
    [amount, setAmount] = useState(""),
    [reference, setReference] = useState(""),
    [reply, setReply] = useState(""),
    [invoiceOpen, setInvoiceOpen] = useState(false),
    [purpose, setPurpose] = useState("deposit"),
    [description, setDescription] = useState(""),
    [dueDate, setDueDate] = useState("");
  const load = () =>
    adminBookingApi
      .get(id)
      .then((r) => setBooking(r.data.booking))
      .catch(() => setNotice("Booking not found."));
  useEffect(() => {
    void load();
  }, [id]);
  const openClientProfile = async () => {
    setClientOpen(true);
    if (client) return;
    setClientLoading(true);
    setClientError("");
    try {
      const response = await adminCustomerApi.get(booking?.customer.id || "");
      setClient(response.data.customer);
    } catch {
      setClientError(
        "Extended account details could not be loaded. The booking contact details are shown below.",
      );
    } finally {
      setClientLoading(false);
    }
  };
  const action = async (name: string) => {
    if (
      name === "cancel" &&
      !confirm(
        "Cancel this booking? Active reserved capacity will be released.",
      )
    )
      return;
    setBusy(true);
    try {
      const r = await adminBookingApi.action(id, name);
      setBooking(r.data.booking);
      setNotice(`Booking ${name.replaceAll("-", " ")} completed.`);
      window.dispatchEvent(new Event("kobani:navigation-counts"));
    } catch {
      setNotice("The booking action could not be completed.");
    } finally {
      setBusy(false);
    }
  };
  const payment = async () => {
    setBusy(true);
    try {
      const r = await adminBookingApi.manualPayment({
        booking_id: id,
        amount,
        payment_type: "balance",
        method: "bank_transfer",
        external_reference: reference,
      });
      setBooking(r.data.booking);
      setPaymentOpen(false);
      setNotice("Manual payment recorded and booking totals updated.");
      window.dispatchEvent(new Event("kobani:navigation-counts"));
    } catch {
      setNotice(
        "Payment could not be recorded. Check the amount and reference.",
      );
    } finally {
      setBusy(false);
    }
  };
  if (!booking)
    return (
      <AdminShell
        title="Booking Details"
        active="Bookings"
        onNavigate={onNavigate}
      >
        <div className="py-28 text-center">{notice || "Loading booking…"}</div>
      </AdminShell>
    );
  if (booking.workflow === "flyer_request") {
    const send = async () => {
      if (!reply.trim()) return;
      setBusy(true);
      try {
        await adminBookingApi.sendMessage(id, reply);
        setReply("");
        await load();
      } catch {
        setNotice("Reply could not be sent.");
      } finally {
        setBusy(false);
      }
    };
    const invoice = async () => {
      setBusy(true);
      try {
        await adminBookingApi.createInvoice(id, {
          amount,
          currency: "GHS",
          purpose,
          description,
          due_date: dueDate,
        });
        setInvoiceOpen(false);
        setAmount("");
        setDescription("");
        await load();
        setNotice("Invoice sent to customer.");
      } catch {
        setNotice("Invoice could not be created. Check the amount and fields.");
      } finally {
        setBusy(false);
      }
    };
    return (
      <AdminShell
        title="Booking Workspace"
        active="Bookings"
        onNavigate={onNavigate}
      >
        <main className="mx-auto max-w-[1400px] p-4 sm:p-7">
          <button
            onClick={() => onNavigate("admin-bookings")}
            className="admin-outline"
          >
            ← Bookings
          </button>
          <header className="mt-5 rounded-2xl bg-[#111] p-6 text-white">
            <p className="text-xs text-[#C6A15B]">
              {booking.booking_reference}
            </p>
            <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl font-bold">
                  {booking.tour.title}
                </h1>
                <p className="mt-2 text-sm text-white/60">
                  {booking.customer.full_name} · {booking.customer.email}
                </p>
              </div>
              <div className="flex gap-2">
                <span className="pill warning capitalize">
                  {booking.booking_status.replaceAll("_", " ")}
                </span>
                <span className="pill neutral capitalize">
                  {booking.payment_status.replaceAll("_", " ")}
                </span>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                disabled={busy}
                onClick={() => setInvoiceOpen(true)}
                className="admin-gold"
              >
                Initiate Invoice
              </button>
              <button
                type="button"
                onClick={() => void openClientProfile()}
                className="inline-flex items-center justify-center rounded-xl border border-white/40 bg-white/10 px-4 py-3 text-[11px] font-bold text-white hover:bg-white/20"
              >
                Client Profile
              </button>
              <button
                onClick={() => {
                  sessionStorage.setItem(
                    "kobani_selected_tour_slug",
                    booking.tour.slug,
                  );
                  window.history.pushState(
                    {},
                    "",
                    `/tours/${encodeURIComponent(booking.tour.slug)}?adminPreview=${encodeURIComponent(booking.tour.id)}`,
                  );
                  onNavigate("tour-details");
                }}
                className="inline-flex items-center justify-center rounded-xl border border-white/40 bg-transparent px-4 py-3 text-[11px] font-bold text-white hover:bg-white/10"
              >
                View Tour & Flyer
              </button>
            </div>
          </header>
          {notice && (
            <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm">{notice}</p>
          )}
          <div className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
            <div className="space-y-5">
              <Card title="Booking Request">
                <p className="whitespace-pre-wrap text-sm leading-6">
                  {booking.request_details}
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {booking.preferred_date && (
                    <div>
                      <small>Preferred date</small>
                      <b className="block">{booking.preferred_date}</b>
                    </div>
                  )}
                  {booking.traveller_count && (
                    <div>
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
              </Card>
              <Card title="Conversation">
                <div className="space-y-3">
                  {booking.messages?.map((item) => (
                    <div
                      key={item.id}
                      className={`max-w-[85%] rounded-xl p-3 text-sm ${item.sender_type === "admin" ? "ml-auto bg-[#C6A15B]/20" : item.sender_type === "customer" ? "bg-[#F2EEE6]" : "mx-auto text-center text-xs text-[#888]"}`}
                    >
                      <b className="block text-[10px] uppercase">
                        {item.sender_type}
                      </b>
                      <p>{item.message}</p>
                      <small>
                        {new Date(item.created_at).toLocaleString()}
                      </small>
                    </div>
                  ))}
                </div>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  className="admin-input mt-5 min-h-24 w-full"
                  placeholder="Reply to customer…"
                />
                <button
                  disabled={busy || !reply.trim()}
                  onClick={() => void send()}
                  className="admin-gold mt-3"
                >
                  {busy ? "Sending…" : "Send Reply"}
                </button>
              </Card>
            </div>
            <aside>
              <Card title="Invoices">
                <div className="space-y-3">
                  {booking.invoices?.map((item) => (
                    <article key={item.id} className="rounded-xl border p-4">
                      <div className="flex justify-between">
                        <b>{item.invoice_number}</b>
                        <span className="capitalize">{item.status}</span>
                      </div>
                      <p className="mt-2 capitalize text-xs">{item.purpose}</p>
                      <b className="mt-2 block font-serif text-2xl">
                        {item.currency} {item.amount}
                      </b>
                      {item.status !== "paid" &&
                        item.status !== "cancelled" && (
                          <button
                            onClick={async () => {
                              await adminBookingApi.cancelInvoice(id, item.id);
                              await load();
                            }}
                            className="mt-3 text-xs text-red-700"
                          >
                            Cancel invoice
                          </button>
                        )}
                    </article>
                  ))}
                  {!booking.invoices?.length && (
                    <p className="text-sm text-[#777]">No invoices yet.</p>
                  )}
                </div>
              </Card>
            </aside>
          </div>
          {invoiceOpen && (
            <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
              <div className="w-full max-w-md rounded-3xl bg-white p-7">
                <button
                  onClick={() => setInvoiceOpen(false)}
                  className="float-right text-xl"
                >
                  ×
                </button>
                <h2 className="font-serif text-3xl font-bold">
                  Initiate Invoice
                </h2>
                <label className="form-field mt-5">
                  <span>Amount (GHS) *</span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="admin-input w-full"
                  />
                </label>
                <label className="form-field mt-4">
                  <span>Invoice Purpose *</span>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="admin-input w-full"
                  >
                    <option value="deposit">Deposit</option>
                    <option value="full_payment">Full Payment</option>
                    <option value="balance">Balance</option>
                    <option value="other">Other</option>
                  </select>
                </label>
                <label className="form-field mt-4">
                  <span>Due date</span>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="admin-input w-full"
                  />
                </label>
                <label className="form-field mt-4">
                  <span>Description / Note</span>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="admin-input min-h-24 w-full"
                  />
                </label>
                <button
                  disabled={busy || !amount}
                  onClick={() => void invoice()}
                  className="admin-gold mt-5 w-full"
                >
                  {busy ? "Sending…" : "Send Invoice"}
                </button>
              </div>
            </div>
          )}
          {clientOpen && (
            <ClientProfileModal
              customer={client}
              loading={clientLoading}
              error={clientError}
              fallback={booking.customer}
              onClose={() => setClientOpen(false)}
            />
          )}
        </main>
      </AdminShell>
    );
  }
  return (
    <AdminShell
      title="Booking Details"
      active="Bookings"
      onNavigate={onNavigate}
    >
      <header className="bg-white border-b px-4 sm:px-7 py-4 sticky top-0 z-30 flex items-center">
        <button
          onClick={() => onNavigate("admin-bookings")}
          className="border rounded-xl px-4 py-2 text-sm"
        >
          ← Bookings
        </button>
        <div className="ml-4">
          <span className="text-[9px] uppercase text-[#888]">
            Booking reference
          </span>
          <h1 className="font-serif text-xl font-bold">
            {booking.booking_reference}
          </h1>
        </div>
        <span className="ml-auto px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-bold">
          {booking.booking_status.replaceAll("_", " ")}
        </span>
      </header>
      {notice && (
        <button
          onClick={() => setNotice("")}
          className="fixed top-20 left-1/2 -translate-x-1/2 bg-black text-white px-5 py-3 rounded-xl text-xs z-40"
        >
          {notice}
        </button>
      )}
      <main className="max-w-[1400px] mx-auto p-4 sm:p-7">
        <section className="bg-[#111] text-white rounded-2xl p-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void openClientProfile()}
            className="border border-white/30 px-4 py-2.5 rounded-xl text-xs font-bold"
          >
            Client Profile
          </button>
          <button
            disabled={busy}
            onClick={() => action("confirm")}
            className="bg-[#C6A15B] text-black px-4 py-2.5 rounded-xl text-xs font-bold"
          >
            Confirm booking
          </button>
          <button
            disabled={busy}
            onClick={() => setPaymentOpen(true)}
            className="border border-white/20 px-4 py-2.5 rounded-xl text-xs"
          >
            Record payment
          </button>
          <button
            disabled={busy}
            onClick={() => action("send-confirmation")}
            className="border border-white/20 px-4 py-2.5 rounded-xl text-xs"
          >
            Send confirmation
          </button>
          <button
            disabled={busy}
            onClick={() => action("send-payment-reminder")}
            className="border border-white/20 px-4 py-2.5 rounded-xl text-xs"
          >
            Payment reminder
          </button>
          <button
            disabled={busy}
            onClick={() => action("complete")}
            className="border border-white/20 px-4 py-2.5 rounded-xl text-xs"
          >
            Complete
          </button>
          <button
            disabled={busy}
            onClick={() => action("cancel")}
            className="ml-auto border border-red-400/40 text-red-300 px-4 py-2.5 rounded-xl text-xs"
          >
            Cancel
          </button>
        </section>
        <div className="grid xl:grid-cols-[1.4fr_.7fr] gap-5 mt-5">
          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <Card title="Customer">
                <b>{booking.customer.full_name}</b>
                <p className="text-sm text-[#777] mt-2">
                  {booking.customer.email}
                </p>
                <p className="text-sm text-[#777]">{booking.customer.phone}</p>
              </Card>
              <Card title="Tour and departure">
                <b>{booking.tour.title}</b>
                <p className="font-bold text-[#9B722D] mt-1">
                  {booking.package?.name || "Standard Package"}
                </p>
                {booking.package?.duration && (
                  <p className="text-sm text-[#777]">
                    {booking.package.duration.days} days /{" "}
                    {booking.package.duration.nights} nights ·{" "}
                    {booking.package.hotel} · {booking.package.transport}
                  </p>
                )}
                <p className="text-sm text-[#777] mt-2">
                  {booking.tour.destination}, {booking.tour.country}
                </p>
                <p className="text-sm">
                  {booking.departure.start_date} → {booking.departure.end_date}
                </p>
                <p className="text-xs text-[#888] mt-1">
                  {booking.departure.code}
                </p>
              </Card>
            </div>
            <Card title={`Travellers (${booking.traveller_summary.spaces})`}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <thead className="text-[10px] uppercase text-[#888]">
                    <tr>
                      {[
                        "Name",
                        "Type",
                        "Nationality",
                        "Dietary",
                        "Accessibility",
                        "Documents",
                      ].map((x) => (
                        <th className="pb-3" key={x}>
                          {x}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {booking.travellers?.map((x, i) => (
                      <tr className="border-t" key={x.id || i}>
                        <td className="py-3 font-bold">
                          {x.full_name || `${x.first_name} ${x.last_name}`}
                        </td>
                        <td>{x.traveller_type}</td>
                        <td>{x.nationality || "—"}</td>
                        <td>{x.dietary_requirements || "None"}</td>
                        <td>{x.accessibility_requirements || "None"}</td>
                        <td>{x.document_status || "Not required"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            <Card title="Payments">
              <div className="space-y-3">
                {booking.payments?.map((x) => (
                  <div
                    className="border rounded-xl p-4 flex justify-between text-sm"
                    key={x.id}
                  >
                    <div>
                      <b>{x.payment_reference}</b>
                      <p className="text-xs text-[#888]">
                        {x.provider} · {x.payment_type}
                      </p>
                    </div>
                    <div className="text-right">
                      <b>
                        {x.currency} {x.amount}
                      </b>
                      <p
                        className={
                          x.status === "success"
                            ? "text-green-700"
                            : "text-amber-700"
                        }
                      >
                        {x.status}
                      </p>
                    </div>
                  </div>
                ))}
                {!booking.payments?.length && (
                  <p className="text-sm text-[#777]">No payments recorded.</p>
                )}
              </div>
            </Card>
            <Card title="Audit timeline">
              <div className="space-y-3">
                {booking.audit?.map((x, i) => (
                  <div className="flex gap-3 text-sm" key={i}>
                    <span className="w-2 h-2 bg-[#C6A15B] rounded-full mt-1.5" />
                    <div>
                      <b>{x.action.replaceAll(".", " · ")}</b>
                      <p className="text-xs text-[#888]">
                        {new Date(x.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <aside className="space-y-5">
            <Card title="Payment summary">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Total</span>
                  <b>
                    {booking.currency} {booking.total}
                  </b>
                </div>
                <div className="flex justify-between text-green-700">
                  <span>Paid</span>
                  <b>
                    {booking.currency} {booking.paid}
                  </b>
                </div>
                <div className="flex justify-between border-t pt-3 text-[#A36D20]">
                  <span>Balance</span>
                  <b className="font-serif text-xl">
                    {booking.currency} {booking.balance}
                  </b>
                </div>
                <p className="text-xs text-[#888]">
                  {booking.payment_status.replaceAll("_", " ")}
                </p>
              </div>
            </Card>
            <Card title="Reservation">
              <p className="text-sm">
                {booking.reservation_active
                  ? "Capacity currently held"
                  : "Reservation converted or released"}
              </p>
              <p className="text-xs text-[#888] mt-2">
                Expires{" "}
                {new Date(booking.reservation_expires_at).toLocaleString()}
              </p>
            </Card>
          </aside>
        </div>
      </main>
      {paymentOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 grid place-items-center p-4">
          <div className="bg-white rounded-3xl p-7 w-full max-w-md">
            <button
              onClick={() => setPaymentOpen(false)}
              className="float-right text-xl"
            >
              ×
            </button>
            <h2 className="font-serif text-3xl font-bold">
              Record manual payment
            </h2>
            <p className="text-sm text-[#777] mt-2">
              This is recorded as manual, never as Paystack.
            </p>
            <label className="block mt-5 text-xs">
              Amount ({booking.currency})
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-11 border rounded-xl px-3 mt-1"
              />
            </label>
            <label className="block mt-3 text-xs">
              External reference
              <input
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full h-11 border rounded-xl px-3 mt-1"
              />
            </label>
            <button
              disabled={busy}
              onClick={payment}
              className="w-full bg-[#C6A15B] rounded-xl py-3 font-bold mt-5"
            >
              {busy ? "Recording…" : "Record payment"}
            </button>
          </div>
        </div>
      )}
      {clientOpen && (
        <ClientProfileModal
          customer={client}
          loading={clientLoading}
          error={clientError}
          fallback={booking.customer}
          onClose={() => setClientOpen(false)}
        />
      )}
    </AdminShell>
  );
}
