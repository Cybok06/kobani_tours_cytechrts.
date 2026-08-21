import { useMemo, useState } from "react"
import type { Page } from "./App"
import BrandLogo from "./BrandLogo"

const GOLD = "#C6A15B"

const services = [
  {
    id: "airport",
    title: "Airport pickup",
    description:
      "A warm welcome at Kotoka Airport with private transfer to your hotel.",
    price: 85,
    unit: "per vehicle",
    image:
      "https://images.unsplash.com/photo-1515569067071-ec3b51335dd0?w=800&h=500&fit=crop&auto=format",
    quantity: true,
  },
  {
    id: "transport",
    title: "Private transportation",
    description:
      "Travel in comfort with a dedicated air-conditioned vehicle and driver.",
    price: 160,
    unit: "per day",
    image:
      "https://images.unsplash.com/photo-1504150558240-0b4fd8946624?w=800&h=500&fit=crop&auto=format",
    quantity: true,
  },
  {
    id: "room",
    title: "Room upgrade",
    description:
      "Upgrade to a spacious premium room with enhanced views and amenities.",
    price: 240,
    unit: "per room",
    image:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=500&fit=crop&auto=format",
  },
  {
    id: "insurance",
    title: "Travel insurance",
    description:
      "Extra peace of mind with medical, cancellation and luggage coverage.",
    price: 74,
    unit: "per traveller",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=500&fit=crop&auto=format",
  },
  {
    id: "meal",
    title: "Special meal package",
    description:
      "Curated vegetarian, vegan, halal or allergy-friendly meals throughout.",
    price: 95,
    unit: "per traveller",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=500&fit=crop&auto=format",
    quantity: true,
  },
  {
    id: "photo",
    title: "Professional photography",
    description:
      "A private photographer captures your journey in 40 edited photographs.",
    price: 320,
    unit: "per tour",
    image:
      "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?w=800&h=500&fit=crop&auto=format",
  },
] as const

const Icon = ({
  name,
  size = 16,
}: {
  name: "lock" | "check" | "back" | "arrow" | "tag" | "shield" | "calendar" | "users"
  size?: number
}) => {
  const paths = {
    lock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 018 0v3" />
      </>
    ),
    check: <path d="M5 12l4 4L19 6" />,
    back: (
      <>
        <path d="M19 12H5" />
        <path d="M12 19l-7-7 7-7" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="M12 5l7 7-7 7" />
      </>
    ),
    tag: (
      <>
        <path d="M20 13l-7 7-10-10V3h7l10 10z" />
        <circle cx="7.5" cy="7.5" r="1" />
      </>
    ),
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="4" />
        <path d="M3 21v-2a6 6 0 0112 0v2M17 11a4 4 0 014 4v2" />
      </>
    ),
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}

const Stepper = () => (
  <div className="flex items-center w-full max-w-[650px]">
    {["Tour Details", "Travellers", "Add-ons", "Payment", "Confirmation"].map(
      (label, i) => (
        <div
          key={label}
          className={`flex items-center ${i < 4 ? "flex-1" : ""}`}
        >
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: i < 2 ? "#0B0B0B" : i === 2 ? GOLD : "#F0EBE0",
                color: i < 2 ? GOLD : i === 2 ? "#0B0B0B" : "#B8B0A4",
                border: `2px solid ${
                  i < 2 ? "#0B0B0B" : i === 2 ? GOLD : "#E6DFD2"
                }`,
                boxShadow: i === 2 ? "0 0 0 4px rgba(198,161,91,.2)" : "none",
              }}
            >
              {i < 2 ? <Icon name="check" size={12} /> : i + 1}
            </div>
            <span
              className="hidden sm:block whitespace-nowrap text-xs font-medium"
              style={{ color: i === 2 ? GOLD : i < 2 ? "#fff" : "#777" }}
            >
              {label}
            </span>
          </div>
          {i < 4 && (
            <div
              className="h-px flex-1 mx-2"
              style={{ background: i < 2 ? GOLD : "#343434" }}
            />
          )}
        </div>
      ),
    )}
  </div>
)

