import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { coverageTranslations } from "../i18n/coverage"

const originals = new WeakMap<Node, string>()
const attributeOriginals = new WeakMap<Element, Map<string, string>>()

const flatten = (value: unknown, prefix = "", output: Record<string, string> = {}) => {
  if (typeof value === "string") output[prefix] = value
  else if (value && typeof value === "object") Object.entries(value).forEach(([key, child]) => flatten(child, prefix ? `${prefix}.${key}` : key, output))
  return output
}

export default function DocumentTranslator() {
  const { i18n } = useTranslation()

  useEffect(() => {
    const english = flatten(i18n.getResourceBundle("en", "translation"))
    const selected = flatten(i18n.getResourceBundle(i18n.resolvedLanguage || "en", "translation"))
    const dictionary = new Map(Object.entries(english).map(([key, source]) => [source, selected[key] ?? source]))
    Object.entries(coverageTranslations[i18n.resolvedLanguage || "en"] ?? {}).forEach(([source, translated]) => dictionary.set(source, translated))

    const translateTree = (root: Node) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
      let node: Node | null = root.nodeType === Node.TEXT_NODE ? root : walker.nextNode()
      while (node) {
        const original = originals.get(node) ?? node.textContent ?? ""
        if (!originals.has(node)) originals.set(node, original)
        const trimmed = original.trim()
        const translated = dictionary.get(trimmed)
        if (translated) node.textContent = original.replace(trimmed, translated)
        node = walker.nextNode()
      }
      if (root instanceof Element) {
        const elements = [root, ...root.querySelectorAll("[placeholder],[aria-label],[title]")]
        elements.forEach((element) => {
          const saved = attributeOriginals.get(element) ?? new Map<string, string>()
          ;["placeholder", "aria-label", "title"].forEach((attribute) => {
            const current = element.getAttribute(attribute)
            if (current && !saved.has(attribute)) saved.set(attribute, current)
            const original = saved.get(attribute)
            if (original && dictionary.has(original)) element.setAttribute(attribute, dictionary.get(original)!)
          })
          attributeOriginals.set(element, saved)
        })
      }
    }

    translateTree(document.body)
    const observer = new MutationObserver((records) => records.forEach((record) => record.addedNodes.forEach(translateTree)))
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [i18n, i18n.resolvedLanguage])

  return null
}
