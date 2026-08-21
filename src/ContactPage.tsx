import { useState } from "react"
import {
  ChevronRightIcon,
  CheckIcon,
  ArrowRightIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  InstagramIcon,
  TikTokIcon,
  TelegramIcon,
  ClockIcon,
  StarIcon,
} from "./icons"
import { ApiError, contactMessageApi } from "./api"
import { COMPANY } from "./companyProfile"

type Page = "home" | "tours" | "tour-details" | "about" | "gallery" | "articles" | "article-read" | "contribute" | "market" | "market-product" | "contact"

const GOLD = "#C6A15B"
const CREAM = "#F8F4EA"
const DARK = "#0B0B0B"

// ─── Extra icons ────────────────────────────────────────────────────────────────
const WhatsAppIcon2 = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)
const ChevronDownIcon = ({ size = 14 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
)
const FacebookIcon2 = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)
const YoutubeIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)
const XSocial = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)
const SendIcon = ({ size = 16 }: { size?: number }) => (
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
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)
const AlertCircle = ({ size = 14 }: { size?: number }) => (
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
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)
const LinkedInIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

// ─── FAQ data ──────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "How far in advance should I book a KOBANI tour?",
    a: "We recommend booking at least 4–6 weeks in advance for standard group tours, and 8–12 weeks for private and bespoke itineraries. During peak season (November–March), earlier booking is strongly advised as availability is limited.",
  },
  {
    q: "Do you offer custom private itineraries?",
    a: "Yes — private bespoke tours are our most popular offering. Tell us your interests, travel dates, group size, and budget and our team will design a custom itinerary. There is no additional planning fee for itineraries over $500.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards (Visa, Mastercard), PayPal, bank wire transfer, and mobile money (MTN, Vodafone, AirtelTigo). A 30% deposit is required to confirm a booking, with the balance due 14 days before departure.",
  },
  {
    q: "What is your cancellation policy?",
    a: "Cancellations made more than 30 days before departure receive a full refund minus a $50 processing fee. Within 14–30 days: 50% refund. Within 14 days: no refund, but we offer rebooking credits valid for 12 months.",
  },
  {
    q: "Are your tours suitable for families with children?",
    a: "Many of our tours are family-friendly and we have experience accommodating children of all ages. We can adjust pace, activities, and accommodation to suit families. Contact us directly and we will recommend the most appropriate itinerary.",
  },
  {
    q: "Do I need a visa to travel to Ghana?",
    a: "Most passport holders require a visa to enter Ghana. We can connect you with our trusted visa facilitation partners, though KOBANI is not responsible for visa applications. We recommend applying at least 3 weeks before travel.",
  },
  {
    q: "What languages do your guides speak?",
    a: "Our guides are fluent in English, French, and Twi. We also have guides proficient in Spanish, German, and Arabic available on request with advance notice.",
  },
  {
    q: "Can you accommodate dietary requirements?",
    a: "Yes. We accommodate vegetarian, vegan, gluten-free, halal, and most other dietary requirements. Please inform us at the time of booking so we can plan accordingly with our hospitality partners.",
  },
]

// ─── Form types ─────────────────────────────────────────────────────────────────
interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  enquiryType: string
  message: string
}
type FormState = "idle" | "submitting" | "success"

const ENQUIRY_TYPES = [
  "Tour Booking Enquiry",
  "Custom Itinerary Request",
  "Group & Corporate Travel",
  "African Market Order",
  "Press & Media",
  "Partnership & Collaboration",
  "General Enquiry",
  "Complaint or Feedback",
]

// ─── Reusable primitives ───────────────────────────────────────────────────────
const inputStyle = (focused: boolean, error?: boolean) => ({
  background: "#F8F4EA",
  border: `1.5px solid ${error ? "#C84A4A" : focused ? GOLD : "#E6DFD2"}`,
  color: "#202020",
  outline: "none",
  transition: "border-color 0.2s",
})

const FieldLabel = ({
  children,
  required,
}: {
  children: React.ReactNode
  required?: boolean
}) => (
  <label
    className="block text-xs font-bold mb-1.5 tracking-wide"
    style={{ color: "#202020" }}
  >
    {children}
    {required && <span style={{ color: GOLD }}> *</span>}
  </label>
)

