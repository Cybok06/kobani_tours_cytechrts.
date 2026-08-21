import { useEffect } from "react"

export const SITE_URL = "https://www.kobanitours.com"
export const SITE_NAME = "KOBANI Historical & Luxury Tours"
export const ORGANIZATION_NAME = "THE KOBANI HISTORICAL AND LUXURY TOURS"
export const DEFAULT_DESCRIPTION = "Discover premium Ghana heritage, cultural and luxury tours with KOBANI, based in Accra, Ghana—where heritage meets luxury."
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/company_logo_kobani.png`

export type StructuredData = Record<string, unknown>

export type SeoProps = {
  title: string
  description: string
  path?: string
  image?: string
  imageAlt?: string
  type?: "website" | "article"
  noindex?: boolean
  nofollow?: boolean
  structuredData?: StructuredData | StructuredData[]
}

const absolute = (value?: string) => {
  if (!value) return DEFAULT_OG_IMAGE
  try { return new URL(value, SITE_URL).href } catch { return DEFAULT_OG_IMAGE }
}

export const canonicalUrl = (path = "/") => {
  const clean = path.split(/[?#]/)[0] || "/"
  return `${SITE_URL}${clean === "/" ? "/" : `/${clean.replace(/^\/+|\/+$/g, "")}`}`
}

const upsertMeta = (selector: string, attribute: "name" | "property", key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement("meta")
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.content = content
}

export const applySeo = ({ title, description, path = "/", image, imageAlt, type = "website", noindex = false, nofollow = false, structuredData }: SeoProps) => {
  const canonical = canonicalUrl(path)
  const robots = `${noindex ? "noindex" : "index"}, ${nofollow ? "nofollow" : "follow"}`
  const socialImage = absolute(image)
  document.title = title
  document.documentElement.lang = document.documentElement.lang || "en"
  upsertMeta('meta[name="description"]', "name", "description", description)
  upsertMeta('meta[name="robots"]', "name", "robots", robots)
  upsertMeta('meta[name="googlebot"]', "name", "googlebot", robots)
  upsertMeta('meta[property="og:title"]', "property", "og:title", title)
  upsertMeta('meta[property="og:description"]', "property", "og:description", description)
  upsertMeta('meta[property="og:url"]', "property", "og:url", canonical)
  upsertMeta('meta[property="og:type"]', "property", "og:type", type)
  upsertMeta('meta[property="og:site_name"]', "property", "og:site_name", SITE_NAME)
  upsertMeta('meta[property="og:image"]', "property", "og:image", socialImage)
  upsertMeta('meta[property="og:image:alt"]', "property", "og:image:alt", imageAlt || title)
  upsertMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image")
  upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", title)
  upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", description)
  upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", socialImage)

  let canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!canonicalLink) { canonicalLink = document.createElement("link"); canonicalLink.rel = "canonical"; document.head.appendChild(canonicalLink) }
  canonicalLink.href = canonical

  document.head.querySelectorAll('script[type="application/ld+json"][data-kobani-seo]').forEach(node => node.remove())
  const schemas = structuredData ? (Array.isArray(structuredData) ? structuredData : [structuredData]) : []
  schemas.forEach(schema => {
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.dataset.kobaniSeo = "true"
    script.text = JSON.stringify(schema).replace(/</g, "\\u003c")
    document.head.appendChild(script)
  })
}

export default function SEO(props: SeoProps) {
  useEffect(() => { applySeo(props) }, [props.title, props.description, props.path, props.image, props.imageAlt, props.type, props.noindex, props.nofollow, JSON.stringify(props.structuredData)])
  return null
}

export const organizationSchema = (): StructuredData => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: ORGANIZATION_NAME,
  alternateName: "KOBANI",
  url: `${SITE_URL}/`,
  logo: DEFAULT_OG_IMAGE,
  slogan: "WHERE HERITAGE MEETS LUXURY",
  address: { "@type": "PostalAddress", addressLocality: "Accra", addressCountry: "GH" },
})

export const breadcrumbSchema = (items: { name: string; path: string }[]): StructuredData => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: canonicalUrl(item.path) })),
})

export const cleanDescription = (value?: string, fallback = DEFAULT_DESCRIPTION) => {
  const text = (value || fallback).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
  return text.length <= 160 ? text : `${text.slice(0, 157).replace(/\s+\S*$/, "")}…`
}
