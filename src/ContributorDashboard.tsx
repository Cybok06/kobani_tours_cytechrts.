import { useState } from "react"
import type { Page } from "./App"

type N = "grid" | "file" | "plus" | "message" | "user" | "logout" | "menu" | "close" | "bell" | "edit" | "clock" | "alert" | "check" | "eye" | "arrow" | "book" | "calendar" | "chevron"
const Icon = ({ n, s = 17 }: { n: N; s?: number }) => {
  const p = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </>
    ),
    file: (
      <>
        <path d="M5 3h10l4 4v14H5zM15 3v5h4M8 13h8M8 17h6" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    message: (
      <>
        <path d="M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4z" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="7" r="4" />
        <path d="M4 21v-2a8 8 0 0116 0v2" />
      </>
    ),
    logout: (
      <>
        <path d="M10 17l5-5-5-5M15 12H3M14 3h7v18h-7" />
      </>
    ),
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="M6 6l12 12M18 6L6 18" />,
    bell: (
      <>
        <path d="M18 8a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
      </>
    ),
    edit: (
      <>
        <path d="M12 20h9M16.5 3.5a2 2 0 013 3L8 18l-4 1 1-4z" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    alert: (
      <>
        <path d="M12 3L2 21h20L12 3z" />
        <path d="M12 9v5M12 18h.01" />
      </>
    ),
    check: <path d="M5 12l4 4L19 6" />,
    eye: (
      <>
        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="M12 5l7 7-7 7" />
      </>
    ),
    book: (
      <>
        <path d="M4 4h7a3 3 0 013 3v13a3 3 0 00-3-3H4z" />
        <path d="M20 4h-3a3 3 0 00-3 3v13a3 3 0 013-3h3z" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    chevron: <path d="M9 6l6 6-6 6" />,
  }
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {p[n]}
    </svg>
  )
}
const nav = [
  ["Overview", "grid"],
  ["My Articles", "file"],
  ["Create Article", "plus"],
  ["Messages", "message"],
  ["Profile", "user"],
] as [string, N][]
const metrics = [
  ["Drafts", "3", "2 updated this week", "edit", "#6F6B63"],
  ["Under Review", "2", "Average review: 5 days", "clock", "#D59A32"],
  ["Revision Requested", "1", "Response due 08 Aug", "alert", "#C84A4A"],
  ["Published", "12", "48.6k total reads", "check", "#27855C"],
] as [string, string, string, N, string][]
const submissions = [
  {
    title: "The Women Who Weave Ghana’s Royal Kente",
    category: "Culture",
    date: "02 Aug 2026",
    status: "Under Review",
    views: "—",
    updated: "2 days ago",
  },
  {
    title: "A Food Lover’s Guide to Night Markets in Accra",
    category: "Food",
    date: "28 Jul 2026",
    status: "Revision Requested",
    views: "—",
    updated: "Yesterday",
  },
  {
    title: "Beyond the Safari: Community Tourism in Tanzania",
    category: "Responsible Travel",
    date: "16 Jul 2026",
    status: "Published",
    views: "8,420",
    updated: "19 Jul 2026",
  },
  {
    title: "Five Quiet Islands Off Africa’s Indian Ocean Coast",
    category: "Destinations",
    date: "05 Jul 2026",
    status: "Published",
    views: "12,180",
    updated: "09 Jul 2026",
  },
  {
    title: "The Sound of Dakar After Dark",
    category: "Culture",
    date: "01 Aug 2026",
    status: "Draft",
    views: "—",
    updated: "4 hours ago",
  },
]
const statusColor: Record<string, string> = {
  "Under Review": "#D59A32",
  "Revision Requested": "#C84A4A",
  Published: "#27855C",
  Draft: "#6F6B63",
}