const FieldError = ({ msg }: { msg: string }) => (
  <div
    className="flex items-center gap-1.5 mt-1.5 text-xs"
    style={{ color: "#C84A4A" }}
  >
    <AlertCircle size={11} /> {msg}
  </div>
)

// ─── FAQ Accordion Item ─────────────────────────────────────────────────────────
const FaqItem = ({ q, a, index }: { q: string; a: string; index: number }) => {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="rounded-2xl overflow-hidden transition-all"
      style={{
        border: `1.5px solid ${open ? GOLD : "#E6DFD2"}`,
        background: "#FFFFFF",
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-start justify-between w-full px-6 py-4 text-left gap-4"
        style={{ background: open ? "rgba(198,161,91,0.04)" : "#FFFFFF" }}
      >
        <div className="flex items-start gap-3">
          <span
            className="flex-shrink-0 font-serif font-bold text-sm mt-0.5"
            style={{ fontFamily: "var(--font-serif)", color: GOLD }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            className="font-semibold text-sm leading-snug"
            style={{ color: "#0B0B0B" }}
          >
            {q}
          </span>
        </div>
        <div
          className="flex-shrink-0 mt-0.5 transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "none", color: GOLD }}
        >
          <ChevronDownIcon size={16} />
        </div>
      </button>
      {open && (
        <div className="px-6 pb-5 pt-1">
          <div
            className="ml-8 text-sm leading-relaxed"
            style={{ color: "#6F6B63" }}
          >
            {a}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Info Card ─────────────────────────────────────────────────────────────────
const InfoCard = ({
  icon,
  title,
  lines,
  accent = false,
}: {
  icon: React.ReactNode
  title: string
  lines: { text: string; sub?: string }[]
  accent?: boolean
}) => (
  <div
    className="rounded-2xl p-5 flex gap-4 transition-all group"
    style={{
      background: accent ? DARK : "#FFFFFF",
      border: `1.5px solid ${accent ? "#1F1F1F" : "#E6DFD2"}`,
      boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
    }}
    onMouseEnter={(e) => {
      ;(e.currentTarget as HTMLElement).style.borderColor = GOLD
      ;(e.currentTarget as HTMLElement).style.boxShadow =
        "0 8px 24px rgba(0,0,0,0.1)"
      ;(e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"
    }}
    onMouseLeave={(e) => {
      ;(e.currentTarget as HTMLElement).style.borderColor = accent
        ? "#1F1F1F"
        : "#E6DFD2"
      ;(e.currentTarget as HTMLElement).style.boxShadow =
        "0 2px 10px rgba(0,0,0,0.04)"
      ;(e.currentTarget as HTMLElement).style.transform = "none"
    }}
  >
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{
        background: accent ? "rgba(198,161,91,0.15)" : "rgba(198,161,91,0.1)",
      }}
    >
      <span style={{ color: GOLD }}>{icon}</span>
    </div>
    <div>
      <div
        className="text-xs font-bold tracking-[0.14em] uppercase mb-1.5"
        style={{ color: GOLD }}
      >
        {title}
      </div>
      {lines.map((l, i) => (
        <div key={i}>
          <div
            className="text-sm font-semibold"
            style={{ color: accent ? "#FFFFFF" : "#202020" }}
          >
            {l.text}
          </div>
          {l.sub && (
            <div
              className="text-xs mt-0.5"
              style={{ color: accent ? "#6F6B63" : "#9A9590" }}
            >
              {l.sub}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
)

// ─── Social button ─────────────────────────────────────────────────────────────
const SocialBtn = ({
  icon,
  label,
  color,
  bg,
  href,
}: {
  icon: React.ReactNode
  label: string
  color: string
  bg: string
  href: string
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`Follow KOBANI on ${label}`}
    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all"
    style={{ background: bg, color, border: `1px solid ${bg}` }}
    onMouseEnter={(e) => {
      ;(e.currentTarget as HTMLElement).style.opacity = "0.85"
    }}
    onMouseLeave={(e) => {
      ;(e.currentTarget as HTMLElement).style.opacity = "1"
    }}
  >
    {icon} {label}
  </a>
)

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ContactPage({
  onNavigate,
}: {
  onNavigate: (p: Page) => void
}) {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    enquiryType: "",
    message: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  )
  const [formState, setFormState] = useState<FormState>("idle")
  const [submitError, setSubmitError] = useState("")
  const [focused, setFocused] = useState("")

  const set = (k: keyof FormData, v: string) =>
    setForm((f) => ({ ...f, [k]: v }))
  const fi = (field: string) => ({
    onFocus: () => setFocused(field),
    onBlur: () => setFocused(""),
  })

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!form.name.trim()) e.name = "Full name is required"
    if (!form.email.trim()) e.email = "Email address is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Please enter a valid email"
    if (!form.enquiryType) e.enquiryType = "Please select an enquiry type"
    if (!form.message.trim()) e.message = "Message is required"
    else if (form.message.trim().length < 20)
      e.message = "Please write at least 20 characters"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setFormState("submitting")
    setSubmitError("")
    try {
      await contactMessageApi.submit({ name: form.name, email: form.email, phone: form.phone, subject: form.subject, enquiry_type: form.enquiryType, message: form.message })
      setFormState("success")
    } catch (error) {
      setFormState("idle")
      if (error instanceof ApiError && error.fields) setErrors(error.fields)
      setSubmitError(error instanceof ApiError && error.code === "RATE_LIMITED" ? "Too many messages were sent. Please try again later." : "Your message could not be sent. Please check your connection and try again.")
    }
  }

  return (
    <div style={{ background: CREAM }}>
      {/* ── 1. Banner ─────────────────────────────────────────────────────────── */}
      <section className="px-4 pt-8 pb-0">
        <div className="mx-auto" style={{ maxWidth: 1280 }}>
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{ minHeight: 320 }}
          >
            <img
              src="https://images.unsplash.com/photo-1592784201029-bdb351d47eff?w=1400&h=560&fit=crop&auto=format"
              alt="Silhouettes on the savanna at sunset"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(110deg,rgba(11,11,11,0.93) 0%,rgba(11,11,11,0.65) 55%,rgba(11,11,11,0.25) 100%)",
              }}
            />
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background: `linear-gradient(90deg,${GOLD},#E9D6A8,${GOLD},#E9D6A8,${GOLD})`,
              }}
            />
            {/* Ornamental corner */}
            <div
              className="absolute bottom-0 right-0 w-64 h-64 opacity-10"
              style={{
                background: `radial-gradient(circle at 80% 80%, ${GOLD}, transparent 70%)`,
              }}
            />

            <div
              className="relative z-10 flex flex-col justify-center px-8 py-16 md:px-16"
              style={{ minHeight: 320 }}
            >
              <nav
                className="flex items-center gap-2 text-xs mb-6"
                style={{ color: "#E9D6A8" }}
              >
                <button
                  onClick={() => onNavigate("home")}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "inherit",
                  }}
                  className="hover:text-[#C6A15B] transition-colors"
                >
                  Home
                </button>
                <ChevronRightIcon size={11} />
                <span style={{ color: GOLD }}>Contact</span>
              </nav>
              <div
                className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase self-start"
                style={{
                  background: "rgba(198,161,91,0.18)",
                  border: "1px solid rgba(198,161,91,0.35)",
                  color: "#E9D6A8",
                }}
              >
                ✦ Get in Touch
              </div>
              <h1
                className="font-serif font-bold leading-tight mb-4"
                style={{
                  fontFamily: "var(--font-serif)",
                  color: "#FFFFFF",
                  fontSize: "clamp(2rem,5vw,3.5rem)",
                  maxWidth: 560,
                }}
              >
                Let Us Plan
                <br />
                Your Journey
              </h1>
              <p
                style={{
                  color: "#E9D6A8",
                  maxWidth: 480,
                  fontSize: 16,
                  lineHeight: 1.8,
                }}
              >
                Our travel experts are ready to craft a bespoke African
                experience around your story, your schedule, and your vision of
                luxury.
              </p>
              <div className="flex flex-wrap gap-6 mt-7">
                {[
                  { icon: "⚡", text: "Responsive travel assistance" },
                  { icon: "🌍", text: "Available in 3 languages" },
                  { icon: "⭐", text: "Personal service from enquiry onward" },
                ].map((b) => (
                  <div
                    key={b.text}
                    className="flex items-center gap-2 text-xs font-medium"
                    style={{ color: "#E9D6A8" }}
                  >
                    <span>{b.icon}</span> {b.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Contact Info Cards ──────────────────────────────────────────────── */}
      <section className="px-4 pt-6">
        <div
          className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          style={{ maxWidth: 1280 }}
        >
          <InfoCard
            icon={<PhoneIcon />}
            title="Phone & WhatsApp"
            lines={[
              { text: "+233 24 471 9176", sub: "Phone and WhatsApp" },
              { text: "+233 53 982 4299", sub: "Additional enquiries" },
            ]}
          />
          <InfoCard
            icon={<MailIcon />}
            title="Email"
            lines={[
              {
                text: "info@kobanitours.com",
                sub: "General enquiries and reservations",
              },
              { text: "@kobanihistoricaltours", sub: "Instagram" },
            ]}
          />
          <InfoCard
            icon={<MapPinIcon />}
            title="Office Location"
            lines={[
              { text: "Amasaman", sub: "Greater Accra Region, Ghana" },
              { text: "Open Mon–Fri", sub: "9 AM – 6 PM · Sat 10 AM – 2 PM" },
            ]}
          />
          <InfoCard
            accent
            icon={<ClockIcon size={18} />}
            title="Business Hours"
            lines={[
              { text: "Mon – Fri: 8 AM – 7 PM", sub: "GMT / West Africa Time" },
              { text: "Sat: 9 AM – 4 PM", sub: "Sunday: By appointment" },
            ]}
          />
        </div>
      </section>

      {/* ── 3. Main Contact Card ───────────────────────────────────────────────── */}
      <section className="px-4 pt-6">
        <div className="mx-auto" style={{ maxWidth: 1280 }}>
          <div
            className="rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-5"
            style={{
              background: "#FFFFFF",
              border: "1.5px solid #E6DFD2",
              boxShadow: "0 8px 40px rgba(0,0,0,0.07)",
            }}
          >
            {/* ── Left: Form ── */}
            <div className="lg:col-span-3 p-7 md:p-10">
              <div className="mb-7">
                <div
                  className="text-xs font-bold tracking-widest uppercase mb-2"
                  style={{ color: GOLD }}
                >
                  ✦ Send a Message
                </div>
                <h2
                  className="font-serif font-bold text-2xl"
                  style={{ fontFamily: "var(--font-serif)", color: DARK }}
                >
                  How Can We Help You?
                </h2>
              </div>

              {formState === "success" ? (
                <div className="py-14 text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{
                      background: "rgba(39,133,92,0.1)",
                      border: "2px solid rgba(39,133,92,0.3)",
                    }}
                  >
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#27855C"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3
                    className="font-serif font-bold text-xl mb-3"
                    style={{ fontFamily: "var(--font-serif)", color: DARK }}
                  >
                    Message Sent!
                  </h3>
                  <p className="text-sm mb-2" style={{ color: "#6F6B63" }}>
                    Thank you,{" "}
                    <strong style={{ color: DARK }}>
                      {form.name.split(" ")[0]}
                    </strong>
                    . Your message was sent successfully.
                  </p>
                  <p className="text-sm mb-8" style={{ color: "#9A9590" }}>
                    Our experts will reply to you shortly at <strong style={{ color: DARK }}>{form.email}</strong>.
                  </p>
                  <div className="flex gap-3 justify-center flex-wrap">
                    <button
                      onClick={() => {
                        setFormState("idle")
                        setForm({
                          name: "",
                          email: "",
                          phone: "",
                          subject: "",
                          enquiryType: "",
                          message: "",
                        })
                      }}
                      className="px-6 py-2.5 rounded-xl text-sm font-semibold"
                      style={{
                        background: "#FFFFFF",
                        border: "1.5px solid #E6DFD2",
                        color: "#202020",
                      }}
                    >
                      Send Another
                    </button>
                    <a
                      href={COMPANY.whatsappChat}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold"
                      style={{ background: "#25D366", color: "#FFFFFF" }}
                    >
                      <WhatsAppIcon2 size={15} /> WhatsApp Us
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  {/* Row 1: Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <FieldLabel required>Full Name</FieldLabel>
                      <input
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="Your full name"
                        className="w-full px-4 py-3 rounded-xl text-sm"
                        style={inputStyle(focused === "name", !!errors.name)}
                        {...fi("name")}
                      />
                      {errors.name && <FieldError msg={errors.name} />}
                    </div>
                    <div>
                      <FieldLabel required>Email Address</FieldLabel>
                      <input
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        type="email"
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-xl text-sm"
                        style={inputStyle(focused === "email", !!errors.email)}
                        {...fi("email")}
                      />
                      {errors.email && <FieldError msg={errors.email} />}
                    </div>
                  </div>

                  {/* Row 2: Phone + Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <FieldLabel>Phone / WhatsApp</FieldLabel>
                      <input
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        placeholder="+1 234 567 8900"
                        className="w-full px-4 py-3 rounded-xl text-sm"
                        style={inputStyle(focused === "phone")}
                        {...fi("phone")}
                      />
                    </div>
                    <div>
                      <FieldLabel>Subject</FieldLabel>
                      <input
                        value={form.subject}
                        onChange={(e) => set("subject", e.target.value)}
                        placeholder="e.g. Private 10-day Ghana tour"
                        className="w-full px-4 py-3 rounded-xl text-sm"
                        style={inputStyle(focused === "subject")}
                        {...fi("subject")}
                      />
                    </div>
                  </div>

                  {/* Enquiry type */}
                  <div className="mb-4">
                    <FieldLabel required>Enquiry Type</FieldLabel>
                    <div className="relative">
                      <select
                        value={form.enquiryType}
                        onChange={(e) => set("enquiryType", e.target.value)}
                        className="w-full appearance-none px-4 py-3 rounded-xl text-sm pr-10"
                        style={inputStyle(
                          focused === "enquiryType",
                          !!errors.enquiryType,
                        )}
                        {...fi("enquiryType")}
                      >
                        <option value="">Select enquiry type…</option>
                        {ENQUIRY_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <div
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: "#6F6B63" }}
                      >
                        <ChevronDownIcon size={14} />
                      </div>
                    </div>
                    {errors.enquiryType && (
                      <FieldError msg={errors.enquiryType} />
                    )}
                  </div>

                  {/* Message */}
                  <div className="mb-5">
                    <FieldLabel required>Message</FieldLabel>
                    <textarea
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                      rows={5}
                      placeholder="Tell us about your travel vision — dates, group size, destinations of interest, special requirements…"
                      className="w-full px-4 py-3 rounded-xl text-sm resize-none leading-relaxed"
                      style={inputStyle(
                        focused === "message",
                        !!errors.message,
                      )}
                      {...fi("message")}
                    />
                    <div className="flex items-center justify-between mt-1">
                      {errors.message ? (
                        <FieldError msg={errors.message} />
                      ) : (
                        <span />
                      )}
                      <span
                        className="text-xs ml-auto"
                        style={{ color: "#9A9590" }}
                      >
                        {form.message.length} chars
                      </span>
                    </div>
                  </div>

                  {submitError && <div role="alert" className="mb-4 rounded-xl border border-[#C84A4A]/30 bg-[#C84A4A]/5 px-4 py-3 text-sm text-[#C84A4A]">{submitError}</div>}
                  <button
                    type="submit"
                    disabled={formState === "submitting"}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-bold transition-all"
                    style={{
                      background: formState === "submitting" ? "#D6C498" : GOLD,
                      color: DARK,
                      cursor:
                        formState === "submitting" ? "not-allowed" : "pointer",
                    }}
                  >
                    {formState === "submitting" ? (
                      <>
                        <div
                          className="w-4 h-4 rounded-full border-2 animate-spin"
                          style={{
                            borderColor:
                              "rgba(0,0,0,0.25) transparent transparent transparent",
                          }}
                        />
                        Sending…
                      </>
                    ) : (
                      <>
                        <SendIcon size={15} /> Send Message
                      </>
                    )}
                  </button>
                  <p
                    className="text-xs text-center mt-3"
                    style={{ color: "#9A9590" }}
                  >
                    We respond to all enquiries within 4 business hours. No
                    spam, ever.
                  </p>
                </form>
              )}
            </div>

            {/* ── Right: Image + Info ── */}
            <div className="lg:col-span-2 flex flex-col min-h-0">
              {/* Image */}
              <div
                className="relative flex-1 overflow-hidden"
                style={{ minHeight: 260 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1728042107033-76b13feac547?w=700&h=800&fit=crop&auto=format"
                  alt="Giraffes silhouetted at golden sunset"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(11,11,11,0.1) 0%, rgba(11,11,11,0.6) 100%)",
                  }}
                />
                {/* Floating review badge */}
                <div
                  className="absolute top-5 right-5 rounded-2xl px-4 py-3"
                  style={{
                    background: "rgba(11,11,11,0.82)",
                    border: "1px solid rgba(198,161,91,0.35)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div className="flex gap-0.5 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <StarIcon key={i} size={11} filled />
                    ))}
                  </div>
                  <div className="text-white text-xs font-semibold">
                    Dedicated Support
                  </div>
                  <div className="text-xs" style={{ color: "#9A9590" }}>
                    1,200+ reviews
                  </div>
                </div>
              </div>

              {/* Bottom info panel */}
              <div className="p-7" style={{ background: DARK }}>
                <div
                  className="text-xs font-bold tracking-widest uppercase mb-2"
                  style={{ color: GOLD }}
                >
                  ✦ We're Here for You
                </div>
                <p
                  className="text-sm leading-relaxed mb-5"
                  style={{ color: "#9A9590" }}
                >
                  Whether you have a fully planned itinerary or just a dream of
                  Africa, our concierge team will listen and build around you.
                </p>

                {/* Direct contact links */}
                <div className="space-y-2.5 mb-6">
                  {[
                    {
                      icon: <PhoneIcon />,
                      label: "+233 24 471 9176",
                      sub: "Call or text",
                      href: `tel:${COMPANY.phones[0]}`,
                    },
                    {
                      icon: <WhatsAppIcon2 size={16} />,
                      label: "WhatsApp Us Now",
                      sub: "Booking assistance",
                      href: COMPANY.whatsappChat,
                    },
                    {
                      icon: <MailIcon />,
                      label: "info@kobanitours.com",
                      sub: "For all enquiries",
                      href: `mailto:${COMPANY.email}`,
                    },
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                      onMouseEnter={(e) => {
                        ;(e.currentTarget as HTMLElement).style.borderColor =
                          "rgba(198,161,91,0.3)"
                        ;(e.currentTarget as HTMLElement).style.background =
                          "rgba(198,161,91,0.06)"
                      }}
                      onMouseLeave={(e) => {
                        ;(e.currentTarget as HTMLElement).style.borderColor =
                          "rgba(255,255,255,0.07)"
                        ;(e.currentTarget as HTMLElement).style.background =
                          "rgba(255,255,255,0.04)"
                      }}
                    >
                      <span style={{ color: GOLD }}>{item.icon}</span>
                      <div>
                        <div className="text-xs font-semibold text-white">
                          {item.label}
                        </div>
                        <div className="text-xs" style={{ color: "#6F6B63" }}>
                          {item.sub}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Social links */}
                <div
                  className="text-xs font-bold tracking-widest uppercase mb-3"
                  style={{ color: "#4A4A4A" }}
                >
                  Follow KOBANI
                </div>
                <div className="flex flex-wrap gap-2">
                  <SocialBtn
                    icon={<InstagramIcon />}
                    label="Instagram"
                    color="#E1306C"
                    bg="rgba(225,48,108,0.12)"
                    href={COMPANY.instagram}
                  />
                  <SocialBtn
                    icon={<TikTokIcon />}
                    label="TikTok"
                    color="#FFFFFF"
                    bg="rgba(255,255,255,0.08)"
                    href={COMPANY.tiktok}
                  />
                  <SocialBtn
                    icon={<TelegramIcon />}
                    label="Telegram"
                    color="#2AABEE"
                    bg="rgba(42,171,238,0.12)"
                    href={COMPANY.telegram}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Map Card ───────────────────────────────────────────────────────── */}
      <section className="px-4 pt-6">
        <div className="mx-auto" style={{ maxWidth: 1280 }}>
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              border: "1.5px solid #E6DFD2",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3">
              {/* Map image */}
              <div
                className="lg:col-span-2 relative overflow-hidden"
                style={{ minHeight: 340 }}
              >
                <iframe
                  src="https://www.google.com/maps?q=5.7062137,-0.3019281&z=15&output=embed"
                  title="KOBANI office location in Amasaman"
                  className="w-full h-full object-cover"
                  style={{ minHeight: 340 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                {/* Map pin overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center shadow-2xl"
                      style={{ background: GOLD, border: "3px solid #FFFFFF" }}
                    >
                      <MapPinIcon size={22} />
                    </div>
                    <div
                      className="mt-2 px-3 py-1.5 rounded-xl text-xs font-bold"
                      style={{
                        background: "rgba(11,11,11,0.85)",
                        color: "#E9D6A8",
                        backdropFilter: "blur(6px)",
                        border: "1px solid rgba(198,161,91,0.3)",
                      }}
                    >
                      KOBANI Amasaman Office
                    </div>
                  </div>
                </div>
                {/* Gradient edge */}
                <div
                  className="absolute top-0 bottom-0 right-0 w-16 hidden lg:block"
                  style={{
                    background:
                      "linear-gradient(to right, transparent, #FFFFFF)",
                  }}
                />
              </div>

              {/* Location details */}
              <div
                className="p-7 flex flex-col justify-between"
                style={{ background: "#FFFFFF" }}
              >
                <div>
                  <div
                    className="text-xs font-bold tracking-widest uppercase mb-2"
                    style={{ color: GOLD }}
                  >
                    ✦ Find Us
                  </div>
                  <h3
                    className="font-serif font-bold text-lg mb-4"
                    style={{ fontFamily: "var(--font-serif)", color: DARK }}
                  >
                    KOBANI Amasaman Head Office
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        icon: <MapPinIcon size={15} />,
                        label: "Amasaman, Greater Accra Region, Ghana",
                      },
                      {
                        icon: <PhoneIcon />,
                        label: "+233 24 471 9176 · +233 53 982 4299",
                      },
                      { icon: <MailIcon />, label: "info@kobanitours.com" },
                      {
                        icon: <ClockIcon size={15} />,
                        label: "Mon–Fri 9 AM – 6 PM · Sat 10 AM – 2 PM",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-start gap-2.5 text-sm"
                        style={{ color: "#6F6B63" }}
                      >
                        <span
                          className="mt-0.5 flex-shrink-0"
                          style={{ color: GOLD }}
                        >
                          {item.icon}
                        </span>
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-6 space-y-2.5">
                  <a
                    href="https://maps.app.goo.gl/61ft5xQoYqj257vg8"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition-all"
                    style={{ background: GOLD, color: DARK }}
                  >
                    <MapPinIcon size={15} /> Get Directions
                  </a>
                  <div
                    className="rounded-xl p-3 text-xs text-center"
                    style={{
                      background: "#F8F4EA",
                      color: "#9A9590",
                      border: "1px solid #E6DFD2",
                    }}
                  >
                    Located in Amasaman, Greater Accra Region
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. FAQ ─────────────────────────────────────────────────────────────── */}
      <section className="px-4 pt-12 pb-6">
        <div className="mx-auto" style={{ maxWidth: 1280 }}>
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* Heading column */}
            <div className="lg:w-72 flex-shrink-0 lg:sticky lg:top-24">
              <div
                className="text-xs font-bold tracking-widest uppercase mb-3"
                style={{ color: GOLD }}
              >
                ✦ FAQ
              </div>
              <h2
                className="font-serif font-bold text-2xl mb-4 leading-snug"
                style={{ fontFamily: "var(--font-serif)", color: DARK }}
              >
                Frequently Asked Questions
              </h2>
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: "#6F6B63" }}
              >
                Can't find what you're looking for? Our team is available on
                WhatsApp and email — we reply to every message personally.
              </p>
              <a
                href={COMPANY.whatsappChat}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold"
                style={{ background: "#25D366", color: "#FFFFFF" }}
              >
                <WhatsAppIcon2 size={16} /> Ask on WhatsApp
              </a>
            </div>

            {/* Accordion column */}
            <div className="flex-1 space-y-3">
              {FAQS.map((faq, i) => (
                <FaqItem key={i} q={faq.q} a={faq.a} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. WhatsApp CTA ───────────────────────────────────────────────────── */}
      <section className="px-4 py-8 pb-16">
        <div className="mx-auto" style={{ maxWidth: 1280 }}>
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{ background: DARK, border: "1px solid #1F1F1F" }}
          >
            {/* Background glow */}
            <div
              className="absolute top-0 right-0 w-80 h-80 opacity-10 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 80% 20%, #25D366, transparent 60%)",
              }}
            />
            <div
              className="absolute bottom-0 left-0 w-60 h-60 opacity-8 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 20% 80%, #C6A15B, transparent 60%)",
              }}
            />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 px-8 py-10 md:px-14">
              <div className="text-center lg:text-left">
                <div
                  className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
                  style={{
                    background: "rgba(37,211,102,0.15)",
                    border: "1px solid rgba(37,211,102,0.3)",
                    color: "#25D366",
                  }}
                >
                  💬 WhatsApp Support
                </div>
                <h2
                  className="font-serif font-bold text-2xl md:text-3xl text-white mb-3"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Chat With Us on WhatsApp
                </h2>
                <p
                  className="text-sm md:text-base max-w-lg"
                  style={{ color: "#9A9590", lineHeight: 1.75 }}
                >
                  Our travel consultants are available on WhatsApp around the
                  clock. Ask questions, share your travel ideas, or get an
                  instant quote — no waiting on hold.
                </p>
                <div className="flex flex-wrap gap-5 mt-5 justify-center lg:justify-start">
                  {[
                    { icon: "⚡", text: "Direct booking assistance" },
                    { icon: "🌍", text: "Available in English, French & Twi" },
                    { icon: "🔒", text: "End-to-end encrypted" },
                  ].map((f) => (
                    <div
                      key={f.text}
                      className="flex items-center gap-1.5 text-xs font-medium"
                      style={{ color: "#9A9590" }}
                    >
                      <span>{f.icon}</span> {f.text}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 flex-shrink-0">
                {/* WhatsApp button */}
                <a
                  href={`${COMPANY.whatsappChat}?text=Hi%20KOBANI%2C%20I%27d%20like%20to%20enquire%20about%20a%20tour.`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-bold transition-all group"
                  style={{
                    background: "#25D366",
                    color: "#FFFFFF",
                    boxShadow: "0 8px 32px rgba(37,211,102,0.35)",
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLElement).style.transform =
                      "translateY(-2px)"
                    ;(e.currentTarget as HTMLElement).style.boxShadow =
                      "0 12px 40px rgba(37,211,102,0.45)"
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLElement).style.transform = "none"
                    ;(e.currentTarget as HTMLElement).style.boxShadow =
                      "0 8px 32px rgba(37,211,102,0.35)"
                  }}
                >
                  <WhatsAppIcon2 size={22} />
                  Start a WhatsApp Chat
                  <ArrowRightIcon size={16} />
                </a>
                {/* Phone number */}
                <div
                  className="text-sm font-semibold"
                  style={{ color: "#6F6B63" }}
                >
                  or call{" "}
                  <a href={`tel:${COMPANY.phones[0]}`} style={{ color: GOLD }}>
                    +233 24 471 9176
                  </a>
                </div>
                {/* Trust note */}
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-xs"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#6F6B63",
                  }}
                >
                  <CheckIcon size={11} /> No commitment required
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
