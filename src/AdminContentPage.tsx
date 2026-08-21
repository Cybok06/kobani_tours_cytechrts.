import { useState } from "react"
import type { Page } from "./App"
import { AdminShell } from "./AdminProductsPage"
const sections = [
  [
    "Homepage Hero",
    "Main headline, introductory copy and background media",
    "Your journey through Africa begins here",
    "Image + copy",
  ],
  [
    "Featured Tours",
    "Choose and order tours featured on the homepage",
    "6 tours selected",
    "Collection",
  ],
  [
    "About Preview",
    "Short brand introduction and About page link",
    "Discover the KOBANI difference",
    "Image + copy",
  ],
  [
    "Statistics",
    "Website trust and achievement counters",
    "4 statistics active",
    "Counters",
  ],
  [
    "Testimonials",
    "Curate guest stories shown throughout the website",
    "8 testimonials published",
    "Collection",
  ],
  [
    "Payment Methods",
    "Accepted payment providers and checkout messaging",
    "Visa, Mastercard, PayPal, Apple Pay",
    "Settings",
  ],
  [
    "Contact Information",
    "Office, phone, email and WhatsApp details",
    "Amasaman office · 4 contact methods",
    "Details",
  ],
  [
    "Social Links",
    "Links to KOBANI social channels",
    "5 channels connected",
    "Links",
  ],
  [
    "Footer",
    "Footer navigation, newsletter text and copyright",
    "Updated 20 Jul 2026",
    "Navigation",
  ],
  [
    "Legal Pages",
    "Privacy, terms, cookies and booking conditions",
    "4 pages published",
    "Pages",
  ],
]
export default function AdminContentPage({
  onNavigate,
}: {
  onNavigate: (p: Page) => void
}) {
  const [editing, setEditing] = useState<string | null>(null),
    [history, setHistory] = useState(false),
    [saved, setSaved] = useState("All changes saved"),
    [copy, setCopy] = useState("")
  const edit = (name: string, value: string) => {
    setEditing(name)
    setCopy(value)
  }
  const save = () => {
    setEditing(null)
    setSaved("Draft saved just now")
  }
  const publish = () => setSaved("Published just now")
  return (
    <AdminShell
      title="Website Content"
      active="Website Content"
      onNavigate={onNavigate}
    >
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Content management</p>
          <h1 className="page-title">Website Content</h1>
          <p className="sub">
            Manage public-facing content without changing the site structure.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setHistory(true)} className="admin-outline">
            ↶ Version History
          </button>
          <button onClick={() => onNavigate("home")} className="admin-outline">
            ◉ Preview
          </button>
          <button onClick={save} className="admin-outline">
            Save Draft
          </button>
          <button onClick={publish} className="admin-gold">
            Publish Changes
          </button>
        </div>
      </div>
      <div className="mt-5 bg-white border rounded-xl px-4 py-3 flex gap-3 items-center text-xs">
        <span className="w-2 h-2 rounded-full bg-green-600" />
        <b>{saved}</b>
        <span className="text-[#999] ml-auto">
          Last published by Nana A. · 02 Aug 2026, 14:32
        </span>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">
        {sections.map((s, i) => (
          <article
            key={s[0]}
            className="bg-white border border-[#E5DDCE] rounded-2xl p-5 hover:shadow-lg transition"
          >
            <div className="flex justify-between">
              <span className="w-10 h-10 rounded-xl bg-[#F3E7C9] text-[#9A7737] grid place-items-center font-serif font-bold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="pill success">Published</span>
            </div>
            <h2 className="font-serif text-xl font-bold mt-5">{s[0]}</h2>
            <p className="text-xs text-[#777] leading-5 mt-2 min-h-10">
              {s[1]}
            </p>
            <div className="bg-[#FAF8F3] rounded-xl p-3 my-4">
              <small className="block uppercase tracking-wider text-[#A39A89] text-[8px] mb-1">
                Current content
              </small>
              <b className="text-xs">{s[2]}</b>
            </div>
            <div className="flex justify-between items-center border-t pt-4">
              <span className="text-[9px] text-[#999] uppercase tracking-wider">
                {s[3]}
              </span>
              <button
                onClick={() => edit(s[0], s[2])}
                className="admin-outline !py-2 !px-3"
              >
                Edit Section
              </button>
            </div>
          </article>
        ))}
      </div>
      {editing && (
        <div
          className="fixed inset-0 z-[80] bg-black/55 flex justify-end"
          onMouseDown={() => setEditing(null)}
        >
          <div
            className="bg-white h-full w-full max-w-xl overflow-y-auto"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <header className="p-6 border-b flex justify-between">
              <div>
                <p className="eyebrow">Edit section</p>
                <h2 className="font-serif text-2xl font-bold">{editing}</h2>
              </div>
              <button onClick={() => setEditing(null)}>×</button>
            </header>
            <div className="p-6 space-y-5">
              <label className="form-field">
                <span>Section heading</span>
                <input className="admin-input w-full" defaultValue={editing} />
              </label>
              <label className="form-field">
                <span>Content</span>
                <textarea
                  value={copy}
                  onChange={(e) => setCopy(e.target.value)}
                  className="admin-input w-full min-h-40 resize-none"
                />
              </label>
              <label className="form-field">
                <span>Call-to-action label</span>
                <input
                  className="admin-input w-full"
                  placeholder="Explore more"
                />
              </label>
              <div className="border-2 border-dashed rounded-xl p-8 text-center text-xs text-[#777]">
                ＋ Replace section image or media
              </div>
              <label className="flex gap-3 text-xs">
                <input type="checkbox" defaultChecked /> Display this section on
                the live website
              </label>
            </div>
            <footer className="sticky bottom-0 p-5 bg-[#FAF8F3] border-t flex justify-end gap-2">
              <button
                onClick={() => setEditing(null)}
                className="admin-outline"
              >
                Cancel
              </button>
              <button onClick={save} className="admin-gold">
                Save Section
              </button>
            </footer>
          </div>
        </div>
      )}
      {history && (
        <div
          className="fixed inset-0 z-[80] bg-black/55 flex justify-end"
          onMouseDown={() => setHistory(false)}
        >
          <aside
            className="bg-white h-full w-full max-w-md p-6 overflow-y-auto"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between">
              <div>
                <p className="eyebrow">Audit trail</p>
                <h2 className="font-serif text-2xl font-bold">
                  Version History
                </h2>
              </div>
              <button onClick={() => setHistory(false)}>×</button>
            </div>
            <div className="mt-8 space-y-3">
              {[
                [
                  "Version 48",
                  "Current · Published",
                  "02 Aug 2026, 14:32",
                  "Nana A.",
                ],
                [
                  "Version 47",
                  "Homepage hero updated",
                  "31 Jul 2026, 10:18",
                  "Ama O.",
                ],
                [
                  "Version 46",
                  "Contact details updated",
                  "26 Jul 2026, 16:05",
                  "Kojo B.",
                ],
                [
                  "Version 45",
                  "Footer links updated",
                  "20 Jul 2026, 09:41",
                  "Nana A.",
                ],
              ].map((v, i) => (
                <div className="border rounded-xl p-4" key={v[0]}>
                  <div className="flex justify-between">
                    <b>{v[0]}</b>
                    {i > 0 && (
                      <button className="text-[10px] text-[#987437] font-bold">
                        Restore
                      </button>
                    )}
                  </div>
                  <p className="text-xs mt-1">{v[1]}</p>
                  <small className="text-[#999]">
                    {v[2]} · {v[3]}
                  </small>
                </div>
              ))}
            </div>
          </aside>
        </div>
      )}
    </AdminShell>
  )
}
