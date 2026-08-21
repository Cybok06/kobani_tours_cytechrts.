import { useMemo, useState } from "react"
import type { Page } from "./App"
import BrandLogo from "./BrandLogo"

const GOLD = "#C6A15B"
type Method = "card" | "paypal" | "apple" | "google"

const Svg = ({
  name,
  size = 16,
}: {
  name: "lock" | "check" | "back" | "card" | "shield" | "calendar" | "users" | "info"
  size?: number
}) => {
  const p = {
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
    card: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
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
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 8h.01" />
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
      {p[name]}
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
              className="w-8 h-8 rounded-full grid place-items-center text-xs font-bold"
              style={{
                background: i < 3 ? "#0B0B0B" : i === 3 ? GOLD : "#F0EBE0",
                color: i < 3 ? GOLD : i === 3 ? "#0B0B0B" : "#B8B0A4",
                border: `2px solid ${
                  i < 3 ? "#0B0B0B" : i === 3 ? GOLD : "#E6DFD2"
                }`,
                boxShadow: i === 3 ? "0 0 0 4px rgba(198,161,91,.2)" : "none",
              }}
            >
              {i < 3 ? <Svg name="check" size={12} /> : i + 1}
            </div>
            <span
              className="hidden sm:block text-xs whitespace-nowrap"
              style={{ color: i === 3 ? GOLD : i < 3 ? "white" : "#777" }}
            >
              {label}
            </span>
          </div>
          {i < 4 && (
            <div
              className="flex-1 h-px mx-2"
              style={{ background: i < 3 ? GOLD : "#343434" }}
            />
          )}
        </div>
      ),
    )}
  </div>
)

const Field = ({
  label,
  children,
  required = true,
}: {
  label: string
  children: React.ReactNode
  required?: boolean
}) => (
  <label className="block">
    <span className="block text-xs font-semibold mb-1.5">
      {label}
      {required && <span className="text-[#C6A15B]"> *</span>}
    </span>
    {children}
  </label>
)
const input =
  "w-full h-11 rounded-xl border border-[#E2DBCE] bg-[#FFFDF8] px-3.5 text-sm outline-none transition focus:border-[#C6A15B] focus:ring-2 focus:ring-[#C6A15B]/10 placeholder:text-[#B8B0A4]"

