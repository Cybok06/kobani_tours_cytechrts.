import { useState, useEffect } from "react"
import {
  PhoneIcon,
  MailIcon,
  InstagramIcon,
  TikTokIcon,
  TelegramIcon,
  GlobeIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MenuIcon,
  XIcon,
  MapPinIcon,
  ArrowRightIcon,
  ShieldIcon,
  StarIcon,
} from "./icons"
import { COMPANY } from "./companyProfile"
import BrandLogo from "./BrandLogo"
import { useTranslation } from "react-i18next"
import LanguageSwitcher from "./components/LanguageSwitcher"
import { ApiError, subscriberApi } from "./api"
import { useAuth } from "./AuthContext"

type Page = "home" | "tours" | "tour-details" | "hotels" | "about" | "gallery" | "articles" | "article-read" | "contribute" | "market" | "market-product" | "contact" | "faq" | "login" | "register" | "verify-email" | "privacy-policy" | "terms-and-conditions" | "refund-policy" | "cancellation-policy" | "cookie-policy" | "booking" | "booking-travellers" | "customer-bookings"

// ─── Stars ─────────────────────────────────────────────────────────────────────
export const Stars = ({
  rating,
  size = 14,
}: {
  rating: number
  size?: number
}) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <StarIcon key={i} filled={i <= rating} size={size} />
    ))}
  </div>
)

// ─── Section Label ─────────────────────────────────────────────────────────────
export const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div
    className="inline-block text-xs font-bold tracking-[0.2em] uppercase mb-3 px-3 py-1.5 rounded-full"
    style={{
      color: "#C6A15B",
      background: "rgba(198,161,91,0.1)",
      border: "1px solid rgba(198,161,91,0.2)",
    }}
  >
    {children}
  </div>
)