export default function ContributorDashboard({
  onNavigate,
}: {
  onNavigate: (p: Page) => void
}) {
  const [active, setActive] = useState("Overview"),
    [menu, setMenu] = useState(false)
  const Sidebar = () => (
    <aside className="h-full bg-[#11110F] text-white flex flex-col">
      <button
        onClick={() => onNavigate("home")}
        className="h-20 px-6 flex items-center gap-3 border-b border-white/10"
      >
        <span className="w-9 h-9 rounded-full bg-[#C6A15B] text-black grid place-items-center font-black">
          K
        </span>
        <span>
          <b className="font-serif text-lg tracking-wide">KOBANI</b>
          <small className="block text-[8px] uppercase tracking-[.18em] text-[#777]">
            Contributor Studio
          </small>
        </span>
      </button>
      <div className="px-5 pt-5 pb-3">
        <p className="text-[8px] uppercase tracking-[.18em] text-[#555]">
          Workspace
        </p>
      </div>
      <nav className="flex-1 px-3">
        {nav.map(([x, i]) => (
          <button
            key={x}
            onClick={() => {
              setActive(x)
              setMenu(false)
            if (x === "Create Article") onNavigate("contributor-editor")
            }}
            className="relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs mb-1"
            style={{
              background: active === x ? "rgba(198,161,91,.13)" : "transparent",
              color: active === x ? "#E9D6A8" : "#999",
            }}
          >
            {active === x && (
              <i className="absolute left-0 w-0.5 h-5 bg-[#C6A15B]" />
            )}
            <Icon n={i} />
            {x}
            {x === "Messages" && (
              <span className="ml-auto w-5 h-5 rounded-full bg-[#C6A15B] text-black grid place-items-center text-[9px] font-bold">
                2
              </span>
            )}
          </button>
        ))}
      </nav>
      <div className="m-3 p-4 rounded-xl bg-white/5 border border-white/10">
        <p className="text-[9px] text-[#777]">Contributor level</p>
        <b className="text-xs text-[#E9D6A8] block mt-1">Silver Storyteller</b>
        <div className="h-1 rounded-full bg-white/10 mt-3">
          <div className="h-full w-[68%] rounded-full bg-[#C6A15B]" />
        </div>
        <p className="text-[8px] text-[#666] mt-2">4 more articles to Gold</p>
      </div>
      <button
        onClick={() => onNavigate("home")}
        className="m-3 px-4 py-3 flex gap-3 text-xs text-[#999] border-t border-white/10"
      >
        <Icon n="logout" />
        Sign out
      </button>
    </aside>
  )
  return (
    <div className="min-h-screen bg-[#F8F4EA] flex text-[#0B0B0B]">
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64">
        <Sidebar />
      </div>
      {menu && (
        <>
          <button
            onClick={() => setMenu(false)}
            className="fixed inset-0 z-40 bg-black/45 lg:hidden"
          />
          <div className="fixed inset-y-0 left-0 z-50 w-72">
            <Sidebar />
            <button
              onClick={() => setMenu(false)}
              className="absolute top-5 right-4 text-white"
            >
              <Icon n="close" />
            </button>
          </div>
        </>
      )}
      <div className="flex-1 min-w-0 lg:ml-64">
        <header className="h-20 bg-white border-b border-[#E6DFD2] px-4 sm:px-7 flex items-center gap-4 sticky top-0 z-30">
          <button
            onClick={() => setMenu(true)}
            className="lg:hidden w-10 h-10 rounded-xl border grid place-items-center"
          >
            <Icon n="menu" />
          </button>
          <div>
            <h1 className="font-serif font-bold text-xl">
              Contributor Dashboard
            </h1>
            <p className="hidden sm:block text-[10px] text-[#9A9590]">
              Create stories that connect readers with Africa.
            </p>
          </div>
          <div className="ml-auto flex gap-3 items-center">
            <button className="relative w-10 h-10 rounded-xl border border-[#E6DFD2] grid place-items-center">
              <Icon n="bell" />
              <i className="absolute top-2 right-2 w-2 h-2 bg-[#C84A4A] rounded-full" />
            </button>
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&auto=format"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
        </header>
        <main className="p-4 sm:p-7 max-w-[1350px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[.18em] font-bold text-[#C6A15B]">
                Tuesday, 4 August 2026
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-1">
                Welcome back, Ama
              </h2>
              <p className="text-xs text-[#6F6B63] mt-1">
                You have one revision request waiting for your attention.
              </p>
            </div>
            <button
            onClick={() => onNavigate("contributor-editor")}
              className="self-start px-5 py-3 rounded-xl bg-[#C6A15B] text-xs font-bold flex items-center gap-2"
            >
              <Icon n="plus" s={14} />
              Create Article
            </button>
          </div>
          <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
            {metrics.map((m) => (
              <article
                key={m[0]}
                className="rounded-2xl bg-white border border-[#E6DFD2] p-5"
              >
                <div className="flex justify-between">
                  <span
                    className="w-10 h-10 rounded-xl grid place-items-center"
                    style={{ background: `${m[4]}15`, color: m[4] }}
                  >
                    <Icon n={m[3]} />
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-[#9A9590]">
                    {m[0]}
                  </span>
                </div>
                <b className="font-serif text-3xl block mt-4">{m[1]}</b>
                <p className="text-[10px] text-[#9A9590] mt-1">{m[2]}</p>
              </article>
            ))}
          </section>
          <div className="grid xl:grid-cols-[1.5fr_.72fr] gap-5 mt-5 items-start">
            <section className="rounded-2xl bg-white border border-[#E6DFD2] overflow-hidden">
              <div className="p-5 flex justify-between items-center border-b border-[#F0EBE0]">
                <div>
                  <h3 className="font-serif font-bold text-lg">
                    Recent submissions
                  </h3>
                  <p className="text-[9px] text-[#9A9590] mt-1">
                    Your latest drafts and editorial decisions.
                  </p>
                </div>
                <button className="text-[10px] font-bold text-[#C6A15B]">
                  View all articles
                </button>
              </div>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full min-w-[720px] text-left">
                  <thead className="bg-[#FFFDF8] text-[9px] uppercase tracking-wider text-[#9A9590]">
                    <tr>
                      {[
                        "Article",
                        "Category",
                        "Submitted",
                        "Status",
                        "Views",
                        "",
                      ].map((x) => (
                        <th key={x} className="px-5 py-3 font-semibold">
                          {x}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((s) => (
                      <tr
                        key={s.title}
                        className="border-t border-[#F2EEE7] text-xs"
                      >
                        <td className="px-5 py-4 max-w-[260px]">
                          <b className="block truncate">{s.title}</b>
                          <small className="text-[9px] text-[#9A9590]">
                            Updated {s.updated}
                          </small>
                        </td>
                        <td className="px-5 py-4 text-[#6F6B63]">
                          {s.category}
                        </td>
                        <td className="px-5 py-4 text-[#6F6B63]">{s.date}</td>
                        <td className="px-5 py-4">
                          <span
                            className="px-2 py-1 rounded-full text-[9px] font-bold"
                            style={{
                              background: `${statusColor[s.status]}15`,
                              color: statusColor[s.status],
                            }}
                          >
                            {s.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">{s.views}</td>
                        <td className="px-5 py-4">
                          <Icon n="chevron" s={13} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="md:hidden divide-y divide-[#F0EBE0]">
                {submissions.map((s) => (
                  <div key={s.title} className="p-4">
                    <div className="flex justify-between gap-3">
                      <b className="text-xs">{s.title}</b>
                      <span
                        className="text-[9px] whitespace-nowrap"
                        style={{ color: statusColor[s.status] }}
                      >
                        {s.status}
                      </span>
                    </div>
                    <p className="text-[9px] text-[#9A9590] mt-2">
                      {s.category} · {s.date}
                    </p>
                  </div>
                ))}
              </div>
            </section>
            <aside className="space-y-5">
              <section className="rounded-2xl bg-[#231F19] text-white p-5">
                <div className="flex justify-between">
                  <span className="w-10 h-10 rounded-xl bg-[#C6A15B]/15 text-[#C6A15B] grid place-items-center">
                    <Icon n="message" />
                  </span>
                  <span className="text-[9px] text-[#E9A0A0] bg-[#C84A4A]/15 px-2 py-1 rounded-full h-fit">
                    ACTION NEEDED
                  </span>
                </div>
                <p className="text-[9px] uppercase tracking-wider text-[#777] mt-5">
                  Editorial feedback
                </p>
                <h3 className="font-serif font-bold mt-1">
                  A Food Lover’s Guide to Night Markets in Accra
                </h3>
                <blockquote className="mt-3 pl-3 border-l-2 border-[#C6A15B] text-[10px] leading-relaxed text-[#AAA]">
                  “A vivid draft with a wonderful sense of place. Please add
                  sources for the market history and strengthen the final
                  section with practical transport advice.”
                </blockquote>
                <div className="flex justify-between text-[9px] text-[#777] mt-4">
                  <span>Editor: Naa Adjei</span>
                  <span>Due 08 Aug</span>
                </div>
                <button className="w-full mt-4 py-3 rounded-xl bg-[#C6A15B] text-black text-xs font-bold">
                  Open Revision
                </button>
              </section>
              <section className="rounded-2xl bg-white border border-[#E6DFD2] p-5">
                <span className="w-10 h-10 rounded-xl bg-[#F3ECDF] text-[#C6A15B] grid place-items-center">
                  <Icon n="book" />
                </span>
                <h3 className="font-serif font-bold text-lg mt-4">
                  Contributor guidelines
                </h3>
                <p className="text-[10px] text-[#6F6B63] mt-2 leading-relaxed">
                  Write original, respectful stories grounded in lived
                  experience and reliable research.
                </p>
                <ul className="mt-4 space-y-2">
                  {[
                    "1,000–2,500 words",
                    "Original photography preferred",
                    "Cite facts and local sources",
                    "Allow 5–7 days for review",
                  ].map((x) => (
                    <li key={x} className="text-[10px] flex gap-2">
                      <span className="text-[#27855C]">
                        <Icon n="check" s={12} />
                      </span>
                      {x}
                    </li>
                  ))}
                </ul>
                <button className="mt-4 text-[10px] font-bold text-[#C6A15B] flex gap-1 items-center">
                  Read full guidelines
                  <Icon n="arrow" s={12} />
                </button>
              </section>
            </aside>
          </div>
          <section className="mt-5 rounded-2xl bg-[#EDE4D3] p-5 sm:p-7 flex flex-col md:flex-row md:items-center gap-5">
            <span className="w-12 h-12 rounded-xl bg-white text-[#C6A15B] grid place-items-center flex-shrink-0">
              <Icon n="edit" s={22} />
            </span>
            <div className="flex-1">
              <p className="text-[9px] uppercase tracking-wider text-[#9A7A40]">
                Have a story to tell?
              </p>
              <h3 className="font-serif text-xl font-bold mt-1">
                Share your Africa with the world
              </h3>
              <p className="text-[10px] text-[#6F6B63] mt-1">
                Start a draft now and return whenever inspiration strikes.
              </p>
            </div>
            <button
          onClick={() => onNavigate("contributor-editor")}
              className="px-5 py-3 rounded-xl bg-[#0B0B0B] text-white text-xs font-bold flex gap-2 items-center"
            >
              Create Article
              <Icon n="arrow" s={13} />
            </button>
          </section>
        </main>
      </div>
    </div>
  )
}
