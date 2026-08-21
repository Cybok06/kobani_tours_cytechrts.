import { useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Stars, SectionLabel } from "./layout"
import { galleryApi, marketApi, resolveMediaUrl, type GalleryItem, type MarketProduct, Tour, tourApi } from "./api"
import { addToCart, setSelectedProduct } from "./marketCart"
import type { Page } from "./App"
import {
  MapPinIcon,
  ClockIcon,
  UsersIcon,
  HeartIcon,
  ShoppingCartIcon,
  ArrowRightIcon,
  SearchIcon,
  CalendarIcon,
  GlobeIcon,
  CheckCircleIcon,
  ShieldIcon,
  ChevronRightIcon,
} from "./icons"

const CheckCircleGold = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#C6A15B"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

// ─── Hero ──────────────────────────────────────────────────────────────────────
export const Hero = ({ onToursClick, onContactClick }: { onToursClick: () => void; onContactClick: () => void }) => {
  const { t } = useTranslation()
  const fallbackImage = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&h=700&fit=crop&auto=format"
  const [images, setImages] = useState<string[]>([])
  const [current, setCurrent] = useState(fallbackImage)
  const [previous, setPrevious] = useState<string | null>(null)
  const [paused, setPaused] = useState(false)
  const [tabVisible, setTabVisible] = useState(!document.hidden)
  const currentRef = useRef(current)
  const reducedMotion = useRef(false)

  useEffect(() => {
    const handleVisibility = () => setTabVisible(!document.hidden)
    document.addEventListener("visibilitychange", handleVisibility)
    return () => document.removeEventListener("visibilitychange", handleVisibility)
  }, [])

  useEffect(() => {
    currentRef.current = current
  }, [current])

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updateMotion = () => { reducedMotion.current = media.matches }
    updateMotion()
    media.addEventListener("change", updateMotion)
    let active = true
    fetch("/generated/hero-images.json", { cache: "no-cache" })
      .then((response) => {
        if (!response.ok) throw new Error(`Manifest returned ${response.status}`)
        return response.json()
      })
      .then((manifest: unknown) => {
        if (!active || !Array.isArray(manifest)) return
        const discovered = manifest.filter((item): item is string => typeof item === "string" && item.startsWith("/"))
        setImages(discovered)
        if (discovered.length) {
          const first = discovered[Math.floor(Math.random() * discovered.length)]
          const preload = new Image()
          preload.onload = () => { if (active) setCurrent(first) }
          preload.onerror = () => {
            if (import.meta.env.DEV) console.warn(`[hero] Could not load initial image: ${first}`)
            setImages((items) => items.filter((item) => item !== first))
          }
          preload.src = first
        }
      })
      .catch((error) => {
        if (import.meta.env.DEV) console.warn("[hero] Using fallback image because the manifest could not be loaded.", error)
      })
    return () => { active = false; media.removeEventListener("change", updateMotion) }
  }, [])

  const advance = useCallback(() => {
    const choices = images.filter((image) => image !== currentRef.current)
    if (!choices.length) return
    const next = choices[Math.floor(Math.random() * choices.length)]
    const preload = new Image()
    preload.onload = () => {
      setPrevious(currentRef.current)
      setCurrent(next)
      window.setTimeout(() => setPrevious(null), reducedMotion.current ? 0 : 1600)
    }
    preload.onerror = () => {
      if (import.meta.env.DEV) console.warn(`[hero] Skipping missing or invalid image: ${next}`)
      setImages((items) => items.filter((item) => item !== next))
    }
    preload.src = next
  }, [images])

  useEffect(() => {
    if (paused || !tabVisible || reducedMotion.current || images.length < 2) return
    const timer = window.setInterval(advance, 3000)
    return () => window.clearInterval(timer)
  }, [advance, images.length, paused, tabVisible])

  return (
  <section
    className="relative px-4 pt-8 pb-0"
    style={{ background: "#F8F4EA" }}
  >
    <div className="mx-auto" style={{ maxWidth: 1240 }}>
      <div
        className="relative overflow-hidden"
        style={{ minHeight: 560, borderRadius: 20 }}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
      >
        <div aria-hidden="true" className="absolute inset-0 bg-[#0B0B0B]" />
        {previous && (
          <div aria-hidden="true" className="hero-slide hero-slide-previous" style={{ backgroundImage: `url("${previous}")` }} />
        )}
        <div key={current} aria-hidden="true" className="hero-slide hero-slide-current" style={{ backgroundImage: `url("${current}")` }} />
        <div aria-hidden="true" className="hero-luxury-overlay pointer-events-none absolute inset-0 z-[2]" />
        <div
          className="pointer-events-none absolute inset-0 z-[3] opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20 L20 0 L40 20 L20 40 Z' fill='none' stroke='%23C6A15B' stroke-width='0.5'/%3E%3C/svg%3E")`,
          }}
        />
        <div
          className="relative z-10 flex flex-col items-start justify-center h-full px-8 py-16 md:px-16"
          style={{ minHeight: 560 }}
        >
          <div
            className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-[0.15em] uppercase"
            style={{
              background: "rgba(198,161,91,0.2)",
              border: "1px solid rgba(198,161,91,0.4)",
              color: "#E9D6A8",
            }}
          >
            ✦ {t("hero.welcome")}
          </div>
          <h1
            className="font-serif mb-5 leading-tight"
            style={{
              fontFamily: "var(--font-serif)",
              color: "#FFFFFF",
              fontSize: "clamp(2rem,5vw,3.5rem)",
              maxWidth: 600,
              fontWeight: 700,
            }}
          >
            {t("hero.title")}
          </h1>
          <p
            className="mb-8 leading-relaxed"
            style={{ color: "#E9D6A8", maxWidth: 480, fontSize: 16 }}
          >
            {t("hero.description")}
          </p>
          <div className="flex flex-wrap gap-3 mb-10">
            <button
              onClick={onToursClick}
              className="btn-gold inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm"
              style={{ color: "#0B0B0B" }}
            >
              {t("hero.exploreTours")} <ArrowRightIcon />
            </button>
            <button
              onClick={onContactClick}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-all"
              style={{
                border: "1.5px solid rgba(255,255,255,0.5)",
                color: "#FFFFFF",
                background: "rgba(255,255,255,0.08)",
              }}
            >
              {t("hero.contactUs")}
            </button>
          </div>
          <div className="flex flex-wrap gap-6">
            {[t("hero.benefits.guides"), t("hero.benefits.payments"), t("hero.benefits.experiences")].map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-2 text-xs font-medium"
                style={{ color: "#E9D6A8" }}
              >
                <CheckCircleGold /> {benefit}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
  )
}

// ─── Search Box ────────────────────────────────────────────────────────────────
export const SearchBox = ({ onNavigate }: { onNavigate: (page: Page) => void }) => {
  const { t } = useTranslation()
  const fields = [
    {
      label: t("tourSearch.destination"),
      placeholder: t("tourSearch.destinationPlaceholder"),
      icon: <MapPinIcon />,
    },
    { label: t("tourSearch.tourType"), placeholder: t("tourSearch.selectType"), icon: <GlobeIcon /> },
    {
      label: t("tourSearch.travelDate"),
      placeholder: t("tourSearch.pickDate"),
      icon: <CalendarIcon />,
    },
    { label: t("tourSearch.duration"), placeholder: t("tourSearch.anyDuration"), icon: <ClockIcon /> },
    { label: t("tourSearch.travellers"), placeholder: t("tourSearch.adultsCount", { count: 2 }), icon: <UsersIcon /> },
  ]
  return (
    <section
      className="px-4 -mt-6 relative z-20"
      style={{ background: "#F8F4EA" }}
    >
      <div className="mx-auto" style={{ maxWidth: 1240 }}>
        <div
          className="rounded-2xl p-5 md:p-6"
          style={{
            background: "#FFFFFF",
            border: "1px solid #E6DFD2",
            boxShadow:
              "0 16px 48px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex flex-col lg:flex-row gap-3 items-end">
            {fields.map((f) => (
              <div key={f.label} className="flex-1 min-w-0">
                <label
                  className="block text-xs font-semibold mb-1.5 tracking-wide uppercase"
                  style={{ color: "#6F6B63" }}
                >
                  {f.label}
                </label>
                <div className="relative">
                  <div
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "#C6A15B" }}
                  >
                    {f.icon}
                  </div>
                  <input
                    placeholder={f.placeholder}
                    className="w-full pl-9 pr-3 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{
                      border: "1.5px solid #E6DFD2",
                      background: "#F8F4EA",
                      color: "#202020",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#C6A15B")}
                    onBlur={(e) => (e.target.style.borderColor = "#E6DFD2")}
                  />
                </div>
              </div>
            ))}
            <button
              onClick={() => onNavigate("tours")}
              className="btn-gold flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap flex-shrink-0"
              style={{ color: "#0B0B0B" }}
            >
              <SearchIcon /> {t("tourSearch.searchTours")}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Tour Categories ───────────────────────────────────────────────────────────
const categories = [
  { name: "Historical Tours", count: 18, icon: "🏛️" },
  { name: "Luxury Tours", count: 12, icon: "✨" },
  { name: "Cultural Tours", count: 24, icon: "🥁" },
  { name: "Private Tours", count: 9, icon: "🔑" },
  { name: "Group Tours", count: 31, icon: "👥" },
  { name: "Educational Tours", count: 15, icon: "📚" },
]

export const TourCategories = ({ onNavigate }: { onNavigate: (page: Page) => void }) => (
  <section className="py-20 px-4" style={{ background: "#F8F4EA" }}>
    <div className="mx-auto" style={{ maxWidth: 1240 }}>
      <div className="text-center mb-12">
        <SectionLabel>Experiences</SectionLabel>
        <h2
          className="font-serif text-3xl md:text-4xl font-bold"
          style={{ fontFamily: "var(--font-serif)", color: "#0B0B0B" }}
        >
          Explore Our Tour Experiences
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => onNavigate("tours")}
            className="group flex flex-col items-center text-center p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E6DFD2",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.borderColor = "#C6A15B"
              ;(e.currentTarget as HTMLElement).style.boxShadow =
                "0 8px 24px rgba(198,161,91,0.15)"
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.borderColor = "#E6DFD2"
              ;(e.currentTarget as HTMLElement).style.boxShadow =
                "0 2px 8px rgba(0,0,0,0.05)"
            }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 text-xl"
              style={{ background: "rgba(198,161,91,0.1)" }}
            >
              {cat.icon}
            </div>
            <div
              className="font-semibold text-xs mb-1 leading-tight"
              style={{ color: "#202020" }}
            >
              {cat.name}
            </div>
            <div className="text-xs" style={{ color: "#C6A15B" }}>
              Explore journeys
            </div>
            <div
              className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: "#C6A15B" }}
            >
              <ChevronRightIcon />
            </div>
          </button>
        ))}
      </div>
    </div>
  </section>
)

// ─── Tour Card ─────────────────────────────────────────────────────────────────
const TourCard = ({
  tour,
  onViewDetails,
  onBookNow,
  onNavigate,
}: {
  tour: Tour
  onViewDetails: (slug: string) => void
  onBookNow: (tour: Tour) => void
  onNavigate: (page: Page) => void
}) => {
  const { t } = useTranslation()
  const [fav, setFav] = useState(false)
  return (
    <div
      className="tour-card rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: "#FFFFFF",
        border: "1px solid #E6DFD2",
        boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
      }}
    >
      <div className="relative overflow-hidden" style={{ height: 220 }}>
        <img
          src={resolveMediaUrl(tour.featured_image?.url)}
          alt={tour.title}
          className="tour-card-img w-full h-full object-cover transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
            style={{ background: "#356A9A" }}
          >
            {tour.is_featured ? "Featured" : "Curated"}
          </span>
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: "rgba(198,161,91,0.9)", color: "#0B0B0B" }}
          >
            {tour.category?.name}
          </span>
        </div>
        <button
          onClick={() => setFav((f) => !f)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.92)" }}
        >
          <HeartIcon filled={fav} />
        </button>
      </div>
      <div className="flex flex-col flex-1 p-5">
        <h3
          className="font-serif font-bold text-base mb-2 leading-snug"
          style={{ fontFamily: "var(--font-serif)", color: "#0B0B0B" }}
        >
          {tour.title}
        </h3>
        <div
          className="flex flex-wrap gap-3 mb-3 text-xs"
          style={{ color: "#6F6B63" }}
        >
          <span className="flex items-center gap-1">
            <MapPinIcon />
            {tour.destination}, {tour.country}
          </span>
          <span className="flex items-center gap-1">
            <ClockIcon />
            {tour.duration_days} Days
          </span>
          {tour.departure_count > 0 && <span className="flex items-center gap-1"><UsersIcon />{Math.max(0, tour.total_capacity - tour.total_booked)} spaces available</span>}
        </div>
        <p className="mb-4 text-xs text-[#6F6B63]">{tour.departure_count > 0 ? `${tour.departure_count} scheduled departure${tour.departure_count === 1 ? "" : "s"}` : "Upcoming departure dates are being finalized."}</p>
        <div className="mt-auto">
          <div className="mb-3">
            <span className="text-xs" style={{ color: "#6F6B63" }}>
              Starting from
            </span>
            <div
              className="font-serif font-bold text-xl"
              style={{ color: "#C6A15B", fontFamily: "var(--font-serif)" }}
            >
              {tour.currency} {tour.adult_price.toLocaleString()}
            </div>
            <span className="text-xs" style={{ color: "#6F6B63" }}>
              {t("homeSections.featured.perPerson")}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onViewDetails(tour.slug)}
              className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                border: "1.5px solid #C6A15B",
                color: "#C6A15B",
                background: "none",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.background =
                  "rgba(198,161,91,0.08)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.background = ""
              }}
            >
              {t("homeSections.featured.viewTour")}
            </button>
            <button
              onClick={() => tour.departure_count > 0 ? onBookNow(tour) : onNavigate("contact")}
              className="flex-1 text-center btn-gold py-2.5 rounded-xl text-sm font-semibold"
              style={{ color: "#0B0B0B" }}
            >
              {tour.departure_count > 0 ? "Book Now" : "Ask About This Tour"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export const FeaturedTours = ({
  onViewDetails,
  onBookNow,
  onNavigate,
}: {
  onViewDetails: (slug: string) => void
  onBookNow: (tour: Tour) => void
  onNavigate: (page: Page) => void
}) => {
  const { t } = useTranslation()
  const [tours, setTours] = useState<Tour[]>([])
  useEffect(() => { tourApi.overview().then(result => setTours(result.data.featured.slice(0, 3))).catch(() => setTours([])) }, [])
  return (
  <section className="py-20 px-4" style={{ background: "#FFFDF8" }}>
    <div className="mx-auto" style={{ maxWidth: 1240 }}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
        <div>
          <SectionLabel>{t("homeSections.featured.eyebrow")}</SectionLabel>
          <h2
            className="font-serif text-3xl md:text-4xl font-bold"
            style={{ fontFamily: "var(--font-serif)", color: "#0B0B0B" }}
          >
            {t("homeSections.featured.title")}
          </h2>
          <p className="mt-2 text-sm" style={{ color: "#6F6B63" }}>
            {t("homeSections.featured.description")}
          </p>
        </div>
        <button
          onClick={() => onNavigate("tours")}
          className="flex-shrink-0 flex items-center gap-1.5 text-sm font-semibold"
          style={{ color: "#C6A15B" }}
        >
          {t("homeSections.featured.viewAll")} <ArrowRightIcon />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((t) => (
          <TourCard
            key={t.id}
            tour={t}
            onViewDetails={onViewDetails}
            onBookNow={onBookNow}
            onNavigate={onNavigate}
          />
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-8">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            className="rounded-full"
            style={{
              width: i === 0 ? 24 : 8,
              height: 8,
              background: i === 0 ? "#C6A15B" : "#E6DFD2",
            }}
          />
        ))}
      </div>
    </div>
  </section>
  )
}

// ─── Why KOBANI ────────────────────────────────────────────────────────────────
const whyCards = [
  {
    icon: "🏺",
    title: "Authentic Heritage",
    desc: "Deep connections to Africa's most significant historical sites and cultural traditions.",
  },
  {
    icon: "🛁",
    title: "Luxury Comfort",
    desc: "Premium accommodation and transport curated for the highest standards of comfort.",
  },
  {
    icon: "🧭",
    title: "Expert Guidance",
    desc: "Award-winning local guides with decades of knowledge and passionate storytelling.",
  },
  {
    icon: "✍️",
    title: "Personalised Service",
    desc: "Every journey tailored to your interests, pace, and unique travel vision.",
  },
]

export const WhyKobani = ({ onNavigate }: { onNavigate: (page: Page) => void }) => {
  const { t } = useTranslation()
  const localizedCards = [
    { ...whyCards[0], title: t("homeSections.why.heritageTitle"), desc: t("homeSections.why.heritageDesc") },
    { ...whyCards[1], title: t("homeSections.why.comfortTitle"), desc: t("homeSections.why.comfortDesc") },
    { ...whyCards[2], title: t("homeSections.why.guidanceTitle"), desc: "Destination knowledge and thoughtful storytelling shape each KOBANI experience." },
    { ...whyCards[3], title: t("homeSections.why.serviceTitle"), desc: t("homeSections.why.serviceDesc") },
  ]
  return (
  <section className="py-20 px-4" style={{ background: "#F8F4EA" }}>
    <div className="mx-auto" style={{ maxWidth: 1240 }}>
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center rounded-2xl overflow-hidden"
        style={{
          background: "#FFFFFF",
          border: "1px solid #E6DFD2",
          boxShadow: "0 8px 32px rgba(0,0,0,0.07)",
        }}
      >
        <div className="relative" style={{ minHeight: 480 }}>
          <img
            src="https://images.unsplash.com/photo-1515914560649-8fe5d631aa62?w=700&h=600&fit=crop&auto=format"
            alt="Safari giraffe experience"
            className="w-full h-full object-cover"
            style={{ minHeight: 480 }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, transparent 60%, rgba(11,11,11,0.3) 100%)",
            }}
          />
          <div className="absolute bottom-6 left-6 right-6">
            <div
              className="rounded-xl p-4"
              style={{
                background: "rgba(11,11,11,0.75)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                className="text-xs font-semibold mb-1"
                style={{ color: "#C6A15B" }}
              >
                Purposeful travel in Ghana
              </div>
              <div className="text-sm font-medium text-white">
                Thoughtfully curated heritage and hospitality experiences
              </div>
            </div>
          </div>
        </div>
        <div className="p-8 lg:p-10">
          <SectionLabel>{t("homeSections.why.eyebrow")}</SectionLabel>
          <h2
            className="font-serif text-3xl font-bold mb-4 leading-tight"
            style={{ fontFamily: "var(--font-serif)", color: "#0B0B0B" }}
          >
            {t("homeSections.why.title")}
          </h2>
          <p
            className="text-sm leading-relaxed mb-8"
            style={{ color: "#6F6B63" }}
          >
            We believe travel should transform. KOBANI connects you with
            Africa's soul — its ancient stories, living cultures, and
            breathtaking landscapes — with the care and precision of a luxury
            concierge.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {localizedCards.map((card) => (
              <div
                key={card.title}
                className="p-4 rounded-xl"
                style={{ background: "#F8F4EA", border: "1px solid #E6DFD2" }}
              >
                <div className="text-2xl mb-2">{card.icon}</div>
                <div
                  className="font-semibold text-sm mb-1"
                  style={{ color: "#202020" }}
                >
                  {card.title}
                </div>
                <div
                  className="text-xs leading-relaxed"
                  style={{ color: "#6F6B63" }}
                >
                  {card.desc}
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => onNavigate("about")} className="btn-black inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white">
            {t("homeSections.why.discover")} <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  </section>
  )
}

// ─── Upcoming Journey ──────────────────────────────────────────────────────────
export const UpcomingJourney = ({ onNavigate }: { onNavigate: (page: Page) => void }) => {
  return (
  <section className="py-20 px-4" style={{ background: "#FFFDF8" }}>
    <div className="mx-auto" style={{ maxWidth: 1240 }}>
      <div
        className="rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2"
        style={{ background: "#0B0B0B", border: "1px solid #2A2A2A" }}
      >
        <div className="relative" style={{ minHeight: 360 }}>
          <img
            src="https://images.unsplash.com/photo-1761364622323-833282bb4aef?w=700&h=500&fit=crop&auto=format"
            alt="Safari sunset journey"
            className="w-full h-full object-cover"
            style={{ minHeight: 360 }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, transparent 40%, rgba(11,11,11,0.8) 100%)",
            }}
          />
          <div className="absolute top-5 left-5">
            <span
              className="text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider"
              style={{ background: "#C6A15B", color: "#0B0B0B" }}
            >
              Featured Experience
            </span>
          </div>
        </div>
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "#C6A15B" }}>Heritage-focused travel</div>
          <h2
            className="font-serif text-2xl md:text-3xl font-bold mb-3 leading-tight"
            style={{ fontFamily: "var(--font-serif)", color: "#FFFFFF" }}
          >
            Discover KOBANI Journeys
          </h2>
          <p
            className="text-sm leading-relaxed mb-6"
            style={{ color: "#9A9590" }}
          >
            Explore thoughtfully planned historical, cultural and luxury experiences across Ghana. Upcoming departure dates are being finalized by our team.
          </p>
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {["Historical insight", "Local knowledge", "Considered comfort"].map((item) => <div key={item} className="rounded-xl px-4 py-3 text-center text-xs font-semibold text-[#C6A15B]" style={{ background: "#171717", border: "1px solid #2A2A2A" }}>{item}</div>)}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate("tours")}
              className="btn-gold px-6 py-3 rounded-full text-sm font-bold"
              style={{ color: "#0B0B0B" }}
            >
              Explore Tours
            </button>
            <span className="text-xs" style={{ color: "#6F6B63" }}>
              Contact KOBANI for departure availability.
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
  )
}

// ─── African Market ────────────────────────────────────────────────────────────
const products = [
  {
    id: 1,
    name: "Kente Travel Bag",
    category: "Luggage & Bags",
    price: "$89",
    oldPrice: "$120",
    badge: "Sale",
    image:
      "https://images.unsplash.com/photo-1578832663461-b4c2bff45c8a?w=400&h=400&fit=crop&auto=format",
    rating: 4,
  },
  {
    id: 2,
    name: "Handcrafted Beaded Necklace",
    category: "Jewellery",
    price: "$45",
    oldPrice: null,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1709808532841-6e336c7da4b6?w=400&h=400&fit=crop&auto=format",
    rating: 5,
  },
  {
    id: 3,
    name: "African Heritage Art Print",
    category: "Art & Prints",
    price: "$65",
    oldPrice: null,
    badge: null,
    image:
      "https://images.unsplash.com/photo-1673773675821-1c0728832af9?w=400&h=400&fit=crop&auto=format",
    rating: 5,
  },
  {
    id: 4,
    name: "Traditional Woven Basket",
    category: "Home Décor",
    price: "$38",
    oldPrice: "$55",
    badge: "Sale",
    image:
      "https://images.unsplash.com/photo-1680713660046-67b7350ed679?w=400&h=400&fit=crop&auto=format",
    rating: 4,
  },
]

const ProductCard = ({ product }: { product: typeof products[0] }) => {
  const [fav, setFav] = useState(false)
  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: "#FFFFFF",
        border: "1px solid #E6DFD2",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      }}
    >
      <div className="relative overflow-hidden" style={{ height: 200 }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          {product.badge && (
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{
                background: product.badge === "Sale" ? "#C84A4A" : "#C6A15B",
                color: product.badge === "Sale" ? "#FFFFFF" : "#0B0B0B",
              }}
            >
              {product.badge}
            </span>
          )}
        </div>
        <button
          onClick={() => setFav((f) => !f)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.92)" }}
        >
          <HeartIcon filled={fav} />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="text-xs mb-0.5" style={{ color: "#C6A15B" }}>
          {product.category}
        </div>
        <div
          className="font-semibold text-sm mb-2"
          style={{ color: "#202020" }}
        >
          {product.name}
        </div>
        <Stars rating={product.rating} />
        <div className="flex items-center gap-2 mt-2 mb-4">
          <span className="font-bold text-base" style={{ color: "#0B0B0B" }}>
            {product.price}
          </span>
          {product.oldPrice && (
            <span className="text-sm line-through" style={{ color: "#9A9590" }}>
              {product.oldPrice}
            </span>
          )}
        </div>
        <button
          className="mt-auto btn-gold flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold w-full"
          style={{ color: "#0B0B0B" }}
        >
          <ShoppingCartIcon /> Add to Cart
        </button>
      </div>
    </div>
  )
}

export const AfricanMarket = ({onNavigate}:{onNavigate:(p:Page)=>void}) => {
  const [liveProducts,setLiveProducts]=useState<MarketProduct[]>([])
  useEffect(()=>{marketApi.list().then(r=>setLiveProducts(r.data.products.slice(0,4))).catch(()=>setLiveProducts([]))},[])
  if(!liveProducts.length)return null
  const money=(n:number)=>new Intl.NumberFormat("en-GH",{style:"currency",currency:"GHS"}).format(n/100)
  return <section className="py-20 px-4" style={{ background: "#F8F4EA" }}>
    <div className="mx-auto" style={{ maxWidth: 1240 }}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
        <div>
          <SectionLabel>Shop African</SectionLabel>
          <h2
            className="font-serif text-3xl md:text-4xl font-bold"
            style={{ fontFamily: "var(--font-serif)", color: "#0B0B0B" }}
          >
            Discover the Unique African Market
          </h2>
        </div>
        <button
          onClick={()=>onNavigate("market")}
          className="flex-shrink-0 flex items-center gap-1.5 text-sm font-semibold"
          style={{ color: "#C6A15B" }}
        >
          Explore Market <ArrowRightIcon />
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {liveProducts.map((p) => (
          <article key={p.id} className="rounded-2xl overflow-hidden bg-white border border-[#E6DFD2]">
            <button className="w-full aspect-square overflow-hidden" onClick={()=>{setSelectedProduct(p.slug);onNavigate("market-product")}}>{p.image_url&&<img src={resolveMediaUrl(p.image_url)} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition"/>}</button>
            <div className="p-4"><p className="text-[10px] uppercase text-[#9A7A3A]">{p.category}</p><h3 className="font-serif font-bold mt-1">{p.name}</h3><div className="flex justify-between items-center mt-4"><b>{money(p.sale_price_minor||p.price_minor)}</b><button disabled={!p.stock} className="btn-gold px-3 py-2 rounded-xl text-xs font-bold disabled:opacity-40" onClick={()=>addToCart(p)}>Add to cart</button></div></div>
          </article>
        ))}
      </div>
    </div>
  </section>
}

// ─── Statistics ────────────────────────────────────────────────────────────────
export const Statistics = () => (
  <section className="py-20 px-4" style={{ background: "#FFFDF8" }}>
    <div className="mx-auto" style={{ maxWidth: 1240 }}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { value: "Heritage", label: "Historically Mindful Journeys", icon: "🗺️" },
          { value: "Comfort", label: "Considered Hospitality", icon: "✦" },
          { value: "Ghana", label: "Destination Knowledge", icon: "✈️" },
          { value: "Care", label: "Dedicated Travel Support", icon: "🏆" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-6 text-center"
            style={{ background: "#0B0B0B", border: "1px solid #2A2A2A" }}
          >
            <div className="text-3xl mb-3">{s.icon}</div>
            <div
              className="font-serif text-3xl md:text-4xl font-bold mb-1"
              style={{ color: "#C6A15B", fontFamily: "var(--font-serif)" }}
            >
              {s.value}
            </div>
            <div className="text-sm" style={{ color: "#9A9590" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

// ─── Articles ─────────────────────────────────────────────────────────────────
const articles = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1597543294759-76598854781e?w=600&h=380&fit=crop&auto=format",
    category: "History",
    title: "The Hidden Stories of Cape Coast Castle",
    summary:
      "Walking through the corridors of Cape Coast Castle reveals a layered history that shaped our world.",
    author: "Kwame Asante",
    date: "July 18, 2026",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1558857014-f7610e096682?w=600&h=380&fit=crop&auto=format",
    category: "Culture",
    title: "Understanding the Significance of Kente Cloth",
    summary:
      "Each pattern woven into Kente cloth carries a proverb, a royal lineage, or a spiritual belief.",
    author: "Abena Mensah",
    date: "June 30, 2026",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1595339796956-e4bd91b6c7f3?w=600&h=380&fit=crop&auto=format",
    category: "Travel",
    title: "Why West Africa Should Be Your Next Luxury Destination",
    summary:
      "Beyond the wildlife of East Africa lies a constellation of ancient empires and untouched coastlines.",
    author: "Yaw Darko",
    date: "June 10, 2026",
  },
]

export const Articles = () => (
  <section className="py-20 px-4" style={{ background: "#F8F4EA" }}>
    <div className="mx-auto" style={{ maxWidth: 1240 }}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
        <div>
          <SectionLabel>Stories & Insights</SectionLabel>
          <h2
            className="font-serif text-3xl md:text-4xl font-bold"
            style={{ fontFamily: "var(--font-serif)", color: "#0B0B0B" }}
          >
            Explore Africa Through Our Stories
          </h2>
        </div>
        <a
          href="#"
          className="flex-shrink-0 flex items-center gap-1.5 text-sm font-semibold"
          style={{ color: "#C6A15B" }}
        >
          View All Articles <ArrowRightIcon />
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((a) => (
          <div
            key={a.id}
            className="rounded-2xl overflow-hidden flex flex-col"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E6DFD2",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            }}
          >
            <div className="relative overflow-hidden" style={{ height: 200 }}>
              <img
                src={a.image}
                alt={a.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute top-3 left-3">
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: "#C6A15B", color: "#0B0B0B" }}
                >
                  {a.category}
                </span>
              </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h3
                className="font-serif font-bold text-base mb-2 leading-snug"
                style={{ fontFamily: "var(--font-serif)", color: "#0B0B0B" }}
              >
                {a.title}
              </h3>
              <p
                className="text-xs leading-relaxed mb-4 flex-1"
                style={{ color: "#6F6B63" }}
              >
                {a.summary}
              </p>
              <div
                className="flex items-center justify-between pt-3"
                style={{ borderTop: "1px solid #E6DFD2" }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: "#E9D6A8", color: "#0B0B0B" }}
                  >
                    {a.author[0]}
                  </div>
                  <div>
                    <div
                      className="text-xs font-semibold"
                      style={{ color: "#202020" }}
                    >
                      {a.author}
                    </div>
                    <div className="text-xs" style={{ color: "#9A9590" }}>
                      {a.date}
                    </div>
                  </div>
                </div>
                <a
                  href="#"
                  className="flex items-center gap-1 text-xs font-semibold"
                  style={{ color: "#C6A15B" }}
                >
                  Read More <ArrowRightIcon size={14} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

// ─── Testimonials ─────────────────────────────────────────────────────────────
const LegacyTestimonials = () => (
  <section className="py-20 px-4" style={{ background: "#FFFDF8" }}>
    <div className="mx-auto" style={{ maxWidth: 1240 }}>
      <div className="text-center mb-12">
        <SectionLabel>Traveller Stories</SectionLabel>
        <h2
          className="font-serif text-3xl md:text-4xl font-bold"
          style={{ fontFamily: "var(--font-serif)", color: "#0B0B0B" }}
        >
          Stories From Our Travellers
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            name: "Sarah Mitchell",
            country: "United Kingdom",
            flag: "🇬🇧",
            rating: 5,
            review:
              "KOBANI gave us a journey we never imagined possible. The Cape Coast experience was deeply moving and beautifully curated.",
            tour: "Cape Coast Heritage Experience",
            initials: "SM",
          },
          {
            name: "James Okonkwo",
            country: "Nigeria",
            flag: "🇳🇬",
            rating: 5,
            review:
              "As a Nigerian rediscovering West Africa's history, I was genuinely moved by the depth of knowledge our guides brought.",
            tour: "Royal Ashanti Cultural Journey",
            initials: "JO",
          },
          {
            name: "Amara Diallo",
            country: "France",
            flag: "🇫🇷",
            rating: 5,
            review:
              "The Luxury Coastal Escape was the finest travel experience I've ever had. KOBANI understands that true luxury is about authentic connection.",
            tour: "Luxury Ghana Coastal Escape",
            initials: "AD",
          },
        ].map((t) => (
          <div
            key={t.name}
            className="rounded-2xl p-6 flex flex-col"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E6DFD2",
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #C6A15B, #E9D6A8)",
                  color: "#0B0B0B",
                }}
              >
                {t.initials}
              </div>
              <div className="flex-1">
                <div
                  className="font-semibold text-sm"
                  style={{ color: "#202020" }}
                >
                  {t.name}
                </div>
                <div className="text-xs" style={{ color: "#6F6B63" }}>
                  {t.flag} {t.country}
                </div>
              </div>
              <Stars rating={t.rating} />
            </div>
            <p
              className="text-sm leading-relaxed flex-1 italic mb-4"
              style={{ color: "#6F6B63" }}
            >
              "{t.review}"
            </p>
            <div
              className="pt-3 text-xs font-semibold flex items-center gap-1.5"
              style={{ borderTop: "1px solid #E6DFD2", color: "#C6A15B" }}
            >
              ✦ {t.tour}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

// ─── Gallery Preview ───────────────────────────────────────────────────────────
export const Testimonials = ({ onNavigate }: { onNavigate: (page: Page) => void }) => (
  <section className="py-20 px-4" style={{ background: "#FFFDF8" }}><div className="mx-auto" style={{ maxWidth: 1240 }}><div className="text-center mb-10"><SectionLabel>Traveller Stories</SectionLabel><h2 className="font-serif text-3xl md:text-4xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#0B0B0B" }}>Share Your KOBANI Experience</h2></div><div className="mx-auto max-w-2xl rounded-2xl border border-[#E6DFD2] bg-white p-8 text-center shadow-sm"><p className="text-sm leading-7 text-[#6F6B63]">Travelled with KOBANI? We welcome genuine feedback about your journey and the service you received.</p><button onClick={() => onNavigate("contact")} className="btn-gold mt-6 rounded-xl px-6 py-3 text-sm font-semibold text-[#0B0B0B]">Share Your Experience</button></div></div></section>
)

const LegacyGalleryPreview = () => (
  <section className="py-20 px-4" style={{ background: "#F8F4EA" }}>
    <div className="mx-auto" style={{ maxWidth: 1240 }}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <SectionLabel>Gallery</SectionLabel>
          <h2
            className="font-serif text-3xl md:text-4xl font-bold"
            style={{ fontFamily: "var(--font-serif)", color: "#0B0B0B" }}
          >
            Moments From KOBANI
          </h2>
        </div>
        <a
          href="#"
          className="flex-shrink-0 flex items-center gap-1.5 text-sm font-semibold"
          style={{ color: "#C6A15B" }}
        >
          View Full Gallery <ArrowRightIcon />
        </a>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <div
          className="col-span-2 lg:col-span-1 lg:row-span-2 rounded-2xl overflow-hidden"
          style={{ height: 400 }}
        >
          <img
            src="https://images.unsplash.com/photo-1728042107033-76b13feac547?w=700&h=600&fit=crop&auto=format"
            alt="Safari giraffes"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
        {[
          {
            src: "https://images.unsplash.com/photo-1709808532841-6e336c7da4b6?w=400&h=280&fit=crop&auto=format",
            alt: "Cultural ceremony",
          },
          {
            src: "https://images.unsplash.com/photo-1597543294759-76598854781e?w=400&h=280&fit=crop&auto=format",
            alt: "Cape Coast",
          },
          {
            src: "https://images.unsplash.com/photo-1595339796956-e4bd91b6c7f3?w=400&h=280&fit=crop&auto=format",
            alt: "Savanna sunset",
          },
          {
            src: "https://images.unsplash.com/photo-1578832663461-b4c2bff45c8a?w=400&h=280&fit=crop&auto=format",
            alt: "Ocean journey",
          },
        ].map((img, i) => (
          <div
            key={i}
            className="rounded-2xl overflow-hidden"
            style={{ height: 190 }}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  </section>
)

// ─── Payment Section ───────────────────────────────────────────────────────────
export const GalleryPreview = ({ onNavigate }: { onNavigate: (page: Page) => void }) => {
  const [items, setItems] = useState<GalleryItem[]>([])
  useEffect(() => { galleryApi.publicList({ limit: 5 }).then(result => setItems(result.data.items.slice(0, 5))).catch(() => setItems([])) }, [])
  if (!items.length) return null
  return <section className="py-20 px-4" style={{ background: "#F8F4EA" }}><div className="mx-auto" style={{ maxWidth: 1240 }}><div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"><div><SectionLabel>Gallery</SectionLabel><h2 className="font-serif text-3xl md:text-4xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#0B0B0B" }}>Moments From KOBANI</h2></div><button onClick={() => onNavigate("gallery")} className="flex-shrink-0 flex items-center gap-1.5 text-sm font-semibold text-[#C6A15B]">View Full Gallery <ArrowRightIcon /></button></div><div className="grid grid-cols-2 lg:grid-cols-3 gap-3">{items.map((item, index) => <button key={item.id} onClick={() => onNavigate("gallery")} aria-label={`View ${item.title} in the KOBANI gallery`} className={`${index === 0 ? "col-span-2 lg:col-span-1 lg:row-span-2 h-[400px]" : "h-[190px]"} overflow-hidden rounded-2xl`}><img loading="lazy" src={resolveMediaUrl(item.image.url)} alt={item.alt_text || item.title} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" /></button>)}</div></div></section>
}

export const PaymentSection = () => (
  <section className="py-20 px-4" style={{ background: "#FFFDF8" }}>
    <div className="mx-auto" style={{ maxWidth: 1240 }}>
      <div
        className="rounded-2xl p-8 md:p-12 text-center"
        style={{
          background: "#FFFFFF",
          border: "1.5px solid #E9D6A8",
          boxShadow: "0 8px 32px rgba(198,161,91,0.08)",
        }}
      >
        <ShieldIcon size={28} />
        <div
          className="mt-4 mb-2 font-serif text-2xl md:text-3xl font-bold"
          style={{ fontFamily: "var(--font-serif)", color: "#0B0B0B" }}
        >
          Secure and Convenient Payments
        </div>
        <p
          className="text-sm mb-8 max-w-md mx-auto"
          style={{ color: "#6F6B63" }}
        >
          Reserve your experience confidently using trusted international
          payment methods with bank-grade encryption.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
          {["VISA", "MC", "PayPal", "Apple Pay", "Google Pay"].map((m) => (
            <div
              key={m}
              className="px-5 py-3 rounded-xl flex items-center justify-center font-bold text-sm"
              style={{
                border: "1.5px solid #E6DFD2",
                background: "#F8F4EA",
                color: "#202020",
                minWidth: 90,
              }}
            >
              {m}
            </div>
          ))}
        </div>
        <div
          className="flex items-center justify-center gap-2 text-xs"
          style={{ color: "#27855C" }}
        >
          <ShieldIcon size={16} /> Secure encrypted checkout — your data is
          always protected
        </div>
      </div>
    </div>
  </section>
)
