import { useEffect, useState } from "react"
import type { Page } from "./App"
import {
  resolveMediaUrl,
  savedTourApi,
  type Tour,
  type TourCategory,
  tourApi,
} from "./api"
import { useAuth } from "./AuthContext"
import { useTranslation } from "react-i18next"

export default function ToursPage({
  onViewDetails,
  onBookNow,
  onNavigate,
}: {
  onViewDetails: (slug: string) => void
  onBookNow: (tour: Tour) => void
  onNavigate: (page: Page) => void
}) {
  const { isAuthenticated } = useAuth()
  const { i18n } = useTranslation()
  const [tours, setTours] = useState<Tour[]>([]),
    [categories, setCategories] = useState<TourCategory[]>([]),
    [saved, setSaved] = useState<Set<string>>(new Set()),
    [saving, setSaving] = useState<Set<string>>(new Set()),
    [search, setSearch] = useState(""),
    [category, setCategory] = useState(""),
    [country, setCountry] = useState(""),
    [maxPrice, setMaxPrice] = useState(""),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("")
  const load = async () => {
    setLoading(true)
    try {
      const result = await tourApi.publicList({
        search,
        category,
        country,
        price_max: maxPrice,
        limit: 60,
      })
      setTours(result.data.tours.filter((tour) => !/\(copy\)\s*$/i.test(tour.title.trim())))
      setCategories(result.data.categories)
      setError("")
    } catch {
      setError("The tour catalogue could not be loaded. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    const timer = setTimeout(() => void load(), 180)
    return () => clearTimeout(timer)
  }, [search, category, country, maxPrice, i18n.resolvedLanguage])
  useEffect(() => {
    if (isAuthenticated)
      savedTourApi
        .list()
        .then((result) => setSaved(new Set(result.data.saved_ids)))
        .catch(() => {})
    else setSaved(new Set())
  }, [isAuthenticated])
  const toggle = async (tour: Tour) => {
    if (!isAuthenticated) {
      sessionStorage.setItem("kobani:returnPage", "tours")
      onNavigate("login")
      return
    }
    if (saving.has(tour.id)) return
    setSaving((value) => new Set(value).add(tour.id))
    try {
      if (saved.has(tour.id)) {
        await savedTourApi.remove(tour.id)
        setSaved((value) => {
          const next = new Set(value)
          next.delete(tour.id)
          return next
        })
      } else {
        await savedTourApi.save(tour.id)
        setSaved((value) => new Set(value).add(tour.id))
      }
    } finally {
      setSaving((value) => {
        const next = new Set(value)
        next.delete(tour.id)
        return next
      })
    }
  }
  const countries = [...new Set(tours.map((item) => item.country))]
  return (
    <div className="min-h-screen bg-[#F8F4EA]">
      <section className="bg-[#0B0B0B] px-5 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold tracking-[.25em] text-[#C6A15B]">
            CURATED AFRICAN JOURNEYS
          </p>
          <h1 className="mt-4 max-w-4xl font-serif text-5xl font-bold sm:text-7xl">
            Travel deeper. Remember forever.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/60">
            Historical insight, exceptional hospitality and carefully planned
            departures across Africa.
          </p>
        </div>
      </section>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="relative -mt-20 grid gap-3 rounded-2xl border bg-white p-4 shadow-lg sm:grid-cols-2 lg:grid-cols-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tours or destinations…"
            className="h-12 rounded-xl border px-4 text-sm"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-12 rounded-xl border px-3 text-sm"
          >
            <option value="">All experiences</option>
            {categories.map((item) => (
              <option value={item.slug} key={item.id}>
                {item.name} ({item.tour_count || 0})
              </option>
            ))}
          </select>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="h-12 rounded-xl border px-3 text-sm"
          >
            <option value="">All countries</option>
            {countries.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
          <select
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="h-12 rounded-xl border px-3 text-sm"
          >
            <option value="">Any price</option>
            <option value="1000">Up to 1,000</option>
            <option value="2000">Up to 2,000</option>
            <option value="3000">Up to 3,000</option>
          </select>
        </div>
        <div className="mt-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold tracking-[.2em] text-[#B88B39]">
              EXPLORE THE COLLECTION
            </p>
            <h2 className="mt-2 font-serif text-4xl font-bold">
              {tours.length} journeys
            </h2>
          </div>
          {(search || category || country || maxPrice) && (
            <button
              onClick={() => {
                setSearch("")
                setCategory("")
                setCountry("")
                setMaxPrice("")
              }}
              className="text-sm underline"
            >
              Clear filters
            </button>
          )}
        </div>
        {loading ? (
          <div className="py-24 text-center text-[#777]">
            Loading curated journeys…
          </div>
        ) : error ? (
          <div className="py-24 text-center text-red-700">{error}</div>
        ) : !tours.length ? (
          <div className="py-24 text-center">
            <h3 className="font-serif text-3xl font-bold">
              No journeys match these filters
            </h3>
            <p className="mt-2 text-[#777]">
              Try another category, destination or price.
            </p>
          </div>
        ) : (
          <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tours.map((tour) => {
              const available = Math.max(
                  0,
                  tour.total_capacity - tour.total_booked,
                ),
                bookable = tour.departure_count > 0 && available > 0,
                isSaved = saved.has(tour.id)
              return (
                <article
                  key={tour.id}
                  className="group overflow-hidden rounded-2xl border bg-white"
                >
                  <a
                    href={`/tours/${encodeURIComponent(tour.slug)}`}
                    onClick={(event) => { event.preventDefault(); onViewDetails(tour.slug) }}
                    className="block w-full text-left"
                  >
                    <div className="h-64 overflow-hidden bg-[#EAE2D3]">
                      {tour.featured_image ? (
                        <img
                          src={resolveMediaUrl(tour.featured_image.url)}
                          alt={tour.featured_image.alt_text || tour.title}
                          className={`h-full w-full transition duration-500 group-hover:scale-105 ${tour.booking_mode === "flyer_request" ? "object-contain p-2" : "object-cover"}`}
                        />
                      ) : (
                        <div className="grid h-full place-items-center text-[#999]">
                          KOBANI Tours
                        </div>
                      )}
                    </div>
                    <div className="p-5 pb-3">
                      <div className="flex justify-between text-xs text-[#877B68]">
                        <span>{tour.category?.name}</span>
                        {tour.booking_mode !== "flyer_request" && <span>{tour.min_duration_days===tour.max_duration_days?`${tour.min_duration_days} days`:`${tour.min_duration_days}–${tour.max_duration_days} days`}</span>}
                      </div>
                      <h3 className="mt-2 font-serif text-2xl font-bold">
                        {tour.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-[#777]">
                        {tour.short_description ||
                          `${tour.destination}, ${tour.country}`}
                      </p>
                      {tour.booking_mode === "flyer_request" ? <div className="mt-5 text-sm font-bold text-[#A57B31]">View Details →</div> : <><div className="mt-5 flex items-end justify-between">
                        <div>
                          <span className="text-xs text-[#888]">From</span>
                          <b className="block font-serif text-2xl">
                            {tour.packages[0]?.currency||tour.currency} {tour.starting_price.toLocaleString()}
                          </b>
                        </div>
                        <span className="text-sm font-bold text-[#A57B31]">
                          View journey →
                        </span>
                      </div>
                      <div className="mt-4 border-t pt-3 text-xs text-[#777]">
                        {tour.package_count} Package Option{tour.package_count===1?"":"s"} · {tour.departure_count} scheduled departure
                        {tour.departure_count === 1 ? "" : "s"} · {available}{" "}
                        places available
                      </div>
                      </>}
                    </div>
                  </a>
                  <div className="grid grid-cols-[52px_1fr] gap-2 px-5 pb-5">
                    <button
                      disabled={saving.has(tour.id)}
                      onClick={() => void toggle(tour)}
                      aria-label={
                        isSaved
                          ? `Remove ${tour.title} from saved tours`
                          : `Save ${tour.title}`
                      }
                      title={isSaved ? "Saved" : "Save tour"}
                      className={`grid h-12 place-items-center rounded-xl border text-xl transition ${
                        isSaved
                          ? "border-[#C84A4A]/30 bg-[#C84A4A]/5 text-[#C84A4A]"
                          : "border-[#E6DFD2] text-[#6F6B63] hover:border-[#C6A15B] hover:text-[#C6A15B]"
                      }`}
                    >
                      {isSaved ? "♥" : "♡"}
                    </button>
                    <button
                      onClick={() => tour.booking_mode === "flyer_request" ? onViewDetails(tour.slug) : bookable ? onBookNow(tour) : onNavigate("contact")}
                      className="rounded-xl bg-[#C6A15B] py-3 text-sm font-bold"
                    >
                      {tour.booking_mode === "flyer_request" ? "View Details" : bookable ? "Book Now" : "Ask About This Tour"}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
        <section className="mt-14 flex flex-col justify-between gap-6 rounded-3xl bg-[#181713] p-8 text-white sm:flex-row sm:items-center sm:p-12">
          <div>
            <p className="text-xs tracking-[.2em] text-[#C6A15B]">
              TAILOR-MADE TRAVEL
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold">
              Need a private departure?
            </h2>
            <p className="mt-2 text-white/60">
              Our team will shape an itinerary around your dates and interests.
            </p>
          </div>
          <button
            onClick={() => onNavigate("contact")}
            className="whitespace-nowrap rounded-xl bg-[#C6A15B] px-6 py-3 font-bold text-black"
          >
            Speak with an expert
          </button>
        </section>
      </main>
    </div>
  )
}
