import { useState, useEffect, useRef } from "react"
import BrandLogo from "./BrandLogo"
import { useAuth } from "./AuthContext"
import { ApiError } from "./api"
import { useTranslation } from "react-i18next"

type Page = "home" | "tours" | "tour-details" | "about" | "gallery" | "articles" | "article-read" | "contribute" | "market" | "market-product" | "contact" | "faq" | "login" | "register" | "dashboard" | "admin-dashboard"
type AuthView = "login" | "forgot" | "sent" | "reset"
type FormState = "idle" | "loading" | "error" | "success"

const GOLD = "#C6A15B"

// ─── Inline icons ──────────────────────────────────────────────────────────────
const EyeIcon = ({ open, size = 18 }: { open: boolean; size?: number }) =>
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
const CheckCircleIcon = ({ size = 20 }: { size?: number }) => (
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
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)
const MailSentIcon = ({ size = 56 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={GOLD}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
    <path d="M9 12l2 2 4-4" strokeWidth="2" />
  </svg>
)
const ArrowLeftIcon = ({ size = 16 }: { size?: number }) => (
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
const LockIcon = ({ size = 16 }: { size?: number }) => (
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
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
)
const MailIcon2 = ({ size = 16 }: { size?: number }) => (
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
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)
// ─── Left panel ────────────────────────────────────────────────────────────────
const LeftPanel = () => (
  <div
    className="relative hidden lg:flex flex-col justify-between overflow-hidden"
    style={{ width: "45%", minHeight: "100vh", flexShrink: 0 }}
  >
    {/* Background image */}
    <div className="absolute inset-0">
      <img
        src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=900&h=1200&fit=crop&auto=format"
        alt="Luxury African savanna at golden hour"
        className="w-full h-full object-cover"
        style={{ filter: "brightness(0.5)" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(11,11,11,0.6) 0%, rgba(11,11,11,0.3) 40%, rgba(198,161,91,0.15) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(11,11,11,0.9) 0%, transparent 50%)",
        }}
      />
    </div>

    {/* Ornamental top line */}
    <div
      className="absolute top-0 left-0 right-0 h-px"
      style={{
        background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
      }}
    />

    {/* Content */}
    <div className="relative z-10 flex flex-col justify-between h-full p-10 py-12">
      {/* Logo */}
      <div>
        <div className="flex items-center gap-2.5 mb-2">
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

      {/* Middle quote */}
      <div className="py-12">
        <div className="w-10 h-px mb-6" style={{ background: GOLD }} />
        <blockquote
          className="font-serif text-2xl font-light text-white leading-snug mb-6"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          "Africa changes you forever, like nowhere on Earth. Once you have been
          there, you will never be the same again."
        </blockquote>
        <p
          className="text-xs tracking-widest uppercase"
          style={{ color: GOLD }}
        >
          — Brian Jackman
        </p>
      </div>

      {/* Bottom stats */}
      <div className="flex gap-8">
        {[
          { value: "Heritage", label: "Purposeful journeys" },
          { value: "Ghana", label: "Destination knowledge" },
          { value: "Care", label: "Guest support" },
        ].map((s) => (
          <div key={s.label}>
            <div
              className="font-serif font-bold text-lg text-white"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {s.value}
            </div>
            <div className="text-xs" style={{ color: "#9A9590" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

// ─── Field wrapper ─────────────────────────────────────────────────────────────
const Field = ({
  label,
  children,
  hint,
}: {
  label: string
  children: React.ReactNode
  hint?: string
}) => (
  <div className="space-y-1.5">
    <label
      className="block text-xs font-semibold tracking-wide uppercase"
      style={{ color: "#6F6B63" }}
    >
      {label}
    </label>
    {children}
    {hint && (
      <p className="text-xs" style={{ color: "#9A9590" }}>
        {hint}
      </p>
    )}
  </div>
)

const inputBase: React.CSSProperties = {
  width: "100%",
  borderRadius: 12,
  border: "1.5px solid #E6DFD2",
  background: "#FAFAF8",
  color: "#0B0B0B",
  fontSize: 14,
  outline: "none",
  transition: "border-color 0.15s",
}

// ─── Login view ────────────────────────────────────────────────────────────────
const LoginView = ({
  onForgot,
  onNavigate,
}: {
  onForgot: () => void
  onNavigate: (p: Page) => void
}) => {
  const { login } = useAuth()
  const { t } = useTranslation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"customer" | "admin">("customer")
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(false)
  const [status, setStatus] = useState<FormState>("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setStatus("error")
      setErrorMsg("Please fill in all fields.")
      return
    }
    setStatus("loading")
    setErrorMsg("")
    try {
      const authenticatedUser = await login(email, password)
      if (authenticatedUser.role === "admin") {
        setRole("admin")
        window.history.replaceState({}, "", "/admin/dashboard")
        onNavigate("admin-dashboard")
        return
      }
      const requested = sessionStorage.getItem("kobani:returnPage")
      sessionStorage.removeItem("kobani:returnPage")
      const safePages = new Set(["tours", "booking-request", "dashboard", "customer-bookings", "customer-booking-detail", "customer-payments", "customer-product-orders", "customer-saved-tours", "customer-profile", "customer-settings"])
      window.history.replaceState({}, "", "/customer/dashboard")
      onNavigate((requested && safePages.has(requested) ? requested : "dashboard") as Page)
    } catch (error) {
      setStatus("error")
      setPassword("")
      const code = error instanceof ApiError ? error.code : "SERVER_ERROR"
      setErrorMsg(t(`auth.errors.${code}`, { defaultValue: t("auth.errors.SERVER_ERROR") }))
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 px-6">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
          style={{
            background: "rgba(39,133,92,0.12)",
            border: "1.5px solid rgba(39,133,92,0.3)",
          }}
        >
          <CheckCircleIcon size={28} />
        </div>
        <h2
          className="font-serif font-bold text-2xl mb-2"
          style={{ fontFamily: "var(--font-serif)", color: "#0B0B0B" }}
        >
          Welcome back!
        </h2>
        <p className="text-sm mb-8" style={{ color: "#6F6B63" }}>
          You are now signed in to the KOBANI{" "}
          {role === "admin" ? "admin portal" : "customer account"}.
        </p>
        <button
          onClick={() =>
            onNavigate(role === "admin" ? "admin-dashboard" : "dashboard")
          }
          className="btn-gold px-8 py-3 rounded-xl text-sm font-bold"
          style={{ color: "#0B0B0B" }}
        >
          Go to Dashboard →
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} autoComplete="off" className="space-y-5">
      <div>
        <h1
          className="font-serif font-bold text-3xl mb-1"
          style={{ fontFamily: "var(--font-serif)", color: "#0B0B0B" }}
        >
          Welcome Back
        </h1>
        <p className="text-sm" style={{ color: "#6F6B63" }}>
          Sign in to continue your journey with KOBANI.
        </p>
      </div>

      {/* Error */}
      {status === "error" && errorMsg && (
        <div
          className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm"
          style={{
            background: "rgba(200,74,74,0.08)",
            border: "1.5px solid rgba(200,74,74,0.25)",
            color: "#C84A4A",
          }}
        >
          <span className="flex-shrink-0 mt-0.5">⚠</span> {errorMsg}
        </div>
      )}

      <Field label="Email address">
        <div className="relative">
          <div
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: focusedField === "email" ? GOLD : "#9A9590" }}
          >
            <MailIcon2 size={15} />
          </div>
          <input
            type="email"
            name="kobani-login-email"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
            style={{
              ...inputBase,
              paddingLeft: 38,
              paddingRight: 14,
              paddingTop: 11,
              paddingBottom: 11,
              borderColor:
                focusedField === "email"
                  ? GOLD
                  : status === "error" && !email
                    ? "#C84A4A"
                    : "#E6DFD2",
            }}
          />
        </div>
      </Field>

      <Field label="Password">
        <div className="relative">
          <div
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: focusedField === "pw" ? GOLD : "#9A9590" }}
          >
            <LockIcon size={15} />
          </div>
          <input
            type={showPw ? "text" : "password"}
            name="kobani-login-password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            onFocus={() => setFocusedField("pw")}
            onBlur={() => setFocusedField(null)}
            style={{
              ...inputBase,
              paddingLeft: 38,
              paddingRight: 44,
              paddingTop: 11,
              paddingBottom: 11,
              borderColor:
                focusedField === "pw"
                  ? GOLD
                  : status === "error" && !password
                    ? "#C84A4A"
                    : "#E6DFD2",
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
      </Field>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <div
            onClick={() => setRemember((v) => !v)}
            className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 cursor-pointer transition-all"
            style={{
              border: `1.5px solid ${remember ? GOLD : "#D6D0C8"}`,
              background: remember ? GOLD : "transparent",
            }}
          >
            {remember && (
              <svg width={9} height={9} viewBox="0 0 10 8">
                <polyline
                  points="1,4 4,7 9,1"
                  fill="none"
                  stroke="#0B0B0B"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <span className="text-xs" style={{ color: "#6F6B63" }}>
            Remember me for 30 days
          </span>
        </label>
        <button
          type="button"
          onClick={onForgot}
          className="text-xs font-semibold transition-colors"
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
          Forgot Password?
        </button>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
        style={{
          background: status === "loading" ? "#E6DFD2" : GOLD,
          color: "#0B0B0B",
          opacity: status === "loading" ? 0.8 : 1,
          cursor: status === "loading" ? "not-allowed" : "pointer",
        }}
      >
        {status === "loading" ? (
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
            </svg>
            Signing in…
          </>
        ) : (
          "Sign In to KOBANI"
        )}
      </button>

      <p className="text-center text-xs" style={{ color: "#9A9590" }}>
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => onNavigate("register")}
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
          Create Account
        </button>
      </p>
    </form>
  )
}

// ─── Forgot password view ──────────────────────────────────────────────────────
const ForgotView = ({
  onBack,
  onSent,
}: {
  onBack: () => void
  onSent: (email: string) => void
}) => {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<FormState>("idle")
  const [focusedField, setFocusedField] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus("loading")
    await new Promise((r) => setTimeout(r, 1400))
    setStatus("success")
    onSent(email)
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-semibold transition-colors mb-2"
        style={{
          color: "#6F6B63",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.color = GOLD)
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.color = "#6F6B63")
        }
      >
        <ArrowLeftIcon size={13} /> Back to Sign In
      </button>

      <div>
        <h1
          className="font-serif font-bold text-3xl mb-2"
          style={{ fontFamily: "var(--font-serif)", color: "#0B0B0B" }}
        >
          Forgot Password?
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: "#6F6B63" }}>
          No problem. Enter your account email and we'll send a secure reset
          link within a few moments.
        </p>
      </div>

      <Field label="Account email">
        <div className="relative">
          <div
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: focusedField ? GOLD : "#9A9590" }}
          >
            <MailIcon2 size={15} />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            onFocus={() => setFocusedField(true)}
            onBlur={() => setFocusedField(false)}
            style={{
              ...inputBase,
              paddingLeft: 38,
              paddingRight: 14,
              paddingTop: 11,
              paddingBottom: 11,
              borderColor: focusedField ? GOLD : "#E6DFD2",
            }}
          />
        </div>
      </Field>

      <button
        type="submit"
        disabled={!email || status === "loading"}
        className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
        style={{
          background: !email || status === "loading" ? "#E6DFD2" : GOLD,
          color: "#0B0B0B",
          cursor: !email || status === "loading" ? "not-allowed" : "pointer",
        }}
      >
        {status === "loading" ? (
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
            Sending link…
          </>
        ) : (
          "Send Reset Link"
        )}
      </button>
    </form>
  )
}

