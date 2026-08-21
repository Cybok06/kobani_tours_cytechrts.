import { useEffect, useMemo, useState } from "react"
import { useAuth } from "./AuthContext"
import type { Page } from "./App"
import {
  bookingApi,
  resolveMediaUrl,
  type BookingPrice,
  type Tour,
  type TourPackage,
  tourApi,
} from "./api"
import SEO, {
  breadcrumbSchema,
  canonicalUrl,
  ORGANIZATION_NAME,
  SITE_URL,
} from "./seo"
const money = (currency: string, n: number) =>
  new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(n)
const slug = () =>
  decodeURIComponent(location.pathname.split("/").filter(Boolean).pop() || "")
export default function TourDetailsPage({
  onNavigate,
}: {
  onNavigate: (p: Page) => void
}) {
  const { isAuthenticated } = useAuth()
  const [flyerOpen, setFlyerOpen] = useState(false)
  useEffect(()=>{if(!flyerOpen)return;const close=(event:KeyboardEvent)=>{if(event.key==="Escape")setFlyerOpen(false)};const previous=document.body.style.overflow;document.body.style.overflow="hidden";window.addEventListener("keydown",close);return()=>{document.body.style.overflow=previous;window.removeEventListener("keydown",close)}},[flyerOpen])
  const [tour, setTour] = useState<Tour>(),
    [selectedId, setSelectedId] = useState(
      new URLSearchParams(location.search).get("package") || "",
    ),
    [departure, setDeparture] = useState(""),
    [adults, setAdults] = useState(1),
    [children, setChildren] = useState(0),
    [price, setPrice] = useState<BookingPrice>(),
    [error, setError] = useState("")
  useEffect(() => {
    const adminPreviewId = new URLSearchParams(location.search).get("adminPreview")
    const detailRequest = adminPreviewId
      ? tourApi.adminDetail(adminPreviewId)
      : tourApi.publicDetail(slug())
    detailRequest
      .then((r) => {
        const t = r.data.tour
        setTour(t)
        setSelectedId((x) =>
          t.packages.some((p) => p.id === x) ? x : t.packages[0]?.id || "",
        )
        setDeparture(
          t.departures?.find(
            (x) => x.available > 0 && ["open", "limited"].includes(x.status),
          )?.id || "",
        )
      })
      .catch(() => setError("This experience is not available."))
  }, [])
  const pkg = tour?.packages.find((x) => x.id === selectedId)
  const dep = tour?.departures?.find((x) => x.id === departure)
  useEffect(() => {
    if (!tour || !pkg || !departure) return
    bookingApi
      .calculatePrice({
        tour_id: tour.id,
        package_id: pkg.id,
        departure_id: departure,
        adults,
        children,
        infants: 0,
        payment_option: pkg.deposit_enabled ? "deposit" : "full_payment",
      })
      .then((r) => {
        setPrice(r.data.price)
        setError("")
      })
      .catch((e) => {
        setPrice(undefined)
        setError(String((e as Error).message).replaceAll("_", " "))
      })
  }, [tour?.id, pkg?.id, departure, adults, children])
  const choose = (p: TourPackage) => {
    setSelectedId(p.id)
    history.replaceState(
      {},
      "",
      `${location.pathname}?package=${encodeURIComponent(p.id)}`,
    )
  }
  const book = () => {
    if (!tour || !pkg || !dep || !price) return
    sessionStorage.setItem(
      "kobani_booking_selection",
      JSON.stringify({
        tour_id: tour.id,
        tour_slug: tour.slug,
        tour_title: tour.title,
        package_id: pkg.id,
        package_name: pkg.name,
        departure_id: dep.id,
        start_date: dep.start_date,
        end_date: dep.end_date,
        adults,
        children,
        price_adult: pkg.adult_price || pkg.price,
        price_child: pkg.child_price,
        currency: pkg.currency,
        image: tour.featured_image?.url,
        location: `${tour.destination} · ${tour.country}`,
        duration_days: pkg.days,
        nights: pkg.nights,
        available: dep.available,
        capacity: dep.capacity,
        category: tour.category?.name,
      }),
    )
    sessionStorage.removeItem("kobani_booking_idempotency")
    onNavigate("booking")
  }
  const duration =
    tour && tour.min_duration_days === tour.max_duration_days
      ? `${tour.min_duration_days} Days`
      : `${tour?.min_duration_days}–${tour?.max_duration_days} Days`
  const compareRows = useMemo(
    () =>
      tour
        ? [
            {
              label: "Price",
              get: (p: TourPackage) =>
                money(p.currency, p.price || p.adult_price),
            },
            {
              label: "Duration",
              get: (p: TourPackage) => `${p.days} Days / ${p.nights} Nights`,
            },
            { label: "Hotel", get: (p: TourPackage) => p.hotel_standard },
            { label: "Room", get: (p: TourPackage) => p.room_type },
            { label: "Transport", get: (p: TourPackage) => p.transport_type },
            { label: "Meals", get: (p: TourPackage) => p.meal_plan },
            {
              label: "Activities",
              get: (p: TourPackage) => String(p.activities.length),
            },
            {
              label: "Minimum guests",
              get: (p: TourPackage) => String(p.min_guests),
            },
            {
              label: "Deposit",
              get: (p: TourPackage) =>
                p.deposit_enabled
                  ? p.deposit_type === "percentage"
                    ? `${p.deposit_value}%`
                    : money(p.currency, p.deposit_value)
                  : "Not available",
            },
          ]
        : [],
    [tour],
  )
  if (error && !tour) return <div className="p-20 text-center">{error}</div>
  if (tour?.booking_mode === "flyer_request") {
    const flyer=tour.flyer_image||tour.featured_image
    const requestBooking=()=>{sessionStorage.setItem("kobani_booking_request_tour",JSON.stringify({id:tour.id,title:tour.title,slug:tour.slug,location:`${tour.destination}, ${tour.country}`,flyer:flyer?.url}));if(!isAuthenticated){sessionStorage.setItem("kobani:returnPage","booking-request");onNavigate("login")}else onNavigate("booking-request")}
    return <div className="min-h-screen bg-[#F8F4EA] px-4 py-12"><div className="mx-auto max-w-6xl"><p className="eyebrow">{tour.category?.name}</p><h1 className="mt-2 font-serif text-4xl font-bold sm:text-6xl">{tour.title}</h1><p className="mt-3 text-[#6F6B63]">{tour.destination}, {tour.country}</p><div className="mt-8 grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px]"><button onClick={()=>setFlyerOpen(true)} className="overflow-hidden rounded-2xl border bg-[#151515] p-3"><img src={resolveMediaUrl(flyer?.url||"")} alt={flyer?.alt_text||`${tour.title} package flyer`} className="max-h-[1100px] w-full object-contain"/><span className="mt-3 block text-xs font-bold text-[#E9D6A8]">View Full Flyer</span></button><aside><div className="sticky top-24 rounded-2xl border bg-white p-6"><p className="eyebrow">Request this experience</p><h2 className="mt-2 font-serif text-2xl font-bold">Ready to travel with KOBANI?</h2><p className="mt-3 text-sm leading-6 text-[#6F6B63]">Review the package flyer, then tell us which package and arrangements you need. Payment begins only after KOBANI sends an invoice.</p><button onClick={requestBooking} className="admin-gold mt-6 w-full">Book This Tour</button>{tour.notes&&<div className="mt-7 border-t pt-6"><h3 className="font-serif text-xl font-bold">Important Notes</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#6F6B63]">{tour.notes}</p></div>}</div></aside></div>{tour.gallery&&tour.gallery.length>0&&<section className="mt-12"><h2 className="font-serif text-3xl font-bold">Tour Gallery</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{tour.gallery.map((image,index)=><button key={image.storage_key||index} onClick={()=>setFlyerOpen(true)} className="overflow-hidden rounded-2xl border bg-white"><img loading="lazy" src={resolveMediaUrl(image.url)} alt={image.alt_text||`${tour.title} picture ${index+1}`} className="h-64 w-full object-cover"/></button>)}</div></section>}</div>{flyerOpen&&<div role="dialog" aria-modal="true" aria-label="Full tour flyer" className="fixed inset-0 z-[100] grid place-items-center overflow-auto bg-black/95 p-4" onClick={()=>setFlyerOpen(false)}><button aria-label="Close flyer" className="fixed right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white text-2xl" onClick={()=>setFlyerOpen(false)}>×</button><img src={resolveMediaUrl(flyer?.url||"")} alt={flyer?.alt_text||`${tour.title} full package flyer`} className="max-h-none max-w-full object-contain" onClick={event=>event.stopPropagation()}/></div>}</div>
  }
  if (!tour || !pkg)
    return <div className="p-20 text-center">Loading experience…</div>
  const visibleItinerary = pkg.itinerary.filter((item) => item.title?.trim() || item.description?.trim() || item.activities?.length)
  const seo = tour.seo || {},
    path = `/tours/${tour.slug}`
  return (
    <div className="min-h-screen bg-[#F8F4EA]">
      <SEO
        title={String(seo.title || `${tour.title} | KOBANI Tours`)}
        description={String(seo.description || tour.short_description)}
        path={path}
        image={tour.featured_image?.url}
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "TouristTrip",
            name: tour.title,
            description: tour.short_description,
            url: canonicalUrl(path),
            provider: {
              "@type": "Organization",
              name: ORGANIZATION_NAME,
              url: `${SITE_URL}/`,
            },
            offers: {
              "@type": "AggregateOffer",
              lowPrice: tour.starting_price,
              priceCurrency: tour.packages[0]?.currency,
              offerCount: tour.package_count,
            },
          },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Tours", path: "/tours" },
            { name: tour.title, path },
          ]),
        ]}
      />
      <section className="relative h-[62vh] min-h-[480px] bg-black">
        {tour.featured_image && (
          <img
            src={resolveMediaUrl(tour.featured_image.url)}
            alt={tour.title}
            className="w-full h-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
        <div className="absolute bottom-0 inset-x-0 max-w-7xl mx-auto p-6 sm:p-12 text-white">
          <p className="text-[#D6B873] text-xs tracking-[.2em]">
            {tour.tour_type.toUpperCase()} · {tour.country.toUpperCase()}
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold mt-3 max-w-4xl">
            {tour.title}
          </h1>
          <div className="flex gap-5 mt-5 text-sm text-white/70">
            <span>{tour.destination}</span>
            <span>{duration}</span>
            <span>{tour.package_count} Package Options</span>
          </div>
        </div>
      </section>
      <main className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        <section className="max-w-4xl">
          <p className="eyebrow">The experience</p>
          <h2 className="font-serif text-3xl font-bold">
            {tour.short_description}
          </h2>
          <p className="mt-5 text-[#655F56] leading-8 whitespace-pre-line">
            {tour.description}
          </p>
          {!!tour.highlights?.length && (
            <div className="grid sm:grid-cols-2 gap-3 mt-7">
              {tour.highlights.map((x) => (
                <div className="bg-white border rounded-xl p-4" key={x}>
                  ✦ {x}
                </div>
              ))}
            </div>
          )}
        </section>
        {!!tour.destinations?.length && (
          <section>
            <p className="eyebrow">Places you will experience</p>
            <h2 className="font-serif text-3xl font-bold">
              Destinations & heritage sites
            </h2>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              {tour.destinations.map((x, i) => (
                <article className="bg-white border rounded-2xl p-5" key={i}>
                  <small className="text-[#A57B31]">
                    {x.type} · {x.region}
                  </small>
                  <h3 className="font-serif text-xl font-bold mt-2">
                    {x.name}
                  </h3>
                  <p className="text-sm text-[#777] mt-2">{x.description}</p>
                </article>
              ))}
            </div>
          </section>
        )}
        {!!tour.gallery?.length && (
          <section>
            <p className="eyebrow">In pictures</p>
            <h2 className="font-serif text-3xl font-bold">
              Experience gallery
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-5">
              {tour.gallery.map((image, i) => (
                <img
                  key={image.storage_key || i}
                  src={resolveMediaUrl(image.url)}
                  alt={image.alt_text || `${tour.title} gallery image ${i + 1}`}
                  className="w-full aspect-[4/3] object-cover rounded-2xl"
                  loading="lazy"
                />
              ))}
            </div>
          </section>
        )}
        <section id="packages">
          <p className="eyebrow">Choose your experience</p>
          <h2 className="font-serif text-4xl font-bold">Package options</h2>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5 mt-7">
            {tour.packages.map((p) => (
              <article
                key={p.id}
                className={`rounded-2xl p-5 border-2 bg-white ${
                  p.id === pkg.id
                    ? "border-[#C6A15B] shadow-xl"
                    : "border-[#E5DED2]"
                }`}
              >
                {p.badge && <span className="pill warning">{p.badge}</span>}
                <h3 className="font-serif text-2xl font-bold mt-3">{p.name}</h3>
                <p className="text-2xl font-bold text-[#9A702B] mt-4">
                  {money(p.currency, p.price || p.adult_price)}
                </p>
                <small>{p.pricing_basis.replaceAll("_", " ")}</small>
                <p className="mt-4 text-sm">
                  {p.days} Days / {p.nights} Nights
                </p>
                <p className="text-sm text-[#777] mt-2">{p.hotel_standard}</p>
                <p className="text-xs text-[#777] mt-4 min-h-12">
                  {p.short_description}
                </p>
                <button
                  className={`w-full mt-5 py-3 rounded-xl font-bold ${
                    p.id === pkg.id ? "bg-[#C6A15B]" : "bg-black text-white"
                  }`}
                  onClick={() => choose(p)}
                >
                  {p.id === pkg.id ? "Selected" : "Select Package"}
                </button>
              </article>
            ))}
          </div>
        </section>
        <section>
          <h2 className="font-serif text-3xl font-bold">Compare packages</h2>
          <div className="overflow-x-auto bg-white border rounded-2xl mt-5">
            <table className="min-w-[800px] w-full text-sm">
              <thead>
                <tr>
                  <th className="p-4 text-left">Feature</th>
                  {tour.packages.map((p) => (
                    <th className="p-4 text-left" key={p.id}>
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compareRows.map((r) => (
                  <tr className="border-t" key={r.label}>
                    <th className="p-4 text-left">{r.label}</th>
                    {tour.packages.map((p) => (
                      <td className="p-4" key={p.id}>
                        {r.get(p)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="grid lg:grid-cols-[1fr_360px] gap-7">
          <div className="space-y-7">
            <div>
              <p className="eyebrow">Selected package</p>
              <h2 className="font-serif text-4xl font-bold">{pkg.name}</h2>
              <p className="mt-3 text-[#777]">{pkg.short_description}</p>
            </div>
            {[
              ["Activities", pkg.activities],
              ["Package highlights", pkg.highlights],
              ["Inclusions", pkg.inclusions],
              ["Exclusions", pkg.exclusions],
              ["Requirements", pkg.requirements],
            ]
              .filter(([, v]) => (v as string[]).length)
              .map(([label, values]) => (
                <div key={label as string}>
                  <h3 className="font-serif text-2xl font-bold">
                    {label as string}
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-2 mt-3">
                    {(values as string[]).map((x) => (
                      <li className="bg-white border rounded-xl p-3" key={x}>
                        ✓ {x}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            {!!visibleItinerary.length && (
              <div>
                <h3 className="font-serif text-2xl font-bold">Itinerary</h3>
                <div className="space-y-3 mt-4">
                  {visibleItinerary.map((x) => (
                    <article
                      className="bg-white border rounded-2xl p-5"
                      key={x.day}
                    >
                      <small>DAY {x.day}</small>
                      <h4 className="font-serif text-xl font-bold">
                        {x.title}
                      </h4>
                      <p className="text-sm text-[#666] mt-2 whitespace-pre-line">
                        {x.description}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
          <aside>
            <div className="sticky top-24 bg-white border rounded-3xl overflow-hidden shadow-xl">
              <div className="bg-[#111] text-white p-6">
                <small>Selected experience</small>
                <h3 className="font-serif text-2xl font-bold mt-1">
                  {pkg.name}
                </h3>
                <b className="block text-3xl text-[#C6A15B] mt-3">
                  {money(pkg.currency, pkg.price || pkg.adult_price)}
                </b>
              </div>
              <div className="p-6 space-y-4">
                <label className="block text-xs font-bold">
                  DEPARTURE
                  <select
                    className="admin-input w-full mt-2"
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                    disabled={!tour.departures?.length}
                  >
                    <option value="">
                      {tour.departures?.length ? "Choose date" : "Dates being finalized"}
                    </option>
                    {tour.departures?.map((x) => (
                      <option
                        key={x.id}
                        value={x.id}
                        disabled={
                          !x.available ||
                          !["open", "limited"].includes(x.status)
                        }
                      >
                        {x.start_date} · {x.available} spaces
                      </option>
                    ))}
                  </select>
                </label>
                {!tour.departures?.length && (
                  <div className="rounded-xl bg-[#F8F4EA] p-4 text-xs leading-5 text-[#6F6B63]">
                    Upcoming departure dates are being finalized. Contact KOBANI to plan this experience.
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-xs">
                    Adults
                    <input
                      type="number"
                      min="1"
                      max={pkg.max_guests}
                      className="admin-input w-full mt-1"
                      value={adults}
                      onChange={(e) => setAdults(Math.max(1, +e.target.value))}
                    />
                  </label>
                  <label className="text-xs">
                    Children
                    <input
                      type="number"
                      min="0"
                      className="admin-input w-full mt-1"
                      value={children}
                      onChange={(e) =>
                        setChildren(Math.max(0, +e.target.value))
                      }
                    />
                  </label>
                </div>
                {price && (
                  <div className="bg-[#F8F4EA] rounded-xl p-4 text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Total</span>
                      <b>
                        {price.currency} {price.total}
                      </b>
                    </div>
                    {price.deposit_enabled && (
                      <div className="flex justify-between text-green-700">
                        <span>Deposit available</span>
                        <b>
                          {price.currency} {price.deposit}
                        </b>
                      </div>
                    )}
                  </div>
                )}
                {error && <p className="text-xs text-red-700">{error}</p>}
                <button className="w-full bg-[#C6A15B] py-4 rounded-xl font-bold" onClick={() => departure && price ? book() : onNavigate("contact")}>
                  {departure && price ? `Book ${pkg.name}` : "Contact KOBANI"}
                </button>
                <p className="text-xs text-center text-[#888]">
                  Pricing and capacity are validated securely by KOBANI.
                </p>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}
