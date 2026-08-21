import { useEffect, useState } from "react"
import type { Page } from "./App"
import { ApiError, customerAccountApi, type CustomerPreferences } from "./api"
import { useAuth } from "./AuthContext"
import CustomerPortalLayout from "./CustomerPortalLayout"
import { useTranslation } from "react-i18next"

type Tab = "Security" | "Region"
const defaults: CustomerPreferences = {
  notifications: { email: true, sms: true, whatsapp: false, marketing: false },
  privacy: { analytics: true, personalization: true },
  currency: "USD",
  language: "en",
}
const errorText = (error: unknown) =>
  error instanceof ApiError
    ? error.code.replaceAll("_", " ").toLowerCase()
    : "The request could not be completed."

export default function CustomerSettingsPage({
  onNavigate,
}: {
  onNavigate: (page: Page) => void
}) {
  const { refreshUser, logout } = useAuth()
  const { i18n } = useTranslation()
  const [tab, setTab] = useState<Tab>("Security"),
    [preferences, setPreferences] = useState(defaults),
    [loading, setLoading] = useState(true),
    [saving, setSaving] = useState(false),
    [notice, setNotice] = useState(""),
    [error, setError] = useState(""),
    [current, setCurrent] = useState(""),
    [next, setNext] = useState(""),
    [confirm, setConfirm] = useState(""),
    [deleteOpen, setDeleteOpen] = useState(false),
    [deletePassword, setDeletePassword] = useState(""),
    [deleteText, setDeleteText] = useState("")
  useEffect(() => {
    customerAccountApi
      .get()
      .then((result) => setPreferences(result.data.preferences))
      .catch(() => setError("Your settings could not be loaded."))
      .finally(() => setLoading(false))
  }, [])
  const saveRegion = async () => {
    setSaving(true)
    setError("")
    try {
      const result = await customerAccountApi.updatePreferences(preferences)
      setPreferences(result.data.preferences)
      await i18n.changeLanguage(result.data.preferences.language)
      setNotice("Your regional preferences have been saved.")
      await refreshUser()
    } catch (e) {
      setError(errorText(e))
    } finally {
      setSaving(false)
    }
  }
  const changePassword = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    setNotice("")
    if (next !== confirm) {
      setError("New passwords do not match.")
      return
    }
    setSaving(true)
    try {
      await customerAccountApi.changePassword(current, next)
      setCurrent("")
      setNext("")
      setConfirm("")
      setNotice("Your password was updated successfully.")
    } catch (e) {
      setError(errorText(e))
    } finally {
      setSaving(false)
    }
  }
  const deleteAccount = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setError("")
    try {
      await customerAccountApi.deleteAccount(deletePassword, deleteText)
      await logout()
      window.history.replaceState({}, "", "/login")
      onNavigate("login")
    } catch (e) {
      setError(errorText(e))
      setSaving(false)
    }
  }
  return (
    <CustomerPortalLayout
      title="Account Settings"
      subtitle="Manage account security and regional preferences."
      active="Account Settings"
      onNavigate={onNavigate}
    >
      <main className="mx-auto max-w-[950px] p-4 sm:p-7">
        <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#C6A15B]">
          Account controls
        </p>
        <h2 className="mt-1 font-serif text-3xl font-bold">Settings</h2>
        {notice && (
          <div className="mt-5 rounded-xl bg-[#27855C]/10 px-4 py-3 text-xs text-[#27855C]">
            ✓ {notice}
          </div>
        )}
        {error && (
          <div
            role="alert"
            className="mt-5 rounded-xl bg-[#C84A4A]/10 px-4 py-3 text-xs capitalize text-[#C84A4A]"
          >
            {error}
          </div>
        )}
        <section className="mt-6 flex rounded-2xl border border-[#E6DFD2] bg-white p-2">
          {(["Security", "Region"] as Tab[]).map((value) => (
            <button
              key={value}
              onClick={() => {
                setTab(value)
                setError("")
                setNotice("")
              }}
              className={`flex-1 rounded-xl px-5 py-3 text-xs font-bold ${
                tab === value ? "bg-[#0B0B0B] text-white" : "text-[#777]"
              }`}
            >
              {value}
            </button>
          ))}
        </section>
        {loading ? (
          <div className="py-24 text-center text-sm text-[#6F6B63]">
            Loading account settings…
          </div>
        ) : (
          <>
            <section className="mt-5 rounded-2xl border border-[#E6DFD2] bg-white p-5 sm:p-7">
              {tab === "Security" ? (
                <>
                  <h3 className="font-serif text-xl font-bold">
                    Change password
                  </h3>
                  <p className="mt-1 text-[10px] text-[#9A9590]">
                    Use at least eight characters with uppercase, lowercase,
                    number and symbol.
                  </p>
                  <form
                    onSubmit={changePassword}
                    className="mt-5 grid gap-3 sm:grid-cols-3"
                  >
                    <input
                      required
                      type="password"
                      autoComplete="current-password"
                      value={current}
                      onChange={(e) => setCurrent(e.target.value)}
                      placeholder="Current password"
                      className="h-11 rounded-xl border px-3 text-xs outline-none focus:border-[#C6A15B]"
                    />
                    <input
                      required
                      type="password"
                      autoComplete="new-password"
                      value={next}
                      onChange={(e) => setNext(e.target.value)}
                      placeholder="New password"
                      className="h-11 rounded-xl border px-3 text-xs outline-none focus:border-[#C6A15B]"
                    />
                    <input
                      required
                      type="password"
                      autoComplete="new-password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Confirm new password"
                      className="h-11 rounded-xl border px-3 text-xs outline-none focus:border-[#C6A15B]"
                    />
                    <button
                      disabled={saving}
                      className="rounded-xl bg-[#0B0B0B] px-5 py-3 text-xs font-bold text-white disabled:opacity-60 sm:col-span-3 sm:w-fit"
                    >
                      {saving ? "Updating…" : "Update Password"}
                    </button>
                  </form>
                  <div className="mt-6 rounded-xl border border-[#E6DFD2] bg-[#F8F4EA] p-4">
                    <b className="text-sm">Verified account</b>
                    <p className="mt-1 text-[10px] text-[#27855C]">
                      Your email identity is verified and protected.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-serif text-xl font-bold">
                    Currency & language
                  </h3>
                  <p className="mt-1 text-[10px] text-[#9A9590]">
                    Set how regional information appears in your account.
                  </p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <label>
                      <span className="text-[10px] uppercase text-[#9A9590]">
                        Preferred currency
                      </span>
                      <select
                        value={preferences.currency}
                        onChange={(e) =>
                          setPreferences((data) => ({
                            ...data,
                            currency: e.target.value,
                          }))
                        }
                        className="mt-2 h-12 w-full rounded-xl border px-3 text-sm"
                      >
                        <option>USD</option>
                        <option>GHS</option>
                        <option>GBP</option>
                        <option>EUR</option>
                        <option>NGN</option>
                      </select>
                    </label>
                    <label>
                      <span className="text-[10px] uppercase text-[#9A9590]">
                        Language
                      </span>
                      <select
                        value={preferences.language}
                        onChange={(e) =>
                          setPreferences((data) => ({
                            ...data,
                            language: e.target.value,
                          }))
                        }
                        className="mt-2 h-12 w-full rounded-xl border px-3 text-sm"
                      >
                        <option value="en">English</option>
                        <option value="de">Deutsch</option>
                        <option value="es">Español</option>
                        <option value="zh-CN">简体中文</option>
                        <option value="fr">Français</option>
                        <option value="ru">Русский</option>
                        <option value="ar">العربية</option>
                        <option value="it">Italiano</option>
                      </select>
                    </label>
                  </div>
                  <div className="mt-4 rounded-xl bg-[#F8F4EA] p-4 text-[10px] text-[#6F6B63]">
                    Tour charges remain in each tour’s displayed transaction
                    currency. Your bank may apply conversion fees.
                  </div>
                  <button
                    disabled={saving}
                    onClick={() => void saveRegion()}
                    className="mt-5 rounded-xl bg-[#C6A15B] px-5 py-3 text-xs font-bold disabled:opacity-60"
                  >
                    {saving ? "Saving…" : "Save Regional Settings"}
                  </button>
                </>
              )}
            </section>
            <section className="mt-5 rounded-2xl border border-[#C84A4A]/30 bg-white p-5 sm:p-7">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#C84A4A]">
                Danger zone
              </p>
              <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <h3 className="font-serif text-xl font-bold">
                    Delete account
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setDeleteOpen(true)
                    setError("")
                  }}
                  className="rounded-xl bg-[#C84A4A] px-5 py-3 text-xs font-bold text-white"
                >
                  Delete Account
                </button>
              </div>
            </section>
          </>
        )}
        {deleteOpen && (
          <div
            className="fixed inset-0 z-[90] grid place-items-center bg-black/60 p-4"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget && !saving)
                setDeleteOpen(false)
            }}
          >
            <form
              onSubmit={deleteAccount}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#C84A4A]/10 text-xl text-[#C84A4A]">
                !
              </span>
              <h3 className="mt-4 text-center font-serif text-2xl font-bold">
                Delete your account?
              </h3>
              <p className="mt-2 text-center text-xs leading-5 text-[#6F6B63]">
                Enter your password and type <b>DELETE</b> to confirm.
              </p>
              <label className="mt-5 block text-xs font-bold">
                Current password
                <input
                  required
                  type="password"
                  autoComplete="current-password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="mt-1 h-11 w-full rounded-xl border px-3 outline-none focus:border-[#C84A4A]"
                />
              </label>
              <label className="mt-3 block text-xs font-bold">
                Type DELETE
                <input
                  required
                  value={deleteText}
                  onChange={(e) => setDeleteText(e.target.value)}
                  className="mt-1 h-11 w-full rounded-xl border px-3 outline-none focus:border-[#C84A4A]"
                />
              </label>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setDeleteOpen(false)}
                  className="rounded-xl border py-3 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  disabled={
                    saving || deleteText !== "DELETE" || !deletePassword
                  }
                  className="rounded-xl bg-[#C84A4A] py-3 text-xs font-bold text-white disabled:opacity-40"
                >
                  {saving ? "Deleting…" : "Confirm Delete"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </CustomerPortalLayout>
  )
}
