import { useEffect, useState, useMemo } from "react"
import { faqApi, type Faq } from "./api"
import {
  SearchIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  PhoneIcon,
  MailIcon,
  CheckIcon,
} from "./icons"

type Page = "home" | "tours" | "tour-details" | "about" | "gallery" | "articles" | "article-read" | "contribute" | "market" | "market-product" | "contact" | "faq"

const GOLD = "#C6A15B"

// ─── Extra icons ────────────────────────────────────────────────────────────────
const WhatsAppIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)
const ChevronDownIcon = ({ size = 15 }: { size?: number }) => (
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
const BookIcon = ({ size = 20 }: { size?: number }) => (
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
    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
    <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
  </svg>
)
const CreditCardIcon = ({ size = 20 }: { size?: number }) => (
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
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
)
const PassportIcon = ({ size = 20 }: { size?: number }) => (
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
    <path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2z" />
    <circle cx="12" cy="11" r="3" />
    <line x1="8" y1="17" x2="16" y2="17" />
  </svg>
)
const RefreshCcwIcon = ({ size = 20 }: { size?: number }) => (
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
    <polyline points="1 4 1 10 7 10" />
    <polyline points="23 20 23 14 17 14" />
    <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
  </svg>
)
const ShoppingBagIcon = ({ size = 20 }: { size?: number }) => (
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
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
)
const UserIcon = ({ size = 20 }: { size?: number }) => (
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
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)
const XCircleIcon2 = ({ size = 16 }: { size?: number }) => (
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
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
)

// ─── FAQ Data ──────────────────────────────────────────────────────────────────
export const FAQ_DATA = [
  {
    id: "booking",
    label: "Tour Booking",
    icon: <BookIcon />,
    color: "#356A9A",
    bg: "rgba(53,106,154,0.1)",
    count: 7,
    questions: [
      {
        q: "How do I book a KOBANI tour?",
        a: 'You can book directly on our Tours page by selecting your preferred tour and clicking "Book Now." You\'ll be asked to choose travel dates, group size, and any add-ons. A 30% deposit secures your spot. For private or custom tours, we recommend reaching out via the Contact page first so we can build an itinerary around your needs.',
      },
      {
        q: "How far in advance should I book?",
        a: "We recommend booking at least 4–6 weeks in advance for group tours. For bespoke private itineraries, 8–12 weeks gives us time to arrange preferred accommodations, exclusive access, and specialist guides. During peak season (November to March), availability is limited — booking 3+ months ahead is strongly advised.",
      },
      {
        q: "Can I customise my tour itinerary?",
        a: "Yes. All our tours can be tailored — from day-by-day scheduling to accommodation preferences, optional excursions, and cultural experiences. Private bespoke itineraries are our most popular offering. Tell us your interests, dates, and group size and we'll design something entirely around you at no extra planning fee.",
      },
      {
        q: "What is included in the tour price?",
        a: "Most KOBANI tour prices include: accommodation, a certified expert guide, ground transfers within the itinerary, listed entrance fees, and a daily breakfast. International flights, visa fees, travel insurance, personal shopping, and optional activities are not included unless specifically noted in the tour description.",
      },
      {
        q: "Do you offer group or corporate travel discounts?",
        a: "Yes. Groups of 6 or more receive a 10% discount on the base tour price. Corporate team experiences and incentive travel are available with bespoke pricing. Contact our group travel team at info@kobanitours.com for a customised quote.",
      },
      {
        q: "Are your tours suitable for solo travellers?",
        a: "Absolutely. Solo travellers are welcome on all group tours. We can also match solo travellers with compatible companions to avoid single-supplement fees where possible. Our guides are especially attentive to solo guests to ensure they feel included and comfortable throughout.",
      },
      {
        q: "Can I add accommodation nights before or after my tour?",
        a: "Yes. We can arrange pre- and post-tour accommodation, airport transfers, and day activities to extend your stay. Let us know when booking and we'll include these in your itinerary at a discounted partner rate.",
      },
    ],
  },
  {
    id: "payments",
    label: "Payments",
    icon: <CreditCardIcon />,
    color: "#27855C",
    bg: "rgba(39,133,92,0.1)",
    count: 5,
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept Visa, Mastercard, American Express, PayPal, bank wire transfer, and mobile money (MTN MoMo, Vodafone Cash, AirtelTigo Money). All online payments are securely encrypted. For wire transfers, contact info@kobanitours.com for our banking details.",
      },
      {
        q: "Is a deposit required to confirm a booking?",
        a: "Yes. A 30% non-refundable deposit is required to secure your booking and dates. The remaining 70% balance is due no later than 14 days before your departure date. For bookings made within 14 days of departure, full payment is required immediately.",
      },
      {
        q: "Are all prices displayed in US dollars?",
        a: "Our default display currency is USD. You can switch to GBP, EUR, GHS (Ghanaian Cedi), or AUD using the currency selector in the top navigation bar. All payments are processed in your selected currency where supported, or USD as a fallback.",
      },
      {
        q: "Do you offer payment plans or instalment options?",
        a: "Yes, for tours valued at $500 or more, we offer a 3-instalment payment plan: 30% at booking, 35% at 60 days before departure, and 35% at 14 days before departure. Payment plans must be arranged at the time of booking. Contact us to set one up.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes. All payment data is processed by Stripe, which is PCI DSS Level 1 certified — the highest level of payment security certification. KOBANI never stores your card details. All transactions use 256-bit TLS encryption.",
      },
    ],
  },
  {
    id: "travel",
    label: "Travel Requirements",
    icon: <PassportIcon />,
    color: "#7B5EA7",
    bg: "rgba(123,94,167,0.1)",
    count: 5,
    questions: [
      {
        q: "Do I need a visa to visit Ghana?",
        a: "Most international passport holders require a visa to enter Ghana. Citizens of ECOWAS countries are exempt. We recommend applying for an e-visa through the Ghana Immigration Service website at least 3 weeks before travel. KOBANI can connect you with our trusted visa facilitation partners, though we are not responsible for visa decisions.",
      },
      {
        q: "What vaccinations are recommended for travel to Ghana?",
        a: "Yellow fever vaccination is mandatory and you must carry your yellow card certificate. Recommended vaccinations include typhoid, hepatitis A and B, and meningococcal meningitis. Malaria prophylaxis is strongly recommended. Consult your GP or travel health clinic at least 4 weeks before departure for personalised advice.",
      },
      {
        q: "What should I pack for a heritage tour?",
        a: "We recommend lightweight, breathable clothing in neutral tones, a light jacket for air-conditioned spaces and cool evenings, comfortable walking shoes for site visits, sunscreen (SPF 50+), insect repellent, and a reusable water bottle. A full packing guide is sent with every confirmed booking.",
      },
      {
        q: "Is travel insurance required?",
        a: "Travel insurance is not legally required but is strongly recommended and considered mandatory by our guides for your safety. Your policy should cover medical evacuation, trip cancellation, and lost luggage. We can refer you to our partner insurers who specialise in African travel coverage.",
      },
      {
        q: "What currency should I bring to Ghana?",
        a: "The Ghanaian Cedi (GHS) is the local currency. USD and EUR are also widely accepted in tourist areas and by licensed exchanges. We recommend bringing a mix of USD cash and a travel card. ATMs are widely available in Accra and major towns. Avoid street money changers.",
      },
    ],
  },
  {
    id: "cancellations",
    label: "Cancellations",
    icon: <RefreshCcwIcon />,
    color: "#C84A4A",
    bg: "rgba(200,74,74,0.1)",
    count: 5,
    questions: [
      {
        q: "What is your cancellation policy?",
        a: "Cancellations 30+ days before departure: full refund minus $50 processing fee. 15–29 days: 50% refund. 7–14 days: 25% refund. Fewer than 7 days: no refund. All cancellations must be submitted in writing to info@kobanitours.com. Deposits are non-refundable under all circumstances.",
      },
      {
        q: "Can I reschedule my tour to a different date?",
        a: "Yes. One free date change is permitted if requested more than 21 days before your original departure, subject to availability. Date changes requested within 21 days may incur a $75 rebooking fee. Changes are confirmed only when new dates are available and written confirmation is issued.",
      },
      {
        q: "What happens if KOBANI cancels my tour?",
        a: "If KOBANI cancels a tour for any reason (weather, political events, insufficient numbers), you will receive a full refund including deposit within 5 business days, or the option to rebook at no extra charge. We will notify you at least 7 days before departure wherever possible.",
      },
      {
        q: "When will I receive my refund after cancellation?",
        a: "Refunds are processed within 5–7 business days of your cancellation confirmation. The time for the funds to appear in your account depends on your bank — typically 3–7 additional business days for card refunds and 1–3 days for bank transfers.",
      },
      {
        q: "Do I need travel insurance to claim a cancellation refund?",
        a: "KOBANI's refund policy is independent of your travel insurance. However, if you cancel outside our refund window, a comprehensive travel insurance policy may cover costs that KOBANI cannot refund. We strongly recommend insuring your trip for this reason.",
      },
    ],
  },
  {
    id: "market",
    label: "African Market",
    icon: <ShoppingBagIcon />,
    color: GOLD,
    bg: "rgba(198,161,91,0.1)",
    count: 5,
    questions: [
      {
        q: "How do I place an order on the African Market?",
        a: "Browse products in the African Market section, add items to your cart, and proceed to checkout. You'll be asked for a delivery address and payment details. Orders are confirmed by email within 30 minutes. Most products are made-to-order, so please allow the lead time noted on each product page.",
      },
      {
        q: "Do you ship African Market products internationally?",
        a: "Yes. We ship to over 60 countries worldwide. Shipping rates and estimated delivery times are calculated at checkout. Free international shipping applies to orders over $150. Customs duties and import taxes are the responsibility of the customer and vary by destination country.",
      },
      {
        q: "How long does shipping take?",
        a: "Standard international shipping takes 7–14 business days. Express (DHL) shipping is available for 3–5 business days at an additional charge. Within West Africa, most orders arrive within 3–5 days. All orders include a tracking number sent by email once dispatched.",
      },
      {
        q: "What is your African Market returns policy?",
        a: "We accept returns on unworn, unaltered items in their original packaging within 30 days of delivery. To initiate a return, email info@kobanitours.com with your order number. Return shipping is covered by KOBANI for defective items. Change-of-mind returns incur a $12 return shipping fee.",
      },
      {
        q: "Are the products on the African Market authentic?",
        a: "Yes. Every product on the KOBANI African Market is ethically sourced directly from artisans, weavers, and cultural custodians across the continent. We personally visit every supplier and each product includes an authenticity card detailing the maker, region, and cultural significance.",
      },
    ],
  },
  {
    id: "accounts",
    label: "Customer Accounts",
    icon: <UserIcon />,
    color: "#202020",
    bg: "rgba(32,32,32,0.08)",
    count: 5,
    questions: [
      {
        q: "How do I create a KOBANI account?",
        a: 'Click "Register" in the top navigation bar. You\'ll be asked for your name, email, and a password. Once registered, you can save tours to your wishlist, view past bookings, manage your profile, and receive exclusive member discounts.',
      },
      {
        q: "I've forgotten my password. How do I reset it?",
        a: 'Click "Login" and then "Forgot Password." Enter your registered email address and we\'ll send a reset link within 2 minutes. If you don\'t see the email, check your spam folder. The reset link expires after 60 minutes. Contact info@kobanitours.com if you continue to have trouble.',
      },
      {
        q: "How do I view my past bookings and orders?",
        a: 'Log in to your account and navigate to "My Dashboard" — you\'ll find all your tour bookings, African Market orders, payment history, and upcoming itineraries in one place. You can download invoice PDFs, view tour documents, and track your market orders from the dashboard.',
      },
      {
        q: "Can I save favourite tours to review later?",
        a: "Yes. Click the heart icon on any tour card to save it to your Wishlist. You must be logged in to save favourites. Your wishlist is accessible from your account dashboard and can be shared with travel companions via a unique link.",
      },
      {
        q: "How do I update my personal information or email address?",
        a: 'Log in to your account, go to "My Profile" and click "Edit Profile." You can update your name, email, phone number, nationality, and communication preferences at any time. Changes to your email require verification by clicking a link sent to your new address.',
      },
    ],
  },
]