// ─── Email sent view ───────────────────────────────────────────────────────────
const SentView = ({ email, onBack }: { email: string; onBack: () => void }) => {
  const [resent, setResent] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const resend = () => {
    setResent(true)
    setCountdown(30)
  }

  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  return (
    <div className="space-y-6 text-center">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
        style={{
          color: "#6F6B63",
          background: "none",
          border: "none",
          cursor: "pointer",
          marginLeft: 0,
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.color = GOLD)
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.color = "#6F6B63")
        }
      >
        <ArrowLeftIcon size={13} /> Back to Sign In
      </button>

      <div className="flex justify-center">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{
            background: "rgba(198,161,91,0.1)",
            border: "1.5px solid rgba(198,161,91,0.3)",
          }}
        >
          <MailSentIcon size={44} />
        </div>
      </div>

      <div>
        <h1
          className="font-serif font-bold text-3xl mb-2"
          style={{ fontFamily: "var(--font-serif)", color: "#0B0B0B" }}
        >
          Check Your Inbox
        </h1>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "#6F6B63", maxWidth: 340, margin: "0 auto" }}
        >
          We've sent a password reset link to{" "}
          <span className="font-semibold" style={{ color: "#0B0B0B" }}>
            {email}
          </span>
          . The link expires in 60 minutes.
        </p>
      </div>

      <div
        className="px-5 py-4 rounded-xl text-left space-y-2"
        style={{ background: "#F8F4EA", border: "1px solid #E6DFD2" }}
      >
        <p className="text-xs font-semibold" style={{ color: "#6F6B63" }}>
          What to do next:
        </p>
        {[
          "Open the email from info@kobanitours.com",
          'Click the "Reset Password" button',
          "Check your spam folder if it's not there",
        ].map((tip, i) => (
          <div
            key={i}
            className="flex items-start gap-2 text-xs"
            style={{ color: "#6F6B63" }}
          >
            <span className="font-bold flex-shrink-0" style={{ color: GOLD }}>
              {i + 1}.
            </span>{" "}
            {tip}
          </div>
        ))}
      </div>

      {resent ? (
        <p className="text-xs" style={{ color: "#27855C" }}>
          ✓ Email resent.{" "}
          {countdown > 0 && `You can resend again in ${countdown}s.`}
        </p>
      ) : (
        <p className="text-xs" style={{ color: "#9A9590" }}>
          Didn't receive it?{" "}
          <button
            onClick={resend}
            disabled={countdown > 0}
            className="font-bold transition-colors"
            style={{
              color: countdown > 0 ? "#9A9590" : GOLD,
              background: "none",
              border: "none",
              cursor: countdown > 0 ? "not-allowed" : "pointer",
            }}
          >
            Resend email {countdown > 0 && `(${countdown}s)`}
          </button>
        </p>
      )}
    </div>
  )
}