export default function BookingAddonsPage({
  onNavigate,
}: {
  onNavigate: (p: Page) => void
}) {
  const [selected, setSelected] = useState<Record<string, number>>({})
  const [requests, setRequests] = useState("")
  const [promo, setPromo] = useState("")
  const [promoMessage, setPromoMessage] = useState("")
  const addOnTotal = useMemo(
    () => services.reduce((sum, s) => sum + (selected[s.id] || 0) * s.price, 0),
    [selected],
  )
  const base = 2370
  const total = base + addOnTotal
  const toggle = (id: string) =>
    setSelected((p) => ({ ...p, [id]: p[id] ? 0 : 1 }))
  const change = (id: string, amount: number) =>
    setSelected((p) => ({
      ...p,
      [id]: Math.max(0, Math.min(5, (p[id] || 0) + amount)),
    }))

  return (
    <div
      className="min-h-screen"
      style={{ background: "#F8F4EA", color: "#0B0B0B" }}
    >
      <header className="bg-[#0B0B0B] border-b border-[#242424]">
        <div className="mx-auto max-w-[1100px] px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2.5 text-white cursor-pointer"
          >
            <BrandLogo className="w-8 h-8" />
            <span className="hidden sm:block font-serif font-bold">KOBANI</span>
          </button>
          <div className="hidden md:flex items-center gap-1.5 text-xs text-[#777]">
            <Icon name="lock" size={13} /> Secure Booking
          </div>
          <div className="flex-1 flex justify-center px-2">
            <Stepper />
          </div>
          <button
            onClick={() => onNavigate("booking-travellers")}
            className="hidden sm:flex items-center gap-1 text-xs text-[#777] hover:text-[#C6A15B] cursor-pointer"
          >
            <Icon name="back" size={12} /> Step 2
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1100px] px-4 pt-8 pb-4">
        <div className="text-xs text-[#9A9590] mb-2">
          Book <span className="mx-1">›</span> Travellers{" "}
          <span className="mx-1">›</span>{" "}
          <span className="text-[#C6A15B]">Add-ons</span>
        </div>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl">
          Make your journey even better
        </h1>
        <p className="text-sm text-[#6F6B63] mt-1">
          Personalise your experience with optional services. You can skip this
          step if you prefer.
        </p>
      </div>

      <main className="mx-auto max-w-[1100px] px-4 pb-16 flex flex-col lg:flex-row gap-6 items-start">
        <section className="flex-1 min-w-0">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="font-serif font-bold text-lg">
                Enhance your trip
              </h2>
              <p className="text-xs text-[#9A9590] mt-1">
                Select as many as you need
              </p>
            </div>
            <span className="text-xs font-semibold text-[#C6A15B]">
              {Object.values(selected).filter(Boolean).length} selected
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {services.map((s) => {
              const qty = selected[s.id] || 0
              return (
                <article
                  key={s.id}
                  className="overflow-hidden rounded-2xl bg-white transition-all"
                  style={{
                    border: `1.5px solid ${qty ? GOLD : "#E6DFD2"}`,
                    boxShadow: qty
                      ? "0 8px 28px rgba(198,161,91,.13)"
                      : "0 3px 14px rgba(0,0,0,.04)",
                  }}
                >
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={s.image}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                    {qty > 0 && (
                      <span className="absolute top-3 right-3 w-7 h-7 rounded-full grid place-items-center bg-[#C6A15B] text-black">
                        <Icon name="check" size={14} />
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif font-bold text-base">
                      {s.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-[#6F6B63] mt-1 min-h-[48px]">
                      {s.description}
                    </p>
                    <div className="flex items-end justify-between gap-3 mt-3 pt-3 border-t border-[#F0EBE0]">
                      <div>
                        <span className="font-serif font-bold text-lg">
                          ${s.price}
                        </span>
                        <span className="block text-[10px] text-[#9A9590]">
                          {s.unit}
                        </span>
                      </div>
                      {s.quantity ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => change(s.id, -1)}
                            disabled={!qty}
                            className="w-8 h-8 rounded-lg border border-[#E6DFD2] disabled:opacity-35 cursor-pointer"
                          >
                            −
                          </button>
                          <span className="w-4 text-center text-sm font-bold">
                            {qty}
                          </span>
                          <button
                            onClick={() => change(s.id, 1)}
                            className="w-8 h-8 rounded-lg bg-[#C6A15B] font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => toggle(s.id)}
                          className="flex items-center gap-2 text-xs font-semibold cursor-pointer"
                        >
                          <span
                            className="w-5 h-5 rounded-md grid place-items-center"
                            style={{
                              background: qty ? GOLD : "#fff",
                              border: `1.5px solid ${qty ? GOLD : "#D6D0C8"}`,
                            }}
                          >
                            {qty ? <Icon name="check" size={12} /> : null}
                          </span>
                          {qty ? "Added" : "Add service"}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="rounded-2xl bg-white border border-[#E6DFD2] p-5 mt-5">
            <h2 className="font-serif font-bold text-lg">
              Anything else we should know?
            </h2>
            <p className="text-xs text-[#9A9590] mt-1 mb-3">
              Dietary needs, accessibility requirements, celebrations or other
              requests.
            </p>
            <textarea
              value={requests}
              onChange={(e) => setRequests(e.target.value.slice(0, 500))}
              rows={5}
              placeholder="Tell us how we can make your journey more comfortable..."
              className="w-full resize-none rounded-xl border border-[#E6DFD2] bg-[#FFFDF8] p-3 text-sm outline-none focus:border-[#C6A15B]"
            />
            <div className="text-right text-[10px] text-[#9A9590] mt-1">
              {requests.length} / 500
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button
              onClick={() => onNavigate("booking-travellers")}
              className="px-6 py-3.5 rounded-xl bg-white border border-[#E6DFD2] text-sm font-semibold cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={() => onNavigate("booking-payment")}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#C6A15B] text-sm font-bold hover:bg-[#D9B96E] cursor-pointer"
            >
              Continue to Payment <Icon name="arrow" size={15} />
            </button>
          </div>
        </section>

        <aside className="w-full lg:w-[310px] flex-shrink-0 lg:sticky lg:top-6 space-y-4">
          <div className="rounded-2xl overflow-hidden bg-white border border-[#E6DFD2] shadow-[0_8px_32px_rgba(0,0,0,.06)]">
            <div className="relative h-32">
              <img
                src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=700&h=300&fit=crop&auto=format"
                className="w-full h-full object-cover brightness-[.6]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
              <div className="absolute bottom-3 left-4 text-white font-serif font-bold text-sm">
                Sacred Kumasi Heritage Trail
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-serif font-bold text-base mb-3">
                Booking summary
              </h3>
              <div className="space-y-2.5 text-xs text-[#6F6B63]">
                <div className="flex gap-2">
                  <Icon name="calendar" size={13} /> 18 – 21 September 2026
                </div>
                <div className="flex gap-2">
                  <Icon name="users" size={13} /> 2 adults · 1 child
                </div>
              </div>
              <div className="my-4 border-t border-[#F0EBE0]" />
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#9A9590]">Tour package</span>
                  <b>${base.toLocaleString()}</b>
                </div>
                {services
                  .filter((s) => selected[s.id])
                  .map((s) => (
                    <div key={s.id} className="flex justify-between">
                      <span className="text-[#9A9590] truncate pr-2">
                        {s.title}{" "}
                        {selected[s.id] > 1 ? `× ${selected[s.id]}` : ""}
                      </span>
                      <b>${(s.price * selected[s.id]).toLocaleString()}</b>
                    </div>
                  ))}
                {!addOnTotal && (
                  <div className="text-[#9A9590] italic">
                    No add-ons selected
                  </div>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-[#F0EBE0] flex justify-between">
                <span className="text-sm font-bold">Trip total</span>
                <span className="font-serif font-bold text-lg">
                  ${total.toLocaleString()}
                </span>
              </div>
              <div className="mt-3 p-3 rounded-xl bg-[#0B0B0B] flex justify-between items-center">
                <span className="text-xs text-[#9A9590]">
                  Deposit due today
                </span>
                <b className="font-serif text-[#C6A15B]">
                  ${Math.round(total * 0.3).toLocaleString()}
                </b>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-[#E6DFD2] p-4">
            <label className="flex items-center gap-2 text-xs font-bold mb-2">
              <Icon name="tag" size={14} /> Have a promo code?
            </label>
            <div className="flex gap-2">
              <input
                value={promo}
                onChange={(e) => {
                  setPromo(e.target.value.toUpperCase())
                  setPromoMessage("")
                }}
                placeholder="Enter code"
                className="min-w-0 flex-1 rounded-xl border border-[#E6DFD2] px-3 text-xs outline-none focus:border-[#C6A15B]"
              />
              <button
                onClick={() =>
                  setPromoMessage(
                    promo
                      ? "Code will be verified at payment."
                      : "Enter a promo code first.",
                  )
                }
                className="px-4 py-2.5 rounded-xl bg-[#0B0B0B] text-white text-xs font-bold cursor-pointer"
              >
                Apply
              </button>
            </div>
            {promoMessage && (
              <p className="mt-2 text-[10px] text-[#6F6B63]">{promoMessage}</p>
            )}
          </div>
          <div className="rounded-2xl bg-[#EFE7D5] p-4 flex gap-3">
            <span className="text-[#C6A15B]">
              <Icon name="shield" />
            </span>
            <div>
              <b className="text-xs">Flexible booking</b>
              <p className="text-[10px] leading-relaxed text-[#6F6B63] mt-1">
                Add-ons can be changed or removed up to 7 days before departure.
              </p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}
