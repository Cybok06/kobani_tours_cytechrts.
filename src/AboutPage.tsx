import { useState, useEffect, useRef } from "react"
import { SectionLabel } from "./layout"
import {
  ChevronRightIcon,
  ArrowRightIcon,
  MapPinIcon,
  CheckIcon,
  InstagramIcon,
  TikTokIcon,
  TelegramIcon,
} from "./icons"

type Page = "home" | "tours" | "tour-details" | "about"

// ─── Animated counter ──────────────────────────────────────────────────────────
const useCountUp = (target: number, duration = 2000, triggered = false) => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!triggered) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration, triggered])
  return count
}

const CounterStat = ({
  value,
  label,
  suffix = "+",
  triggered,
}: {
  value: number
  label: string
  suffix?: string
  triggered: boolean
}) => {
  const count = useCountUp(value, 1800, triggered)
  return (
    <div className="text-center">
      <div
        className="font-serif font-bold mb-1"
        style={{
          fontFamily: "var(--font-serif)",
          color: "#C6A15B",
          fontSize: "clamp(2rem,4vw,3rem)",
        }}
      >
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-sm font-medium" style={{ color: "#6F6B63" }}>
        {label}
      </div>
    </div>
  )
}

// ─── Timeline Step ─────────────────────────────────────────────────────────────
const timelineSteps = [
  {
    number: "01",
    title: "Discover",
    desc: "Every journey begins with curiosity. We help you discover the Africa that history books rarely show — its kingdoms, coastal empires, and living traditions.",
    icon: "🔍",
    color: "#C6A15B",
  },
  {
    number: "02",
    title: "Connect",
    desc: "We connect you with master guides, local historians, and community custodians who have spent lifetimes understanding Africa's layered stories.",
    icon: "🤝",
    color: "#D9B96E",
  },
  {
    number: "03",
    title: "Explore",
    desc: "Move through curated destinations with purpose — walking castle corridors, tasting local cuisine, and witnessing ceremonies most visitors never see.",
    icon: "🗺️",
    color: "#C6A15B",
  },
  {
    number: "04",
    title: "Relax",
    desc: "Return each evening to hand-selected luxury lodges, resort suites, and coastal hideaways where comfort meets the calm of African landscapes.",
    icon: "🌿",
    color: "#D9B96E",
  },
  {
    number: "05",
    title: "Remember",
    desc: "KOBANI curates each journey so it leaves a mark. Not just photographs — but perspectives, connections, and stories that stay with you forever.",
    icon: "✨",
    color: "#C6A15B",
  },
]

// ─── Team ─────────────────────────────────────────────────────────────────────
const team = [
  {
    name: "KOBANI Leadership",
    role: "Founder & CEO",
    image:
      "https://images.unsplash.com/photo-1584012961487-006d0c5c3c99?w=400&h=480&fit=crop&auto=format&facepad=3",
    bio: "Ghana's heritage is priceless. Our job is to present it with the honor and luxury it deserves. Every tour is a bridge between past and present, Africa and the world, heritage and luxury.",
    socials: {
      instagram: "https://www.instagram.com/kobanihistoricaltours",
      telegram: "https://t.me/KOBANITOURS",
    },
  },
  {
    name: "Abena Mensah-Boateng",
    role: "Head of Tour Operations",
    image:
      "https://images.unsplash.com/photo-1573496130141-209d200cebd8?w=400&h=480&fit=crop&auto=format&facepad=3",
    bio: "Abena brings 14 years of luxury travel logistics expertise across West and East Africa. She ensures every KOBANI journey runs to a standard of precision and warmth that our guests describe as effortless.",
    socials: { instagram: "#", telegram: "#" },
  },
  {
    name: "Yaw Owusu-Adjei",
    role: "Lead Heritage Guide",
    image:
      "https://images.unsplash.com/photo-1739298061757-7a3339cee982?w=400&h=480&fit=crop&auto=format&facepad=3",
    bio: "KOBANI works with destination professionals and cultural storytellers who approach Ghana's heritage with care and respect.",
    socials: { instagram: "#", telegram: "#" },
  },
  {
    name: "Efua Barimah",
    role: "Guest Experience Manager",
    image:
      "https://images.unsplash.com/photo-1778876087506-47da0c3e6d98?w=400&h=480&fit=crop&auto=format&facepad=3",
    bio: "Efua is the heartbeat of the KOBANI guest experience — managing pre-trip consultations, bespoke itinerary customisation, and post-journey follow-up that transforms first-time visitors into lifelong KOBANI travellers.",
    socials: { instagram: "#", telegram: "#" },
  },
]

