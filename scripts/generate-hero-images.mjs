import { promises as fs } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const source = path.join(root, "public", "images", "hero_section")
const outputDirectory = path.join(root, "public", "generated")
const output = path.join(outputDirectory, "hero-images.json")
const supported = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"])

let files = []
try {
  files = await fs.readdir(source, { withFileTypes: true })
} catch (error) {
  if (error?.code !== "ENOENT") throw error
  console.warn(`[hero-images] Folder not found: ${source}`)
}

const images = files
  .filter((entry) => entry.isFile() && !entry.name.startsWith(".") && supported.has(path.extname(entry.name).toLowerCase()))
  .map((entry) => `/images/hero_section/${entry.name.split(path.sep).map(encodeURIComponent).join("/")}`)
  .sort((a, b) => a.localeCompare(b, "en"))

await fs.mkdir(outputDirectory, { recursive: true })
await fs.writeFile(output, `${JSON.stringify(images, null, 2)}\n`, "utf8")
console.log(`[hero-images] Generated ${images.length} image${images.length === 1 ? "" : "s"} in public/generated/hero-images.json`)
