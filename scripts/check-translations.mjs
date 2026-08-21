import { resources } from "../src/i18n/resources.ts"

const flatten = (value, prefix = "", result = {}) => {
  if (typeof value === "string") result[prefix] = value
  else if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) flatten(child, prefix ? `${prefix}.${key}` : key, result)
  }
  return result
}

const baseline = flatten(resources.en.translation)
let failed = false
for (const [language, bundle] of Object.entries(resources)) {
  const values = flatten(bundle.translation)
  // Some languages (including Chinese) use a single plural category, so an
  // English `_one` form is not required when that locale supplies `_other`.
  const missing = Object.keys(baseline).filter((key) => {
    if (key.endsWith("_one") && !(key in values) && `${key.slice(0, -4)}_other` in values) return false
    return !(key in values) || !values[key].trim()
  })
  const extra = Object.keys(values).filter((key) => !(key in baseline))
  if (missing.length || extra.length) {
    failed = true
    console.error(`${language}: missing [${missing.join(", ")}], extra [${extra.join(", ")}]`)
  } else console.log(`${language}: ${Object.keys(values).length} keys OK`)
}
if (failed) process.exit(1)