// ─── Partners ─────────────────────────────────────────────────────────────────
const partners = [
  {
    name: "Ghana Tourism Authority",
    abbr: "GTA",
    desc: "Official tourism partner",
  },
  {
    name: "UNESCO World Heritage",
    abbr: "UNESCO",
    desc: "Heritage conservation",
  },
  {
    name: "African Travel Association",
    abbr: "ATA",
    desc: "Industry association",
  },
  { name: "Luxury Travel Guild", abbr: "LTG", desc: "Luxury standards body" },
  { name: "ECOWAS Tourism", abbr: "ECOWAS", desc: "Regional partnership" },
  { name: "Green Safari Alliance", abbr: "GSA", desc: "Sustainable travel" },
]

// ─── Values ───────────────────────────────────────────────────────────────────
const values = [
  {
    icon: "🏺",
    title: "Authenticity",
    color: "#C6A15B",
    points: [
      "We partner only with local guides who live the history they teach",
      "No manufactured tourist experiences — every moment is real",
      "Itineraries designed around truth, not convenience",
    ],
    desc: "Authenticity is KOBANI's founding principle. Every itinerary, every guide, every destination is chosen because it tells a true story — not because it photographs well.",
  },
  {
    icon: "⭐",
    title: "Excellence",
    color: "#D9B96E",
    points: [
      "Handpicked luxury accommodation at every destination",
      "Curated dining — from fine restaurants to local family kitchens",
      "Punctual, professional logistics from arrival to departure",
    ],
    desc: "Excellence is the standard we refuse to compromise on. From the thread count of your pillow to the depth of your guide's briefing, every detail is considered.",
  },
  {
    icon: "📜",
    title: "Heritage",
    color: "#C6A15B",
    points: [
      "Active support of UNESCO heritage site preservation",
      "Community investment programmes in visited regions",
      "Proceeds fund local historical research and archives",
    ],
    desc: "We are custodians, not just operators. Part of every tour fee supports the communities and conservation of the sites we are privileged to visit.",
  },
  {
    icon: "🤲",
    title: "Hospitality",
    color: "#D9B96E",
    points: [
      "Personal concierge from enquiry to post-trip follow-up",
      "We remember your preferences, anniversary, dietary needs",
      "Dedicated in-destination support from KOBANI's team",
    ],
    desc: "African hospitality — the spirit of Ubuntu — is woven into every guest interaction. We don't serve customers. We welcome travellers as family.",
  },
]

