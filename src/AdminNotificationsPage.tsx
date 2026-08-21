import { useState } from "react"
import type { Page } from "./App"
import { AdminShell } from "./AdminProductsPage"
const templates = [
  "Booking Confirmation",
  "Payment Successful",
  "Payment Failed",
  "Balance Reminder",
  "Tour Update",
  "Order Confirmation",
  "Shipping Update",
  "Refund",
]
const meta: Record<string, [string, string]> = {
  "Booking Confirmation": [
    "Your KOBANI journey is confirmed — {{booking_reference}}",
    "Your booking for {{tour_name}} is confirmed. Your journey begins on {{travel_date}}.",
  ],
  "Payment Successful": [
    "Payment received for {{booking_reference}}",
    "Thank you, {{customer_name}}. We have received your payment of {{amount}}.",
  ],
  "Payment Failed": [
    "Action required: payment unsuccessful",
    "We could not process your payment. Please update your payment method to secure your booking.",
  ],
  "Balance Reminder": [
    "Your remaining balance is due soon",
    "A balance of {{balance}} is due by {{due_date}} for your upcoming journey.",
  ],
  "Tour Update": [
    "Important update for {{tour_name}}",
    "There is a new update for your journey. Please review the details in your booking dashboard.",
  ],
  "Order Confirmation": [
    "Your African Market order is confirmed",
    "Thank you for your order {{order_reference}}. We are preparing your items.",
  ],
  "Shipping Update": [
    "Your KOBANI order is on its way",
    "Good news — order {{order_reference}} has shipped. Track it using {{tracking_link}}.",
  ],
  Refund: [
    "Your refund has been processed",
    "Your refund of {{amount}} has been processed to your original payment method.",
  ],
}
const logs = [
  [
    "Olivia Bennett",
    "Booking Confirmation",
    "Email",
    "Delivered",
    "04 Aug, 10:43",
  ],
  [
    "Marcus Reed",
    "Payment Successful",
    "Email + WhatsApp",
    "Delivered",
    "04 Aug, 09:19",
  ],
  ["Akosua Nyame", "Shipping Update", "SMS", "Pending", "03 Aug, 16:07"],
  ["Daniel Kim", "Payment Failed", "Email", "Bounced", "03 Aug, 11:34"],
]
export default function AdminNotificationsPage({
  onNavigate,
}: {
  onNavigate: (p: Page) => void
}) {
  const [tab, setTab] = useState("Customer Templates"),
    [selected, setSelected] = useState(templates[0]),
    [subject, setSubject] = useState(meta[templates[0]][0]),
    [body, setBody] = useState(meta[templates[0]][1]),
    [channel, setChannel] = useState("Email"),
    [notice, setNotice] = useState("")
  const pick = (t: string) => {
    setSelected(t)
    setSubject(meta[t][0])
    setBody(meta[t][1])
    setNotice("")
  }
  return (
    <AdminShell
      title="Notifications"
      active="Notifications"
      onNavigate={onNavigate}
    >
      <div>
        <p className="eyebrow">Communication centre</p>
        <h1 className="page-title">Notifications</h1>
        <p className="sub">
          Manage customer messages, staff alerts and delivery performance.
        </p>
      </div>
      <div className="flex gap-7 border-b mt-6 overflow-x-auto">
        {["Customer Templates", "Admin Alerts", "Delivery Logs"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-4 text-xs font-bold whitespace-nowrap border-b-2 ${
              tab === t ? "border-[#C6A15B]" : "border-transparent text-[#888]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "Customer Templates" && (
        <div className="grid xl:grid-cols-[360px_1fr] gap-5 mt-6">
          <aside className="grid sm:grid-cols-2 xl:grid-cols-1 gap-3 content-start">
            {templates.map((t, i) => (
              <button
                onClick={() => pick(t)}
                key={t}
                className={`bg-white border rounded-xl p-4 text-left flex gap-3 ${
                  selected === t ? "border-[#C6A15B] ring-2 ring-[#E9DDBF]" : ""
                }`}
              >
                <span className="w-9 h-9 rounded-lg bg-[#F3E8CF] grid place-items-center">
                  {["✓", "$", "!", "◷", "↻", "□", "→", "↶"][i]}
                </span>
                <span>
                  <b className="block text-sm">{t}</b>
                  <small className="text-[#888]">Email · SMS · WhatsApp</small>
                </span>
                <i className="ml-auto not-italic text-green-700">●</i>
              </button>
            ))}
          </aside>
          <section className="bg-white border rounded-2xl overflow-hidden">
            <header className="p-5 border-b flex justify-between">
              <div>
                <p className="eyebrow">Template editor</p>
                <h2 className="font-serif text-xl font-bold">{selected}</h2>
              </div>
              <span className="pill success">Active</span>
            </header>
            <div className="grid lg:grid-cols-[1fr_300px]">
              <div className="p-5 sm:p-6 space-y-5">
                <label className="form-field">
                  <span>Subject</span>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="admin-input w-full"
                  />
                </label>
                <label className="form-field">
                  <span>Channel</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {["Email", "SMS", "WhatsApp", "In-app"].map((c) => (
                      <button
                        onClick={() => setChannel(c)}
                        key={c}
                        className={
                          channel === c ? "admin-gold" : "admin-outline"
                        }
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </label>
                <label className="form-field">
                  <span>Message body</span>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="admin-input w-full min-h-52 resize-none leading-6"
                  />
                </label>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Variables
                  </span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {[
                      "{{customer_name}}",
                      "{{booking_reference}}",
                      "{{tour_name}}",
                      "{{amount}}",
                      "{{travel_date}}",
                      "{{support_phone}}",
                    ].map((v) => (
                      <button
                        onClick={() => setBody((x) => `${x} ${v}`)}
                        className="bg-[#F4F0E7] rounded-md px-2 py-1 text-[10px] font-mono"
                        key={v}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <aside className="bg-[#F8F4EA] border-l p-5">
                <p className="eyebrow">Live preview</p>
                <div className="bg-white rounded-xl shadow-sm mt-4 overflow-hidden">
                  <div className="bg-black text-white text-center p-4 font-serif font-bold">
                    KOBANI
                  </div>
                  <div className="p-5">
                    <b className="text-sm">
                      {subject.replace("{{booking_reference}}", "KB-20482")}
                    </b>
                    <p className="text-xs text-[#666] leading-5 mt-4">
                      {body
                        .replace("{{customer_name}}", "Olivia")
                        .replace("{{tour_name}}", "Royal Ghana Heritage")
                        .replace("{{amount}}", "$4,850")
                        .replace("{{travel_date}}", "12 Dec 2026")}
                    </p>
                    <button className="bg-[#C6A15B] rounded-lg px-4 py-2 mt-5 text-[10px] font-bold">
                      View Details
                    </button>
                  </div>
                </div>
              </aside>
            </div>
            <footer className="p-5 bg-[#FAF8F3] border-t flex items-center gap-2">
              <span className="text-xs text-green-700">{notice}</span>
              <button
                onClick={() => setNotice("Test sent successfully")}
                className="admin-outline ml-auto"
              >
                Send Test
              </button>
              <button
                onClick={() => setNotice("Template saved")}
                className="admin-gold"
              >
                Save Template
              </button>
            </footer>
          </section>
        </div>
      )}
      {tab === "Admin Alerts" && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
          {[
            [
              "New booking alerts",
              "Notify booking managers when a booking is created",
            ],
            [
              "Payment failure alerts",
              "Notify finance when a payment attempt fails",
            ],
            ["Low stock alerts", "Notify store managers at product thresholds"],
            ["Contribution alerts", "Notify editors about new submissions"],
            ["Refund request alerts", "Notify finance about refund requests"],
            ["System security alerts", "Notify admins about unusual sign-ins"],
          ].map((x) => (
            <div className="bg-white border rounded-2xl p-5" key={x[0]}>
              <div className="flex justify-between">
                <b>{x[0]}</b>
                <input
                  type="checkbox"
                  defaultChecked
                  className="accent-[#C6A15B]"
                />
              </div>
              <p className="text-xs text-[#777] mt-2 leading-5">{x[1]}</p>
              <select className="admin-input w-full mt-4">
                <option>Email + In-app</option>
                <option>Email only</option>
                <option>In-app only</option>
              </select>
            </div>
          ))}
        </div>
      )}
      {tab === "Delivery Logs" && (
        <div className="admin-table-card mt-6">
          <div className="overflow-x-auto">
            <table className="admin-table min-w-[850px]">
              <thead>
                <tr>
                  {["Recipient", "Template", "Channel", "Status", "Sent"].map(
                    (h) => (
                      <th key={h}>{h}</th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {logs.map((r, i) => (
                  <tr key={i}>
                    {r.map((c, j) => (
                      <td key={j}>
                        {j === 3 ? (
                          <span
                            className={`pill ${
                              c === "Delivered"
                                ? "success"
                                : c === "Bounced"
                                  ? "danger"
                                  : "warning"
                            }`}
                          >
                            {c}
                          </span>
                        ) : (
                          c
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminShell>
  )
}