// ─── Accordion Item ─────────────────────────────────────────────────────────────
const AccordionItem = ({
  q,
  a,
  index,
  isOpen,
  onToggle,
  searchTerm,
}: {
  q: string
  a: string
  index: number
  isOpen: boolean
  onToggle: () => void
  searchTerm: string
}) => {
  const highlight = (text: string) => {
    if (!searchTerm.trim()) return text
    const regex = new RegExp(
      `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi",
    )
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <mark
          key={i}
          style={{
            background: "rgba(198,161,91,0.35)",
            color: "#0B0B0B",
            borderRadius: 3,
          }}
        >
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  return (
    <div
      className="transition-all duration-200"
      style={{
        border: `1.5px solid ${isOpen ? GOLD : "#E6DFD2"}`,
        borderRadius: 16,
        background: "#FFFFFF",
        overflow: "hidden",
      }}
    >
      <button
        onClick={onToggle}
        className="flex items-start justify-between w-full px-5 py-4 text-left gap-4 group"
        style={{ background: isOpen ? "rgba(198,161,91,0.03)" : "#FFFFFF" }}
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span
            className="flex-shrink-0 font-serif text-sm font-bold mt-0.5"
            style={{
              fontFamily: "var(--font-serif)",
              color: isOpen ? GOLD : "#D6D0C8",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            className="text-sm font-semibold leading-snug"
            style={{ color: isOpen ? "#0B0B0B" : "#202020" }}
          >
            {highlight(q)}
          </span>
        </div>
        <div
          className="flex-shrink-0 mt-0.5 transition-transform duration-200"
          style={{
            transform: isOpen ? "rotate(180deg)" : "none",
            color: isOpen ? GOLD : "#9A9590",
          }}
        >
          <ChevronDownIcon size={16} />
        </div>
      </button>
      {isOpen && (
        <div className="px-5 pb-5" style={{ borderTop: "1px solid #F0EBE0" }}>
          <p
            className="pt-3 text-sm leading-[1.85] ml-8"
            style={{ color: "#6F6B63" }}
          >
            {highlight(a)}
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Category Card ──────────────────────────────────────────────────────────────
const CategoryCard = ({
  cat,
  active,
  onClick,
  matchCount,
}: {
  cat: typeof FAQ_DATA[0]
  active: boolean
  onClick: () => void
  matchCount: number
}) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-2.5 p-4 rounded-2xl transition-all text-center"
    style={{
      background: active ? "#0B0B0B" : "#FFFFFF",
      border: `1.5px solid ${active ? "#0B0B0B" : "#E6DFD2"}`,
      boxShadow: active
        ? "0 8px 24px rgba(0,0,0,0.2)"
        : "0 2px 8px rgba(0,0,0,0.04)",
      transform: active ? "translateY(-2px)" : "none",
      minWidth: 100,
    }}
    onMouseEnter={(e) => {
      if (!active) {
        ;(e.currentTarget as HTMLElement).style.borderColor = GOLD
        ;(e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"
      }
    }}
    onMouseLeave={(e) => {
      if (!active) {
        ;(e.currentTarget as HTMLElement).style.borderColor = "#E6DFD2"
        ;(e.currentTarget as HTMLElement).style.transform = "none"
      }
    }}
  >
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center"
      style={{ background: active ? "rgba(198,161,91,0.18)" : cat.bg }}
    >
      <span style={{ color: active ? GOLD : cat.color }}>{cat.icon}</span>
    </div>
    <div
      className="text-xs font-semibold leading-snug"
      style={{ color: active ? "#E9D6A8" : "#202020" }}
    >
      {cat.label}
    </div>
    <div
      className="text-xs px-2 py-0.5 rounded-full font-bold"
      style={{
        background: active ? "rgba(198,161,91,0.2)" : "#F8F4EA",
        color: active ? GOLD : "#9A9590",
      }}
    >
      {matchCount}
    </div>
  </button>
)

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function FAQPage({
  onNavigate,
}: {
  onNavigate: (p: Page) => void
}) {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())
  const [managedFaqs, setManagedFaqs] = useState<Faq[] | null>(null)

  useEffect(() => {
    faqApi.publicList().then(result => setManagedFaqs(result.data.faqs)).catch(() => {})
  }, [])

  const faqData = useMemo(() => {
    if (managedFaqs === null) return FAQ_DATA
    const groups = new Map<string, Faq[]>()
    managedFaqs.forEach(item => groups.set(item.category, [...(groups.get(item.category) || []), item]))
    return Array.from(groups.entries()).map(([category, items]) => {
      const original = FAQ_DATA.find(item => item.id === category)
      return {
        id: category,
        label: items[0]?.category_label || original?.label || "KOBANI FAQs",
        icon: original?.icon || <BookIcon />,
        color: original?.color || GOLD,
        bg: original?.bg || "rgba(198,161,91,0.1)",
        count: items.length,
        questions: items.map(item => ({ q: item.question, a: item.answer })),
      }
    })
  }, [managedFaqs])

  const toggleItem = (key: string) =>
    setOpenItems((prev) => {
      const s = new Set(prev)
      s.has(key) ? s.delete(key) : s.add(key)
      return s
    })

  const searchLower = search.toLowerCase().trim()

  const filtered = useMemo(() => {
    return faqData.map((cat) => ({
      ...cat,
      questions: cat.questions.filter((item) => {
        const matchesCat = !activeCategory || cat.id === activeCategory
        const matchesSearch =
          !searchLower ||
          item.q.toLowerCase().includes(searchLower) ||
          item.a.toLowerCase().includes(searchLower)
        return matchesCat && matchesSearch
      }),
    })).filter((cat) => cat.questions.length > 0)
  }, [activeCategory, faqData, searchLower])

  const totalMatches = useMemo(
    () =>
      faqData.reduce((acc, cat) => {
        const match = !activeCategory || cat.id === activeCategory
        if (!match) return acc
        return (
          acc +
          cat.questions.filter(
            (item) =>
              !searchLower ||
              item.q.toLowerCase().includes(searchLower) ||
              item.a.toLowerCase().includes(searchLower),
          ).length
        )
      }, 0),
    [activeCategory, faqData, searchLower],
  )

  const categoryMatchCount = (catId: string) =>
    faqData.find((c) => c.id === catId)!.questions.filter(
      (item) =>
        !searchLower ||
        item.q.toLowerCase().includes(searchLower) ||
        item.a.toLowerCase().includes(searchLower),
    ).length

  const expandAll = () => {
    const keys = new Set<string>()
    filtered.forEach((cat) =>
      cat.questions.forEach((_, i) => keys.add(`${cat.id}-${i}`)),
    )
    setOpenItems(keys)
  }
  const collapseAll = () => setOpenItems(new Set())

  return (
    <div style={{ background: "#F8F4EA" }}>
      {/* ── 1. Banner ─────────────────────────────────────────────────────────── */}
      <section className="px-4 pt-8 pb-0">
        <div className="mx-auto" style={{ maxWidth: 1100 }}>
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{ minHeight: 340 }}
          >
            {/* Background layers */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg,#0B0B0B 0%,#1A1208 50%,#0B0B0B 100%)",
              }}
            />
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 50%, #C6A15B 0%, transparent 50%), radial-gradient(circle at 80% 20%, #E9D6A8 0%, transparent 40%)",
              }}
            />
            {/* Ornamental grid */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(198,161,91,0.6) 39px,rgba(198,161,91,0.6) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(198,161,91,0.6) 39px,rgba(198,161,91,0.6) 40px)",
              }}
            />
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background: `linear-gradient(90deg,transparent,${GOLD},#E9D6A8,${GOLD},transparent)`,
              }}
            />

            <div
              className="relative z-10 px-8 py-14 md:px-16 flex flex-col items-center text-center"
              style={{ minHeight: 340, justifyContent: "center" }}
            >
              <nav
                className="flex items-center justify-center gap-2 text-xs mb-6"
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
                <span style={{ color: GOLD }}>FAQ</span>
              </nav>
              <div
                className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
                style={{
                  background: "rgba(198,161,91,0.18)",
                  border: "1px solid rgba(198,161,91,0.35)",
                  color: "#E9D6A8",
                }}
              >
                ✦ Help Centre
              </div>
              <h1
                className="font-serif font-bold text-white mb-3"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(2rem,5vw,3.2rem)",
                }}
              >
                How Can We Help?
              </h1>
              <p
                className="text-sm mb-8"
                style={{ color: "#9A9590", maxWidth: 440, lineHeight: 1.75 }}
              >
                Browse answers to our most common questions. Can't find what you
                need? Our team will respond as soon as possible during business hours.
              </p>

              {/* Search box */}
              <div className="relative w-full max-w-lg">
                <div
                  className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: GOLD }}
                >
                  <SearchIcon size={18} />
                </div>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={
                    "Search questions — e.g. “visa”, “cancellation”, “payment”…"
                  }
                  className="w-full pl-11 pr-12 py-4 rounded-2xl text-sm outline-none"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: `1.5px solid ${
                      search ? GOLD : "rgba(198,161,91,0.3)"
                    }`,
                    color: "#FFFFFF",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                    backdropFilter: "blur(8px)",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = GOLD)}
                  onBlur={(e) => {
                    if (!search)
                      e.target.style.borderColor = "rgba(198,161,91,0.3)"
                  }}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    style={{
                      color: "#6F6B63",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <XCircleIcon2 size={16} />
                  </button>
                )}
              </div>

              {search && (
                <div
                  className="mt-3 text-xs"
                  style={{ color: totalMatches > 0 ? "#E9D6A8" : "#C84A4A" }}
                >
                  {totalMatches > 0 ? (
                    <>
                      <span style={{ color: GOLD }}>{totalMatches}</span> result
                      {totalMatches !== 1 ? "s" : ""} for "
                      <span style={{ color: GOLD }}>{search}</span>"
                    </>
                  ) : (
                    "No results found — try different keywords or contact us directly"
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Category Cards ─────────────────────────────────────────────────── */}
      <section className="px-4 pt-6">
        <div className="mx-auto" style={{ maxWidth: 1100 }}>
          <div className="flex flex-wrap gap-3 justify-center">
            {/* All button */}
            <button
              onClick={() => setActiveCategory(null)}
              className="flex flex-col items-center gap-2.5 p-4 rounded-2xl transition-all text-center"
              style={{
                background: activeCategory === null ? "#0B0B0B" : "#FFFFFF",
                border: `1.5px solid ${
                  activeCategory === null ? "#0B0B0B" : "#E6DFD2"
                }`,
                boxShadow:
                  activeCategory === null
                    ? "0 8px 24px rgba(0,0,0,0.2)"
                    : "0 2px 8px rgba(0,0,0,0.04)",
                transform:
                  activeCategory === null ? "translateY(-2px)" : "none",
                minWidth: 100,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background:
                    activeCategory === null
                      ? "rgba(198,161,91,0.18)"
                      : "rgba(198,161,91,0.1)",
                }}
              >
                <span style={{ color: GOLD, fontSize: 20 }}>✦</span>
              </div>
              <div
                className="text-xs font-semibold"
                style={{
                  color: activeCategory === null ? "#E9D6A8" : "#202020",
                }}
              >
                All Topics
              </div>
              <div
                className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={{
                  background:
                    activeCategory === null
                      ? "rgba(198,161,91,0.2)"
                      : "#F8F4EA",
                  color: activeCategory === null ? GOLD : "#9A9590",
                }}
              >
                {faqData.reduce((a, c) => a + c.questions.length, 0)}
              </div>
            </button>

            {faqData.map((cat) => (
              <CategoryCard
                key={cat.id}
                cat={cat}
                active={activeCategory === cat.id}
                onClick={() =>
                  setActiveCategory(activeCategory === cat.id ? null : cat.id)
                }
                matchCount={categoryMatchCount(cat.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. FAQ Accordions ─────────────────────────────────────────────────── */}
      <section className="px-4 pt-8 pb-10">
        <div className="mx-auto" style={{ maxWidth: 1100 }}>
          {/* Controls */}
          <div className="flex items-center justify-between mb-6 px-1">
            <div className="text-sm" style={{ color: "#6F6B63" }}>
              {filtered.length > 0 ? (
                <>
                  <span className="font-bold" style={{ color: "#0B0B0B" }}>
                    {totalMatches}
                  </span>{" "}
                  question{totalMatches !== 1 ? "s" : ""}
                  {activeCategory
                    ? ` in ${faqData.find((c) => c.id === activeCategory)?.label}`
                    : ""}
                </>
              ) : (
                "No questions match your search"
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={expandAll}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: "#FFFFFF",
                  border: "1.5px solid #E6DFD2",
                  color: "#6F6B63",
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.borderColor = GOLD
                  ;(e.currentTarget as HTMLElement).style.color = GOLD
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.borderColor =
                    "#E6DFD2"
                  ;(e.currentTarget as HTMLElement).style.color = "#6F6B63"
                }}
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: "#FFFFFF",
                  border: "1.5px solid #E6DFD2",
                  color: "#6F6B63",
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.borderColor = GOLD
                  ;(e.currentTarget as HTMLElement).style.color = GOLD
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.borderColor =
                    "#E6DFD2"
                  ;(e.currentTarget as HTMLElement).style.color = "#6F6B63"
                }}
              >
                Collapse All
              </button>
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="space-y-8">
              {filtered.map((cat) => (
                <div
                  key={cat.id}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    border: "1.5px solid #E6DFD2",
                    background: "#FFFFFF",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* Category header */}
                  <div
                    className="flex items-center justify-between px-6 py-4"
                    style={{
                      background:
                        "linear-gradient(to right, rgba(248,244,234,0.8), #FFFFFF)",
                      borderBottom: "1px solid #F0EBE0",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: cat.bg }}
                      >
                        <span style={{ color: cat.color }}>{cat.icon}</span>
                      </div>
                      <div>
                        <div
                          className="font-serif font-bold text-base"
                          style={{
                            fontFamily: "var(--font-serif)",
                            color: "#0B0B0B",
                          }}
                        >
                          {cat.label}
                        </div>
                        <div className="text-xs" style={{ color: "#9A9590" }}>
                          {cat.questions.length} question
                          {cat.questions.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                    <div
                      className="text-xs px-3 py-1 rounded-full font-bold"
                      style={{ background: cat.bg, color: cat.color }}
                    >
                      {cat.questions.length} result
                      {cat.questions.length !== 1 ? "s" : ""}
                    </div>
                  </div>

                  {/* Questions */}
                  <div className="p-4 space-y-2.5">
                    {cat.questions.map((item, i) => {
                      const key = `${cat.id}-${FAQ_DATA.find((c) => c.id === cat.id)!.questions.indexOf(item)}`
                      return (
                        <AccordionItem
                          key={key}
                          q={item.q}
                          a={item.a}
                          index={FAQ_DATA.find(
                            (c) => c.id === cat.id,
                          )!.questions.indexOf(item)}
                          isOpen={openItems.has(key)}
                          onToggle={() => toggleItem(key)}
                          searchTerm={search}
                        />
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="rounded-2xl py-20 text-center"
              style={{ background: "#FFFFFF", border: "1px solid #E6DFD2" }}
            >
              <div className="text-5xl mb-4">🔍</div>
              <div
                className="font-serif font-bold text-lg mb-2"
                style={{ fontFamily: "var(--font-serif)", color: "#0B0B0B" }}
              >
                No results for "{search}"
              </div>
              <p className="text-sm mb-6" style={{ color: "#6F6B63" }}>
                Try different keywords, or reach out to our team and we'll
                answer personally.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <button
                  onClick={() => setSearch("")}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                  style={{
                    background: "#F8F4EA",
                    border: "1.5px solid #E6DFD2",
                    color: "#202020",
                  }}
                >
                  Clear Search
                </button>
                <button
                  onClick={() => onNavigate("contact")}
                  className="btn-gold px-5 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ color: "#0B0B0B" }}
                >
                  Contact Us
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 4. Still Need Help ────────────────────────────────────────────────── */}
      <section className="px-4 pb-16">
        <div className="mx-auto" style={{ maxWidth: 1100 }}>
          {/* Section heading */}
          <div className="text-center mb-8">
            <div
              className="text-xs font-bold tracking-widest uppercase mb-2"
              style={{ color: GOLD }}
            >
              ✦ Still Need Help?
            </div>
            <h2
              className="font-serif font-bold text-2xl"
              style={{ fontFamily: "var(--font-serif)", color: "#0B0B0B" }}
            >
              Our Team Is Ready to Help
            </h2>
            <p className="text-sm mt-2" style={{ color: "#6F6B63" }}>
              Can't find your answer above? Reach out — we reply to every
              enquiry personally and promptly.
            </p>
          </div>

          {/* Three cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {/* Chat on WhatsApp */}
            <div
              className="rounded-2xl p-6 flex flex-col items-center text-center transition-all group"
              style={{
                background: "#0B0B0B",
                border: "1.5px solid #1A1A1A",
                boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.borderColor = "#25D366"
                ;(e.currentTarget as HTMLElement).style.transform =
                  "translateY(-3px)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.borderColor = "#1A1A1A"
                ;(e.currentTarget as HTMLElement).style.transform = "none"
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{
                  background: "rgba(37,211,102,0.15)",
                  border: "1px solid rgba(37,211,102,0.25)",
                }}
              >
                <WhatsAppIcon size={26} />
              </div>
              <div
                className="font-serif font-bold text-base text-white mb-2"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Chat on WhatsApp
              </div>
              <p
                className="text-xs leading-relaxed mb-5"
                style={{ color: "#6F6B63" }}
              >
                Contact our team on WhatsApp for tour information and booking assistance.
              </p>
              <div
                className="flex items-center gap-1.5 text-xs mb-5"
                style={{ color: "#9A9590" }}
              >
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: "#25D366" }}
                />
                Message our team
              </div>
              <a
                href="https://wa.me/233244719176?text=Hi%20KOBANI%2C%20I%20have%20a%20question."
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold w-full justify-center transition-all"
                style={{ background: "#25D366", color: "#FFFFFF" }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.opacity = "0.9"
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.opacity = "1"
                }}
              >
                <WhatsAppIcon size={16} /> Start Chat
              </a>
            </div>

            {/* Send a message */}
            <div
              className="rounded-2xl p-6 flex flex-col items-center text-center transition-all"
              style={{
                background: "#FFFFFF",
                border: "1.5px solid #E6DFD2",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.borderColor = GOLD
                ;(e.currentTarget as HTMLElement).style.transform =
                  "translateY(-3px)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.borderColor = "#E6DFD2"
                ;(e.currentTarget as HTMLElement).style.transform = "none"
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{
                  background: "rgba(198,161,91,0.1)",
                  border: "1px solid rgba(198,161,91,0.2)",
                }}
              >
                <MailIcon />
              </div>
              <div
                className="font-serif font-bold text-base mb-2"
                style={{ fontFamily: "var(--font-serif)", color: "#0B0B0B" }}
              >
                Send a Message
              </div>
              <p
                className="text-xs leading-relaxed mb-5"
                style={{ color: "#6F6B63" }}
              >
                Fill in our contact form with your question, tour interest, or
                feedback and a member of our team will reply within 4 business
                hours.
              </p>
              <div
                className="flex items-center gap-1.5 text-xs mb-5"
                style={{ color: "#9A9590" }}
              >
                <CheckIcon size={12} /> Replies during business hours
              </div>
              <button
                onClick={() => onNavigate("contact")}
                className="btn-gold flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold w-full justify-center"
                style={{ color: "#0B0B0B" }}
              >
                Contact Us <ArrowRightIcon size={14} />
              </button>
            </div>

            {/* Call us */}
            <div
              className="rounded-2xl p-6 flex flex-col items-center text-center transition-all"
              style={{
                background: "#FFFFFF",
                border: "1.5px solid #E6DFD2",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.borderColor = GOLD
                ;(e.currentTarget as HTMLElement).style.transform =
                  "translateY(-3px)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.borderColor = "#E6DFD2"
                ;(e.currentTarget as HTMLElement).style.transform = "none"
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{
                  background: "rgba(198,161,91,0.1)",
                  border: "1px solid rgba(198,161,91,0.2)",
                }}
              >
                <PhoneIcon />
              </div>
              <div
                className="font-serif font-bold text-base mb-2"
                style={{ fontFamily: "var(--font-serif)", color: "#0B0B0B" }}
              >
                Call Us Directly
              </div>
              <p
                className="text-xs leading-relaxed mb-5"
                style={{ color: "#6F6B63" }}
              >
                Speak to a travel consultant directly for urgent bookings,
                same-day enquiries, or if you simply prefer a conversation.
              </p>
              <div className="text-xs mb-5" style={{ color: "#9A9590" }}>
                Mon–Sat · 8 AM – 7 PM GMT
              </div>
              <a
                href="tel:+233244719176"
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold w-full justify-center transition-all"
                style={{
                  background: "#F8F4EA",
                  border: "1.5px solid #E6DFD2",
                  color: "#202020",
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.borderColor = GOLD
                  ;(e.currentTarget as HTMLElement).style.color = GOLD
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.borderColor =
                    "#E6DFD2"
                  ;(e.currentTarget as HTMLElement).style.color = "#202020"
                }}
              >
                <PhoneIcon /> +233 24 471 9176
              </a>
            </div>
          </div>

          {/* Bottom trust strip */}
          <div
            className="rounded-2xl px-6 py-4 flex flex-wrap items-center justify-center gap-6"
            style={{ background: "#FFFFFF", border: "1px solid #E6DFD2" }}
          >
            {[
              { icon: "⚡", text: "Dedicated email assistance" },
              { icon: "💬", text: "WhatsApp booking support" },
              { icon: "🌍", text: "Support in English, French & Twi" },
              { icon: "⭐", text: "Thoughtful customer care" },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-2 text-xs font-medium"
                style={{ color: "#6F6B63" }}
              >
                <span>{item.icon}</span> {item.text}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
