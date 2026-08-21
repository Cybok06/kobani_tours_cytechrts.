import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { ChevronDownIcon, GlobeIcon } from "../icons"

const languages = [
  { code: "en", short: "EN", name: "English" },
  { code: "de", short: "DE", name: "Deutsch" },
  { code: "es", short: "ES", name: "Español" },
  { code: "zh-CN", short: "中文", name: "简体中文" },
  { code: "fr", short: "FR", name: "Français" },
  { code: "ru", short: "RU", name: "Русский" },
  { code: "ar", short: "AR", name: "العربية" },
  { code: "it", short: "IT", name: "Italiano" },
] as const

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const active = languages.find((item) => item.code === i18n.resolvedLanguage) ?? languages[0]

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    const closeEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("pointerdown", closeOutside)
    document.addEventListener("keydown", closeEscape)
    return () => {
      document.removeEventListener("pointerdown", closeOutside)
      document.removeEventListener("keydown", closeEscape)
    }
  }, [])

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-label={t("language.label")}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-[#E8E2D8] hover:text-[#C6A15B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6A15B]"
      >
        <GlobeIcon /> <span>{active.short}</span>
        <span className={open ? "rotate-180 transition-transform" : "transition-transform"}><ChevronDownIcon /></span>
      </button>
      {open && (
        <div role="listbox" aria-label={t("language.label")} className="absolute right-0 top-full z-[100] mt-2 w-44 max-w-[calc(100vw-1rem)] overflow-hidden rounded-xl border border-[#34312B] bg-[#111] p-1.5 shadow-2xl">
          {languages.map((language) => (
            <button
              key={language.code}
              type="button"
              role="option"
              aria-selected={active.code === language.code}
              onClick={() => { void i18n.changeLanguage(language.code); setOpen(false) }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition-colors ${active.code === language.code ? "bg-[#C6A15B] text-black" : "text-white hover:bg-white/10 hover:text-[#D9B96E]"}`}
            >
              <span>{language.name}</span><span className="opacity-70">{language.short}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
