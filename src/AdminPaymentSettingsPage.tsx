import { useEffect, useState } from "react"
import type { Page } from "./App"
import {
  ApiError,
  paymentSettingsApi,
  type PaymentSettings,
  type PaymentSettingsAudit,
} from "./api"
import { AdminShell } from "./AdminProductsPage"
const input = "admin-input w-full"
const message = (e: unknown, fallback: string) =>
  e instanceof ApiError ? e.code.replaceAll("_", " ") : fallback
export default function AdminPaymentSettingsPage({
  onNavigate,
}: {
  onNavigate: (p: Page) => void
}) {
  const [current, setCurrent] = useState<PaymentSettings>(),
    [events, setEvents] = useState<PaymentSettingsAudit[]>([]),
    [form, setForm] = useState({
      enabled: false,
      usd_to_ghs_rate: "12",
      public_key: "",
      secret_key: "",
    }),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(""),
    [loading, setLoading] = useState(true)
  const load = async () => {
    setLoading(true)
    try {
      const [s, a] = await Promise.all([
        paymentSettingsApi.get(),
        paymentSettingsApi.audit(),
      ])
      const settings = s?.data?.settings
      if (!settings) throw new Error("INVALID_SETTINGS_RESPONSE")
      setCurrent(settings)
      setEvents(Array.isArray(a?.data?.events) ? a.data.events : [])
      setForm((x) => ({
        ...x,
        enabled: Boolean(settings.enabled),
        usd_to_ghs_rate: settings.usd_to_ghs_rate || "12",
        public_key: "",
        secret_key: "",
      }))
    } catch (e) {
      setNotice(
        message(
          e,
          "Payment settings are temporarily unavailable. Confirm the backend deployment is current.",
        ),
      )
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    load()
  }, [])
  const save = async () => {
    if (!Number.isFinite(Number(form.usd_to_ghs_rate)) || Number(form.usd_to_ghs_rate) <= 0)
      return setNotice("Enter a valid USD to GHS exchange rate.")
    if (
      form.enabled &&
      !current?.secret_key_configured &&
      (!form.secret_key || !form.public_key)
    )
      return setNotice(
        "Enter both Paystack keys when enabling payments for the first time.",
      )
    setBusy(true)
    setNotice("")
    try {
      await paymentSettingsApi.update(form)
      setNotice("Payment settings changed successfully. The change was added to the audit history.")
      await load()
    } catch (e: unknown) {
      setNotice(message(e, "Payment settings were not changed."))
    } finally {
      setBusy(false)
    }
  }
  return (
    <AdminShell
      title="Payment Settings"
      active="Payment Settings"
      onNavigate={onNavigate}
    >
      <div>
        <p className="eyebrow">Secure administration</p>
        <h1 className="page-title">Payment Settings</h1>
        <p className="sub">
          Paystack always charges GHS. USD catalogue prices are converted using
          the controlled rate below.
        </p>
      </div>
      {notice && (
        <div
          role="alert"
          className="my-5 rounded-xl border bg-white p-4 text-sm"
        >
          {notice}
        </div>
      )}
      {loading ? (
        <div className="mt-6 h-64 rounded-2xl bg-white/70 animate-pulse" />
      ) : (
        <div className="grid xl:grid-cols-[1fr_420px] gap-6 mt-6">
          <section className="bg-white border rounded-2xl p-6">
            <div className="flex justify-between gap-3">
              <div>
                <h2 className="font-serif text-2xl font-bold">
                  Paystack configuration
                </h2>
                <p className="text-xs text-[#777] mt-1">
                  Keys are encrypted and never returned by the API.
                </p>
              </div>
              <span className={`pill ${current?.enabled ? "success" : "neutral"}`}>{current?.enabled ? "Paystack On" : "Paystack Off"}</span>
            </div>
            <div className="grid md:grid-cols-2 gap-5 mt-6">
              <label className="rounded-xl border p-4 flex items-center justify-between gap-4">
                <span><b className="block">Enable Paystack</b><small className="text-[#777]">Turn customer Paystack payments on or off.</small></span>
                <input type="checkbox" className="w-5 h-5 accent-[#C6A15B]" checked={form.enabled} onChange={(e) => setForm((x) => ({ ...x, enabled: e.target.checked }))} />
              </label>
              <label>
                USD to GHS exchange rate
                <input className={input} type="number" min="0.0001" step="0.0001" value={form.usd_to_ghs_rate} onChange={(e)=>setForm((x)=>({...x,usd_to_ghs_rate:e.target.value}))}/>
                <small className="text-[#777]">Example: 1 USD = {form.usd_to_ghs_rate || "0"} GHS</small>
              </label>
              <label>
                Paystack public key
                <input
                  className={input}
                  type="password"
                  autoComplete="new-password"
                  placeholder={
                    current?.public_key_masked || "pk_test_… or pk_live_…"
                  }
                  value={form.public_key}
                  onChange={(e) =>
                    setForm((x) => ({ ...x, public_key: e.target.value }))
                  }
                />
              </label>
              <label>
                Paystack secret key
                <input
                  className={input}
                  type="password"
                  autoComplete="new-password"
                  placeholder={
                    current?.secret_key_masked || "sk_test_… or sk_live_…"
                  }
                  value={form.secret_key}
                  onChange={(e) =>
                    setForm((x) => ({ ...x, secret_key: e.target.value }))
                  }
                />
              </label>
            </div>
            <div className="mt-6 rounded-xl border border-[#C6A15B]/40 bg-[#C6A15B]/10 p-4 text-sm"><b>Settlement rule</b><p className="mt-1">GHS tours and products are charged unchanged. USD tours and products are multiplied by this rate, and the resulting GHS amount is sent to Paystack.</p></div>
            <button disabled={busy} onClick={save} className="admin-gold w-full mt-8 disabled:opacity-40">
              {busy ? "Saving changes…" : "Save Payment Settings"}
            </button>
          </section>
          <aside className="space-y-5">
            <section className="bg-[#111] text-white rounded-2xl p-5">
              <p className="eyebrow text-[#C6A15B]">Current source</p>
              <h2 className="font-serif text-xl">
                {current?.source === "admin_settings"
                  ? "Admin encrypted settings"
                  : "Render environment"}
              </h2>
              <p className="text-xs mt-4">
                Public key: {current?.public_key_masked || "Not configured"}
              </p>
              <p className="text-xs">
                Secret key: {current?.secret_key_masked || "Not configured"}
              </p>
              <p className="text-xs">Paystack currency: GHS</p>
              <p className="text-xs">1 USD = {current?.usd_to_ghs_rate || "12"} GHS</p>
            </section>
            <section className="bg-white border rounded-2xl p-5">
              <h2 className="font-serif text-xl">Change history</h2>
              <div className="mt-4 space-y-3">
                {events.map((e) => (
                  <article className="border rounded-xl p-3" key={e.id}>
                    <b>{e.admin_name || e.admin_email || "Administrator"}</b>
                    <p className="text-xs">
                      {e.created_at
                        ? new Date(e.created_at).toLocaleString()
                        : "Unknown time"}
                    </p>
                    <p className="text-xs">
                      Changed:{" "}
                      {(e.changed_fields || []).join(", ") || "Settings"}
                    </p>
                    {e.ip_address && <p className="text-xs">IP: {e.ip_address}</p>}
                  </article>
                ))}
                {!events.length && (
                  <p className="text-sm text-[#777]">
                    No admin changes recorded.
                  </p>
                )}
              </div>
            </section>
          </aside>
        </div>
      )}
    </AdminShell>
  )
}
