import { useState } from "react"
import type { Page } from "./App"
import { ApiError, marketApi } from "./api"
import { readCart } from "./marketCart"
const inp = "admin-input w-full"
export default function MarketCheckoutPage({
  onNavigate,
}: {
  onNavigate: (p: Page) => void
}) {
  const items = readCart()
  const [form, setForm] = useState({
      phone: "",
      first_name: "",
      last_name: "",
      street: "",
      city: "",
      region: "Greater Accra",
      country: "Ghana",
      postal_code: "",
      fulfilment: "delivery",
      notes: "",
    }),
    [terms, setTerms] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("")
  const update = (k: string, v: string) => setForm((x) => ({ ...x, [k]: v }))
  const pay = async () => {
    if (!terms)
      return setError("Please accept the Terms of Sale and Privacy Policy.")
    if (!items.length) return setError("Your cart is empty.")
    setBusy(true)
    setError("")
    try {
      const r = await marketApi.checkout({
        items: items.map((x) => ({
          product_id: x.product.id,
          quantity: x.quantity,
          variant: x.variant,
        })),
        phone: form.phone,
        fulfilment: form.fulfilment,
        notes: form.notes,
        delivery_address: {
          first_name: form.first_name,
          last_name: form.last_name,
          street: form.street,
          city: form.city,
          region: form.region,
          country: form.country,
          postal_code: form.postal_code,
        },
      })
      window.location.assign(r.data.authorization_url)
    } catch (e) {
      setError(
        e instanceof ApiError && e.code === "UNAUTHORIZED"
          ? "Please sign in to your customer account before checkout."
          : e instanceof ApiError
            ? e.code.replaceAll("_", " ")
            : "Checkout could not be started.",
      )
    } finally {
      setBusy(false)
    }
  }
  return (
    <main className="min-h-screen bg-[#F8F4EA] px-4 py-10">
      <div className="max-w-[850px] mx-auto">
        <button onClick={() => onNavigate("market-cart")}>
          ← Back to cart
        </button>
        <h1 className="font-serif text-4xl font-bold mt-5">Secure checkout</h1>
        <p className="text-sm text-[#666] mt-2">
          Payment is completed on Paystack in GHS. Products priced in USD are
          converted using the exchange rate configured by the administrator.
          KOBANI never receives or stores your card details.
        </p>
        <div className="bg-white border rounded-2xl p-6 mt-7 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              className={inp}
              placeholder="First name"
              value={form.first_name}
              onChange={(e) => update("first_name", e.target.value)}
            />
            <input
              className={inp}
              placeholder="Last name"
              value={form.last_name}
              onChange={(e) => update("last_name", e.target.value)}
            />
            <input
              className={inp}
              placeholder="Phone number"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
            <select
              className={inp}
              value={form.fulfilment}
              onChange={(e) => update("fulfilment", e.target.value)}
            >
              <option value="delivery">Delivery</option>
              <option value="pickup">Pickup from Amasaman</option>
            </select>
          </div>
          {form.fulfilment === "delivery" && (
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                className={`${inp} sm:col-span-2`}
                placeholder="Street address"
                value={form.street}
                onChange={(e) => update("street", e.target.value)}
              />
              <input
                className={inp}
                placeholder="City"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
              />
              <input
                className={inp}
                placeholder="Region"
                value={form.region}
                onChange={(e) => update("region", e.target.value)}
              />
              <input
                className={inp}
                placeholder="Country"
                value={form.country}
                onChange={(e) => update("country", e.target.value)}
              />
              <input
                className={inp}
                placeholder="Postal code"
                value={form.postal_code}
                onChange={(e) => update("postal_code", e.target.value)}
              />
            </div>
          )}
          <textarea
            className={`${inp} min-h-24`}
            placeholder="Order notes (optional)"
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
          />
          <label className="flex gap-2 text-sm">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
            />
            I agree to the Terms of Sale and Privacy Policy.
          </label>
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-red-700 text-sm">
              {error}
              {error.startsWith("Please sign in") && (
                <button
                  onClick={() => onNavigate("login")}
                  className="underline ml-2"
                >
                  Sign in
                </button>
              )}
            </div>
          )}
          <button
            disabled={busy}
            onClick={pay}
            className="admin-gold w-full disabled:opacity-50"
          >
            {busy ? "Connecting to Paystack…" : "Pay securely with Paystack"}
          </button>
        </div>
      </div>
    </main>
  )
}
