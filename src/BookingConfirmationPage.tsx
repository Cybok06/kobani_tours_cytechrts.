import type { Page } from "./App"
import BrandLogo from "./BrandLogo"

const GOLD = "#C6A15B"
const Icon = ({
  name,
  size = 18,
}: {
  name: "check" | "download" | "calendar" | "users" | "card" | "clock" | "arrow" | "home" | "mail" | "phone" | "whatsapp" | "shield"
  size?: number
}) => {
  const p = {
    check: <path d="M5 12l4 4L19 6" />,
    download: (
      <>
        <path d="M12 3v12M7 10l5 5 5-5" />
        <path d="M5 21h14" />
      </>
    ),
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
    card: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="M12 5l7 7-7 7" />
      </>
    ),
    home: (
      <>
        <path d="M3 11l9-8 9 8" />
        <path d="M5 10v11h14V10M9 21v-7h6v7" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </>
    ),
    phone: (
      <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.2a2 2 0 012.1-.5c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z" />
    ),
    whatsapp: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8.5 8.5c.5 4 3 6.5 7 7M8 17l-2 1 1-3" />
      </>
    ),
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
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

const details = [
  { label: "Booking reference", value: "KOB–GH–260918", accent: true },
  { label: "Tour", value: "Sacred Kumasi Heritage Trail" },
  {
    label: "Travel date",
    value: "18 – 21 September 2026",
    icon: "calendar" as const,
  },
  { label: "Travellers", value: "2 adults · 1 child", icon: "users" as const },
  { label: "Amount paid", value: "$860.19", positive: true },
  { label: "Outstanding balance", value: "$2,007.11" },
  {
    label: "Payment deadline",
    value: "19 August 2026",
    icon: "clock" as const,
  },
  {
    label: "Payment method",
    value: "Visa ending in 3456",
    icon: "card" as const,
  },
]
const timeline = [
  {
    title: "Confirmation received",
    text: "Your booking and deposit are confirmed.",
    when: "Today",
    done: true,
  },
  {
    title: "Prepare travel documents",
    text: "Check passport validity, visas and recommended vaccinations.",
    when: "This week",
  },
  {
    title: "Receive final tour information",
    text: "We’ll email your itinerary, meeting point and guide details.",
    when: "7 days before",
  },
  {
    title: "Begin your journey",
    text: "Meet your Kobani guide and experience the heart of Ghana.",
    when: "18 Sep 2026",
  },
]

