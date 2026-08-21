import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const output = path.join(root, "public", "sitemap.xml")
const siteUrl = "https://www.kobanitours.com"
const apiBase = (process.env.VITE_KOBANI_API_BASE_URL || "https://www.cytechdevhub.com/kobani/api").replace(/\/$/, "")
const staticPaths = ["/", "/about", "/tours", "/hotels", "/gallery", "/articles", "/market", "/contact", "/faq", "/privacy-policy", "/terms-and-conditions", "/refund-policy", "/cancellation-policy", "/cookie-policy"]

const escapeXml = value => String(value).replace(/[<>&"']/g, character => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[character])
const lastmod = value => {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.valueOf()) ? undefined : date.toISOString().slice(0, 10)
}

async function getJson(url) {
  const response = await fetch(url, { headers: { Accept: "application/json", "Accept-Language": "en" }, signal: AbortSignal.timeout(20000) })
  if (!response.ok) throw new Error(`${response.status} ${url}`)
  return response.json()
}

async function allTours() {
  const records = []
  let page = 1
  do {
    const body = await getJson(`${apiBase}/public/tours?page=${page}&limit=100`)
    records.push(...(body.data?.tours || []))
    if (page >= Number(body.data?.pagination?.pages || 1)) break
    page += 1
  } while (page <= 100)
  // This endpoint is public-only and the backend already restricts it to published, non-deleted tours.
  return records.filter(item => item.slug).map(item => ({ path: `/tours/${encodeURIComponent(item.slug)}`, lastmod: lastmod(item.updated_at) }))
}

async function allArticles() {
  const records = []
  let page = 1
  do {
    const body = await getJson(`${apiBase}/public/articles?page=${page}&limit=100`)
    records.push(...(body.data?.articles || []))
    if (page >= Number(body.data?.pages || 1)) break
    page += 1
  } while (page <= 100)
  // This endpoint is public-only and the backend already restricts it to published, non-deleted articles.
  return records.filter(item => item.slug).map(item => ({ path: `/articles/${encodeURIComponent(item.slug)}`, lastmod: lastmod(item.updated_at || item.published_at) }))
}

async function allHotels() {
  const body = await getJson(`${apiBase}/public/hotels`)
  return (body.data?.hotels || []).filter(item => item.slug).map(item => ({ path: `/hotels/${encodeURIComponent(item.slug)}`, lastmod: lastmod(item.updated_at) }))
}

const previousDynamicEntries = async () => {
  try {
    const previous = await readFile(output, "utf8")
    return [...previous.matchAll(/<loc>https:\/\/www\.kobanitours\.com(\/(?:tours|hotels|articles)\/[^<]+)<\/loc>(?:\s*<lastmod>([^<]+)<\/lastmod>)?/g)].map(match => ({ path: match[1], lastmod: match[2] }))
  } catch { return [] }
}

let dynamic = []
try {
  const [tours, hotels, articles] = await Promise.all([allTours(), allHotels(), allArticles()])
  dynamic = [...tours, ...hotels, ...articles]
  console.log(`[seo] Loaded ${tours.length} published tours, ${hotels.length} published hotels and ${articles.length} published articles.`)
} catch (error) {
  dynamic = await previousDynamicEntries()
  const message = `[seo] Could not refresh dynamic sitemap entries: ${error.message}. ${dynamic.length ? "Using the last generated dynamic entries." : "No cached dynamic entries are available."}`
  if (process.env.RENDER === "true" || process.env.CI === "true") throw new Error(message)
  console.warn(message)
}

const entries = [...staticPaths.map(path => ({ path })), ...dynamic]
const unique = [...new Map(entries.map(entry => [entry.path, entry])).values()].sort((a, b) => a.path.localeCompare(b.path))
const urls = unique.map(entry => `  <url>\n    <loc>${escapeXml(`${siteUrl}${entry.path}`)}</loc>${entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : ""}\n  </url>`).join("\n")
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
await writeFile(output, xml, "utf8")
console.log(`[seo] Generated public/sitemap.xml with ${unique.length} canonical URLs.`)
