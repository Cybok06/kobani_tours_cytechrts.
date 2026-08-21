import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import type { Page } from "./App"
import { hotelApi, type Hotel } from "./api"
import { COMPANY } from "./companyProfile"
export default function HotelsPage({
  onNavigate,
  onHotel,
}: {
  onNavigate: (p: Page) => void
  onHotel: (slug: string) => void
}) {
  const { t } = useTranslation(),
    [hotels, setHotels] = useState<Hotel[]>([]),
    [regions, setRegions] = useState<string[]>([]),
    [q, setQ] = useState(""),
    [region, setRegion] = useState(""),
    [stars, setStars] = useState(""),
    [sort, setSort] = useState(""),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("")
  const load = () => {
    setLoading(true)
    hotelApi
      .list({ search: q, region, stars, sort })
      .then((r) => {
        setHotels(r.data.hotels)
        setRegions(r.data.regions)
      })
      .catch(() => setError("Hotels could not be loaded. Please try again."))
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [region, stars, sort])
  return (
    <main>
      <section className="bg-[#111] text-white px-5 py-20 text-center">
        <p className="eyebrow text-[#C6A15B]">{t("hotels.eyebrow")}</p>
        <h1 className="font-serif text-4xl sm:text-6xl mt-3">
          {t("hotels.title")}
        </h1>
        <p className="max-w-2xl mx-auto mt-5 text-white/70">
          {t("hotels.subtitle")}
        </p>
      </section>
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-[1fr_200px_160px_190px_auto] gap-3 bg-[#F8F4EA] border p-4 rounded-2xl">
          <input
            aria-label="Search hotels"
            className="admin-input"
            placeholder={t("hotels.search")}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
          />
          <select
            aria-label="Region"
            className="admin-input"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="">All regions</option>
            {regions.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <select
            aria-label="Star rating"
            className="admin-input"
            value={stars}
            onChange={(e) => setStars(e.target.value)}
          >
            <option value="">All stars</option>
            {[5, 4, 3, 2, 1].map((x) => (
              <option value={x} key={x}>
                {x} stars
              </option>
            ))}
          </select>
          <select
            aria-label="Sort hotels"
            className="admin-input"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Recommended</option>
            <option value="rating">Highest Rated</option>
            <option value="popular">Most Popular</option>
            <option value="price_low">Price Low to High</option>
            <option value="price_high">Price High to Low</option>
          </select>
          <button
            className="bg-[#C6A15B] px-6 rounded-xl font-bold"
            onClick={load}
          >
            Search
          </button>
        </div>
        {error && (
          <p role="alert" className="text-red-700 mt-5">
            {error}
          </p>
        )}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {[1, 2, 3].map((x) => (
              <div
                className="h-96 bg-[#EEE8DC] animate-pulse rounded-2xl"
                key={x}
              />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7 mt-10">
            {hotels.map((h) => (
              <HotelCard hotel={h} onHotel={onHotel} />
            ))}
          </div>
        )}
        {!loading && !hotels.length && (
          <div className="py-24 text-center">
            <h2 className="font-serif text-3xl">{q || region || stars ? t("hotels.noMatches") : "Our accommodation collection is being curated"}</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#6F6B63]">{q || region || stars ? "Try adjusting your hotel filters." : "Contact KOBANI for accommodation recommendations and booking assistance for your Ghana journey."}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">{(q || region || stars) && <button className="rounded-xl border border-[#C6A15B] px-5 py-3 text-sm font-semibold text-[#9A7636]" onClick={() => { setQ(""); setRegion(""); setStars("") }}>Clear filters</button>}<button onClick={() => onNavigate("contact")} className="btn-gold rounded-xl px-5 py-3 text-sm font-semibold">Contact Us</button><a href={COMPANY.whatsappChat} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-[#168A49] px-5 py-3 text-sm font-semibold text-white">WhatsApp</a></div>
          </div>
        )}
      </section>
    </main>
  )
}
export function HotelCard({
  hotel: h,
  onHotel,
  source = "hotel_card",
}: {
  hotel: Hotel
  onHotel: (s: string) => void
  source?: string
}) {
  const { t } = useTranslation()
  return (
    <article className="group bg-white border border-[#DED3C1] rounded-2xl overflow-hidden shadow-sm hover:-translate-y-1 transition">
      <button
        className="block w-full text-left"
        onClick={() => onHotel(h.slug)}
      >
        <div className="relative h-60 bg-[#EAE2D5]">
          {h.cover_image?.url && (
            <img
              loading="lazy"
              src={h.cover_image.url}
              alt={h.cover_image.alt_text || h.name}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition"
            />
          )}
          <div className="absolute top-3 left-3 flex gap-2">
            {h.verified && (
              <span className="bg-[#111] text-[#E9D6A8] text-[10px] px-3 py-2 rounded-full">
                KOBANI VERIFIED
              </span>
            )}
            {h.featured && (
              <span className="bg-[#C6A15B] text-black text-[10px] px-3 py-2 rounded-full">
                FEATURED
              </span>
            )}
          </div>
        </div>
        <div className="p-5">
          <p className="text-[#B28B40]">
            {h.star_rating ? "★".repeat(h.star_rating) : "Unrated"}
          </p>
          <h2 className="font-serif text-2xl font-bold mt-1">{h.name}</h2>
          <p className="text-sm text-[#6F6B63] mt-1">
            {[h.city, h.region].filter(Boolean).join(", ")}
          </p>
          <p className="mt-4 text-sm line-clamp-2">{h.short_description}</p>
          <p className="text-xs text-[#6F6B63] mt-4 line-clamp-1">
            {h.amenities?.slice(0, 4).join(" · ")}
          </p>
          <div className="flex justify-between mt-5">
            <span>
              {h.rating_count
                ? `${h.rating_average} ★ (${h.rating_count})`
                : t("hotels.noReviews")}
            </span>
            <b>
              {h.price_from
                ? `${t("hotels.from")} ${h.currency} ${h.price_from.toLocaleString()}`
                : "Contact hotel"}
            </b>
          </div>
        </div>
      </button>
      <div className="grid grid-cols-2 border-t">
        <button className="p-4 font-bold" onClick={() => onHotel(h.slug)}>
          {t("hotels.viewDetails")}
        </button>
        <a
          className="p-4 bg-[#168A49] text-white text-center font-bold"
          href={hotelApi.whatsappUrl(h.id, source)}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>
      </div>
    </article>
  )
}
