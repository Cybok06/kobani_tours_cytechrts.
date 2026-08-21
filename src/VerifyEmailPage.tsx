import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import BrandLogo from "./BrandLogo"
import { useAuth } from "./AuthContext"
import { ApiError, authApi } from "./api"

type Page = "home" | "login" | "register" | "dashboard" | "verify-email"
const GOLD = "#C6A15B"

export default function VerifyEmailPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { t } = useTranslation()
  const { verifyEmail } = useAuth()
  const [email, setEmail] = useState(() => sessionStorage.getItem("kobani:verificationEmail") || "")
  const [maskedEmail] = useState(() => sessionStorage.getItem("kobani:verificationMaskedEmail") || email)
  const [digits, setDigits] = useState(["", "", "", "", "", ""])
  const [countdown, setCountdown] = useState(60)
  const [status, setStatus] = useState<"idle" | "loading" | "resending" | "success">("idle")
  const [error, setError] = useState("")
  const inputs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    if (countdown <= 0) return
    const timer = window.setInterval(() => setCountdown((value) => Math.max(0, value - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [countdown])

  const setDigit = (index: number, value: string) => {
    const numeric = value.replace(/\D/g, "").slice(-1)
    setDigits((current) => current.map((item, position) => position === index ? numeric : item))
    if (numeric && index < 5) inputs.current[index + 1]?.focus()
  }

  const paste = (event: React.ClipboardEvent) => {
    const code = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (code.length === 6) { event.preventDefault(); setDigits(code.split("")); inputs.current[5]?.focus() }
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!email) { setError(t("auth.verify.enterEmail")); return }
    const code = digits.join("")
    if (code.length !== 6) { setError(t("auth.verify.enterCode")); return }
    setStatus("loading"); setError("")
    try {
      await verifyEmail(email, code)
      setStatus("success")
      sessionStorage.removeItem("kobani:verificationEmail")
      sessionStorage.removeItem("kobani:verificationMaskedEmail")
      window.setTimeout(() => { window.history.replaceState({}, "", "/customer/dashboard"); onNavigate("dashboard") }, 700)
    } catch (reason) {
      setStatus("idle")
      const codeName = reason instanceof ApiError ? reason.code : "SERVER_ERROR"
      setError(t(`auth.errors.${codeName}`, { defaultValue: t("auth.errors.SERVER_ERROR") }))
    }
  }

  const resend = async () => {
    if (!email || countdown > 0 || status === "resending") return
    setStatus("resending"); setError("")
    try { const response = await authApi.resendVerification(email); setCountdown(response.resendAvailableInSeconds); setDigits(["", "", "", "", "", ""]); setStatus("idle") }
    catch (reason) { setStatus("idle"); const codeName = reason instanceof ApiError ? reason.code : "SERVER_ERROR"; setError(t(`auth.errors.${codeName}`, { defaultValue: t("auth.errors.SERVER_ERROR") })) }
  }

  return <div className="min-h-screen bg-[#F8F4EA] grid lg:grid-cols-[42%_58%]">
    <section className="hidden lg:flex relative overflow-hidden bg-[#0B0B0B] text-white p-12 flex-col justify-between">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(198,161,91,.25),transparent_55%)]" />
      <div className="relative flex items-center gap-3"><BrandLogo className="w-10 h-10"/><div><b className="font-serif text-xl">KOBANI</b><p className="text-[9px] tracking-[.2em] text-[#C6A15B]">WHERE HERITAGE MEETS LUXURY</p></div></div>
      <div className="relative"><p className="text-[#C6A15B] text-xs tracking-widest uppercase">Secure registration</p><h2 className="font-serif text-4xl font-bold mt-3">{t("auth.verify.title")}</h2><p className="text-sm text-white/60 mt-4 max-w-md">{t("auth.verify.spam")}</p></div>
      <p className="relative text-xs text-white/50">info@kobanitours.com</p>
    </section>
    <main className="flex items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-lg rounded-3xl bg-white border border-[#E6DFD2] p-6 sm:p-10 shadow-sm">
        <div className="lg:hidden flex items-center gap-2 mb-8"><BrandLogo className="w-8 h-8"/><b className="font-serif">KOBANI</b></div>
        <p className="text-xs font-bold tracking-widest uppercase text-[#C6A15B]">Email verification</p>
        <h1 className="font-serif font-bold text-3xl mt-2">{t("auth.verify.title")}</h1>
        {email ? <p className="text-sm text-[#6F6B63] mt-3">{t("auth.verify.sentTo", { email: maskedEmail })}</p> : <div className="mt-5"><label className="text-xs font-bold">Email Address</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full h-12 rounded-xl border border-[#E6DFD2] px-4 outline-none focus:border-[#C6A15B]"/></div>}
        <form onSubmit={submit} className="mt-8">
          <label className="text-xs font-bold">{t("auth.verify.code")}</label>
          <div className="grid grid-cols-6 gap-2 mt-2" onPaste={paste}>{digits.map((digit, index) => <input key={index} ref={(element) => { inputs.current[index] = element }} value={digit} onChange={(event) => setDigit(index, event.target.value)} onKeyDown={(event) => { if (event.key === "Backspace" && !digit && index > 0) inputs.current[index - 1]?.focus() }} inputMode="numeric" autoComplete={index === 0 ? "one-time-code" : "off"} aria-label={`Verification code digit ${index + 1}`} className="w-full aspect-square rounded-xl border border-[#E6DFD2] text-center text-xl font-bold outline-none focus:border-[#C6A15B]" />)}</div>
          <p className="text-xs text-[#9A9590] mt-3">{t("auth.verify.expires")}</p>
          {error && <div role="alert" className="mt-4 rounded-xl border border-[#C84A4A]/30 bg-[#C84A4A]/[.08] p-3 text-sm text-[#C84A4A]">{error}</div>}
          {status === "success" && <div className="mt-4 rounded-xl bg-[#27855C]/10 p-3 text-sm text-[#27855C]">{t("auth.verify.success")}</div>}
          <button disabled={status === "loading" || status === "success"} className="mt-6 w-full h-13 rounded-xl font-bold disabled:opacity-60" style={{ background: GOLD }}>{status === "loading" ? t("auth.verify.verifying") : t("auth.verify.verify")}</button>
        </form>
        <button type="button" onClick={resend} disabled={countdown > 0 || status === "resending"} className="mt-4 w-full text-sm font-bold disabled:text-[#9A9590]" style={{ color: countdown ? undefined : GOLD }}>{countdown > 0 ? t("auth.verify.resendIn", { seconds: countdown }) : status === "resending" ? t("auth.verify.sending") : t("auth.verify.resend")}</button>
        <div className="mt-7 flex justify-between text-xs"><button onClick={() => onNavigate("register")} className="font-bold text-[#6F6B63]">← {t("auth.verify.back")}</button><a href="mailto:info@kobanitours.com" className="font-bold text-[#9A7636]">{t("auth.verify.support")}</a></div>
      </div>
    </main>
  </div>
}