// ─── Top Bar ───────────────────────────────────────────────────────────────────
export const TopBar = ({ onNavigate }: { onNavigate: (p: Page) => void }) => {
  const { t } = useTranslation()
  const { isAuthenticated, isInitializing, user } = useAuth()
  return (
  <div data-public-topbar style={{ background: "#0B0B0B" }} className="py-2 px-4">
    <div
      className="mx-auto flex items-center justify-between"
      style={{ maxWidth: 1240 }}
    >
      <div
        className="flex items-center gap-5 text-xs"
        style={{ color: "#9A9590" }}
      >
        <a
          href={`tel:${COMPANY.phones[0]}`}
          className="flex items-center gap-1.5 hover:text-[#C6A15B] transition-colors"
        >
          <PhoneIcon /> +233 24 471 9176
        </a>
        <a
          href={`mailto:${COMPANY.email}`}
          className="items-center gap-1.5 hover:text-[#C6A15B] transition-colors hidden sm:flex"
        >
          <MailIcon /> {COMPANY.email}
        </a>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3" style={{ color: "#9A9590" }}>
          <a
            href={COMPANY.instagram}
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#C6A15B] transition-colors"
          >
            <InstagramIcon />
          </a>
          <a
            href={COMPANY.tiktok}
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#C6A15B] transition-colors"
          >
            <TikTokIcon />
          </a>
          <a
            href={COMPANY.telegram}
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#C6A15B] transition-colors"
          >
            <TelegramIcon />
          </a>
        </div>
        <div className="w-px h-4" style={{ background: "#2A2A2A" }} />
        <LanguageSwitcher />
        {isInitializing ? <div className="hidden h-5 w-32 sm:block" aria-hidden="true" /> : isAuthenticated ? <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="text-[#9A9590]">{user?.fullName}</span><span style={{ color: "#2A2A2A" }}>|</span>
          <button onClick={() => onNavigate("customer-bookings")} className="font-medium text-[#C6A15B]">My Bookings</button>
        </div> : <div className="hidden sm:flex items-center gap-2 text-xs">
          <button
            onClick={() => onNavigate("login")}
            className="hover:text-[#C6A15B] transition-colors"
            style={{
              color: "#9A9590",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            {t("common.login")}
          </button>
          <span style={{ color: "#2A2A2A" }}>|</span>
          <button
            onClick={() => onNavigate("register")}
            className="text-[#C6A15B] hover:text-[#D9B96E] transition-colors font-medium"
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            {t("common.register")}
          </button>
        </div>}
      </div>
    </div>
  </div>
  )
}

// ─── Navbar ────────────────────────────────────────────────────────────────────
export const Navbar = ({
  mobileOpen,
  setMobileOpen,
  currentPage,
  onNavigate,
}: {
  mobileOpen: boolean
  setMobileOpen: (v: boolean) => void
  currentPage: Page
  onNavigate: (p: Page) => void
}) => {
  const { t } = useTranslation()
  const { isAuthenticated, isInitializing } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handler = () => {
      const topBar = document.querySelector<HTMLElement>("[data-public-topbar]")
      setScrolled(window.scrollY >= (topBar?.offsetHeight ?? 36))
    }
    handler()
    window.addEventListener("scroll", handler, { passive: true })
    window.addEventListener("resize", handler)
    return () => {
      window.removeEventListener("scroll", handler)
      window.removeEventListener("resize", handler)
    }
  }, [])

  const links: { label: string; page?: Page }[] = [
    { label: t("navigation.home"), page: "home" }, { label: t("navigation.tours"), page: "tours" }, { label: t("hotels.nav"), page: "hotels" },
    { label: t("navigation.africanMarket"), page: "market" as Page }, { label: t("navigation.articles"), page: "articles" as Page },
    { label: t("navigation.gallery"), page: "gallery" }, { label: t("navigation.about"), page: "about" }, { label: t("navigation.contact"), page: "contact" as Page }, { label: "FAQ", page: "faq" },
  ]

  return (
    <nav
      className={`sticky top-0 z-50 transition-shadow duration-300 ${
        scrolled ? "shadow-lg" : ""
      }`}
      style={{ background: "#FFFFFF", borderBottom: "1px solid #E6DFD2" }}
    >
      <div
        className="mx-auto px-4 flex items-center justify-between h-16"
        style={{ maxWidth: 1240 }}
      >
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 sm:gap-3 flex-shrink-0"
        >
          <BrandLogo />
          <div className="block text-left">
            <div
              className="font-serif text-sm sm:text-base font-bold leading-tight"
              style={{ color: "#0B0B0B", fontFamily: "var(--font-serif)" }}
            >
              KOBANI
            </div>
            <div className="hidden sm:block text-xs leading-none" style={{ color: "#6F6B63" }}>
              {t("brand.descriptor")}
            </div>
          </div>
        </button>
        <div className="hidden lg:flex items-center gap-6">
          {links.map((link) => (
            <button
              key={link.label}
              onClick={() => link.page && onNavigate(link.page)}
              className="nav-link text-sm font-medium transition-colors"
              style={{
                color: currentPage === link.page ? "#C6A15B" : "#202020",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              {link.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div
            aria-hidden={!scrolled}
            className={`hidden lg:flex items-center overflow-hidden whitespace-nowrap transition-all duration-500 ease-out ${
              scrolled
                ? "max-w-48 translate-x-0 gap-2 opacity-100"
                : "pointer-events-none max-w-0 translate-x-5 gap-0 opacity-0"
            }`}
          >
            {isInitializing ? null : isAuthenticated ? <button
              type="button"
              tabIndex={scrolled ? 0 : -1}
              onClick={() => onNavigate("customer-bookings")}
              className="rounded-full border border-[#C6A15B] px-3.5 py-2 text-sm font-semibold text-[#9A7636] hover:bg-[#FFF8EC]"
            >
              My Bookings
            </button> : <><button
              type="button"
              tabIndex={scrolled ? 0 : -1}
              onClick={() => onNavigate("login")}
              className="rounded-full px-3 py-2 text-sm font-medium text-[#4A4741] hover:text-[#9A7636]"
            >
              {t("common.login")}
            </button>
            <button
              type="button"
              tabIndex={scrolled ? 0 : -1}
              onClick={() => onNavigate("register")}
              className="rounded-full border border-[#C6A15B] px-3.5 py-2 text-sm font-semibold text-[#9A7636] hover:bg-[#FFF8EC]"
            >
              {t("common.register")}
            </button>
            </>}
          </div>
          <button
            onClick={() => onNavigate("tours")}
            className="hidden sm:inline-flex items-center gap-2 btn-gold text-sm font-semibold rounded-full px-5 py-2.5 text-[#0B0B0B]"
          >
            {t("common.bookNow")}
          </button>
          <button
            className="lg:hidden p-2 rounded-lg"
            style={{ color: "#0B0B0B" }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </nav>
  )
}

// ─── Mobile Drawer ─────────────────────────────────────────────────────────────
export const MobileDrawer = ({
  open,
  onClose,
  onNavigate,
}: {
  open: boolean
  onClose: () => void
  onNavigate: (p: Page) => void
}) => {
  const { t } = useTranslation()
  const { isAuthenticated, isInitializing } = useAuth()
  const links: { label: string; page?: Page }[] = [
    { label: t("navigation.home"), page: "home" }, { label: t("navigation.tours"), page: "tours" }, { label: t("hotels.nav"), page: "hotels" }, { label: t("navigation.africanMarket"), page: "market" as Page },
    { label: t("navigation.articles"), page: "articles" as Page }, { label: t("navigation.gallery"), page: "gallery" }, { label: t("navigation.about"), page: "about" }, { label: t("navigation.contact"), page: "contact" as Page }, { label: "FAQ", page: "faq" },
  ]
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 lg:hidden flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "#FFFFFF" }}
      >
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "#E6DFD2" }}
        >
          <div className="flex items-center gap-3">
            <BrandLogo className="w-9 h-9" />
            <span
              className="font-serif font-bold text-sm"
              style={{ color: "#0B0B0B" }}
            >
              KOBANI
            </span>
          </div>
          <button onClick={onClose} style={{ color: "#6F6B63" }}>
            <XIcon />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          {links.map((link) => (
            <button
              key={link.label}
              onClick={() => {
                link.page && onNavigate(link.page)
                onClose()
              }}
              className="flex items-center justify-between w-full px-5 py-3.5 text-sm font-medium hover:bg-[#F8F4EA] transition-colors text-left"
              style={{ color: "#202020" }}
            >
              {link.label} <ChevronRightIcon />
            </button>
          ))}
        </div>
        <div className="p-5 border-t" style={{ borderColor: "#E6DFD2" }}>
          <button
            onClick={() => {
              onNavigate("tours")
              onClose()
            }}
            className="btn-gold w-full text-sm font-semibold rounded-full px-5 py-3 text-[#0B0B0B]"
          >
            {t("common.bookNow")}
          </button>
          {isInitializing ? null : isAuthenticated ? <button
            onClick={() => { onNavigate("customer-bookings"); onClose() }}
            className="mt-4 w-full rounded-full border border-[#C6A15B] px-5 py-3 text-sm font-semibold text-[#9A7636]"
          >
            My Bookings
          </button> : <div
            className="flex justify-center gap-4 mt-4 text-sm"
            style={{ color: "#6F6B63" }}
          >
            <button
              onClick={() => {
                onNavigate("login")
                onClose()
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#6F6B63",
              }}
            >
              {t("common.login")}
            </button>
            <span>·</span>
            <button
              onClick={() => {
                onNavigate("register")
                onClose()
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#C6A15B",
              }}
            >
              {t("common.register")}
            </button>
          </div>}
        </div>
      </div>
    </>
  )
}

// ─── Newsletter ────────────────────────────────────────────────────────────────
function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation()
  const [email, setEmail] = useState(""), [busy, setBusy] = useState(false), [message, setMessage] = useState(""), [failed, setFailed] = useState(false)
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setMessage(""); setFailed(false)
    try { const result = await subscriberApi.subscribe(email); setMessage(result.data.created ? "Welcome to KOBANI. You are now subscribed." : "You are already subscribed to KOBANI updates."); setEmail("") }
    catch (error) { setFailed(true); setMessage(error instanceof ApiError && error.code === "INVALID_EMAIL" ? "Enter a valid email address." : "Subscription could not be completed. Please try again.") }
    finally { setBusy(false) }
  }
  return <div><form onSubmit={submit} className={`flex ${compact ? "" : "flex-col sm:flex-row gap-3 max-w-md mx-auto"}`}>
    <input required type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder={compact ? t("newsletter.shortEmail") : t("newsletter.email")} aria-label={t("newsletter.email")} className={compact ? "flex-1 min-w-0 px-3 py-2 text-xs rounded-l-lg outline-none" : "flex-1 px-4 py-3 rounded-xl text-sm outline-none"} style={{ background: "#171717", border: "1.5px solid #2A2A2A", color: "#FFFFFF" }}/>
    <button disabled={busy} className={`btn-gold font-semibold disabled:opacity-60 ${compact ? "px-3 py-2 rounded-r-lg text-xs" : "px-6 py-3 rounded-xl text-sm whitespace-nowrap"}`} style={{ color: "#0B0B0B" }}>{busy ? "…" : compact ? t("newsletter.go") : t("common.subscribe")}</button>
  </form>{message && <p role="status" className={`${compact ? "mt-2 text-[10px]" : "mt-3 text-xs"}`} style={{ color: failed ? "#F29A9A" : "#C6A15B" }}>{message}</p>}</div>
}