// ─── About Page ───────────────────────────────────────────────────────────────
export default function AboutPage({
  onNavigate,
}: {
  onNavigate: (p: Page) => void
}) {
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true)
      },
      { threshold: 0.3 },
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  const Card = ({
    children,
    className = "",
  }: {
    children: React.ReactNode
    className?: string
  }) => (
    <div
      className={`rounded-2xl ${className}`}
      style={{
        background: "#FFFFFF",
        border: "1px solid #E6DFD2",
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
      }}
    >
      {children}
    </div>
  )

  return (
    <div style={{ background: "#F8F4EA" }}>
      {/* ── 1. Hero Banner ── */}
      <section className="px-4 pt-8 pb-0">
        <div className="mx-auto" style={{ maxWidth: 1240 }}>
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{ minHeight: 320 }}
          >
            <img
              src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1400&h=600&fit=crop&auto=format"
              alt="African landscape at golden hour"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(120deg, rgba(11,11,11,0.82) 0%, rgba(11,11,11,0.45) 60%, rgba(11,11,11,0.2) 100%)",
              }}
            />
            {/* subtle kente-inspired border accent at the top */}
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{
                background:
                  "linear-gradient(90deg, #C6A15B, #E9D6A8, #C6A15B, #E9D6A8, #C6A15B)",
              }}
            />
            <div
              className="relative z-10 flex flex-col items-start justify-center h-full px-8 py-14 md:px-14"
              style={{ minHeight: 320 }}
            >
              <nav
                className="flex items-center gap-2 text-xs mb-5"
                style={{ color: "#E9D6A8" }}
              >
                <button
                  onClick={() => onNavigate("home")}
                  className="hover:text-[#C6A15B] transition-colors"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "inherit",
                  }}
                >
                  Home
                </button>
                <ChevronRightIcon size={11} />
                <span style={{ color: "#C6A15B" }}>About Us</span>
              </nav>
              <div
                className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full text-xs font-semibold tracking-[0.15em] uppercase"
                style={{
                  background: "rgba(198,161,91,0.2)",
                  border: "1px solid rgba(198,161,91,0.4)",
                  color: "#E9D6A8",
                }}
              >
                ✦ Our Story
              </div>
              <h1
                className="font-serif font-bold leading-tight mb-4"
                style={{
                  fontFamily: "var(--font-serif)",
                  color: "#FFFFFF",
                  fontSize: "clamp(2rem,5vw,3.25rem)",
                  maxWidth: 540,
                }}
              >
                Where Heritage Meets Luxury
              </h1>
              <p
                style={{
                  color: "#E9D6A8",
                  maxWidth: 460,
                  fontSize: 15,
                  lineHeight: 1.7,
                }}
              >
                A journey into Africa's soul, crafted with the precision of a
                luxury concierge and the passion of a born storyteller.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Our Story ── */}
      <section className="py-20 px-4">
        <div className="mx-auto" style={{ maxWidth: 1240 }}>
          <Card className="overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image side */}
              <div className="relative" style={{ minHeight: 500 }}>
                <img
                  src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=700&h=600&fit=crop&auto=format"
                  alt="Safari vehicle at sunset"
                  className="w-full h-full object-cover"
                  style={{ minHeight: 500 }}
                />
                {/* Gold overlay strip */}
                <div
                  className="absolute top-0 bottom-0 right-0 w-1"
                  style={{
                    background:
                      "linear-gradient(180deg, #C6A15B, #E9D6A8, #C6A15B)",
                  }}
                />
                {/* Floating year badge */}
                <div className="absolute bottom-8 left-8">
                  <div
                    className="rounded-2xl p-5"
                    style={{
                      background: "rgba(11,11,11,0.82)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(198,161,91,0.3)",
                    }}
                  >
                    <div
                      className="font-serif text-4xl font-bold mb-1"
                      style={{
                        color: "#C6A15B",
                        fontFamily: "var(--font-serif)",
                      }}
                    >
                      GH
                    </div>
                    <div
                      className="text-xs font-medium"
                      style={{ color: "#E9D6A8" }}
                    >
                      Ghanaian-owned company
                    </div>
                    <div className="text-xs mt-1" style={{ color: "#6F6B63" }}>
                      Accra, Republic of Ghana
                    </div>
                  </div>
                </div>
              </div>

              {/* Text side */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <SectionLabel>Our Story</SectionLabel>
                <h2
                  className="font-serif font-bold text-3xl mb-6 leading-tight"
                  style={{ fontFamily: "var(--font-serif)", color: "#0B0B0B" }}
                >
                  Born from a Love of Africa's True Story
                </h2>

                <div
                  className="space-y-4 text-sm leading-relaxed"
                  style={{ color: "#6F6B63" }}
                >
                  <p>
                    THE KOBANI HISTORICAL AND LUXURY TOURS is a premium Ghanaian
                    tourism company based in Accra, delivering exceptional
                    travel experiences that celebrate Ghana's history with
                    modern luxury.
                  </p>
                  <p>
                    He had one conviction:{" "}
                    <span
                      className="font-semibold italic"
                      style={{ color: "#202020" }}
                    >
                      Africa's heritage deserved to be experienced with the same
                      care and reverence as any world-class luxury destination.
                    </span>{" "}
                    Not despite its history — because of it.
                  </p>
                  <p>
                    From the dungeons of Cape Coast to the royal palaces of
                    Kumasi, from diaspora homecomings to executive retreats,
                    KOBANI connects people to the soul of Ghana — in style.
                  </p>
                  <p>
                    Every journey is shaped by historical accuracy, cultural
                    respect, genuine local relationships, security, discretion,
                    and five-star hospitality.
                  </p>
                </div>

                {/* Timeline years */}
                <div
                  className="mt-8 pt-6 grid grid-cols-3 gap-4"
                  style={{ borderTop: "1px solid #E6DFD2" }}
                >
                  {[
                    { year: "Accra", text: "Ghana headquarters" },
                    { year: "Ghana", text: "Nationwide coverage" },
                    { year: "W. Africa", text: "Regional partnerships" },
                  ].map((m) => (
                    <div key={m.year}>
                      <div
                        className="font-serif font-bold text-lg"
                        style={{
                          color: "#C6A15B",
                          fontFamily: "var(--font-serif)",
                        }}
                      >
                        {m.year}
                      </div>
                      <div className="text-xs" style={{ color: "#9A9590" }}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ── 3. Mission & Vision ── */}
      <section className="pb-20 px-4">
        <div className="mx-auto" style={{ maxWidth: 1240 }}>
          <div className="text-center mb-12">
            <SectionLabel>Purpose</SectionLabel>
            <h2
              className="font-serif font-bold text-3xl md:text-4xl"
              style={{ fontFamily: "var(--font-serif)", color: "#0B0B0B" }}
            >
              Mission & Vision
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mission */}
            <div
              className="rounded-2xl p-8 relative overflow-hidden"
              style={{ background: "#0B0B0B", border: "1px solid #2A2A2A" }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{
                  background:
                    "linear-gradient(90deg, #C6A15B, #E9D6A8, #C6A15B)",
                }}
              />
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6"
                style={{
                  background: "rgba(198,161,91,0.15)",
                  border: "1px solid rgba(198,161,91,0.25)",
                }}
              >
                🎯
              </div>
              <div
                className="text-xs font-bold tracking-[0.2em] uppercase mb-2"
                style={{ color: "#C6A15B" }}
              >
                Our Mission
              </div>
              <h3
                className="font-serif font-bold text-xl mb-4"
                style={{ fontFamily: "var(--font-serif)", color: "#FFFFFF" }}
              >
                Where Heritage Meets Luxury
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#9A9590" }}
              >
                Our mission is to preserve, honor, and share Ghana's history
                through meticulously crafted tours combining historical
                accuracy, cultural respect, and five-star hospitality.
              </p>
              <div className="mt-6 space-y-2.5">
                {[
                  "Connect travellers to authentic African heritage",
                  "Support local communities and heritage preservation",
                  "Set the gold standard for ethical luxury tourism",
                ].map((p) => (
                  <div
                    key={p}
                    className="flex items-center gap-2.5 text-sm"
                    style={{ color: "#E9D6A8" }}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(198,161,91,0.2)" }}
                    >
                      <CheckIcon size={11} color="#C6A15B" />
                    </div>
                    {p}
                  </div>
                ))}
              </div>
            </div>

            {/* Vision */}
            <div
              className="rounded-2xl p-8 relative overflow-hidden"
              style={{ background: "#FFFFFF", border: "1.5px solid #E9D6A8" }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{
                  background:
                    "linear-gradient(90deg, #C6A15B, #E9D6A8, #C6A15B)",
                }}
              />
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6"
                style={{
                  background: "rgba(198,161,91,0.1)",
                  border: "1px solid rgba(198,161,91,0.2)",
                }}
              >
                🌍
              </div>
              <div
                className="text-xs font-bold tracking-[0.2em] uppercase mb-2"
                style={{ color: "#C6A15B" }}
              >
                Our Vision
              </div>
              <h3
                className="font-serif font-bold text-xl mb-4"
                style={{ fontFamily: "var(--font-serif)", color: "#0B0B0B" }}
              >
                West Africa's Most Trusted Luxury Heritage Brand
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#6F6B63" }}
              >
                To be the most trusted luxury heritage tourism brand in West
                Africa, setting the global standard for how history is
                experienced.
              </p>
              <div className="mt-6 space-y-2.5">
                {[
                  "Lead the global heritage tourism conversation",
                  "Train the next generation of African heritage guides",
                  "Make African history accessible to diaspora travellers worldwide",
                ].map((p) => (
                  <div
                    key={p}
                    className="flex items-center gap-2.5 text-sm"
                    style={{ color: "#202020" }}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(198,161,91,0.15)" }}
                    >
                      <CheckIcon size={11} color="#C6A15B" />
                    </div>
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Brand Values ── */}
      <section className="py-20 px-4" style={{ background: "#FFFDF8" }}>
        <div className="mx-auto" style={{ maxWidth: 1240 }}>
          <div className="text-center mb-12">
            <SectionLabel>What We Stand For</SectionLabel>
            <h2
              className="font-serif font-bold text-3xl md:text-4xl"
              style={{ fontFamily: "var(--font-serif)", color: "#0B0B0B" }}
            >
              The Values That Guide Us
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <div
                key={v.title}
                className="rounded-2xl p-6 flex flex-col group transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E6DFD2",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.borderColor =
                    "#C6A15B"
                  ;(e.currentTarget as HTMLElement).style.boxShadow =
                    "0 12px 32px rgba(198,161,91,0.15)"
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.borderColor =
                    "#E6DFD2"
                  ;(e.currentTarget as HTMLElement).style.boxShadow =
                    "0 2px 12px rgba(0,0,0,0.05)"
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 transition-all"
                  style={{
                    background: "rgba(198,161,91,0.1)",
                    border: "1px solid rgba(198,161,91,0.2)",
                  }}
                >
                  {v.icon}
                </div>
                <div
                  className="text-xs font-bold tracking-[0.15em] uppercase mb-2"
                  style={{ color: "#C6A15B" }}
                >
                  0{i + 1}
                </div>
                <h3
                  className="font-serif font-bold text-lg mb-3"
                  style={{ fontFamily: "var(--font-serif)", color: "#0B0B0B" }}
                >
                  {v.title}
                </h3>
                <p
                  className="text-xs leading-relaxed mb-4 flex-1"
                  style={{ color: "#6F6B63" }}
                >
                  {v.desc}
                </p>
                <div
                  className="space-y-2 pt-4"
                  style={{ borderTop: "1px solid #E6DFD2" }}
                >
                  {v.points.map((pt) => (
                    <div
                      key={pt}
                      className="flex items-start gap-2 text-xs"
                      style={{ color: "#6F6B63" }}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <CheckIcon size={12} color="#C6A15B" />
                      </div>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. The KOBANI Experience — Timeline ── */}
      <section className="py-20 px-4" style={{ background: "#F8F4EA" }}>
        <div className="mx-auto" style={{ maxWidth: 1240 }}>
          <div className="text-center mb-14">
            <SectionLabel>How It Works</SectionLabel>
            <h2
              className="font-serif font-bold text-3xl md:text-4xl"
              style={{ fontFamily: "var(--font-serif)", color: "#0B0B0B" }}
            >
              The KOBANI Experience
            </h2>
            <p
              className="mt-3 text-sm max-w-md mx-auto"
              style={{ color: "#6F6B63" }}
            >
              Every KOBANI journey follows five phases — each designed to deepen
              your connection with Africa.
            </p>
          </div>

          {/* Desktop timeline */}
          <div className="hidden md:block">
            {/* Connector line */}
            <div className="relative mb-6">
              <div
                className="absolute top-8 left-16 right-16 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, #C6A15B, #E9D6A8, #C6A15B, #E9D6A8, #C6A15B)",
                }}
              />
              <div className="grid grid-cols-5 gap-4">
                {timelineSteps.map((step, i) => (
                  <div key={step.title} className="flex flex-col items-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-2xl z-10 mb-4 border-4 border-white shadow-lg"
                      style={{
                        background: i % 2 === 0 ? "#C6A15B" : "#0B0B0B",
                      }}
                    >
                      {step.icon}
                    </div>
                    <div
                      className="text-xs font-bold tracking-widest uppercase mb-1"
                      style={{ color: "#C6A15B" }}
                    >
                      {step.number}
                    </div>
                    <div
                      className="font-serif font-bold text-base text-center mb-2"
                      style={{
                        fontFamily: "var(--font-serif)",
                        color: "#0B0B0B",
                      }}
                    >
                      {step.title}
                    </div>
                    <p
                      className="text-xs text-center leading-relaxed"
                      style={{ color: "#6F6B63" }}
                    >
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile timeline */}
          <div className="md:hidden space-y-0">
            {timelineSteps.map((step, i) => (
              <div key={step.title} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 border-4 border-white shadow-md"
                    style={{ background: i % 2 === 0 ? "#C6A15B" : "#0B0B0B" }}
                  >
                    {step.icon}
                  </div>
                  {i < timelineSteps.length - 1 && (
                    <div
                      className="w-px flex-1 my-2"
                      style={{
                        background: "linear-gradient(180deg, #C6A15B, #E9D6A8)",
                      }}
                    />
                  )}
                </div>
                <div className="pb-8 pt-1">
                  <div
                    className="text-xs font-bold tracking-widest uppercase mb-0.5"
                    style={{ color: "#C6A15B" }}
                  >
                    {step.number}
                  </div>
                  <div
                    className="font-serif font-bold text-base mb-1"
                    style={{
                      fontFamily: "var(--font-serif)",
                      color: "#0B0B0B",
                    }}
                  >
                    {step.title}
                  </div>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "#6F6B63" }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Why Choose Us ── */}
      <section className="py-20 px-4" style={{ background: "#FFFDF8" }}>
        <div className="mx-auto" style={{ maxWidth: 1240 }}>
          <Card className="overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative" style={{ minHeight: 480 }}>
                <img
                  src="https://images.unsplash.com/photo-1577971132997-c10be9372519?w=700&h=600&fit=crop&auto=format"
                  alt="Elephants on African road"
                  className="w-full h-full object-cover"
                  style={{ minHeight: 480 }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 50%, rgba(11,11,11,0.5) 100%)",
                  }}
                />
                {/* Floating stat */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { val: "Ghana", label: "Nationwide Coverage" },
                      { val: "Heritage", label: "Purposeful Journeys" },
                      { val: "Care", label: "Guest Support" },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="rounded-xl p-3 text-center"
                        style={{
                          background: "rgba(11,11,11,0.8)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(198,161,91,0.2)",
                        }}
                      >
                        <div
                          className="font-serif font-bold text-lg"
                          style={{
                            color: "#C6A15B",
                            fontFamily: "var(--font-serif)",
                          }}
                        >
                          {s.val}
                        </div>
                        <div className="text-xs" style={{ color: "#9A9590" }}>
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 lg:p-12">
                <SectionLabel>Why KOBANI</SectionLabel>
                <h2
                  className="font-serif font-bold text-2xl md:text-3xl mb-5 leading-tight"
                  style={{ fontFamily: "var(--font-serif)", color: "#0B0B0B" }}
                >
                  The Difference You'll Feel From Day One
                </h2>
                <p
                  className="text-sm leading-relaxed mb-8"
                  style={{ color: "#6F6B63" }}
                >
                  Every luxury operator promises excellence. What sets KOBANI
                  apart is the care behind our curation — the local knowledge,
                  destination relationships, and the conviction that the best travel experience is
                  also the most honest one.
                </p>

                <div className="space-y-4">
                  {[
                    {
                      icon: "🏛️",
                      title: "Historically Mindful Design",
                      desc: "Our journeys approach Ghana's history and living cultures with context, care and respect.",
                    },
                    {
                      icon: "🤝",
                      title: "Community-First Ethics",
                      desc: "We value respectful relationships with local guides, hospitality providers and the communities included in our journeys.",
                    },
                    {
                      icon: "🎖️",
                      title: "Local Knowledge",
                      desc: "Our approach brings destination knowledge and cultural context into each planned experience.",
                    },
                    {
                      icon: "📱",
                      title: "Concierge Support",
                      desc: "Our team provides dedicated assistance from your first enquiry through the completion of your journey.",
                    },
                  ].map((b) => (
                    <div
                      key={b.title}
                      className="flex items-start gap-4 p-4 rounded-xl transition-all"
                      style={{
                        border: "1px solid #E6DFD2",
                        background: "#F8F4EA",
                      }}
                      onMouseEnter={(e) => {
                        ;(e.currentTarget as HTMLElement).style.borderColor =
                          "#C6A15B"
                        ;(e.currentTarget as HTMLElement).style.background =
                          "rgba(198,161,91,0.05)"
                      }}
                      onMouseLeave={(e) => {
                        ;(e.currentTarget as HTMLElement).style.borderColor =
                          "#E6DFD2"
                        ;(e.currentTarget as HTMLElement).style.background =
                          "#F8F4EA"
                      }}
                    >
                      <div className="text-2xl flex-shrink-0">{b.icon}</div>
                      <div>
                        <div
                          className="font-semibold text-sm mb-1"
                          style={{ color: "#202020" }}
                        >
                          {b.title}
                        </div>
                        <div
                          className="text-xs leading-relaxed"
                          style={{ color: "#6F6B63" }}
                        >
                          {b.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ── 7. Meet the Team ── */}
      {false && <section className="py-20 px-4" style={{ background: "#F8F4EA" }}>
        <div className="mx-auto" style={{ maxWidth: 1240 }}>
          <div className="text-center mb-12">
            <SectionLabel>The People</SectionLabel>
            <h2
              className="font-serif font-bold text-3xl md:text-4xl"
              style={{ fontFamily: "var(--font-serif)", color: "#0B0B0B" }}
            >
              Meet Our Team
            </h2>
            <p
              className="mt-3 text-sm max-w-md mx-auto"
              style={{ color: "#6F6B63" }}
            >
              The historians, guides, and experience architects who make every
              KOBANI journey extraordinary.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {team.slice(0, 1).map((member) => (
              <div
                key={member.name}
                className="rounded-2xl overflow-hidden group transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E6DFD2",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.boxShadow =
                    "0 16px 40px rgba(0,0,0,0.12)"
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.boxShadow =
                    "0 4px 20px rgba(0,0,0,0.07)"
                }}
              >
                {/* Photo */}
                <div
                  className="relative overflow-hidden"
                  style={{ height: 260 }}
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 object-top"
                  />
                  <div
                    className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent 50%, rgba(11,11,11,0.6) 100%)",
                    }}
                  />
                </div>
                {/* Info */}
                <div className="p-5">
                  <div
                    className="text-xs font-bold tracking-wider uppercase mb-1"
                    style={{ color: "#C6A15B" }}
                  >
                    {member.role}
                  </div>
                  <h3
                    className="font-serif font-bold text-base mb-3 leading-snug"
                    style={{
                      fontFamily: "var(--font-serif)",
                      color: "#0B0B0B",
                    }}
                  >
                    {member.name}
                  </h3>
                  <p
                    className="text-xs leading-relaxed mb-4"
                    style={{ color: "#6F6B63" }}
                  >
                    {member.bio}
                  </p>
                  {/* Social links */}
                  <div
                    className="flex items-center gap-2 pt-3"
                    style={{ borderTop: "1px solid #E6DFD2" }}
                  >
                    {[
                      {
                        icon: <InstagramIcon />,
                        href: member.socials.instagram,
                      },
                      { icon: <TelegramIcon />, href: member.socials.telegram },
                    ].map((s, i) => (
                      <a
                        key={i}
                        href={s.href}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                        style={{
                          background: "#F8F4EA",
                          color: "#9A9590",
                          border: "1px solid #E6DFD2",
                        }}
                        onMouseEnter={(e) => {
                          ;(e.currentTarget as HTMLElement).style.background =
                            "rgba(198,161,91,0.1)"
                          ;(e.currentTarget as HTMLElement).style.color =
                            "#C6A15B"
                          ;(e.currentTarget as HTMLElement).style.borderColor =
                            "#C6A15B"
                        }}
                        onMouseLeave={(e) => {
                          ;(e.currentTarget as HTMLElement).style.background =
                            "#F8F4EA"
                          ;(e.currentTarget as HTMLElement).style.color =
                            "#9A9590"
                          ;(e.currentTarget as HTMLElement).style.borderColor =
                            "#E6DFD2"
                        }}
                      >
                        {s.icon}
                      </a>
                    ))}
                    <a
                      href="/about"
                      className="ml-auto text-xs font-semibold flex items-center gap-1 transition-colors"
                      style={{ color: "#C6A15B" }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.color =
                          "#D9B96E")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.color =
                          "#C6A15B")
                      }
                    >
                      Profile <ArrowRightIcon size={12} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>}

      {/* ── 8. Company Statistics ── */}
      <section
        className="py-20 px-4"
        style={{ background: "#0B0B0B" }}
        ref={statsRef}
      >
        <div className="mx-auto" style={{ maxWidth: 1240 }}>
          {/* Gold top rule */}
          <div
            className="h-px mb-16 mx-auto"
            style={{
              background:
                "linear-gradient(90deg, transparent, #C6A15B, transparent)",
              maxWidth: 400,
            }}
          />
          <div className="text-center mb-12">
            <div
              className="text-xs font-bold tracking-[0.2em] uppercase mb-3"
              style={{ color: "#C6A15B" }}
            >
              ✦ By the Numbers
            </div>
            <h2
              className="font-serif font-bold text-3xl md:text-4xl"
              style={{ fontFamily: "var(--font-serif)", color: "#FFFFFF" }}
            >
              The KOBANI Approach
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: "Heritage", label: "Historically Mindful Journeys" },
              { value: "Hospitality", label: "Considered Guest Care" },
              { value: "Ghana", label: "Local Destination Knowledge" },
              { value: "Support", label: "Personal Travel Assistance" },
            ].map((s) => (
              <div
                key={s.label}
                className="text-center py-8 px-4 rounded-2xl relative"
                style={{ border: "1px solid #2A2A2A", background: "#111111" }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, #C6A15B, transparent)",
                  }}
                />
                <div className="font-serif text-2xl font-bold text-[#C6A15B] sm:text-3xl">{s.value}</div><div className="mt-2 text-sm text-[#9A9590]">{s.label}</div>
              </div>
            ))}
          </div>
          <div
            className="h-px mt-16 mx-auto"
            style={{
              background:
                "linear-gradient(90deg, transparent, #C6A15B, transparent)",
              maxWidth: 400,
            }}
          />
        </div>
      </section>

      {/* ── 9. Certifications & Partners ── */}
      {false && <section className="py-20 px-4" style={{ background: "#FFFDF8" }}>
        <div className="mx-auto" style={{ maxWidth: 1240 }}>
          <div className="text-center mb-12">
            <SectionLabel>Trust & Accreditation</SectionLabel>
            <h2
              className="font-serif font-bold text-3xl md:text-4xl"
              style={{ fontFamily: "var(--font-serif)", color: "#0B0B0B" }}
            >
              Certifications & Partners
            </h2>
            <p
              className="mt-3 text-sm max-w-md mx-auto"
              style={{ color: "#6F6B63" }}
            >
              KOBANI is recognised and accredited by the leading bodies in
              heritage tourism, luxury travel, and African cultural
              preservation.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {partners.map((p) => (
              <div
                key={p.name}
                className="rounded-2xl p-5 flex flex-col items-center text-center group transition-all duration-300"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E6DFD2",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.borderColor =
                    "#C6A15B"
                  ;(e.currentTarget as HTMLElement).style.boxShadow =
                    "0 8px 24px rgba(198,161,91,0.12)"
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.borderColor =
                    "#E6DFD2"
                  ;(e.currentTarget as HTMLElement).style.boxShadow =
                    "0 2px 8px rgba(0,0,0,0.04)"
                }}
              >
                {/* Abbr as logo stand-in */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xs mb-3 transition-all"
                  style={{
                    background: "rgba(198,161,91,0.1)",
                    color: "#C6A15B",
                    border: "1px solid rgba(198,161,91,0.2)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {p.abbr}
                </div>
                <div
                  className="font-semibold text-xs mb-0.5 leading-tight"
                  style={{ color: "#202020" }}
                >
                  {p.name}
                </div>
                <div className="text-xs" style={{ color: "#9A9590" }}>
                  {p.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Certification badges row */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {[
              "IATA Certified",
              "ISO 9001:2015",
              "Eco-Certified",
              "ATTA Member",
            ].map((cert) => (
              <div
                key={cert}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
                style={{
                  border: "1.5px solid #C6A15B",
                  color: "#C6A15B",
                  background: "rgba(198,161,91,0.06)",
                }}
              >
                <span style={{ fontSize: 14 }}>✓</span> {cert}
              </div>
            ))}
          </div>
        </div>
      </section>}

      {/* ── 10. CTA ── */}
      <section className="py-20 px-4" style={{ background: "#F8F4EA" }}>
        <div className="mx-auto" style={{ maxWidth: 1240 }}>
          <div
            className="rounded-2xl overflow-hidden relative"
            style={{ background: "#0B0B0B", border: "1px solid #2A2A2A" }}
          >
            {/* Top gold gradient line */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{
                background: "linear-gradient(90deg, #C6A15B, #E9D6A8, #C6A15B)",
              }}
            />
            {/* Background pattern */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 30 L30 0 L60 30 L30 60 Z' fill='none' stroke='%23C6A15B' stroke-width='1'/%3E%3C/svg%3E")`,
              }}
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left text */}
              <div className="p-10 md:p-14 flex flex-col justify-center">
                <div
                  className="text-xs font-bold tracking-[0.2em] uppercase mb-4"
                  style={{ color: "#C6A15B" }}
                >
                  ✦ Begin Your Journey
                </div>
                <h2
                  className="font-serif font-bold mb-4 leading-tight"
                  style={{
                    fontFamily: "var(--font-serif)",
                    color: "#FFFFFF",
                    fontSize: "clamp(1.8rem,3.5vw,2.6rem)",
                  }}
                >
                  Your African Journey Begins Here
                </h2>
                <p
                  className="text-sm leading-relaxed mb-8"
                  style={{ color: "#9A9590", maxWidth: 400 }}
                >
                  Whether you're drawn by history, culture, luxury, or all three
                  — KOBANI will craft a journey that exceeds every expectation.
                  The only question is where in Africa calls to you first.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => onNavigate("tours")}
                    className="btn-gold inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm"
                    style={{ color: "#0B0B0B" }}
                  >
                    Explore Tours <ArrowRightIcon size={15} />
                  </button>
                  <button
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-all"
                    style={{
                      border: "1.5px solid rgba(255,255,255,0.3)",
                      color: "#FFFFFF",
                      background: "rgba(255,255,255,0.06)",
                    }}
                    onMouseEnter={(e) => {
                      ;(e.currentTarget as HTMLElement).style.borderColor =
                        "#C6A15B"
                      ;(e.currentTarget as HTMLElement).style.background =
                        "rgba(198,161,91,0.08)"
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(255,255,255,0.3)"
                      ;(e.currentTarget as HTMLElement).style.background =
                        "rgba(255,255,255,0.06)"
                    }}
                  >
                    Contact Us
                  </button>
                </div>

                {/* Trust line */}
                <div className="flex flex-wrap gap-5 mt-8">
                  {[
                    "Free consultation",
                    "No booking fees",
                    "Secure payments",
                  ].map((t) => (
                    <div
                      key={t}
                      className="flex items-center gap-1.5 text-xs"
                      style={{ color: "#6F6B63" }}
                    >
                      <CheckIcon size={12} color="#C6A15B" /> {t}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right image */}
              <div
                className="hidden lg:block relative"
                style={{ minHeight: 400 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1521651201144-634f700b36ef?w=700&h=500&fit=crop&auto=format"
                  alt="Elephants in African savanna"
                  className="w-full h-full object-cover"
                  style={{ minHeight: 400 }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(11,11,11,0.6) 0%, transparent 50%)",
                  }}
                />
                {/* Testimonial floating card */}
                <div className="absolute bottom-8 right-8 max-w-xs">
                  <div
                    className="rounded-xl p-4"
                    style={{
                      background: "rgba(11,11,11,0.85)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(198,161,91,0.25)",
                    }}
                  >
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span
                          key={i}
                          style={{ color: "#C6A15B", fontSize: 12 }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p
                      className="text-xs italic leading-relaxed mb-3"
                      style={{ color: "#E9D6A8" }}
                    >
                      "KOBANI didn't just show me Africa — they helped me
                      understand it. The most meaningful trip of my life."
                    </p>
                    <div
                      className="text-xs font-semibold"
                      style={{ color: "#C6A15B" }}
                    >
                      — James O., Lagos
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
