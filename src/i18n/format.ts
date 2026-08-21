export const getLocalizedContent = (value: Record<string, string> | string | null | undefined, language: string, fallback = "en") => {
  if (typeof value === "string") return value
  if (!value) return ""
  return value[language] ?? value[language.split("-")[0]] ?? value[fallback] ?? ""
}

export const formatDate = (value: Date | string | number, language: string, options: Intl.DateTimeFormatOptions = { dateStyle: "long" }) =>
  new Intl.DateTimeFormat(language, options).format(new Date(value))

export const formatCurrency = (amount: number, currency: string, language: string) =>
  new Intl.NumberFormat(language, { style: "currency", currency }).format(amount)
