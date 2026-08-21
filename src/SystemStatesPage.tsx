import { useState } from "react"
import type { Page } from "./App"
import { AdminShell } from "./AdminProductsPage"
type Kind = "Empty" | "Loading" | "Errors" | "Success"
const empties = [
  [
    "No tours found",
    "No journeys match the filters you selected.",
    "Adjust Filters",
    "⌁",
  ],
  [
    "No saved tours",
    "Save journeys you love and revisit them here.",
    "Explore Tours",
    "♡",
  ],
  [
    "No bookings yet",
    "Your upcoming KOBANI journeys will appear here.",
    "Discover Tours",
    "◇",
  ],
  [
    "No product orders",
    "Your African Market orders will be shown here.",
    "Visit the Market",
    "□",
  ],
  [
    "No search results",
    "We couldn't find anything matching your search.",
    "Clear Search",
    "⌕",
  ],
  [
    "Empty shopping cart",
    "Your basket is waiting for something special.",
    "Continue Shopping",
    "♧",
  ],
  [
    "No notifications",
    "You're all caught up. New updates will appear here.",
    "View Dashboard",
    "♢",
  ],
  [
    "No transactions",
    "Payments and refunds will appear once processed.",
    "Refresh",
    "↻",
  ],
]
const errors = [
  [
    "404",
    "Page Not Found",
    "The page may have moved or the address may be incorrect.",
    "Return Home",
  ],
  [
    "500",
    "Server Error",
    "Something went wrong on our side. Please try again shortly.",
    "Try Again",
  ],
  [
    "!",
    "Payment Failed",
    "Your payment was not completed. No charge has been made.",
    "Try Another Method",
  ],
  [
    "⌁",
    "Network Error",
    "We couldn't connect. Check your internet connection and retry.",
    "Reconnect",
  ],
  [
    "⊘",
    "Access Denied",
    "You don't have permission to view this part of KOBANI.",
    "Go Back",
  ],
  [
    "◷",
    "Session Expired",
    "For your security, your session has ended. Please sign in again.",
    "Sign In",
  ],
]
const successes = [
  [
    "Payment Successful",
    "Your payment has been securely processed.",
    "View Receipt",
  ],
  [
    "Booking Confirmed",
    "Your KOBANI journey is officially confirmed.",
    "View Booking",
  ],
  [
    "Article Submitted",
    "Your story has been sent to our editorial team.",
    "Track Submission",
  ],
  ["Profile Updated", "Your personal information has been saved.", "Done"],
  [
    "Product Added",
    "The product is now available in your catalogue.",
    "View Product",
  ],
  [
    "Refund Completed",
    "Funds have been returned to the original method.",
    "View Transaction",
  ],
]
export default function SystemStatesPage({
  onNavigate,
}: {
  onNavigate: (p: Page) => void
}) {
  const [tab, setTab] = useState<Kind>("Empty")
  return (
    <AdminShell
      title="System States"
      active="System States"
      onNavigate={onNavigate}
    >
      <div className="max-w-7xl">
        <p className="eyebrow">Design system · Page 62</p>
        <h1 className="page-title">Empty, Loading & System States</h1>
        <p className="sub">
          Reusable feedback patterns for every KOBANI journey.
        </p>
        <div className="state-tabs mt-6">
          {(["Empty", "Loading", "Errors", "Success"] as Kind[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={tab === t ? "admin-gold" : "admin-outline"}
            >
              {t}
            </button>
          ))}
        </div>
        {tab === "Empty" && (
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-6">
            {empties.map((x) => (
              <StateCard
                key={x[0]}
                icon={x[3]}
                title={x[0]}
                text={x[1]}
                action={x[2]}
              />
            ))}
          </div>
        )}
        {tab === "Loading" && <LoadingStates />}
        {tab === "Errors" && (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">
            {errors.map((x) => (
              <StateCard
                key={x[1]}
                icon={x[0]}
                title={x[1]}
                text={x[2]}
                action={x[3]}
                error
              />
            ))}
          </div>
        )}
        {tab === "Success" && (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">
            {successes.map((x) => (
              <StateCard
                key={x[0]}
                icon="✓"
                title={x[0]}
                text={x[1]}
                action={x[2]}
                success
              />
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
function StateCard({
  icon,
  title,
  text,
  action,
  error,
  success,
}: {
  icon: string
  title: string
  text: string
  action: string
  error?: boolean
  success?: boolean
}) {
  return (
    <article className="system-state-card">
      <span
        className={`state-icon ${error ? "error" : success ? "success" : ""}`}
      >
        {icon}
      </span>
      <h2>{title}</h2>
      <p>{text}</p>
      <button className={success ? "admin-gold" : "admin-outline"}>
        {action}
      </button>
    </article>
  )
}
function Bone({ className }: { className: string }) {
  return <i className={`skeleton ${className}`} />
}
function LoadingStates() {
  return (
    <div className="grid lg:grid-cols-2 gap-5 mt-6">
      <section className="state-demo">
        <p className="eyebrow">Skeleton tour card</p>
        <div className="mt-4 border rounded-2xl overflow-hidden">
          <Bone className="block h-44 rounded-none" />
          <div className="p-5 space-y-3">
            <Bone className="block h-3 w-1/3" />
            <Bone className="block h-6 w-4/5" />
            <Bone className="block h-3 w-full" />
            <Bone className="block h-12 w-full mt-5" />
          </div>
        </div>
      </section>
      <section className="state-demo">
        <p className="eyebrow">Skeleton table</p>
        <div className="mt-4 border rounded-xl p-4 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div className="grid grid-cols-[40px_1fr_80px] gap-3" key={i}>
              <Bone className="block h-10 w-10" />
              <div className="space-y-2">
                <Bone className="block h-3 w-3/4" />
                <Bone className="block h-2 w-1/2" />
              </div>
              <Bone className="block h-7 w-full" />
            </div>
          ))}
        </div>
      </section>
      <section className="state-demo lg:col-span-2">
        <p className="eyebrow">Skeleton dashboard</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {[1, 2, 3, 4].map((i) => (
            <div className="border rounded-xl p-4 space-y-3" key={i}>
              <Bone className="block h-2 w-1/2" />
              <Bone className="block h-7 w-2/3" />
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-3 mt-3">
          <div className="border rounded-xl p-4">
            <Bone className="block h-48 w-full" />
          </div>
          <div className="border rounded-xl p-4 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Bone className="block h-9 w-full" key={i} />
            ))}
          </div>
        </div>
      </section>
      <section className="state-demo lg:col-span-2">
        <p className="eyebrow">Full-page loading</p>
        <div className="mt-4 h-72 bg-[#F8F4EA] rounded-2xl grid place-items-center text-center">
          <div>
            <span className="kobani-loader">
              <i>K</i>
            </span>
            <h3 className="font-serif text-xl font-bold mt-5">
              Preparing your KOBANI experience
            </h3>
            <p className="text-xs text-[#888] mt-2">
              Curating something extraordinary…
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