export default function BookingPaymentPage({
  onNavigate,
}: {
  onNavigate: (p: Page) => void
}) {
  const [payFull, setPayFull] = useState(false),
    [method, setMethod] = useState<Method>("card"),
    [terms, setTerms] = useState(false),
    [same, setSame] = useState(true)
  const [card, setCard] = useState({
      name: "",
      number: "",
      expiry: "",
      cvv: "",
    }),
    [attempted, setAttempted] = useState(false)
  const subtotal = 2825,
    discount = 120,
    tax = 162.3,
    total = subtotal - discount + tax,
    deposit = Math.round(total * 0.3 * 100) / 100,
    due = payFull ? total : deposit,
    outstanding = payFull ? 0 : total - deposit
  const valid =
    terms && (method !== "card" || Object.values(card).every(Boolean))
  const money = (n: number) =>
    `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  const paymentTitle = useMemo(
    () =>
      method === "card"
        ? "Pay securely by card"
        : method === "paypal"
          ? "Continue with PayPal"
          : method === "apple"
            ? "Pay with Apple Pay"
            : "Pay with Google Pay",
    [method],
  )
  const formatNumber = (v: string) =>
    v.replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim()

  return (
    <div className="min-h-screen bg-[#F8F4EA] text-[#0B0B0B]">
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
            <Svg name="lock" size={13} /> Secure Booking
          </div>
          <div className="flex-1 flex justify-center px-2">
            <Stepper />
          </div>
          <button
            onClick={() => onNavigate("booking-addons")}
            className="hidden sm:flex items-center gap-1 text-xs text-[#777] hover:text-[#C6A15B] cursor-pointer"
          >
            <Svg name="back" size={12} /> Step 3
          </button>
        </div>
      </header>
      <div className="mx-auto max-w-[1100px] px-4 pt-8 pb-4">
        <div className="text-xs text-[#9A9590] mb-2">
          Book <span className="mx-1">›</span> Add-ons{" "}
          <span className="mx-1">›</span>{" "}
          <span className="text-[#C6A15B]">Payment</span>
        </div>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl">
          Secure checkout
        </h1>
        <p className="text-sm text-[#6F6B63] mt-1">
          Complete your payment to reserve your place on this journey.
        </p>
      </div>
      <main className="mx-auto max-w-[1100px] px-4 pb-16 flex flex-col lg:flex-row gap-6 items-start">
        <section className="flex-1 min-w-0 space-y-5">
          <div className="rounded-2xl bg-white border border-[#E6DFD2] p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-8 rounded-full grid place-items-center bg-[#F1E9D8] text-[#C6A15B] text-xs font-bold">
                1
              </span>
              <h2 className="font-serif font-bold text-lg">
                Contact information
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Email address">
                <input
                  className={input}
                  type="email"
                  placeholder="you@example.com"
                />
              </Field>
              <Field label="Phone number">
                <input
                  className={input}
                  type="tel"
                  placeholder="+233 50 000 0000"
                />
              </Field>
            </div>
            <p className="text-[10px] text-[#9A9590] mt-3">
              Your receipt and booking confirmation will be sent to this email.
            </p>
          </div>
          <div className="rounded-2xl bg-white border border-[#E6DFD2] p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-8 rounded-full grid place-items-center bg-[#F1E9D8] text-[#C6A15B] text-xs font-bold">
                2
              </span>
              <h2 className="font-serif font-bold text-lg">Billing address</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field label="Street address">
                  <input
                    className={input}
                    placeholder="House number and street"
                  />
                </Field>
              </div>
              <Field label="City">
                <input className={input} placeholder="Accra" />
              </Field>
              <Field label="State / Region">
                <input className={input} placeholder="Greater Accra" />
              </Field>
              <Field label="Country">
                <select className={input} defaultValue="Ghana">
                  <option>Ghana</option>
                  <option>United Kingdom</option>
                  <option>United States</option>
                  <option>Nigeria</option>
                </select>
              </Field>
              <Field label="Postal code">
                <input className={input} placeholder="GA-184" />
              </Field>
            </div>
          </div>
          <div className="rounded-2xl bg-white border border-[#E6DFD2] p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-8 rounded-full grid place-items-center bg-[#F1E9D8] text-[#C6A15B] text-xs font-bold">
                3
              </span>
              <div>
                <h2 className="font-serif font-bold text-lg">
                  Choose how you pay
                </h2>
                <p className="text-xs text-[#9A9590]">
                  Flexible payment, same confirmed booking.
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                {
                  full: true,
                  title: "Pay full amount",
                  sub: "Pay once and you are all set",
                  price: total,
                },
                {
                  full: false,
                  title: "Pay 30% deposit",
                  sub: `Balance due 30 days before travel`,
                  price: deposit,
                },
              ].map((o) => (
                <button
                  key={o.title}
                  onClick={() => setPayFull(o.full)}
                  className="text-left p-4 rounded-xl cursor-pointer transition"
                  style={{
                    border: `1.5px solid ${
                      payFull === o.full ? GOLD : "#E6DFD2"
                    }`,
                    background:
                      payFull === o.full ? "rgba(198,161,91,.06)" : "#FFF",
                  }}
                >
                  <div className="flex justify-between gap-2">
                    <span className="flex gap-2">
                      <i
                        className="mt-0.5 w-4 h-4 rounded-full border grid place-items-center"
                        style={{
                          borderColor: payFull === o.full ? GOLD : "#CFC7BA",
                        }}
                      >
                        {payFull === o.full && (
                          <i className="w-2 h-2 rounded-full bg-[#C6A15B]" />
                        )}
                      </i>
                      <span>
                        <b className="block text-sm">{o.title}</b>
                        <span className="text-[10px] text-[#9A9590]">
                          {o.sub}
                        </span>
                      </span>
                    </span>
                    <b className="font-serif text-sm">{money(o.price)}</b>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-white border border-[#E6DFD2] p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-8 rounded-full grid place-items-center bg-[#F1E9D8] text-[#C6A15B] text-xs font-bold">
                4
              </span>
              <h2 className="font-serif font-bold text-lg">Payment method</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
              {([
                {
                  id: "card",
                  label: "Card",
                  mark: <Svg name="card" size={18} />,
                },
                {
                  id: "paypal",
                  label: "PayPal",
                  mark: <b className="italic text-[#123D8D]">P</b>,
                },
                {
                  id: "apple",
                  label: "Apple Pay",
                  mark: <b className="text-base">●</b>,
                },
                {
                  id: "google",
                  label: "Google Pay",
                  mark: <b className="text-[#4285F4]">G</b>,
                },
              ] as const).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className="h-12 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer"
                  style={{
                    border: `1.5px solid ${method === m.id ? GOLD : "#E6DFD2"}`,
                    background:
                      method === m.id ? "rgba(198,161,91,.06)" : "white",
                  }}
                >
                  {m.mark}
                  {m.label}
                </button>
              ))}
            </div>
            {method === "card" ? (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Field label="Cardholder name">
                      <input
                        value={card.name}
                        onChange={(e) =>
                          setCard({ ...card, name: e.target.value })
                        }
                        className={input}
                        placeholder="Name as shown on card"
                      />
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Card number">
                      <div className="relative">
                        <input
                          value={card.number}
                          onChange={(e) =>
                            setCard({
                              ...card,
                              number: formatNumber(e.target.value),
                            })
                          }
                          className={`${input} pr-24`}
                          inputMode="numeric"
                          placeholder="1234 5678 9012 3456"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                          <span className="px-1.5 py-1 rounded bg-[#1434CB] text-white text-[8px] font-black italic">
                            VISA
                          </span>
                          <span className="px-1.5 py-1 rounded bg-[#F3F0E9] text-[8px] font-bold">
                            ●●
                          </span>
                        </div>
                      </div>
                    </Field>
                  </div>
                  <Field label="Expiry date">
                    <input
                      value={card.expiry}
                      onChange={(e) =>
                        setCard({ ...card, expiry: e.target.value.slice(0, 5) })
                      }
                      className={input}
                      placeholder="MM / YY"
                    />
                  </Field>
                  <Field label="CVV">
                    <div className="relative">
                      <input
                        value={card.cvv}
                        onChange={(e) =>
                          setCard({
                            ...card,
                            cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                          })
                        }
                        className={`${input} pr-9`}
                        inputMode="numeric"
                        placeholder="123"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9590]">
                        <Svg name="info" size={15} />
                      </span>
                    </div>
                  </Field>
                </div>
                <label className="flex items-center gap-2 mt-4 text-xs text-[#6F6B63] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={same}
                    onChange={(e) => setSame(e.target.checked)}
                    className="accent-[#C6A15B]"
                  />{" "}
                  Save this card securely for future bookings
                </label>
              </>
            ) : (
              <div className="rounded-xl bg-[#F8F4EA] border border-[#E6DFD2] p-8 text-center">
                <div className="font-serif font-bold text-lg mb-2">
                  {paymentTitle}
                </div>
                <p className="text-xs text-[#6F6B63]">
                  After clicking the payment button, you’ll be redirected to
                  complete your secure payment.
                </p>
              </div>
            )}
          </div>
          <label className="rounded-2xl bg-white border border-[#E6DFD2] p-4 flex items-start gap-3 cursor-pointer">
            <span
              className="w-5 h-5 mt-0.5 rounded-md grid place-items-center flex-shrink-0"
              style={{
                border: `1.5px solid ${terms ? GOLD : "#CFC7BA"}`,
                background: terms ? GOLD : "white",
              }}
            >
              {terms && <Svg name="check" size={13} />}
            </span>
            <input
              type="checkbox"
              className="hidden"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
            />
            <span className="text-xs leading-relaxed text-[#6F6B63]">
              I agree to Kobani Tours’{" "}
              <a className="font-semibold text-[#0B0B0B] underline">
                Booking Terms
              </a>
              ,{" "}
              <a className="font-semibold text-[#0B0B0B] underline">
                Cancellation Policy
              </a>{" "}
              and{" "}
              <a className="font-semibold text-[#0B0B0B] underline">
                Privacy Policy
              </a>
              .
            </span>
          </label>
          {attempted && !valid && (
            <div className="rounded-xl border border-[#C84A4A]/25 bg-[#C84A4A]/5 p-3 text-xs text-[#C84A4A]">
              Please complete your payment details and accept the booking terms.
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => onNavigate("booking-addons")}
              className="px-6 py-4 rounded-xl bg-white border border-[#E6DFD2] text-sm font-semibold cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={() => {
                setAttempted(true)
                if (valid) onNavigate("booking-confirmation")
              }}
              className="flex-1 rounded-xl bg-[#C6A15B] hover:bg-[#D9B96E] text-sm font-bold cursor-pointer flex items-center justify-center gap-2"
            >
              <Svg name="lock" size={15} /> Pay {money(due)} & Confirm Booking
            </button>
          </div>
        </section>

        <aside className="w-full lg:w-[325px] flex-shrink-0 lg:sticky lg:top-6 space-y-4">
          <div className="rounded-2xl overflow-hidden bg-white border border-[#E6DFD2] shadow-[0_8px_32px_rgba(0,0,0,.06)]">
            <div className="relative h-36">
              <img
                src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=700&h=350&fit=crop&auto=format"
                className="w-full h-full object-cover brightness-[.6]"
                alt="Kumasi tour"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[9px] tracking-[.18em] uppercase text-[#E9D6A8]">
                  Your journey
                </span>
                <h3 className="font-serif font-bold text-sm">
                  Sacred Kumasi Heritage Trail
                </h3>
              </div>
            </div>
            <div className="p-5">
              <h2 className="font-serif font-bold mb-3">Order summary</h2>
              <div className="space-y-2 text-xs text-[#6F6B63]">
                <div className="flex gap-2">
                  <Svg name="calendar" size={13} /> 18 – 21 September 2026
                </div>
                <div className="flex gap-2">
                  <Svg name="users" size={13} /> 2 adults · 1 child
                </div>
              </div>
              <div className="border-t border-[#F0EBE0] my-4" />
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#9A9590]">Tour package</span>
                  <b>$2,370.00</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9A9590]">Airport pickup</span>
                  <b>$85.00</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9A9590]">Room upgrade</span>
                  <b>$240.00</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9A9590]">Travel insurance × 1</span>
                  <b>$74.00</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9A9590]">Special meal package</span>
                  <b>$56.00</b>
                </div>
              </div>
              <div className="border-t border-[#F0EBE0] my-4" />
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#9A9590]">Subtotal</span>
                  <b>{money(subtotal)}</b>
                </div>
                <div className="flex justify-between text-[#27855C]">
                  <span>Promo discount</span>
                  <b>−{money(discount)}</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9A9590]">Tax & booking fees</span>
                  <b>{money(tax)}</b>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#F0EBE0] flex justify-between items-center">
                <b>Total</b>
                <b className="font-serif text-xl">{money(total)}</b>
              </div>
              <div className="mt-3 rounded-xl bg-[#0B0B0B] p-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#9A9590]">Due today</span>
                  <b className="font-serif text-base text-[#C6A15B]">
                    {money(due)}
                  </b>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-[#777]">Outstanding balance</span>
                  <span className="text-white">{money(outstanding)}</span>
                </div>
              </div>
              {!payFull && (
                <p className="text-[10px] text-[#9A9590] text-center mt-2">
                  30% deposit · Remaining balance due 19 Aug 2026
                </p>
              )}
            </div>
          </div>
          <div className="rounded-2xl bg-white border border-[#E6DFD2] p-4">
            <div className="flex items-center justify-center gap-2 text-xs font-bold">
              <span className="text-[#27855C]">
                <Svg name="shield" size={15} />
              </span>
              Secure encrypted checkout
            </div>
            <p className="text-[10px] text-center text-[#9A9590] mt-1">
              Your payment details are protected with 256-bit SSL encryption.
            </p>
            <div className="flex justify-center items-center gap-2 mt-3">
              <span className="px-2 py-1 rounded bg-[#1434CB] text-white text-[9px] font-black italic">
                VISA
              </span>
              <span className="px-2 py-1 rounded bg-[#F3F0E9] text-[9px] font-bold">
                ●● Mastercard
              </span>
              <b className="italic text-[#123D8D] text-xs">PayPal</b>
              <b className="text-xs">● Pay</b>
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}
