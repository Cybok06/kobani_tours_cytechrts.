import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const target = process.argv.includes("--dist") ? "dist" : "public"
const [sitemap, robots, html] = await Promise.all([
  readFile(path.join(root, target, "sitemap.xml"), "utf8"),
  readFile(path.join(root, target, "robots.txt"), "utf8"),
  readFile(path.join(root, target === "dist" ? "dist" : "", "index.html"), "utf8"),
])
const errors = []
const warnings = []
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1])
if (!sitemap.startsWith("<?xml") || !sitemap.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) errors.push("sitemap.xml is not a basic sitemap urlset")
if (!urls.includes("https://www.kobanitours.com/")) errors.push("homepage is missing from sitemap")
if (!urls.some(url => url.includes("/tours/"))) warnings.push("no published tour detail URLs are currently present")
if (!urls.some(url => url.includes("/articles/"))) warnings.push("no published article detail URLs are currently present")
if (urls.some(url => !url.startsWith("https://www.kobanitours.com/") || /localhost|onrender\.com|cytechdevhub\.com/i.test(url))) errors.push("sitemap contains a non-production frontend URL")
if (urls.some(url => /\/(?:admin|customer|login|create-account|verify-email|booking|checkout)(?:\/|$)/i.test(new URL(url).pathname))) errors.push("sitemap contains a private or utility route")
if (!robots.includes("Sitemap: https://www.kobanitours.com/sitemap.xml") || /User-agent:\s*\*\s*\nDisallow:\s*\/\s*(?:\n|$)/i.test(robots)) errors.push("robots.txt is unsafe or does not reference the production sitemap")
if (!html.includes('rel="canonical"') || !html.includes('name="description"') || !html.includes('name="robots"')) errors.push("index.html is missing baseline SEO metadata")
if (errors.length) { console.error(errors.map(error => `- ${error}`).join("\n")); process.exit(1) }
if (warnings.length) console.warn(warnings.map(warning => `[seo] Warning: ${warning}.`).join("\n"))
console.log(`[seo] Validated ${target}/sitemap.xml (${urls.length} URLs), robots.txt, and baseline metadata.`)