// ─── Reset password view ───────────────────────────────────────────────────────
const strengthLevels = [
  { label: "Weak", color: "#C84A4A" },
  { label: "Fair", color: "#E9893A" },
  { label: "Good", color: "#D9B96E" },
  { label: "Strong", color: "#27855C" },
]

const calcStrength = (p: string) => {
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  return score
}

const Requirement = ({ met, text }: { met: boolean; text: string }) => (
  <div
    className="flex items-center gap-2 text-xs"
    style={{ color: met ? "#27855C" : "#9A9590" }}
  >
    <div
      className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
      style={{
        background: met ? "rgba(39,133,92,0.15)" : "#F0EBE0",
        border: `1px solid ${met ? "rgba(39,133,92,0.4)" : "#E6DFD2"}`,
      }}
    >
      {met ? (
        <svg width={8} height={8} viewBox="0 0 10 8">
          <polyline
            points="1,4 4,7 9,1"
            fill="none"
            stroke="#27855C"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: "#D6D0C8" }}
        />
      )}
    </div>
    {text}
  </div>
)

const ResetView = ({
  onBack,
  onNavigate,
}: {
  onBack: () => void
  onNavigate: (p: Page) => void
}) => {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [showCf, setShowCf] = useState(false)
  const [status, setStatus] = useState<FormState>("idle")
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const strength = calcStrength(password)
  const reqs = [
    { met: password.length >= 8, text: "At least 8 characters" },
    { met: /[A-Z]/.test(password), text: "One uppercase letter" },
    { met: /[0-9]/.test(password), text: "One number" },
    { met: /[^A-Za-z0-9]/.test(password), text: "One special character" },
  ]
  const confirmMatch = confirm.length > 0 && password === confirm

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (strength < 2 || password !== confirm) return
    setStatus("loading")
    await new Promise((r) => setTimeout(r, 1600))
    setStatus("success")
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center text-center py-8 space-y-5">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(39,133,92,0.12)",
            border: "1.5px solid rgba(39,133,92,0.3)",
          }}
        >
          <CheckCircleIcon size={28} />
        </div>
        <div>
          <h2
            className="font-serif font-bold text-2xl mb-2"
            style={{ fontFamily: "var(--font-serif)", color: "#0B0B0B" }}
          >
            Password Updated!
          </h2>
          <p className="text-sm" style={{ color: "#6F6B63" }}>
            Your new password is set. Sign in to continue your journey.
          </p>
        </div>
        <button
          onClick={onBack}
          className="btn-gold px-8 py-3 rounded-xl text-sm font-bold"
          style={{ color: "#0B0B0B" }}
        >
          Sign In Now →
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
        style={{
          color: "#6F6B63",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.color = GOLD)
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.color = "#6F6B63")
        }
      >
        <ArrowLeftIcon size={13} /> Back to Sign In
      </button>

      <div>
        <h1
          className="font-serif font-bold text-3xl mb-2"
          style={{ fontFamily: "var(--font-serif)", color: "#0B0B0B" }}
        >
          Reset Password
        </h1>
        <p className="text-sm" style={{ color: "#6F6B63" }}>
          Choose a strong new password for your account.
        </p>
      </div>

      <Field label="New password">
        <div className="relative">
          <div
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: focusedField === "pw" ? GOLD : "#9A9590" }}
          >
            <LockIcon size={15} />
          </div>
          <input
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password"
            onFocus={() => setFocusedField("pw")}
            onBlur={() => setFocusedField(null)}
            style={{
              ...inputBase,
              paddingLeft: 38,
              paddingRight: 44,
              paddingTop: 11,
              paddingBottom: 11,
              borderColor: focusedField === "pw" ? GOLD : "#E6DFD2",
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

        {/* Strength meter */}
        {password.length > 0 && (
          <div className="mt-2.5 space-y-2">
            <div className="flex gap-1.5">
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
              <p
                className="text-xs font-semibold"
                style={{ color: strengthLevels[strength - 1]?.color }}
              >
                {strengthLevels[strength - 1]?.label} password
              </p>
            )}
          </div>
        )}
      </Field>

      {/* Requirements */}
      {password.length > 0 && (
        <div
          className="grid grid-cols-2 gap-1.5 p-3.5 rounded-xl"
          style={{ background: "#F8F4EA", border: "1px solid #E6DFD2" }}
        >
          {reqs.map((r) => (
            <Requirement key={r.text} met={r.met} text={r.text} />
          ))}
        </div>
      )}

      <Field label="Confirm new password">
        <div className="relative">
          <div
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: focusedField === "cf" ? GOLD : "#9A9590" }}
          >
            <LockIcon size={15} />
          </div>
          <input
            type={showCf ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat your new password"
            onFocus={() => setFocusedField("cf")}
            onBlur={() => setFocusedField(null)}
            style={{
              ...inputBase,
              paddingLeft: 38,
              paddingRight: 44,
              paddingTop: 11,
              paddingBottom: 11,
              borderColor:
                confirm.length > 0
                  ? confirmMatch
                    ? "#27855C"
                    : "#C84A4A"
                  : focusedField === "cf"
                    ? GOLD
                    : "#E6DFD2",
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
            className="text-xs mt-1"
            style={{ color: confirmMatch ? "#27855C" : "#C84A4A" }}
          >
            {confirmMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
          </p>
        )}
      </Field>

      <button
        type="submit"
        disabled={strength < 2 || !confirmMatch || status === "loading"}
        className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
        style={{
          background:
            strength < 2 || !confirmMatch || status === "loading"
              ? "#E6DFD2"
              : GOLD,
          color: "#0B0B0B",
          cursor:
            strength < 2 || !confirmMatch || status === "loading"
              ? "not-allowed"
              : "pointer",
        }}
      >
        {status === "loading" ? (
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
            Updating password…
          </>
        ) : (
          "Update Password"
        )}
      </button>
    </form>
  )
}

