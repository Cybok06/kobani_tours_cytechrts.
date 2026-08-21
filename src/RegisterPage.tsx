import { useState, useEffect } from "react"
import BrandLogo from "./BrandLogo"
import { useTranslation } from "react-i18next"
import { useAuth } from "./AuthContext"
import { ApiError } from "./api"
import { LEGAL_VERSIONS } from "./config/legal"

type Page = "home" | "tours" | "tour-details" | "about" | "gallery" | "articles" | "article-read" | "contribute" | "market" | "market-product" | "contact" | "faq" | "login" | "register" | "verify-email" | "dashboard"

const GOLD = "#C6A15B"

// ─── Icons ────────────────────────────────────────────────────────────────────
const EyeIcon = ({ open, size = 16 }: { open: boolean; size?: number }) =>
  open ? (
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
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
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
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
const CheckIcon2 = ({ size = 10 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 10 8">
    <polyline
      points="1,4 4,7 9,1"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
const ArrowLeftIcon = ({ size = 14 }: { size?: number }) => (
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
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
)
const BriefcaseIcon = ({ size = 20 }: { size?: number }) => (
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
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
  </svg>
)
const ShieldIcon2 = ({ size = 20 }: { size?: number }) => (
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
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)
const PackageIcon = ({ size = 20 }: { size?: number }) => (
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
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
)
const HeartIcon2 = ({ size = 20 }: { size?: number }) => (
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
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
)
const BookmarkIcon2 = ({ size = 20 }: { size?: number }) => (
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
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
  </svg>
)
const ChevronDownIcon2 = ({ size = 14 }: { size?: number }) => (
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

// ─── Strength helpers ─────────────────────────────────────────────────────────
const calcStrength = (p: string) => {
  let s = 0
  if (p.length >= 8) s++
  if (/[A-Z]/.test(p)) s++
  if (/[0-9]/.test(p)) s++
  if (/[^A-Za-z0-9]/.test(p)) s++
  return s
}
const strengthLevels = [
  { label: "Weak", color: "#C84A4A" },
  { label: "Fair", color: "#E9893A" },
  { label: "Good", color: "#D9B96E" },
  { label: "Strong", color: "#27855C" },
]

// ─── Email validation ─────────────────────────────────────────────────────────
type EmailState = "idle" | "typing" | "valid" | "invalid"
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// ─── Country codes ────────────────────────────────────────────────────────────
const CODES = [
  { code: "+1", flag: "🇺🇸", label: "US" },
  { code: "+44", flag: "🇬🇧", label: "UK" },
  { code: "+233", flag: "🇬🇭", label: "GH" },
  { code: "+234", flag: "🇳🇬", label: "NG" },
  { code: "+27", flag: "🇿🇦", label: "ZA" },
  { code: "+33", flag: "🇫🇷", label: "FR" },
  { code: "+49", flag: "🇩🇪", label: "DE" },
  { code: "+971", flag: "🇦🇪", label: "AE" },
  { code: "+91", flag: "🇮🇳", label: "IN" },
  { code: "+61", flag: "🇦🇺", label: "AU" },
  { code: "+1", flag: "🇨🇦", label: "CA" },
  { code: "+86", flag: "🇨🇳", label: "CN" },
]

const COUNTRIES = [
  "Ghana",
  "Nigeria",
  "South Africa",
  "Kenya",
  "Ethiopia",
  "Tanzania",
  "Senegal",
  "Ivory Coast",
  "United States",
  "United Kingdom",
  "France",
  "Germany",
  "Canada",
  "Australia",
  "United Arab Emirates",
  "India",
  "China",
  "Brazil",
  "Netherlands",
  "Switzerland",
  "Sweden",
  "Italy",
  "Spain",
  "Other",
]

const BENEFITS = [
  {
    icon: <BriefcaseIcon />,
    title: "Manage Bookings",
    text: "View, modify, and track all your tour reservations in one place.",
  },
  {
    icon: <ShieldIcon2 />,
    title: "Secure Payments",
    text: "Pay confidently with PCI-certified, encrypted transactions.",
  },
  {
    icon: <PackageIcon />,
    title: "Track Orders",
    text: "Follow your African Market orders from dispatch to doorstep.",
  },
  {
    icon: <HeartIcon2 />,
    title: "Save Favourite Tours",
    text: "Build a wishlist and return to it whenever inspiration strikes.",
  },
  {
    icon: <BookmarkIcon2 />,
    title: "Continue Where You Left Off",
    text: "Your search history and preferences are remembered across sessions.",
  },
]

// ─── Shared input style ───────────────────────────────────────────────────────
const inputBase = (
  focused: boolean,
  error?: boolean,
  valid?: boolean,
): React.CSSProperties => ({
  width: "100%",
  borderRadius: 12,
  border: `1.5px solid ${
    error ? "#C84A4A" : valid ? "#27855C" : focused ? GOLD : "#E6DFD2"
  }`,
  background: "#FAFAF8",
  color: "#0B0B0B",
  fontSize: 14,
  outline: "none",
  padding: "11px 14px",
  transition: "border-color 0.15s",
})

const Field = ({
  label,
  required,
  children,
  hint,
  error,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
  hint?: string
  error?: string
}) => (
  <div className="space-y-1.5">
    <label
      className="flex gap-1 text-xs font-semibold tracking-wide uppercase"
      style={{ color: "#6F6B63" }}
    >
      {label} {required && <span style={{ color: "#C84A4A" }}>*</span>}
    </label>
    {children}
    {hint && !error && (
      <p className="text-xs" style={{ color: "#9A9590" }}>
        {hint}
      </p>
    )}
    {error && (
      <p className="text-xs" style={{ color: "#C84A4A" }}>
        ⚠ {error}
      </p>
    )}
  </div>
)

// ─── Password requirement pill ────────────────────────────────────────────────
const Req = ({ met, text }: { met: boolean; text: string }) => (
  <div
    className="flex items-center gap-1.5 text-xs"
    style={{ color: met ? "#27855C" : "#9A9590" }}
  >
    <div
      className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0"
      style={{
        background: met ? "rgba(39,133,92,0.15)" : "#EDE8E0",
        border: `1px solid ${met ? "rgba(39,133,92,0.4)" : "#DDD7CF"}`,
      }}
    >
      {met && <CheckIcon2 size={7} />}
    </div>
    {text}
  </div>
)

// ─── Left benefits panel ──────────────────────────────────────────────────────
const MemberBenefitsPanel = () => (
  <div
    className="relative hidden lg:flex flex-col justify-between overflow-hidden"
    style={{
      width: "42%",
      minHeight: "100vh",
      flexShrink: 0,
      background: "#0B0B0B",
    }}
  >
    {/* Decorative gradient */}
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse at 120% 0%, rgba(198,161,91,0.18) 0%, transparent 55%), radial-gradient(ellipse at -20% 100%, rgba(198,161,91,0.12) 0%, transparent 50%)",
      }}
    />
    {/* Subtle grid */}
    <div
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg,transparent,transparent 59px,rgba(198,161,91,1) 59px,rgba(198,161,91,1) 60px),repeating-linear-gradient(90deg,transparent,transparent 59px,rgba(198,161,91,1) 59px,rgba(198,161,91,1) 60px)",
      }}
    />
    <div
      className="absolute top-0 left-0 right-0 h-px"
      style={{
        background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
      }}
    />

    <div className="relative z-10 flex flex-col h-full p-10 py-12">
      {/* Logo */}
      <div className="mb-12">
        <div className="flex items-center gap-2.5 mb-1.5">
          <BrandLogo className="w-8 h-8" />
          <span
            className="font-serif font-bold text-xl tracking-wide text-white"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            KOBANI
          </span>
        </div>
        <p
          className="text-xs tracking-[0.25em] uppercase"
          style={{ color: GOLD }}
        >
          Where Heritage Meets Luxury
        </p>
      </div>

      {/* Heading */}
      <div className="mb-10">
        <div
          className="text-xs font-bold tracking-widest uppercase mb-3"
          style={{ color: GOLD }}
        >
          ✦ Member Benefits
        </div>
        <h2
          className="font-serif font-bold text-3xl text-white leading-tight"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Your journey, fully in your hands.
        </h2>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "#6F6B63" }}
        >
          A KOBANI account puts every booking, order, and discovery at your
          fingertips — from anywhere in the world.
        </p>
      </div>

      {/* Benefits list */}
      <div className="space-y-4 flex-1">
        {BENEFITS.map((b, i) => (
          <div
            key={i}
            className="flex items-start gap-4 p-4 rounded-xl transition-all group"
            style={{
              border: "1px solid rgba(198,161,91,0.12)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(198,161,91,0.12)",
                border: "1px solid rgba(198,161,91,0.2)",
              }}
            >
              <span style={{ color: GOLD }}>{b.icon}</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-white mb-0.5">
                {b.title}
              </div>
              <div
                className="text-xs leading-relaxed"
                style={{ color: "#6F6B63" }}
              >
                {b.text}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom trust */}
      <div
        className="mt-8 pt-6"
        style={{ borderTop: "1px solid rgba(198,161,91,0.15)" }}
      >
        <div
          className="flex items-center gap-2 text-xs"
          style={{ color: "#6F6B63" }}
        >
          <span style={{ color: GOLD }}>🔒</span>
          Your data is encrypted and never shared with third parties.
        </div>
      </div>
    </div>
  </div>
)

// ─── Main export ──────────────────────────────────────────────────────────────
const LeftPanel = () => (
  <div
    className="relative hidden min-h-screen overflow-hidden lg:block"
    style={{ width: "42%", flexShrink: 0 }}
  >
    <img
      src="/images/hero_section/lux_tour.png"
      alt="KOBANI luxury tour experience"
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-black/45" />
    <div className="relative z-10 p-10 py-12">
      <div className="flex items-center gap-2.5 mb-1.5">
        <BrandLogo className="w-8 h-8" />
        <span
          className="font-serif font-bold text-xl tracking-wide text-white"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          KOBANI
        </span>
      </div>
      <p className="text-xs tracking-[0.25em] uppercase" style={{ color: GOLD }}>
        Where Heritage Meets Luxury
      </p>
    </div>
  </div>
)

export default function RegisterPage({
  onNavigate,
}: {
  onNavigate: (p: Page) => void
}) {
  const { register } = useAuth()
  const { i18n, t } = useTranslation()
  // Form fields
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [emailState, setEmailState] = useState<EmailState>("idle")
  const [phone, setPhone] = useState("")
  const [countryCode, setCountryCode] = useState("+233")
  const [country, setCountry] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [showCf, setShowCf] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)

  // Form state
  const [formStatus, setFormStatus] =
    useState<"idle" | "loading" | "success" | "error">("idle")
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Email validation with debounce
  useEffect(() => {
    if (!email) {
      setEmailState("idle")
      return
    }
    setEmailState("typing")
    const t = setTimeout(() => {
      setEmailState(emailRegex.test(email) ? "valid" : "invalid")
    }, 600)
    return () => clearTimeout(t)
  }, [email])

  const strength = calcStrength(password)
  const reqs = [
    { met: password.length >= 8, text: "At least 8 characters" },
    { met: /[A-Z]/.test(password), text: "One uppercase letter" },
    { met: /[0-9]/.test(password), text: "One number" },
    { met: /[^A-Za-z0-9]/.test(password), text: "One special character" },
  ]
  const confirmMatch = confirm.length > 0 && password === confirm

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!fullName.trim()) errs.fullName = "Full name is required."
    if (emailState !== "valid")
      errs.email = "Please enter a valid email address."
    if (!phone.trim()) errs.phone = "Phone number is required."
    if (!country) errs.country = "Please select your country."
    if (strength < 4) errs.password = "Password must meet all four requirements."
    if (!confirmMatch) errs.confirm = "Passwords do not match."
    if (!acceptTerms)
      errs.terms = "You must accept the Terms of Service to continue."
    return errs
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setFormStatus("loading")
    try {
      const countryCodes: Record<string, string> = { Ghana: "GH", Nigeria: "NG", "South Africa": "ZA", Kenya: "KE", Ethiopia: "ET", Tanzania: "TZ", Senegal: "SN", "Ivory Coast": "CI", "United States": "US", "United Kingdom": "GB", France: "FR", Germany: "DE", Canada: "CA", Australia: "AU", "United Arab Emirates": "AE", India: "IN", China: "CN", Brazil: "BR", Netherlands: "NL", Switzerland: "CH", Sweden: "SE", Italy: "IT", Spain: "ES", Other: "ZZ" }
      const result = await register({ fullName, email, phoneCountryCode: countryCode, phoneNumber: phone.replace(/[^0-9]/g, ""), countryOfResidence: countryCodes[country] || country, password, preferredLanguage: i18n.resolvedLanguage || "en", acceptTerms: true, termsVersion: LEGAL_VERSIONS.terms, privacyVersion: LEGAL_VERSIONS.privacy })
      if (result.verificationRequired) {
        sessionStorage.setItem("kobani:verificationEmail", email.trim().toLowerCase())
        sessionStorage.setItem("kobani:verificationMaskedEmail", result.email)
        window.history.replaceState({}, "", "/verify-email")
        onNavigate("verify-email")
      }
    } catch (error) {
      setFormStatus("error")
      setPassword("")
      setConfirm("")
      const code = error instanceof ApiError ? error.code : "SERVER_ERROR"
      setErrors((current) => ({ ...current, form: t(`auth.errors.${code}`, { defaultValue: t("auth.errors.SERVER_ERROR") }) }))
    }
  }

  if (formStatus === "success") {
    return (
      <div className="flex min-h-screen" style={{ background: "#F8F4EA" }}>
        <LeftPanel />
        <div className="flex-1 flex items-center justify-center p-10">
          <div className="text-center" style={{ maxWidth: 400 }}>
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{
                background: "rgba(198,161,91,0.12)",
                border: "1.5px solid rgba(198,161,91,0.3)",
              }}
            >
              <span className="text-4xl">✦</span>
            </div>
            <h2
              className="font-serif font-bold text-3xl mb-3"
              style={{ fontFamily: "var(--font-serif)", color: "#0B0B0B" }}
            >
              Account Created!
            </h2>
            <p
              className="text-sm leading-relaxed mb-3"
              style={{ color: "#6F6B63" }}
            >
              Welcome to KOBANI,{" "}
              <span className="font-semibold" style={{ color: "#0B0B0B" }}>
                {fullName.split(" ")[0]}
              </span>
              . A confirmation email is on its way to{" "}
              <span className="font-semibold" style={{ color: "#0B0B0B" }}>
                {email}
              </span>
              .
            </p>
            <p className="text-xs mb-8" style={{ color: "#9A9590" }}>
              Please verify your email to unlock all features.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => onNavigate("home")}
                className="px-6 py-3 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: "#F0EBE0",
                  border: "1.5px solid #E6DFD2",
                  color: "#6F6B63",
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.borderColor = GOLD
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.borderColor =
                    "#E6DFD2"
                }}
              >
                Explore KOBANI
              </button>
              <button
                onClick={() => onNavigate("login")}
                className="btn-gold px-6 py-3 rounded-xl text-sm font-bold"
                style={{ color: "#0B0B0B" }}
              >
                Sign In →
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex min-h-screen"
      style={{ background: "#F8F4EA", fontFamily: "var(--font-sans)" }}
    >
      <LeftPanel />

      {/* Right panel */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-5 lg:px-10 flex-shrink-0">
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-1.5 text-xs font-semibold transition-colors lg:hidden"
            style={{
              color: "#6F6B63",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <ArrowLeftIcon size={12} /> KOBANI
          </button>
          <div className="lg:flex-1" />
          <div className="text-xs" style={{ color: "#9A9590" }}>
            Already a member?{" "}
            <button
              onClick={() => onNavigate("login")}
              className="font-bold transition-colors"
              style={{
                color: GOLD,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "#D9B96E")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = GOLD)
              }
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-start justify-center px-8 py-6 lg:px-12">
          <div className="w-full" style={{ maxWidth: 480 }}>
            <div className="mb-8">
              <div
                className="text-xs font-bold tracking-widest uppercase mb-2"
                style={{ color: GOLD }}
              >
                ✦ Join KOBANI
              </div>
              <h1
                className="font-serif font-bold text-3xl mb-1.5"
                style={{ fontFamily: "var(--font-serif)", color: "#0B0B0B" }}
              >
                Create Your Account
              </h1>
              <p className="text-sm" style={{ color: "#6F6B63" }}>
                Takes less than 2 minutes. No credit card required.
              </p>
            </div>

            <form onSubmit={submit} autoComplete="off" className="space-y-5">
              {errors.form && <div className="rounded-xl border border-[#C84A4A]/25 bg-[#C84A4A]/[0.08] px-4 py-3 text-sm text-[#C84A4A]">{errors.form}</div>}
              {/* Full name */}
              <Field label="Full Name" required error={errors.fullName}>
                <input
                  type="text"
                  name="kobani-signup-full-name"
                  autoComplete="off"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ama Owusu"
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused(null)}
                  style={inputBase(focused === "name", !!errors.fullName)}
                />
              </Field>

              {/* Email */}
              <Field label="Email Address" required error={errors.email}>
                <div className="relative">
                  <input
                    type="email"
                    name="kobani-signup-email"
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    style={{
                      ...inputBase(
                        focused === "email",
                        emailState === "invalid",
                        emailState === "valid",
                      ),
                      paddingRight: emailState !== "idle" ? 36 : 14,
                    }}
                  />
                  {emailState === "typing" && (
                    <svg
                      className="animate-spin absolute right-3.5 top-1/2 -translate-y-1/2"
                      width={14}
                      height={14}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#9A9590"
                      strokeWidth="2.5"
                    >
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                  )}
                  {emailState === "valid" && (
                    <div
                      className="absolute right-3.5 top-1/2 -translate-y-1/2"
                      style={{ color: "#27855C" }}
                    >
                      <svg
                        width={15}
                        height={15}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </div>
                  )}
                  {emailState === "invalid" && (
                    <div
                      className="absolute right-3.5 top-1/2 -translate-y-1/2"
                      style={{ color: "#C84A4A" }}
                    >
                      <svg
                        width={15}
                        height={15}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                    </div>
                  )}
                </div>
                {emailState === "valid" && !errors.email && (
                  <p className="text-xs" style={{ color: "#27855C" }}>
                    ✓ Email address looks good
                  </p>
                )}
                {emailState === "invalid" && !errors.email && (
                  <p className="text-xs" style={{ color: "#C84A4A" }}>
                    Please enter a valid email (e.g. name@domain.com)
                  </p>
                )}
              </Field>

              {/* Phone with country code */}
              <Field label="Phone Number" required error={errors.phone}>
                <div className="flex gap-2">
                  <div
                    className="relative"
                    style={{ width: 110, flexShrink: 0 }}
                  >
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      onFocus={() => setFocused("code")}
                      onBlur={() => setFocused(null)}
                      style={{
                        width: "100%",
                        borderRadius: 12,
                        border: `1.5px solid ${
                          focused === "code" ? GOLD : "#E6DFD2"
                        }`,
                        background: "#FAFAF8",
                        color: "#0B0B0B",
                        fontSize: 13,
                        outline: "none",
                        padding: "11px 28px 11px 10px",
                        appearance: "none",
                        cursor: "pointer",
                      }}
                    >
                      {CODES.map((c) => (
                        <option
                          key={`${c.flag}-${c.code}-${c.label}`}
                          value={c.code}
                        >
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <div
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: "#9A9590" }}
                    >
                      <ChevronDownIcon2 size={12} />
                    </div>
                  </div>
                  <input
                    type="tel"
                    name="kobani-signup-phone"
                    autoComplete="off"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="55 012 3456"
                    onFocus={() => setFocused("phone")}
                    onBlur={() => setFocused(null)}
                    style={{
                      ...inputBase(focused === "phone", !!errors.phone),
                      flex: 1,
                    }}
                  />
                </div>
              </Field>

              {/* Country */}
              <Field
                label="Country of Residence"
                required
                error={errors.country}
              >
                <div className="relative">
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    onFocus={() => setFocused("country")}
                    onBlur={() => setFocused(null)}
                    style={{
                      ...inputBase(focused === "country", !!errors.country),
                      appearance: "none",
                      cursor: "pointer",
                      paddingRight: 36,
                      color: country ? "#0B0B0B" : "#9A9590",
                    }}
                  >
                    <option value="" disabled>
                      Select your country
                    </option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <div
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: "#9A9590" }}
                  >
                    <ChevronDownIcon2 size={13} />
                  </div>
                </div>
              </Field>

              {/* Password */}
              <Field label="Password" required error={errors.password}>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    name="kobani-signup-password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    onFocus={() => setFocused("pw")}
                    onBlur={() => setFocused(null)}
                    style={{
                      ...inputBase(focused === "pw", !!errors.password),
                      paddingRight: 44,
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                    style={{
                      color: "#9A9590",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <EyeIcon open={showPw} size={16} />
                  </button>
                </div>

                {/* Strength bar */}
                {password.length > 0 && (
                  <div className="mt-2.5 space-y-1.5">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="flex-1 h-1 rounded-full transition-all duration-300"
                          style={{
                            background:
                              i <= strength
                                ? strengthLevels[strength - 1]?.color
                                : "#E6DFD2",
                          }}
                        />
                      ))}
                    </div>
                    {strength > 0 && (
                      <span
                        className="text-xs font-semibold"
                        style={{ color: strengthLevels[strength - 1]?.color }}
                      >
                        {strengthLevels[strength - 1]?.label} password
                      </span>
                    )}
                  </div>
                )}

                {/* Requirements */}
                {password.length > 0 && (
                  <div
                    className="grid grid-cols-2 gap-1.5 mt-2.5 p-3 rounded-xl"
                    style={{
                      background: "#F0EBE0",
                      border: "1px solid #E6DFD2",
                    }}
                  >
                    {reqs.map((r) => (
                      <Req key={r.text} met={r.met} text={r.text} />
                    ))}
                  </div>
                )}
              </Field>

              {/* Confirm password */}
              <Field label="Confirm Password" required error={errors.confirm}>
                <div className="relative">
                  <input
                    type={showCf ? "text" : "password"}
                    name="kobani-signup-password-confirmation"
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat your password"
                    onFocus={() => setFocused("cf")}
                    onBlur={() => setFocused(null)}
                    style={{
                      ...inputBase(
                        focused === "cf",
                        confirm.length > 0 && !confirmMatch,
                        confirm.length > 0 && confirmMatch,
                      ),
                      paddingRight: 44,
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCf((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                    style={{
                      color: "#9A9590",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <EyeIcon open={showCf} size={16} />
                  </button>
                </div>
                {confirm.length > 0 && (
                  <p
                    className="text-xs"
                    style={{ color: confirmMatch ? "#27855C" : "#C84A4A" }}
                  >
                    {confirmMatch
                      ? "✓ Passwords match"
                      : "✗ Passwords do not match"}
                  </p>
                )}
              </Field>

              {/* Checkboxes */}
              <div className="space-y-3 pt-1">
                {/* Terms */}
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <div
                    onClick={() => setAcceptTerms((v) => !v)}
                    className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5 cursor-pointer transition-all"
                    style={{
                      border: `1.5px solid ${
                        errors.terms
                          ? "#C84A4A"
                          : acceptTerms
                            ? GOLD
                            : "#D6D0C8"
                      }`,
                      background: acceptTerms ? GOLD : "transparent",
                    }}
                  >
                    {acceptTerms && <CheckIcon2 size={8} />}
                  </div>
                  <span
                    className="text-xs leading-relaxed"
                    style={{ color: "#6F6B63" }}
                  >
                    I agree to KOBANI's{" "}
                    <a
                      href="/terms-and-conditions"
                      className="font-semibold transition-colors"
                      style={{ color: GOLD }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.color =
                          "#D9B96E")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.color = GOLD)
                      }
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy-policy"
                      className="font-semibold transition-colors"
                      style={{ color: GOLD }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.color =
                          "#D9B96E")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.color = GOLD)
                      }
                    >
                      Privacy Policy
                    </a>
                    . <span style={{ color: "#C84A4A" }}>*</span>
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-xs ml-7" style={{ color: "#C84A4A" }}>
                    ⚠ {errors.terms}
                  </p>
                )}

                {/* Marketing */}
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <div
                    onClick={() => setMarketing((v) => !v)}
                    className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5 cursor-pointer transition-all"
                    style={{
                      border: `1.5px solid ${marketing ? GOLD : "#D6D0C8"}`,
                      background: marketing ? GOLD : "transparent",
                    }}
                  >
                    {marketing && <CheckIcon2 size={8} />}
                  </div>
                  <span
                    className="text-xs leading-relaxed"
                    style={{ color: "#6F6B63" }}
                  >
                    I'd like to receive exclusive offers, new tour
                    announcements, and travel inspiration from KOBANI. (Optional
                    — unsubscribe anytime.)
                  </span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={formStatus === "loading"}
                className="w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all mt-2"
                style={{
                  background: formStatus === "loading" ? "#E6DFD2" : GOLD,
                  color: "#0B0B0B",
                  cursor: formStatus === "loading" ? "not-allowed" : "pointer",
                }}
              >
                {formStatus === "loading" ? (
                  <>
                    <svg
                      className="animate-spin"
                      width={16}
                      height={16}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>{" "}
                    Creating your account…
                  </>
                ) : (
                  "Create My KOBANI Account →"
                )}
              </button>

              <p className="text-center text-xs" style={{ color: "#9A9590" }}>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => onNavigate("login")}
                  className="font-bold transition-colors"
                  style={{
                    color: GOLD,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "#D9B96E")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = GOLD)
                  }
                >
                  Sign In
                </button>
              </p>
            </form>

            {/* Footer links */}
            <div
              className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-8 pt-6 text-xs"
              style={{ color: "#9A9590", borderTop: "1px solid #E6DFD2" }}
            >
              <span>© 2025 KOBANI Tours Ltd.</span>
              <a
                href="/privacy-policy"
                style={{ color: "#9A9590" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = GOLD)
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "#9A9590")
                }
              >
                Privacy
              </a>
              <a
                href="/terms-and-conditions"
                style={{ color: "#9A9590" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = GOLD)
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "#9A9590")
                }
              >
                Terms
              </a>
              <a
                href="/cookie-policy"
                style={{ color: "#9A9590" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = GOLD)
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "#9A9590")
                }
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