export default function BookingConfirmationPage({
  onNavigate,
}: {
  onNavigate: (p: Page) => void
}) {
  const download = () => {
    const text = `KOBANI TOURS — BOOKING VOUCHER\n\nBooking reference: KOB-GH-260918\nTour: Sacred Kumasi Heritage Trail\nTravel date: 18-21 September 2026\nTravellers: 2 adults, 1 child\nAmount paid: $860.19\nOutstanding balance: $2,007.11\nPayment deadline: 19 August 2026`
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" })),
      a = document.createElement("a")
    a.href = url
    a.download = "Kobani-Booking-KOB-GH-260918.txt"
    a.click()
    URL.revokeObjectURL(url)
  }
  return (
    <div className="min-h-screen bg-[#F8F4EA] text-[#0B0B0B]">
      <header className="bg-[#0B0B0B]">
        <div className="mx-auto max-w-[1100px] px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2.5 text-white cursor-pointer"
          >
            <BrandLogo className="w-8 h-8" />
            <span className="font-serif font-bold">KOBANI</span>
          </button>
          <div className="hidden sm:flex items-center gap-2 text-xs text-[#8D8D8D]">
            <span className="text-[#C6A15B]">
              <Icon name="shield" size={14} />
            </span>
            Secure booking complete
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#0B0B0B] text-white px-4 pt-12 pb-24 text-center">
        <div
          className="absolute inset-0 opacity-[.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #C6A15B 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative mx-auto max-w-3xl">
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 rounded-full bg-[#C6A15B]/15 animate-ping" />
            <div className="relative w-full h-full rounded-full grid place-items-center bg-[#C6A15B] text-black shadow-[0_0_0_10px_rgba(198,161,91,.12)]">
              <Icon name="check" size={46} />
            </div>
          </div>
          <p className="text-[10px] sm:text-xs tracking-[.25em] uppercase text-[#C6A15B] font-bold mb-3">
            Booking complete
          </p>
          <h1 className="font-serif font-bold text-3xl sm:text-5xl leading-tight">
            Your KOBANI Journey
            <br className="hidden sm:block" /> Is Confirmed
          </h1>
          <p className="mt-4 text-sm text-[#A9A9A9] max-w-xl mx-auto leading-relaxed">
            Thank you for choosing Kobani Tours. A confirmation email and
            receipt have been sent to{" "}
            <span className="text-white">you@example.com</span>.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-[1000px] px-4 pb-16 -mt-12 relative">
        <div className="rounded-2xl bg-white border border-[#E6DFD2] shadow-[0_16px_50px_rgba(0,0,0,.10)] overflow-hidden">
          <div className="px-5 sm:px-8 py-5 bg-[#FFFDF8] border-b border-[#E6DFD2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase tracking-[.16em] text-[#9A9590]">
                Booking reference
              </span>
              <div className="font-serif text-xl font-bold tracking-wide">
                KOB–GH–260918
              </div>
            </div>
            <span className="self-start sm:self-auto px-3 py-1.5 rounded-full bg-[#27855C]/10 text-[#27855C] text-xs font-bold flex items-center gap-1.5">
              <Icon name="check" size={12} /> Confirmed
            </span>
          </div>
          <div className="grid md:grid-cols-[1.15fr_.85fr]">
            <div className="relative min-h-64">
              <img
                src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1000&h=700&fit=crop&auto=format"
                alt="Ghana landscape"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[10px] uppercase tracking-[.17em] text-[#E9D6A8]">
                  Your tour
                </span>
                <h2 className="font-serif font-bold text-xl mt-1">
                  Sacred Kumasi Heritage Trail
                </h2>
                <p className="text-xs text-white/70 mt-1">
                  Kumasi, Ashanti Region · Ghana
                </p>
              </div>
            </div>
            <div className="p-5 sm:p-6">
              <h3 className="font-serif font-bold text-lg mb-4">
                Booking details
              </h3>
              <div className="space-y-3">
                {details.slice(2).map((d) => (
                  <div
                    key={d.label}
                    className="flex justify-between gap-4 text-xs"
                  >
                    <span className="text-[#9A9590] flex gap-2 items-center">
                      {d.icon && <Icon name={d.icon} size={13} />} {d.label}
                    </span>
                    <b
                      className="text-right"
                      style={{ color: d.positive ? "#27855C" : "#0B0B0B" }}
                    >
                      {d.value}
                    </b>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mt-5">
          <button
            onClick={download}
            className="rounded-xl bg-[#C6A15B] hover:bg-[#D9B96E] py-3.5 px-4 flex items-center justify-center gap-2 text-sm font-bold cursor-pointer"
          >
            <Icon name="download" size={16} />
            Download Booking Voucher
          </button>
          <button className="rounded-xl bg-[#0B0B0B] hover:bg-[#1B1B1B] text-white py-3.5 px-4 flex items-center justify-center gap-2 text-sm font-bold cursor-pointer">
            View My Booking
            <Icon name="arrow" size={15} />
          </button>
          <button
            onClick={() => onNavigate("home")}
            className="rounded-xl bg-white border border-[#E6DFD2] py-3.5 px-4 flex items-center justify-center gap-2 text-sm font-semibold cursor-pointer"
          >
            <Icon name="home" size={15} />
            Return Home
          </button>
        </div>

        <section className="rounded-2xl bg-white border border-[#E6DFD2] p-5 sm:p-8 mt-6">
          <div className="mb-7">
            <span className="text-[10px] font-bold uppercase tracking-[.18em] text-[#C6A15B]">
              What happens next
            </span>
            <h2 className="font-serif font-bold text-2xl mt-1">
              Your journey starts here
            </h2>
            <p className="text-xs text-[#6F6B63] mt-1">
              We’ll stay in touch at every step before you travel.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-0">
            {timeline.map((s, i) => (
              <div
                key={s.title}
                className="relative flex md:block gap-4 pb-6 md:pb-0 md:pr-4"
              >
                <div className="relative flex-shrink-0">
                  <div
                    className="w-9 h-9 rounded-full grid place-items-center text-xs font-bold"
                    style={{
                      background: s.done ? GOLD : "#F1EDE5",
                      color: s.done ? "#0B0B0B" : "#9A9590",
                      border: `1px solid ${s.done ? GOLD : "#E0D9CE"}`,
                    }}
                  >
                    {s.done ? <Icon name="check" size={15} /> : i + 1}
                  </div>
                  {i < timeline.length - 1 && (
                    <div className="absolute top-9 bottom-[-24px] left-1/2 w-px md:top-1/2 md:bottom-auto md:left-9 md:right-[-1px] md:w-auto md:h-px bg-[#E6DFD2]" />
                  )}
                </div>
                <div className="md:mt-4">
                  <span
                    className="text-[9px] uppercase tracking-wider font-bold"
                    style={{ color: s.done ? "#27855C" : GOLD }}
                  >
                    {s.when}
                  </span>
                  <h3 className="text-sm font-bold mt-1">{s.title}</h3>
                  <p className="text-[11px] leading-relaxed text-[#6F6B63] mt-1">
                    {s.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl bg-[#0B0B0B] text-white overflow-hidden">
          <div className="grid md:grid-cols-[1fr_auto] items-center gap-6 p-6 sm:p-8">
            <div>
              <span className="text-[10px] uppercase tracking-[.18em] text-[#C6A15B]">
                We’re here for you
              </span>
              <h2 className="font-serif font-bold text-xl mt-1">
                Questions before your journey?
              </h2>
              <p className="text-xs text-[#8D8D8D] mt-2 max-w-lg leading-relaxed">
                Our travel specialists are available Monday–Saturday, 8:00
                AM–6:00 PM GMT. Quote booking reference KOB–GH–260918 for faster
                support.
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-xs">
                <a
                  href="mailto:info@kobanitours.com"
                  className="flex items-center gap-2 text-white hover:text-[#C6A15B]"
                >
                  <Icon name="mail" size={14} />
                  info@kobanitours.com
                </a>
                <a
                  href="tel:+233244719176"
                  className="flex items-center gap-2 text-white hover:text-[#C6A15B]"
                >
                  <Icon name="phone" size={14} />
                  +233 302 555 014
                </a>
              </div>
            </div>
            <a
              href="https://wa.me/233244719176"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-[#25D366] text-[#082E17] px-5 py-3.5 flex items-center justify-center gap-2 text-sm font-bold whitespace-nowrap"
            >
              <Icon name="whatsapp" size={18} />
              Chat on WhatsApp
            </a>
          </div>
        </section>
        <p className="text-center text-[10px] text-[#9A9590] mt-6">
          Please keep your booking reference safe. You’ll need it for all future
          correspondence.
        </p>
      </main>
    </div>
  )
}
