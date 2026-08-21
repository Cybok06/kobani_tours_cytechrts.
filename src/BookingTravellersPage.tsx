import { useState, useRef } from "react"

type Page = "home" | "tours" | "tour-details" | "about" | "gallery" | "articles" | "article-read" | "contribute" | "market" | "market-product" | "contact" | "faq" | "login" | "register" | "verify-email" | "booking" | "booking-travellers" | "booking-addons"

const GOLD = "#C6A15B"

// ─── Demo travellers from step 1 ─────────────────────────────────────────────
const DEMO_TRAVELLERS = [
  { type: "Adult", label: "Lead Traveller", isPrimary: true },
  { type: "Adult", label: "Adult", isPrimary: false },
  { type: "Child", label: "Child (age 2–17)", isPrimary: false },
]

const TOUR_SUMMARY = {
  name: "Sacred Kumasi Heritage Trail",
  date: "Monday, 15 September 2025",
  duration: "4 Days / 3 Nights",
  adults: 2,
  children: 1,
  tourType: "Group Tour",
  deposit: 534,
  total: 2370,
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"]
const DIETARY = [
  "None / No requirements",
  "Vegetarian",
  "Vegan",
  "Halal",
  "Kosher",
  "Gluten-free",
  "Dairy-free",
  "Nut allergy",
  "Other",
]
const ACCESSIBILITY = [
  "None required",
  "Wheelchair access",
  "Hearing assistance",
  "Visual assistance",
  "Mobility assistance",
  "Other — please specify",
]
const NATIONALITIES = [
  "Afghan",
  "Albanian",
  "Algerian",
  "American",
  "Angolan",
  "Argentine",
  "Australian",
  "Austrian",
  "Bangladeshi",
  "Belgian",
  "Bolivian",
  "Brazilian",
  "British",
  "Bulgarian",
  "Cameroonian",
  "Canadian",
  "Chilean",
  "Chinese",
  "Colombian",
  "Congolese",
  "Croatian",
  "Cuban",
  "Czech",
  "Danish",
  "Dutch",
  "Egyptian",
  "Ethiopian",
  "Finnish",
  "French",
  "Ghanaian",
  "German",
  "Greek",
  "Guatemalan",
  "Hungarian",
  "Indian",
  "Indonesian",
  "Iranian",
  "Iraqi",
  "Irish",
  "Israeli",
  "Italian",
  "Ivorian",
  "Jamaican",
  "Japanese",
  "Jordanian",
  "Kenyan",
  "Korean",
  "Lebanese",
  "Libyan",
  "Malaysian",
  "Malian",
  "Mexican",
  "Moroccan",
  "Mozambican",
  "Namibian",
  "Nigerian",
  "Norwegian",
  "Pakistani",
  "Peruvian",
  "Philippine",
  "Polish",
  "Portuguese",
  "Romanian",
  "Russian",
  "Rwandan",
  "Saudi",
  "Senegalese",
  "Serbian",
  "Sierra Leonean",
  "Singaporean",
  "Somali",
  "South African",
  "Spanish",
  "Sudanese",
  "Swedish",
  "Swiss",
  "Tanzanian",
  "Thai",
  "Togolese",
  "Tunisian",
  "Turkish",
  "Ugandan",
  "Ukrainian",
  "Uruguayan",
  "Venezuelan",
  "Vietnamese",
  "Yemeni",
  "Zimbabwean",
]
const COUNTRY_CODES = [
  { code: "+1", flag: "🇺🇸", label: "US" },
  { code: "+44", flag: "🇬🇧", label: "UK" },
  { code: "+233", flag: "🇬🇭", label: "GH" },
  { code: "+234", flag: "🇳🇬", label: "NG" },
  { code: "+27", flag: "🇿🇦", label: "ZA" },
  { code: "+33", flag: "🇫🇷", label: "FR" },
  { code: "+49", flag: "🇩🇪", label: "DE" },
  { code: "+91", flag: "🇮🇳", label: "IN" },
  { code: "+61", flag: "🇦🇺", label: "AU" },
  { code: "+86", flag: "🇨🇳", label: "CN" },
  { code: "+971", flag: "🇦🇪", label: "AE" },
]

// ─── Traveller form state ──────────────────────────────────────────────────────
type TravellerData = {
  firstName: string
  lastName: string
  dob: string
  gender: string
  nationality: string
  passportNum: string
  passportExpiry: string
  dietary: string[]
  accessibility: string
  accessibilityNote: string
  // Primary contact fields (only for traveller 0)
  email: string
  phoneCode: string
  phone: string
  emergencyName: string
  emergencyPhone: string
  emergencyRelation: string
}
const emptyTraveller = (): TravellerData => ({
  firstName: "",
  lastName: "",
  dob: "",
  gender: "",
  nationality: "",
  passportNum: "",
  passportExpiry: "",
  dietary: ["None / No requirements"],
  accessibility: "None required",
  accessibilityNote: "",
  email: "",
  phoneCode: "+233",
  phone: "",
  emergencyName: "",
  emergencyPhone: "",
  emergencyRelation: "",
})

// ─── Icons ────────────────────────────────────────────────────────────────────
const ChevronDownIcon = ({ size = 16 }: { size?: number }) => (
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
const CheckIcon = ({ size = 10 }: { size?: number }) => (
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
const LockIcon = ({ size = 13 }: { size?: number }) => (
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
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
)
const ShieldIcon = ({ size = 14 }: { size?: number }) => (
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
const UserIcon = ({ size = 15 }: { size?: number }) => (
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
const ArrowLeftIcon = ({ size = 14 }: { size?: number }) => (
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
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
)
const ArrowRightIcon = ({ size = 14 }: { size?: number }) => (
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
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)
const InfoIcon = ({ size = 13 }: { size?: number }) => (
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
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
)
const MapPinIcon = ({ size = 13 }: { size?: number }) => (
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
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)
const ClockIcon = ({ size = 13 }: { size?: number }) => (
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
    <polyline points="12 6 12 12 16 14" />
  </svg>
)
const PhoneIcon2 = ({ size = 13 }: { size?: number }) => (
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
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.4 10.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012.31 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.06 6.06l1.27-.76a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
)
const MailIcon2 = ({ size = 13 }: { size?: number }) => (
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

// ─── Stepper ─────────────────────────────────────────────────────────────────
const STEPS = [
  { n: 1, label: "Tour Details" },
  { n: 2, label: "Travellers" },
  { n: 3, label: "Add-ons" },
  { n: 4, label: "Payment" },
  { n: 5, label: "Confirmation" },
]
const Stepper = ({ current }: { current: number }) => (
  <div className="flex items-center w-full" style={{ maxWidth: 680 }}>
    {STEPS.map((step, i) => {
      const done = step.n < current
      const active = step.n === current
      return (
        <div
          key={step.n}
          className="flex items-center"
          style={{ flex: i < STEPS.length - 1 ? "1 1 0%" : "none" }}
        >
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
              style={{
                background: done ? "#0B0B0B" : active ? GOLD : "#2A2A2A",
                color: done ? GOLD : active ? "#0B0B0B" : "#6F6B63",
                border: active
                  ? `2px solid ${GOLD}`
                  : done
                    ? "2px solid #0B0B0B"
                    : "2px solid #2A2A2A",
                boxShadow: active ? `0 0 0 4px rgba(198,161,91,0.2)` : "none",
              }}
            >
              {done ? <CheckIcon size={10} /> : step.n}
            </div>
            <span
              className="text-xs font-medium hidden sm:block whitespace-nowrap"
              style={{ color: active ? GOLD : done ? "#9A9590" : "#4A4A4A" }}
            >
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className="flex-1 h-px mx-2"
              style={{ background: done ? "#3A3A3A" : "#2A2A2A", minWidth: 20 }}
            />
          )}
        </div>
      )
    })}
  </div>
)

// ─── Shared field components ─────────────────────────────────────────────────
const inputStyle = (
  focused: boolean,
  error?: boolean,
): React.CSSProperties => ({
  width: "100%",
  borderRadius: 12,
  outline: "none",
  fontSize: 14,
  padding: "10px 14px",
  color: "#0B0B0B",
  background: "#FAFAF8",
  border: `1.5px solid ${error ? "#C84A4A" : focused ? GOLD : "#E6DFD2"}`,
  transition: "border-color 0.15s",
})
const selectStyle = (
  focused: boolean,
  error?: boolean,
): React.CSSProperties => ({
  ...inputStyle(focused, error),
  appearance: "none",
  cursor: "pointer",
  paddingRight: 34,
})

const FL = ({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) => (
  <div className="space-y-1.5">
    <label
      className="block text-xs font-semibold tracking-wide uppercase"
      style={{ color: "#6F6B63" }}
    >
      {label}
      {required && <span style={{ color: "#C84A4A" }}> *</span>}
    </label>
    {children}
    {error && (
      <p className="text-xs" style={{ color: "#C84A4A" }}>
        ⚠ {error}
      </p>
    )}
  </div>
)

const SelectWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="relative">
    {children}
    <div
      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
      style={{ color: "#9A9590" }}
    >
      <ChevronDownIcon size={13} />
    </div>
  </div>
)

// ─── Completion check ────────────────────────────────────────────────────────
const isComplete = (t: TravellerData, isPrimary: boolean) => {
  const base =
    t.firstName &&
    t.lastName &&
    t.dob &&
    t.gender &&
    t.nationality &&
    t.passportNum &&
    t.passportExpiry
  if (!isPrimary) return !!base
  return !!(base && t.email && t.phone && t.emergencyName && t.emergencyPhone)
}

// ─── Traveller card ──────────────────────────────────────────────────────────
const TravellerCard = ({
  index,
  traveller,
  data,
  onUpdate,
  isOpen,
  onToggle,
  showErrors,
}: {
  index: number
  traveller: typeof DEMO_TRAVELLERS[0]
  data: TravellerData
  onUpdate: (d: Partial<TravellerData>) => void
  isOpen: boolean
  onToggle: () => void
  showErrors: boolean
}) => {
  const [focused, setFocused] = useState<string | null>(null)
  const complete = isComplete(data, traveller.isPrimary)
  const hasName = data.firstName || data.lastName
  const fo = (k: string) => () => setFocused(k)
  const fb = () => setFocused(null)

  const toggleDietary = (item: string) => {
    if (item === "None / No requirements") {
      onUpdate({ dietary: ["None / No requirements"] })
      return
    }
    const current = data.dietary.filter((d) => d !== "None / No requirements")
    const next = current.includes(item)
      ? current.filter((d) => d !== item)
      : [...current, item]
    onUpdate({ dietary: next.length ? next : ["None / No requirements"] })
  }

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all"
      style={{
        border: `1.5px solid ${
          complete
            ? "rgba(39,133,92,0.35)"
            : showErrors && !complete
              ? "#C84A4A"
              : isOpen
                ? GOLD
                : "#E6DFD2"
        }`,
        background: "#FFFFFF",
        boxShadow: isOpen
          ? "0 8px 32px rgba(0,0,0,0.06)"
          : "0 2px 8px rgba(0,0,0,0.03)",
      }}
    >
      {/* ── Card header ── */}
      <button
        onClick={onToggle}
        className="w-full text-left px-6 py-4 flex items-center gap-4 transition-all"
        style={{
          background: isOpen ? "rgba(198,161,91,0.03)" : "#FFFFFF",
          cursor: "pointer",
        }}
      >
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-serif font-bold text-base"
          style={{
            fontFamily: "var(--font-serif)",
            background: complete
              ? "rgba(39,133,92,0.12)"
              : isOpen
                ? "rgba(198,161,91,0.14)"
                : "#F8F4EA",
            color: complete ? "#27855C" : isOpen ? GOLD : "#9A9590",
            border: `1.5px solid ${
              complete
                ? "rgba(39,133,92,0.3)"
                : isOpen
                  ? "rgba(198,161,91,0.35)"
                  : "#E6DFD2"
            }`,
          }}
        >
          {complete ? <CheckIcon size={12} /> : index + 1}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold" style={{ color: "#0B0B0B" }}>
              {hasName
                ? `${data.firstName} ${data.lastName}`.trim()
                : `Traveller ${index + 1}`}
            </span>
            {traveller.isPrimary && (
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(198,161,91,0.12)",
                  color: GOLD,
                  border: `1px solid rgba(198,161,91,0.25)`,
                }}
              >
                Lead
              </span>
            )}
            {complete && (
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(39,133,92,0.1)", color: "#27855C" }}
              >
                ✓ Complete
              </span>
            )}
            {showErrors && !complete && (
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(200,74,74,0.08)", color: "#C84A4A" }}
              >
                Incomplete
              </span>
            )}
          </div>
          <div className="text-xs mt-0.5" style={{ color: "#9A9590" }}>
            {traveller.label}
            {data.nationality && <span> · {data.nationality}</span>}
            {data.dob && <span> · b. {data.dob}</span>}
          </div>
        </div>

        <div
          className="transition-transform duration-200 flex-shrink-0"
          style={{
            transform: isOpen ? "rotate(180deg)" : "none",
            color: isOpen ? GOLD : "#9A9590",
          }}
        >
          <ChevronDownIcon size={16} />
        </div>
      </button>

      {/* ── Card body ── */}
      {isOpen && (
        <div className="px-6 pb-6" style={{ borderTop: "1px solid #F0EBE0" }}>
          {/* Personal information section */}
          <div className="pt-5 mb-5">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(198,161,91,0.1)" }}
              >
                <UserIcon size={13} />
              </div>
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: GOLD }}
              >
                Personal Information
              </span>
            </div>

            <div
              className="text-xs px-3 py-2.5 rounded-xl mb-4 flex items-start gap-2"
              style={{
                background: "rgba(198,161,91,0.07)",
                border: "1px solid rgba(198,161,91,0.2)",
                color: "#6F6B63",
              }}
            >
              <InfoIcon size={12} />
              Names must exactly match the traveller's passport or legal ID.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FL
                label="Legal First Name"
                required
                error={showErrors && !data.firstName ? "Required" : undefined}
              >
                <input
                  type="text"
                  value={data.firstName}
                  placeholder="As on passport"
                  onChange={(e) => onUpdate({ firstName: e.target.value })}
                  onFocus={fo("fn")}
                  onBlur={fb}
                  style={inputStyle(
                    focused === "fn",
                    showErrors && !data.firstName,
                  )}
                />
              </FL>
              <FL
                label="Legal Last Name"
                required
                error={showErrors && !data.lastName ? "Required" : undefined}
              >
                <input
                  type="text"
                  value={data.lastName}
                  placeholder="As on passport"
                  onChange={(e) => onUpdate({ lastName: e.target.value })}
                  onFocus={fo("ln")}
                  onBlur={fb}
                  style={inputStyle(
                    focused === "ln",
                    showErrors && !data.lastName,
                  )}
                />
              </FL>
              <FL
                label="Date of Birth"
                required
                error={showErrors && !data.dob ? "Required" : undefined}
              >
                <input
                  type="date"
                  value={data.dob}
                  onChange={(e) => onUpdate({ dob: e.target.value })}
                  onFocus={fo("dob")}
                  onBlur={fb}
                  style={inputStyle(focused === "dob", showErrors && !data.dob)}
                />
              </FL>
              <FL
                label="Gender"
                required
                error={showErrors && !data.gender ? "Required" : undefined}
              >
                <SelectWrapper>
                  <select
                    value={data.gender}
                    onChange={(e) => onUpdate({ gender: e.target.value })}
                    onFocus={fo("gender")}
                    onBlur={fb}
                    style={{
                      ...selectStyle(
                        focused === "gender",
                        showErrors && !data.gender,
                      ),
                      color: data.gender ? "#0B0B0B" : "#9A9590",
                    }}
                  >
                    <option value="" disabled>
                      Select gender
                    </option>
                    {GENDERS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </SelectWrapper>
              </FL>
            </div>
          </div>

          <div className="h-px mb-5" style={{ background: "#F0EBE0" }} />

          {/* Passport section */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(198,161,91,0.1)" }}
              >
                <svg
                  width={13}
                  height={13}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={GOLD}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2z" />
                  <circle cx="12" cy="11" r="3" />
                  <line x1="8" y1="17" x2="16" y2="17" />
                </svg>
              </div>
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: GOLD }}
              >
                Passport Details
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FL
                label="Nationality"
                required
                error={showErrors && !data.nationality ? "Required" : undefined}
              >
                <SelectWrapper>
                  <select
                    value={data.nationality}
                    onChange={(e) => onUpdate({ nationality: e.target.value })}
                    onFocus={fo("nat")}
                    onBlur={fb}
                    style={{
                      ...selectStyle(
                        focused === "nat",
                        showErrors && !data.nationality,
                      ),
                      color: data.nationality ? "#0B0B0B" : "#9A9590",
                    }}
                  >
                    <option value="" disabled>
                      Select nationality
                    </option>
                    {NATIONALITIES.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </SelectWrapper>
              </FL>
              <FL
                label="Passport Number"
                required
                error={showErrors && !data.passportNum ? "Required" : undefined}
              >
                <input
                  type="text"
                  value={data.passportNum}
                  placeholder="e.g. GH1234567"
                  onChange={(e) =>
                    onUpdate({ passportNum: e.target.value.toUpperCase() })
                  }
                  onFocus={fo("pp")}
                  onBlur={fb}
                  style={{
                    ...inputStyle(
                      focused === "pp",
                      showErrors && !data.passportNum,
                    ),
                    fontFamily: "monospace",
                    letterSpacing: "0.08em",
                  }}
                />
              </FL>
              <FL
                label="Passport Expiry"
                required
                error={
                  showErrors && !data.passportExpiry ? "Required" : undefined
                }
              >
                <input
                  type="date"
                  value={data.passportExpiry}
                  onChange={(e) => onUpdate({ passportExpiry: e.target.value })}
                  onFocus={fo("pe")}
                  onBlur={fb}
                  style={inputStyle(
                    focused === "pe",
                    showErrors && !data.passportExpiry,
                  )}
                />
              </FL>
            </div>
          </div>

          <div className="h-px mb-5" style={{ background: "#F0EBE0" }} />

          {/* Dietary & Accessibility */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(198,161,91,0.1)" }}
              >
                <svg
                  width={13}
                  height={13}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={GOLD}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 2l1.5 15.5a2 2 0 002 1.5h11a2 2 0 002-1.5L21 2" />
                  <path d="M12 2v8" />
                  <path d="M8 2c0 4 4 6 4 6s4-2 4-6" />
                </svg>
              </div>
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: GOLD }}
              >
                Dietary & Accessibility
              </span>
            </div>

            <FL label="Dietary Requirements">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {DIETARY.map((item) => {
                  const checked = data.dietary.includes(item)
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleDietary(item)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs text-left transition-all"
                      style={{
                        border: `1.5px solid ${checked ? GOLD : "#E6DFD2"}`,
                        background: checked
                          ? "rgba(198,161,91,0.08)"
                          : "#FAFAF8",
                        cursor: "pointer",
                        color: checked ? "#0B0B0B" : "#6F6B63",
                      }}
                    >
                      <div
                        className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                        style={{
                          background: checked ? GOLD : "transparent",
                          border: `1.5px solid ${checked ? GOLD : "#D6D0C8"}`,
                        }}
                      >
                        {checked && <CheckIcon size={8} />}
                      </div>
                      <span className="leading-tight">{item}</span>
                    </button>
                  )
                })}
              </div>
            </FL>

            <div className="mt-4">
              <FL label="Accessibility or Medical Needs">
                <SelectWrapper>
                  <select
                    value={data.accessibility}
                    onChange={(e) =>
                      onUpdate({ accessibility: e.target.value })
                    }
                    onFocus={fo("acc")}
                    onBlur={fb}
                    style={selectStyle(focused === "acc")}
                  >
                    {ACCESSIBILITY.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </SelectWrapper>
              </FL>
              {data.accessibility !== "None required" && (
                <div className="mt-3">
                  <FL label="Please describe your needs">
                    <textarea
                      value={data.accessibilityNote}
                      onChange={(e) =>
                        onUpdate({ accessibilityNote: e.target.value })
                      }
                      onFocus={fo("accNote")}
                      onBlur={fb}
                      placeholder="Provide any additional details that will help us support you…"
                      rows={3}
                      style={{
                        ...inputStyle(focused === "accNote"),
                        resize: "none",
                        lineHeight: 1.6,
                      }}
                    />
                  </FL>
                </div>
              )}
            </div>
          </div>

          {/* Primary contact — lead traveller only */}
          {traveller.isPrimary && (
            <>
              <div className="h-px mb-5" style={{ background: "#F0EBE0" }} />
              <div className="mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(198,161,91,0.1)" }}
                  >
                    <PhoneIcon2 size={13} />
                  </div>
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: GOLD }}
                  >
                    Primary Contact
                  </span>
                </div>
                <p className="text-xs mb-4 ml-8" style={{ color: "#9A9590" }}>
                  All booking confirmations and updates will be sent to these
                  details.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <FL
                    label="Email Address"
                    required
                    error={showErrors && !data.email ? "Required" : undefined}
                  >
                    <div className="relative">
                      <div
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{
                          color: focused === "email" ? GOLD : "#9A9590",
                        }}
                      >
                        <MailIcon2 size={13} />
                      </div>
                      <input
                        type="email"
                        value={data.email}
                        placeholder="you@example.com"
                        onChange={(e) => onUpdate({ email: e.target.value })}
                        onFocus={fo("email")}
                        onBlur={fb}
                        style={{
                          ...inputStyle(
                            focused === "email",
                            showErrors && !data.email,
                          ),
                          paddingLeft: 34,
                        }}
                      />
                    </div>
                  </FL>

                  <FL
                    label="Phone Number"
                    required
                    error={showErrors && !data.phone ? "Required" : undefined}
                  >
                    <div className="flex gap-2">
                      <SelectWrapper>
                        <select
                          value={data.phoneCode}
                          onChange={(e) =>
                            onUpdate({ phoneCode: e.target.value })
                          }
                          onFocus={fo("pc")}
                          onBlur={fb}
                          style={{
                            ...selectStyle(focused === "pc"),
                            width: 100,
                            paddingRight: 28,
                          }}
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={`${c.flag}-${c.code}`} value={c.code}>
                              {c.flag} {c.code}
                            </option>
                          ))}
                        </select>
                      </SelectWrapper>
                      <input
                        type="tel"
                        value={data.phone}
                        placeholder="55 012 3456"
                        onChange={(e) => onUpdate({ phone: e.target.value })}
                        onFocus={fo("phone")}
                        onBlur={fb}
                        style={{
                          ...inputStyle(
                            focused === "phone",
                            showErrors && !data.phone,
                          ),
                          flex: 1,
                        }}
                      />
                    </div>
                  </FL>
                </div>

                {/* Emergency contact */}
                <div
                  className="p-4 rounded-xl mb-1"
                  style={{ background: "#F8F4EA", border: "1px solid #EDE8E0" }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <svg
                      width={13}
                      height={13}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={GOLD}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.4 10.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012.31 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.06 6.06l1.27-.76a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                    </svg>
                    <span
                      className="text-xs font-bold"
                      style={{ color: "#6F6B63" }}
                    >
                      Emergency Contact
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <FL
                      label="Full Name"
                      required
                      error={
                        showErrors && !data.emergencyName
                          ? "Required"
                          : undefined
                      }
                    >
                      <input
                        type="text"
                        value={data.emergencyName}
                        placeholder="e.g. Kwame Owusu"
                        onChange={(e) =>
                          onUpdate({ emergencyName: e.target.value })
                        }
                        onFocus={fo("en")}
                        onBlur={fb}
                        style={inputStyle(
                          focused === "en",
                          showErrors && !data.emergencyName,
                        )}
                      />
                    </FL>
                    <FL
                      label="Phone Number"
                      required
                      error={
                        showErrors && !data.emergencyPhone
                          ? "Required"
                          : undefined
                      }
                    >
                      <input
                        type="tel"
                        value={data.emergencyPhone}
                        placeholder="+233 50 000 0000"
                        onChange={(e) =>
                          onUpdate({ emergencyPhone: e.target.value })
                        }
                        onFocus={fo("ep")}
                        onBlur={fb}
                        style={inputStyle(
                          focused === "ep",
                          showErrors && !data.emergencyPhone,
                        )}
                      />
                    </FL>
                    <FL label="Relationship">
                      <input
                        type="text"
                        value={data.emergencyRelation}
                        placeholder="e.g. Spouse, Parent"
                        onChange={(e) =>
                          onUpdate({ emergencyRelation: e.target.value })
                        }
                        onFocus={fo("er")}
                        onBlur={fb}
                        style={inputStyle(focused === "er")}
                      />
                    </FL>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function BookingTravellersPage({
  onNavigate,
}: {
  onNavigate: (p: Page) => void
}) {
  const [openIdx, setOpenIdx] = useState<number>(0)
  const [travellers, setTravellers] = useState<TravellerData[]>(
    DEMO_TRAVELLERS.map(emptyTraveller),
  )
  const [showErrors, setShowErrors] = useState(false)
  const topRef = useRef<HTMLDivElement>(null)

  const update = (idx: number, patch: Partial<TravellerData>) =>
    setTravellers((prev) =>
      prev.map((t, i) => (i === idx ? { ...t, ...patch } : t)),
    )

  const allComplete = travellers.every((t, i) =>
    isComplete(t, DEMO_TRAVELLERS[i].isPrimary),
  )

  const handleContinue = () => {
    setShowErrors(true)
    if (!allComplete) {
      // Open the first incomplete card
      const firstIncomplete = travellers.findIndex(
        (t, i) => !isComplete(t, DEMO_TRAVELLERS[i].isPrimary),
      )
      if (firstIncomplete !== -1) setOpenIdx(firstIncomplete)
      return
    }
    onNavigate("booking-addons")
  }

  const completedCount = travellers.filter((t, i) =>
    isComplete(t, DEMO_TRAVELLERS[i].isPrimary),
  ).length

  return (
    <div
      className="min-h-screen"
      style={{ background: "#F8F4EA", fontFamily: "var(--font-sans)" }}
      ref={topRef}
    >
      {/* ── Header ── */}
      <div style={{ background: "#0B0B0B", borderBottom: "1px solid #1A1A1A" }}>
        <div
          className="mx-auto px-4 py-4 flex items-center gap-4"
          style={{ maxWidth: 1100 }}
        >
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2.5 flex-shrink-0"
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm"
              style={{ background: GOLD, color: "#0B0B0B" }}
            >
              K
            </div>
            <span
              className="font-serif font-bold text-white hidden sm:block"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              KOBANI
            </span>
          </button>
          <div className="w-px h-5 mx-1" style={{ background: "#2A2A2A" }} />
          <div
            className="flex items-center gap-1.5 text-xs"
            style={{ color: "#6F6B63" }}
          >
            <LockIcon size={13} />
            <span>Secure Booking</span>
          </div>
          <div className="flex-1 flex justify-center px-4">
            <Stepper current={2} />
          </div>
          <button
            onClick={() => onNavigate("booking")}
            className="flex-shrink-0 text-xs font-medium transition-colors items-center gap-1 hidden sm:flex"
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
            <ArrowLeftIcon size={11} /> Step 1
          </button>
        </div>
      </div>

      {/* ── Page title ── */}
      <div className="px-4 pt-8 pb-4 mx-auto" style={{ maxWidth: 1100 }}>
        <div
          className="flex items-center gap-2 text-xs mb-2"
          style={{ color: "#9A9590" }}
        >
          <span>Book</span>
          <span>›</span>
          <span>Tour Details</span>
          <span>›</span>
          <span style={{ color: GOLD }}>Travellers</span>
        </div>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1
              className="font-serif font-bold text-2xl sm:text-3xl"
              style={{ fontFamily: "var(--font-serif)", color: "#0B0B0B" }}
            >
              Traveller Information
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6F6B63" }}>
              We need passport-accurate details for each traveller. All
              information is encrypted.
            </p>
          </div>
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl flex-shrink-0"
            style={{ background: "#FFFFFF", border: "1.5px solid #E6DFD2" }}
          >
            <span className="text-xs" style={{ color: "#9A9590" }}>
              Completed
            </span>
            <span
              className="font-serif font-bold text-sm"
              style={{
                fontFamily: "var(--font-serif)",
                color: completedCount === travellers.length ? "#27855C" : GOLD,
              }}
            >
              {completedCount} / {travellers.length}
            </span>
          </div>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="px-4 pb-16 mx-auto" style={{ maxWidth: 1100 }}>
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* ── LEFT: traveller cards ── */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Progress bar */}
            <div>
              <div
                className="flex items-center justify-between text-xs mb-1.5"
                style={{ color: "#9A9590" }}
              >
                <span>
                  {completedCount} of {travellers.length} travellers complete
                </span>
                <span>
                  {Math.round((completedCount / travellers.length) * 100)}%
                </span>
              </div>
              <div
                className="w-full h-1.5 rounded-full overflow-hidden"
                style={{ background: "#E6DFD2" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(completedCount / travellers.length) * 100}%`,
                    background:
                      completedCount === travellers.length ? "#27855C" : GOLD,
                  }}
                />
              </div>
            </div>

            {/* Traveller cards */}
            {DEMO_TRAVELLERS.map((t, i) => (
              <TravellerCard
                key={i}
                index={i}
                traveller={t}
                data={travellers[i]}
                onUpdate={(patch) => update(i, patch)}
                isOpen={openIdx === i}
                onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
                showErrors={showErrors}
              />
            ))}

            {/* Privacy notice */}
            <div
              className="rounded-2xl p-5"
              style={{ background: "#FFFFFF", border: "1.5px solid #E6DFD2" }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    background: "rgba(198,161,91,0.1)",
                    border: "1px solid rgba(198,161,91,0.2)",
                  }}
                >
                  <ShieldIcon size={15} />
                </div>
                <div>
                  <div
                    className="font-bold text-sm mb-1.5"
                    style={{ color: "#0B0B0B" }}
                  >
                    Privacy & Data Security Notice
                  </div>
                  <p
                    className="text-xs leading-relaxed mb-3"
                    style={{ color: "#6F6B63" }}
                  >
                    All personal data you provide — including passport details,
                    medical information, and contact details — is processed in
                    accordance with our{" "}
                    <a href="/privacy-policy" style={{ color: GOLD, fontWeight: 600 }}>
                      Privacy Policy
                    </a>{" "}
                    and the Ghana Data Protection Act 2012.
                  </p>
                  <div className="space-y-1.5">
                    {[
                      "Your data is encrypted at rest and in transit using 256-bit AES-SSL.",
                      "Passport and medical details are shared only with tour operators and relevant authorities.",
                      "You may request deletion of your data at any time by contacting info@kobanitours.com.",
                      "We never sell or rent your personal information to third parties.",
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-xs"
                        style={{ color: "#6F6B63" }}
                      >
                        <div
                          className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{
                            background: "rgba(39,133,92,0.12)",
                            border: "1px solid rgba(39,133,92,0.3)",
                          }}
                        >
                          <CheckIcon size={7} />
                        </div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Back / Continue */}
            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate("booking")}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: "#FFFFFF",
                  border: "1.5px solid #E6DFD2",
                  color: "#6F6B63",
                  cursor: "pointer",
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
                <ArrowLeftIcon size={14} /> Back
              </button>

              <button
                onClick={handleContinue}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: allComplete ? GOLD : "#EDE8E0",
                  color: allComplete ? "#0B0B0B" : "#B8B0A4",
                  cursor: allComplete ? "pointer" : "default",
                }}
                onMouseEnter={(e) => {
                  if (allComplete)
                    (e.currentTarget as HTMLElement).style.background =
                      "#D9B96E"
                }}
                onMouseLeave={(e) => {
                  if (allComplete)
                    (e.currentTarget as HTMLElement).style.background = GOLD
                }}
              >
                Save & Continue to Add-ons
                <ArrowRightIcon size={14} />
              </button>
            </div>

            {showErrors && !allComplete && (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs"
                style={{
                  background: "rgba(200,74,74,0.07)",
                  border: "1.5px solid rgba(200,74,74,0.2)",
                  color: "#C84A4A",
                }}
              >
                <InfoIcon size={12} />
                Please complete all required fields for every traveller before
                continuing.
              </div>
            )}
          </div>

          {/* ── RIGHT: booking summary ── */}
          <div className="w-full lg:w-72 xl:w-[310px] flex-shrink-0 lg:sticky lg:top-6 space-y-4">
            {/* Summary card */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "#FFFFFF",
                border: "1.5px solid #E6DFD2",
                boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
              }}
            >
              <div className="relative h-32 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&h=220&fit=crop&auto=format"
                  alt="Tour"
                  className="w-full h-full object-cover"
                  style={{ filter: "brightness(0.6)" }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(11,11,11,0.85) 0%, transparent 55%)",
                  }}
                />
                <div className="absolute bottom-3 left-4 right-4">
                  <div
                    className="font-serif font-bold text-white text-sm leading-snug"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {TOUR_SUMMARY.name}
                  </div>
                </div>
              </div>

              <div className="px-5 py-4 space-y-3">
                <div
                  className="flex items-center gap-2 text-xs"
                  style={{ color: "#6F6B63" }}
                >
                  <ClockIcon size={12} /> {TOUR_SUMMARY.date}
                </div>
                <div
                  className="flex items-center gap-2 text-xs"
                  style={{ color: "#6F6B63" }}
                >
                  <MapPinIcon size={12} /> {TOUR_SUMMARY.duration} · Ghana
                </div>

                <div
                  className="pt-1 space-y-2"
                  style={{ borderTop: "1px solid #F0EBE0" }}
                >
                  {[
                    {
                      label: `Adults × ${TOUR_SUMMARY.adults}`,
                      val: `$${(TOUR_SUMMARY.adults * 890).toLocaleString()}`,
                    },
                    {
                      label: `Children × ${TOUR_SUMMARY.children}`,
                      val: "$590",
                    },
                    { label: TOUR_SUMMARY.tourType, val: "Included" },
                  ].map((r) => (
                    <div key={r.label} className="flex justify-between text-xs">
                      <span style={{ color: "#9A9590" }}>{r.label}</span>
                      <span
                        className="font-semibold"
                        style={{ color: "#0B0B0B" }}
                      >
                        {r.val}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  className="pt-2 flex justify-between items-center"
                  style={{ borderTop: "1px solid #F0EBE0" }}
                >
                  <span
                    className="text-xs font-bold"
                    style={{ color: "#0B0B0B" }}
                  >
                    Total
                  </span>
                  <span
                    className="font-serif font-bold text-base"
                    style={{
                      fontFamily: "var(--font-serif)",
                      color: "#0B0B0B",
                    }}
                  >
                    ${TOUR_SUMMARY.total.toLocaleString()}
                  </span>
                </div>

                <div
                  className="px-4 py-3 rounded-xl"
                  style={{ background: "#0B0B0B" }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs" style={{ color: "#9A9590" }}>
                      Deposit due today
                    </span>
                    <span
                      className="font-serif font-bold"
                      style={{ fontFamily: "var(--font-serif)", color: GOLD }}
                    >
                      ${TOUR_SUMMARY.deposit.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress mini card */}
            <div
              className="rounded-2xl p-4"
              style={{ background: "#FFFFFF", border: "1px solid #E6DFD2" }}
            >
              <div
                className="text-xs font-bold mb-3"
                style={{ color: "#6F6B63" }}
              >
                Traveller Progress
              </div>
              <div className="space-y-2">
                {DEMO_TRAVELLERS.map((t, i) => {
                  const done = isComplete(travellers[i], t.isPrimary)
                  const name = travellers[i].firstName || `Traveller ${i + 1}`
                  return (
                    <button
                      key={i}
                      onClick={() => setOpenIdx(i)}
                      className="w-full flex items-center gap-3 text-left transition-all px-3 py-2.5 rounded-xl"
                      style={{
                        background:
                          openIdx === i
                            ? "rgba(198,161,91,0.07)"
                            : "transparent",
                        border: `1px solid ${
                          openIdx === i
                            ? "rgba(198,161,91,0.25)"
                            : "transparent"
                        }`,
                        cursor: "pointer",
                      }}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                        style={{
                          background: done
                            ? "#27855C"
                            : openIdx === i
                              ? GOLD
                              : "#F0EBE0",
                          color: done
                            ? "#FFFFFF"
                            : openIdx === i
                              ? "#0B0B0B"
                              : "#9A9590",
                        }}
                      >
                        {done ? <CheckIcon size={9} /> : i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className="text-xs font-semibold truncate"
                          style={{ color: "#0B0B0B" }}
                        >
                          {name}
                        </div>
                        <div className="text-xs" style={{ color: "#9A9590" }}>
                          {t.label}
                        </div>
                      </div>
                      {done && (
                        <span
                          className="text-xs font-bold flex-shrink-0"
                          style={{ color: "#27855C" }}
                        >
                          ✓
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Help */}
            <div
              className="rounded-2xl px-5 py-4 text-center"
              style={{ background: "#FFFFFF", border: "1px solid #E6DFD2" }}
            >
              <p className="text-xs" style={{ color: "#9A9590" }}>
                Questions about required documents?{" "}
                <button
                  onClick={() => onNavigate("contact")}
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
                  Ask us →
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
