import { useMemo, useState } from "react"
import type { Page } from "./App"
import { AdminShell } from "./AdminProductsPage"
type State = "Pending" | "Approved" | "Featured" | "Hidden"
type Review = {
  id: number
  name: string
  initials: string
  tour: string
  rating: number
  text: string
  date: string
  status: State
  location: string
}
const seed: Review[] = [
  {
    id: 1,
    name: "Amelia Hart",
    initials: "AH",
    tour: "Royal Ghana Heritage Journey",
    rating: 5,
    text: "An unforgettable journey. Every detail felt thoughtful, personal and deeply connected to Ghanaian history.",
    date: "03 Aug 2026",
    status: "Pending",
    location: "London, UK",
  },
  {
    id: 2,
    name: "Kwame Arthur",
    initials: "KA",
    tour: "Serengeti Luxury Safari",
    rating: 5,
    text: "The guides were exceptional and the camps exceeded every expectation. KOBANI made the whole experience effortless.",
    date: "31 Jul 2026",
    status: "Approved",
    location: "Accra, Ghana",
  },
  {
    id: 3,
    name: "Sofia Rossi",
    initials: "SR",
    tour: "Morocco Imperial Cities",
    rating: 4,
    text: "Beautiful riads, excellent food and a wonderful private guide. I would happily travel with KOBANI again.",
    date: "28 Jul 2026",
    status: "Featured",
    location: "Milan, Italy",
  },
  {
    id: 4,
    name: "Daniel Kim",
    initials: "DK",
    tour: "Cape Town & Winelands",
    rating: 3,
    text: "The itinerary was strong, although one transfer was delayed. The support team resolved it quickly.",
    date: "25 Jul 2026",
    status: "Pending",
    location: "Toronto, Canada",
  },
  {
    id: 5,
    name: "Aisha Bello",
    initials: "AB",
    tour: "Zanzibar Coastal Escape",
    rating: 5,
    text: "A gorgeous trip from beginning to end. The hotel selection was perfect.",
    date: "20 Jul 2026",
    status: "Hidden",
    location: "Lagos, Nigeria",
  },
]
export default function AdminReviewsPage({
  onNavigate,
}: {
  onNavigate: (p: Page) => void
}) {
  const [items, setItems] = useState(seed),
    [tab, setTab] = useState<State>("Pending"),
    [selected, setSelected] = useState<Review | null>(null),
    [reply, setReply] = useState("")
  const shown = useMemo(
    () => items.filter((x) => x.status === tab),
    [items, tab],
  )
  const act = (s: State) => {
    if (!selected) return
    const next = { ...selected, status: s }
    setItems((xs) => xs.map((x) => (x.id === next.id ? next : x)))
    setSelected(next)
    setTab(s)
  }
  const remove = () => {
    if (!selected) return
    setItems((xs) => xs.filter((x) => x.id !== selected.id))
    setSelected(null)
  }
  return (
    <AdminShell
      title="Reviews & Testimonials"
      active="Testimonials"
      onNavigate={onNavigate}
    >
      <div>
        <p className="eyebrow">Guest experience</p>
        <h1 className="page-title">Reviews & Testimonials</h1>
        <p className="sub">
          Moderate guest feedback and curate stories for the website.
        </p>
      </div>
      <div className="bg-white border border-[#E7DFD1] rounded-2xl mt-6 overflow-hidden">
        <div className="px-5 pt-4 border-b flex gap-7 overflow-x-auto">
          {(["Pending", "Approved", "Featured", "Hidden"] as State[]).map(
            (t) => (
              <button
                onClick={() => setTab(t)}
                key={t}
                className={`pb-4 text-xs font-bold whitespace-nowrap border-b-2 ${
                  tab === t
                    ? "border-[#C6A15B] text-black"
                    : "border-transparent text-[#888]"
                }`}
              >
                {t}
                <span className="ml-2 bg-[#F3EFE7] px-2 py-1 rounded-full text-[9px]">
                  {items.filter((x) => x.status === t).length}
                </span>
              </button>
            ),
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="admin-table min-w-[1100px]">
            <thead>
              <tr>
                {[
                  "Customer",
                  "Tour",
                  "Rating",
                  "Review",
                  "Date",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full bg-[#EEE2C6] grid place-items-center font-bold text-xs">
                        {r.initials}
                      </span>
                      <div>
                        <b>{r.name}</b>
                        <small className="block text-[#999]">
                          {r.location}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <b>{r.tour}</b>
                  </td>
                  <td>
                    <span className="text-[#C6912D] tracking-wider">
                      {"★".repeat(r.rating)}
                    </span>
                    <small className="block">{r.rating}.0</small>
                  </td>
                  <td>
                    <p className="max-w-72 line-clamp-2 text-[#666]">
                      {r.text}
                    </p>
                  </td>
                  <td>{r.date}</td>
                  <td>
                    <span
                      className={`pill ${
                        r.status === "Approved"
                          ? "success"
                          : r.status === "Pending"
                            ? "warning"
                            : "neutral"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        setSelected(r)
                        setReply("")
                      }}
                      className="admin-outline !py-2 !px-3"
                    >
                      Preview
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!shown.length && (
          <div className="py-20 text-center text-[#888]">
            No {tab.toLowerCase()} reviews.
          </div>
        )}
      </div>
      {selected && (
        <div
          className="fixed inset-0 z-[80] bg-black/60 p-4 grid place-items-center"
          onMouseDown={() => setSelected(null)}
        >
          <div
            className="bg-white w-full max-w-2xl max-h-[94vh] overflow-y-auto rounded-2xl"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <header className="p-6 border-b flex justify-between">
              <div>
                <p className="eyebrow">Review preview</p>
                <h2 className="font-serif text-2xl font-bold">Guest Review</h2>
              </div>
              <button onClick={() => setSelected(null)}>×</button>
            </header>
            <div className="p-6 sm:p-8">
              <div className="flex gap-4">
                <span className="w-14 h-14 rounded-full bg-[#C6A15B] grid place-items-center font-bold">
                  {selected.initials}
                </span>
                <div>
                  <h3 className="font-bold text-lg">{selected.name}</h3>
                  <p className="text-xs text-[#888]">
                    {selected.location} · {selected.date}
                  </p>
                  <div className="text-[#C6912D] mt-1">
                    {"★".repeat(selected.rating)}
                  </div>
                </div>
              </div>
              <blockquote className="font-serif text-xl sm:text-2xl leading-9 my-7">
                “{selected.text}”
              </blockquote>
              <div className="bg-[#F8F4EA] rounded-xl p-4 text-sm">
                <small className="uppercase tracking-wider text-[#999]">
                  Tour reviewed
                </small>
                <b className="block mt-1">{selected.tour}</b>
              </div>
              <label className="form-field mt-6">
                <span>Public response</span>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  className="admin-input w-full min-h-28 resize-none"
                  placeholder={`Reply to ${selected.name}...`}
                />
              </label>
              {reply && (
                <button className="admin-outline mt-2">Send Response</button>
              )}
            </div>
            <footer className="p-5 border-t bg-[#FAF8F3] flex flex-wrap gap-2">
              <button onClick={() => act("Approved")} className="admin-gold">
                ✓ Approve
              </button>
              <button onClick={() => act("Featured")} className="admin-outline">
                ★ Feature
              </button>
              <button onClick={() => act("Hidden")} className="admin-outline">
                ◌ Hide
              </button>
              <button
                onClick={remove}
                className="admin-outline text-red-700 ml-auto"
              >
                Delete
              </button>
            </footer>
          </div>
        </div>
      )}
    </AdminShell>
  )
}