export const Newsletter = () => {
  const { t } = useTranslation()
  return (
  <section className="py-20 px-4" style={{ background: "#F8F4EA" }}>
    <div className="mx-auto" style={{ maxWidth: 1240 }}>
      <div
        className="rounded-2xl px-8 py-12 md:px-16"
        style={{ background: "#0B0B0B", border: "1px solid #2A2A2A" }}
      >
        <div className="max-w-xl mx-auto text-center">
          <div className="text-3xl mb-4">✦</div>
          <h2
            className="font-serif text-2xl md:text-3xl font-bold mb-3"
            style={{ fontFamily: "var(--font-serif)", color: "#FFFFFF" }}
          >
            {t("newsletter.title")}
          </h2>
          <p className="text-sm mb-6" style={{ color: "#9A9590" }}>
            {t("newsletter.description")}
          </p>
          <NewsletterForm />
          <p className="mt-4 text-xs" style={{ color: "#6F6B63" }}>
            {t("newsletter.privacy")}
          </p>
        </div>
      </div>
    </div>
  </section>
  )
}

// ─── Footer ────────────────────────────────────────────────────────────────────
export const Footer = ({ onNavigate }: { onNavigate: (p: Page) => void }) => {
  const { t } = useTranslation()
  return (
  <footer style={{ background: "#0B0B0B", borderTop: "1px solid #1A1A1A" }}>
    <div className="mx-auto px-4 pt-16 pb-8" style={{ maxWidth: 1240 }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <BrandLogo />
            <div>
              <div
                className="font-serif font-bold text-base text-white"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                KOBANI
              </div>
              <div className="text-xs" style={{ color: "#6F6B63" }}>
                {t("brand.descriptor")}
              </div>
            </div>
          </div>
          <p
            className="text-sm leading-relaxed mb-5 max-w-xs"
            style={{ color: "#6F6B63" }}
          >
            {t("footer.description")}
          </p>
          <div className="flex gap-3">
            {[
              [<InstagramIcon />, COMPANY.instagram],
              [<TikTokIcon />, COMPANY.tiktok],
              [<TelegramIcon />, COMPANY.telegram],
            ].map(([icon, href], i) => (
              <a
                key={i}
                href={href as string}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: "#171717",
                  color: "#6F6B63",
                  border: "1px solid #2A2A2A",
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.color = "#C6A15B"
                  ;(e.currentTarget as HTMLElement).style.borderColor =
                    "#C6A15B"
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.color = "#6F6B63"
                  ;(e.currentTarget as HTMLElement).style.borderColor =
                    "#2A2A2A"
                }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
        <div>
          <div className="font-semibold text-sm mb-4 text-white">
            {t("footer.quickLinks")}
          </div>
          {[
            { label: t("footer.about"), page: "about" as Page }, { label: t("footer.ourTours"), page: "tours" as Page },
            { label: t("navigation.africanMarket"), page: "market" as Page }, { label: t("navigation.articles"), page: "articles" as Page },
            { label: t("navigation.gallery"), page: "gallery" as Page }, { label: t("common.contactUs"), page: "contact" as Page }, { label: "FAQ", page: "faq" as Page },
          ].map((link) => (
            <button
              key={link.label}
              onClick={() => link.page && onNavigate(link.page)}
              className="block text-sm py-1.5 w-full text-left transition-colors"
              style={{
                color: "#6F6B63",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color = "#C6A15B")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color = "#6F6B63")
              }
            >
              {link.label}
            </button>
          ))}
        </div>
        <div>
          <div className="font-semibold text-sm mb-4 text-white">
            {t("footer.experiences")}
          </div>
          {[
            t("tourTypes.historical"), t("tourTypes.luxury"), t("tourTypes.cultural"),
            t("tourTypes.private"), t("tourTypes.group"), t("tourTypes.educational"),
          ].map((link) => (
            <button
              key={link}
              onClick={() => onNavigate("tours")}
              className="block w-full text-left text-sm py-1.5 transition-colors"
              style={{ color: "#6F6B63" }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color = "#C6A15B")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color = "#6F6B63")
              }
            >
              {link}
            </button>
          ))}
        </div>
        <div>
          <div className="font-semibold text-sm mb-4 text-white">{t("footer.contact")}</div>
          <div className="space-y-3 text-sm" style={{ color: "#6F6B63" }}>
            <div className="flex items-start gap-2">
              <MapPinIcon /> <span>{COMPANY.location}</span>
            </div>
            <a href={`tel:${COMPANY.phones[0]}`} className="flex items-center gap-2 hover:text-[#C6A15B]">
              <PhoneIcon /> +233 24 471 9176
            </a>
            <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-2 hover:text-[#C6A15B]">
              <MailIcon /> {COMPANY.email}
            </a>
            <a
              href={COMPANY.whatsappChannel}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-[#C6A15B]"
            >
              <PhoneIcon /> {t("footer.whatsapp")}
            </a>
          </div>
          <div className="mt-6">
            <div className="font-semibold text-xs mb-3 text-white uppercase tracking-wider">
              {t("footer.newsletter")}
            </div>
            <NewsletterForm compact />
          </div>
        </div>
      </div>
      <div
        className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{ borderTop: "1px solid #1A1A1A" }}
      >
        <div className="text-xs" style={{ color: "#4A4A4A" }}>
          {t("footer.copyright")}
        </div>
        <div
          className="flex flex-wrap justify-center gap-4 text-xs"
          style={{ color: "#4A4A4A" }}
        >
          {[
            [t("footer.privacy"), "privacy-policy"],
            [t("footer.terms"), "terms-and-conditions"],
            ["Refund Policy", "refund-policy"],
            [t("footer.cancellation"), "cancellation-policy"],
            ["Cookie Policy", "cookie-policy"],
          ].map(([label, page]) => <button key={page} onClick={() => onNavigate(page as Page)} className="hover:text-[#C6A15B] transition-colors">{label}</button>)}
        </div>
      </div>
    </div>
  </footer>
  )
}
