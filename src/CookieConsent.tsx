import { useEffect, useRef, useState } from "react";
import { API_BASE } from "./api";
const base = API_BASE;
type Choice = { necessary: true; analytics: boolean; functional: boolean };
type SavedChoice = Choice & { version: string };
const CONSENT_KEY = "kobani:cookie-consent";
const readSavedChoice = (): SavedChoice | null => {
  try {
    const value = JSON.parse(localStorage.getItem(CONSENT_KEY) || "null");
    return value?.necessary === true && typeof value.analytics === "boolean" && typeof value.functional === "boolean" && typeof value.version === "string" ? value : null;
  } catch {
    return null;
  }
};
const saveChoice = (version: string, choice: Choice) => {
  try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ version, ...choice })); } catch { /* Storage can be unavailable in hardened privacy modes. */ }
};
const send = async (path: string, body?: unknown) =>
  fetch(base + path, {
    method: body ? "POST" : "GET",
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  }).then((r) => r.json());
export default function CookieConsent({ page }: { page: string }) {
  const [visible, setVisible] = useState(false),
    [settings, setSettings] = useState(false),
    [analytics, setAnalytics] = useState(false),
    [saving, setSaving] = useState(false),
    [consentVersion, setConsentVersion] = useState("1.0");
  const milestones = useRef(new Set<number>());
  useEffect(() => {
    const saved = readSavedChoice();
    if (saved) setAnalytics(saved.analytics);
    send("/analytics/consent")
      .then((x) => {
        const version = String(x.version || "1.0");
        setConsentVersion(version);
        if (x.decided) {
          const serverChoice: Choice = { necessary: true, analytics: !!x.consent?.analytics, functional: !!x.consent?.functional };
          saveChoice(version, serverChoice);
          setAnalytics(serverChoice.analytics);
          return;
        }
        if (saved?.version === version) return;
        try { localStorage.removeItem(CONSENT_KEY); } catch { /* Ignore unavailable storage. */ }
        setTimeout(() => setVisible(true), 1800);
      })
      .catch(() => {
        if (!saved) setTimeout(() => setVisible(true), 1800);
      });
    const open = () => setSettings(true);
    window.addEventListener("kobani:cookie-settings", open);
    return () => window.removeEventListener("kobani:cookie-settings", open);
  }, []);
  const choose = async (choice: Choice) => {
    setSaving(true);
    saveChoice(consentVersion, choice);
    setAnalytics(choice.analytics);
    setVisible(false);
    setSettings(false);
    try {
      await send("/analytics/consent", choice);
    } catch {
      // The first-party choice remains authoritative for the banner when the
      // browser blocks the API's cross-site consent cookie.
    } finally {
      setSaving(false);
    }
  };
  const event = (name: string, metadata: Record<string, unknown> = {}) => {
    if (!analytics || location.pathname.startsWith("/admin")) return;
    send("/analytics/events", {
      events: [
        {
          event_id: crypto.randomUUID(),
          event_name: name,
          path: location.pathname,
          metadata,
        },
      ],
    }).catch(() => {});
  };
  useEffect(() => {
    milestones.current.clear();
    event("page_view", { page_type: page, page_title: document.title });
  }, [page, analytics]);
  useEffect(() => {
    if (!analytics) return;
    let ticking = false;
    const scroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - innerHeight;
        const p = max > 0 ? Math.round((scrollY / max) * 100) : 100;
        [25, 50, 75, 90, 100].forEach((m) => {
          if (p >= m && !milestones.current.has(m)) {
            milestones.current.add(m);
            event("scroll_depth", { scroll_percent: m });
          }
        });
        ticking = false;
      });
    };
    addEventListener("scroll", scroll, { passive: true });
    return () => removeEventListener("scroll", scroll);
  }, [analytics, page]);
  return (
    <>
      {visible && !settings && (
        <section
          role="dialog"
          aria-label="Cookie consent"
          className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-6xl rounded-2xl border border-[#C6A15B]/30 bg-[#0B0B0B] p-5 text-white shadow-2xl motion-safe:animate-[slideUp_.35s_ease-out] sm:p-6"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
            <div className="flex-1">
              <h2 className="font-serif text-2xl font-bold">
                Your privacy matters
              </h2>
              <p className="mt-2 max-w-3xl text-xs leading-6 text-white/65">
                We use necessary cookies for security and optional analytics
                cookies to understand pages viewed, article engagement and
                approximate country. Analytics remains off until you choose.
              </p>
              <div className="mt-2 flex gap-4 text-[10px]">
                <a href="/privacy-policy" className="text-[#C6A15B]">
                  Privacy Policy
                </a>
                <button
                  onClick={() => setSettings(true)}
                  className="text-[#C6A15B]"
                >
                  Customize
                </button>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:w-[360px]">
              <button
                disabled={saving}
                onClick={() =>
                  choose({
                    necessary: true,
                    analytics: false,
                    functional: false,
                  })
                }
                className="rounded-xl border border-white/20 px-4 py-3 text-xs font-bold"
              >
                Reject Non-Essential
              </button>
              <button
                disabled={saving}
                onClick={() =>
                  choose({
                    necessary: true,
                    analytics: true,
                    functional: false,
                  })
                }
                className="rounded-xl bg-[#C6A15B] px-4 py-3 text-xs font-bold text-black"
              >
                Accept All
              </button>
            </div>
          </div>
        </section>
      )}
      {settings && (
        <div
          className="fixed inset-0 z-[110] grid place-items-end bg-black/60 sm:place-items-center sm:p-5"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSettings(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-title"
            className="w-full max-w-xl rounded-t-2xl bg-[#FFFDF8] p-6 shadow-2xl sm:rounded-2xl"
          >
            <div className="flex items-center">
              <h2 id="cookie-title" className="font-serif text-2xl font-bold">
                Cookie Preferences
              </h2>
              <button
                onClick={() => setSettings(false)}
                className="ml-auto h-10 w-10 rounded-xl border"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="mt-6 space-y-3">
              <div className="rounded-xl border bg-white p-4">
                <div className="flex">
                  <b className="text-sm">Necessary Cookies</b>
                  <span className="ml-auto text-xs font-bold text-[#27855C]">
                    Always enabled
                  </span>
                </div>
                <p className="mt-2 text-xs text-[#777]">
                  Security, authentication, language and your consent choice.
                </p>
              </div>
              <label className="flex cursor-pointer rounded-xl border bg-white p-4">
                <div>
                  <b className="text-sm">Analytics Cookies</b>
                  <p className="mt-2 text-xs text-[#777]">
                    Anonymous visits, sessions, navigation, engagement, broad
                    device type and approximate country.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="ml-auto h-5 w-5 accent-[#C6A15B]"
                />
              </label>
            </div>
            <div className="mt-6 grid gap-2 sm:grid-cols-3">
              <button
                onClick={() =>
                  choose({
                    necessary: true,
                    analytics: false,
                    functional: false,
                  })
                }
                className="admin-outline"
              >
                Reject
              </button>
              <button
                onClick={() =>
                  choose({ necessary: true, analytics, functional: false })
                }
                className="admin-outline"
              >
                Save Preferences
              </button>
              <button
                onClick={() =>
                  choose({
                    necessary: true,
                    analytics: true,
                    functional: false,
                  })
                }
                className="admin-gold"
              >
                Accept All
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
