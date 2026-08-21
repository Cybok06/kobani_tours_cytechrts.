import { useMemo, useState } from "react"
import type { Page } from "./App"
import { AdminShell } from "./AdminProductsPage"
type Status = "Submitted" | "Under Review" | "Revision Requested" | "Approved" | "Rejected"
type Contribution = {
  id: number
  title: string
  author: string
  role: string
  category: string
  date: string
  reviewer: string
  status: Status
}
const seed: Contribution[] = [
  {
    id: 1,
    title: "Echoes of Timbuktu: Libraries of the Desert",
    author: "Dr. Safiya Diallo",
    role: "Historian · Mali",
    category: "History",
    date: "03 Aug 2026",
    reviewer: "Unassigned",
    status: "Submitted",
  },
  {
    id: 2,
    title: "How Community Tourism Protects Gorillas",
    author: "Moses Kato",
    role: "Conservation writer · Uganda",
    category: "Conservation",
    date: "01 Aug 2026",
    reviewer: "Nana A.",
    status: "Under Review",
  },
  {
    id: 3,
    title: "The Living Language of Adinkra Symbols",
    author: "Efua Sarpong",
    role: "Cultural researcher · Ghana",
    category: "Culture",
    date: "29 Jul 2026",
    reviewer: "Ama O.",
    status: "Revision Requested",
  },
  {
    id: 4,
    title: "Flavours of the Swahili Coast",
    author: "Amina Noor",
    role: "Food journalist · Kenya",
    category: "Food",
    date: "26 Jul 2026",
    reviewer: "Kojo B.",
    status: "Approved",
  },
]
export default function AdminContributionsPage({
  onNavigate,
}: {
  onNavigate: (p: Page) => void
}) {
  const [items, setItems] = useState(seed),
    [filter, setFilter] = useState<Status | "All">("Submitted"),
    [selected, setSelected] = useState<Contribution | null>(null),
    [notes, setNotes] = useState("")
  const shown = useMemo(
    () => items.filter((x) => filter === "All" || x.status === filter),
    [items, filter],
  )
  const act = (s: Status) => {
    if (!selected) return
    const next = { ...selected, status: s, reviewer: "Nana A." }
    setItems((xs) => xs.map((x) => (x.id === next.id ? next : x)))
    setSelected(next)
  }
  return (
    <AdminShell
      title="Contributions"
      active="Contributions"
      onNavigate={onNavigate}
    >
      <div>
        <p className="eyebrow">Editorial review</p>
        <h1 className="page-title">Article Contributions</h1>
        <p className="sub">
          Review expert submissions and guide them toward publication.
        </p>
      </div>
      <div className="flex gap-2 overflow-x-auto my-6">
        {([
          "All",
          "Submitted",
          "Under Review",
          "Revision Requested",
          "Approved",
          "Rejected",
        ] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={filter === t ? "admin-gold" : "admin-outline"}
          >
            {t}{" "}
            <span className="opacity-60 ml-1">
              {t === "All"
                ? items.length
                : items.filter((x) => x.status === t).length}
            </span>
          </button>
        ))}
      </div>
      <div className="admin-table-card">
        <div className="overflow-x-auto">
          <table className="admin-table min-w-[1000px]">
            <thead>
              <tr>
                {[
                  "Title",
                  "Author",
                  "Category",
                  "Submitted Date",
                  "Reviewer",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((c) => (
                <tr key={c.id}>
                  <td>
                    <b>{c.title}</b>
                  </td>
                  <td>
                    <b>{c.author}</b>
                    <small className="block text-[#888]">{c.role}</small>
                  </td>
                  <td>
                    <span className="pill neutral">{c.category}</span>
                  </td>
                  <td>{c.date}</td>
                  <td>{c.reviewer}</td>
                  <td>
                    <span
                      className={`pill ${
                        c.status === "Approved"
                          ? "success"
                          : c.status === "Revision Requested"
                            ? "warning"
                            : c.status === "Rejected"
                              ? "danger"
                              : "neutral"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        setSelected(c)
                        setNotes("")
                      }}
                      className="admin-outline !py-2 !px-3"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selected && (
        <div
          className="fixed inset-0 z-[80] bg-black/60 flex justify-end"
          onMouseDown={() => setSelected(null)}
        >
          <section
            className="bg-[#F8F4EA] h-full w-full max-w-4xl overflow-y-auto shadow-2xl"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <header className="sticky top-0 z-10 bg-white border-b px-5 sm:px-8 py-5 flex justify-between items-center">
              <div>
                <p className="eyebrow">Review workspace</p>
                <h2 className="font-serif text-xl sm:text-2xl font-bold">
                  {selected.title}
                </h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-10 h-10 rounded-full bg-[#F3EFE7]"
              >
                ×
              </button>
            </header>
            <div className="p-5 sm:p-8 grid lg:grid-cols-[1fr_280px] gap-6">
              <article className="bg-white border rounded-2xl p-6 sm:p-8">
                <span className="pill neutral">{selected.category}</span>
                <h1 className="font-serif text-3xl mt-5 mb-2">
                  {selected.title}
                </h1>
                <p className="text-[#888] text-sm mb-7">
                  Submitted by {selected.author} · {selected.date}
                </p>
                <div className="space-y-5 text-[#49453E] leading-8">
                  <p>
                    Across the warm sands of the Sahel, manuscripts preserved by
                    generations of families tell a richer story of scholarship,
                    commerce and culture than many travellers expect.
                  </p>
                  <h3 className="font-serif text-xl font-bold text-black">
                    A tradition of knowledge
                  </h3>
                  <p>
                    These collections reveal centuries of exchange between
                    astronomers, jurists, poets and merchants. Today, local
                    custodians are combining careful conservation with digital
                    archives to protect this inheritance.
                  </p>
                  <blockquote className="border-l-4 border-[#C6A15B] bg-[#F8F4EA] p-5 italic">
                    “Every page is both a family memory and a piece of world
                    history.”
                  </blockquote>
                  <h3 className="font-serif text-xl font-bold text-black">
                    Responsible cultural travel
                  </h3>
                  <p>
                    Visitors can support preservation by choosing community-led
                    tours, respecting photography guidance and contributing
                    directly to conservation programmes.
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t">
                  <h3 className="font-bold mb-3">References</h3>
                  <ol className="text-sm text-[#666] space-y-2 list-decimal pl-5">
                    <li>UNESCO — Timbuktu Manuscripts Programme</li>
                    <li>Ahmed Baba Institute archival collection</li>
                    <li>
                      Interview with local manuscript custodian, July 2026
                    </li>
                  </ol>
                </div>
              </article>
              <aside className="space-y-5">
                <div className="bg-white border rounded-2xl p-5">
                  <p className="eyebrow">Author information</p>
                  <div className="w-12 h-12 rounded-full bg-[#C6A15B] grid place-items-center font-bold my-3">
                    SD
                  </div>
                  <b>{selected.author}</b>
                  <small className="block text-[#777] mt-1">
                    {selected.role}
                  </small>
                  <p className="text-xs text-[#777] mt-4 leading-5">
                    Verified contributor specialising in African cultural
                    history and archival preservation.
                  </p>
                </div>
                <div className="bg-white border rounded-2xl p-5">
                  <label className="form-field">
                    <span>Editorial notes</span>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="admin-input min-h-32 w-full resize-none"
                      placeholder="Add private review notes..."
                    />
                  </label>
                  <small className="text-[#999]">
                    Only editors can see these notes.
                  </small>
                </div>
                <div className="bg-white border rounded-2xl p-4 space-y-2">
                  <button
                    onClick={() => act("Approved")}
                    className="admin-gold w-full justify-center"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => act("Revision Requested")}
                    className="admin-outline w-full justify-center"
                  >
                    ↩ Request Revision
                  </button>
                  <button
                    onClick={() => act("Rejected")}
                    className="admin-outline w-full justify-center text-red-700"
                  >
                    × Reject
                  </button>
                  <button
                    onClick={() => act("Approved")}
                    className="w-full bg-black text-white rounded-lg px-4 py-3 text-xs font-bold"
                  >
                    Publish Article
                  </button>
                </div>
              </aside>
            </div>
          </section>
        </div>
      )}
    </AdminShell>
  )
}
