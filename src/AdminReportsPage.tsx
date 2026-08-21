import { useState } from "react"
import type { Page } from "./App"
import { AdminShell } from "./AdminProductsPage"
const reports = [
  [
    "Revenue Report",
    "Income across tours and the African Market",
    "$",
    "#C6A15B",
  ],
  ["Booking Report", "Booking volume, status and conversion", "▣", "#356A9A"],
  ["Tour Performance", "Capacity, demand and revenue by tour", "↗", "#27855C"],
  [
    "Customer Report",
    "Acquisition, retention and lifetime value",
    "♙",
    "#7B5EA7",
  ],
  ["Product Sales", "Units, revenue and best-selling products", "◇", "#C47B3B"],
  ["Inventory", "Stock value, movement and shortages", "□", "#577E70"],
  [
    "Payment Reconciliation",
    "Gateway settlements, fees and exceptions",
    "≡",
    "#4E6C8B",
  ],
  ["Refund Report", "Requests, reasons and refund values", "↶", "#C85A5A"],
  [
    "Website Traffic",
    "Visitors, channels and geographic reach",
    "◎",
    "#8C6B48",
  ],
]
const rows = [
  ["Jan 2026", "Ghana Heritage", "Tours", "42", "$86,420", "$2,058"],
  ["Feb 2026", "Serengeti Safari", "Tours", "36", "$92,160", "$2,560"],
  ["Mar 2026", "African Market", "Products", "684", "$48,260", "$71"],
  ["Apr 2026", "Morocco Imperial", "Tours", "28", "$74,480", "$2,660"],
  ["May 2026", "Cape Town & Winelands", "Tours", "31", "$68,820", "$2,220"],
]
export default function AdminReportsPage({
  onNavigate,
}: {
  onNavigate: (p: Page) => void
}) {
  const [selected, setSelected] = useState("Revenue Report"),
    [generated, setGenerated] = useState("Generated just now")
  const download = (type: string) => {
    const a = document.createElement("a")
    a.href = URL.createObjectURL(
      new Blob(
        [
          `${selected}\nGenerated: ${new Date().toISOString()}\nTotal Revenue,$370140`,
        ],
        { type: "text/plain" },
      ),
    )
    a.download = `kobani-${selected.toLowerCase().replaceAll(" ", "-")}.${type}`
    a.click()
  }
  return (
    <AdminShell title="Reports" active="Reports" onNavigate={onNavigate}>
      <div>
        <p className="eyebrow">Business intelligence</p>
        <h1 className="page-title">Reports</h1>
        <p className="sub">Build, preview and export decision-ready reports.</p>
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
        {reports.map((r) => (
          <button
            onClick={() => setSelected(r[0])}
            key={r[0]}
            className={`text-left bg-white rounded-2xl border p-5 transition ${
              selected === r[0]
                ? "border-[#C6A15B] ring-2 ring-[#E8D9B7]"
                : "border-[#E4DCCE] hover:-translate-y-1"
            }`}
          >
            <div className="flex items-start gap-4">
              <span
                className="w-11 h-11 rounded-xl grid place-items-center text-lg"
                style={{ background: `${r[3]}18`, color: r[3] }}
              >
                {r[2]}
              </span>
              <div>
                <h2 className="font-serif text-lg font-bold">{r[0]}</h2>
                <p className="text-xs text-[#777] mt-1 leading-5">{r[1]}</p>
              </div>
              <span className="ml-auto">→</span>
            </div>
          </button>
        ))}
      </div>
      <section className="bg-white border border-[#E4DCCE] rounded-2xl mt-7 overflow-hidden">
        <header className="p-5 sm:p-6 border-b flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Report builder</p>
            <h2 className="font-serif text-2xl font-bold">{selected}</h2>
          </div>
          <span className="text-xs text-[#888]">{generated}</span>
        </header>
        <div className="p-5 sm:p-6 grid sm:grid-cols-2 lg:grid-cols-5 gap-4 bg-[#FAF8F3]">
          <label className="form-field">
            <span>Date range</span>
            <select className="admin-input w-full">
              <option>01 Jan – 04 Aug 2026</option>
              <option>This month</option>
              <option>Last quarter</option>
            </select>
          </label>
          <label className="form-field">
            <span>Currency</span>
            <select className="admin-input w-full">
              <option>USD</option>
              <option>GHS</option>
              <option>EUR</option>
            </select>
          </label>
          <label className="form-field">
            <span>Tour</span>
            <select className="admin-input w-full">
              <option>All tours</option>
              <option>Ghana Heritage</option>
              <option>Serengeti Safari</option>
            </select>
          </label>
          <label className="form-field">
            <span>Category</span>
            <select className="admin-input w-full">
              <option>All categories</option>
              <option>Tours</option>
              <option>Products</option>
            </select>
          </label>
          <label className="form-field">
            <span>Status</span>
            <select className="admin-input w-full">
              <option>All statuses</option>
              <option>Confirmed</option>
              <option>Completed</option>
            </select>
          </label>
          <button
            onClick={() => setGenerated("Generated just now")}
            className="admin-gold sm:col-span-2 lg:col-span-5 justify-center"
          >
            Generate Report
          </button>
        </div>
        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Report preview</p>
              <h3 className="font-serif text-xl font-bold">
                Revenue performance
              </h3>
              <p className="text-xs text-[#888]">
                Monthly income by business category
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => download("pdf")} className="admin-outline">
                ⇩ Export PDF
              </button>
              <button
                onClick={() => download("xlsx")}
                className="admin-outline"
              >
                ⇩ Export Excel
              </button>
              <button onClick={() => window.print()} className="admin-outline">
                ⌑ Print
              </button>
            </div>
          </div>
          <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6 mt-6">
            <div>
              <div className="h-64 border-b border-l border-[#DDD4C4] flex items-end gap-3 px-4 pt-8">
                {[42, 55, 48, 68, 62, 76, 72, 88, 79, 92, 84, 96].map(
                  (h, i) => (
                    <div
                      className="flex-1 h-full flex items-end gap-0.5"
                      key={i}
                    >
                      <i
                        className="w-1/2 bg-[#C6A15B] rounded-t"
                        style={{ height: `${h}%` }}
                      />
                      <i
                        className="w-1/2 bg-[#171717] rounded-t"
                        style={{ height: `${h * 0.38}%` }}
                      />
                    </div>
                  ),
                )}
              </div>
              <div className="flex justify-between mt-3 text-[8px] text-[#999]">
                {"JAN FEB MAR APR MAY JUN JUL AUG SEP OCT NOV DEC"
                  .split(" ")
                  .map((x) => (
                    <span key={x}>{x}</span>
                  ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 content-start">
              {[
                ["Gross Revenue", "$370,140"],
                ["Net Revenue", "$344,210"],
                ["Transactions", "821"],
                ["Avg. Value", "$450.84"],
              ].map((x) => (
                <div className="bg-[#FAF8F3] rounded-xl p-4" key={x[0]}>
                  <small className="text-[#888]">{x[0]}</small>
                  <b className="block font-serif text-xl mt-1">{x[1]}</b>
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto mt-7 border rounded-xl">
            <table className="admin-table min-w-[800px]">
              <thead>
                <tr>
                  {[
                    "Period",
                    "Revenue Source",
                    "Category",
                    "Transactions",
                    "Revenue",
                    "Average Value",
                  ].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    {r.map((c, j) => (
                      <td key={j} className={j === 4 ? "font-bold" : ""}>
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </AdminShell>
  )
}