// ─── Main export ───────────────────────────────────────────────────────────────
export default function LoginPage({
  onNavigate,
}: {
  onNavigate: (p: Page) => void
}) {
  const [view, setView] = useState<AuthView>("login")
  const [sentEmail, setSentEmail] = useState("")

  const handleSent = (email: string) => {
    setSentEmail(email)
    setView("sent")
  }

  return (
    <div
      className="flex min-h-screen"
      style={{ background: "#F8F4EA", fontFamily: "var(--font-sans)" }}
    >
      <LeftPanel />

      {/* Right panel */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-5 lg:px-10">
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
          <div
            className="flex items-center gap-2 text-xs"
            style={{ color: "#9A9590" }}
          >
            <span>Need help?</span>
            <a
              href="mailto:info@kobanitours.com"
              className="font-semibold transition-colors"
              style={{ color: GOLD }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "#D9B96E")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = GOLD)
              }
            >
              info@kobanitours.com
            </a>
          </div>
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center px-8 py-10 lg:px-14">
          <div className="w-full" style={{ maxWidth: 420 }}>
            {view === "login" && (
              <LoginView
                onForgot={() => setView("forgot")}
                onNavigate={onNavigate}
              />
            )}
            {view === "forgot" && (
              <ForgotView onBack={() => setView("login")} onSent={handleSent} />
            )}
            {view === "sent" && (
              <SentView email={sentEmail} onBack={() => setView("login")} />
            )}
            {view === "reset" && (
              <ResetView
                onBack={() => setView("login")}
                onNavigate={onNavigate}
              />
            )}

          </div>
        </div>

        {/* Footer */}
        <div
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-8 pb-6 text-xs"
          style={{ color: "#9A9590" }}
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
            Privacy Policy
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
            Terms of Service
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
            Cookie Policy
          </a>
        </div>
      </div>
    </div>
  )
}
