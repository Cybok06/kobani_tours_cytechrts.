import { useEffect, useState } from "react"
import type { Page } from "./App"
import {
  adminCommerceApi,
  ApiError,
  type ArticleImage,
  type ProductInput,
} from "./api"
import { AdminShell } from "./AdminProductsPage"
const empty: ProductInput = {
  name: "",
  sku: "",
  category: "Clothing",
  description: "",
  story: "",
  origin: "Ghana",
  currency: "GHS",
  price: 0,
  sale_price: "",
  stock: 0,
  low_stock_level: 5,
  status: "draft",
  featured: false,
  image: null,
  seo: {},
}
const input = "admin-input w-full"
export default function AdminProductFormPage({
  onNavigate,
}: {
  onNavigate: (p: Page) => void
}) {
  const id = localStorage.getItem("kobani:admin-product-id")
  const [form, setForm] = useState<ProductInput>(empty),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("")
  useEffect(() => {
    if (id) adminCommerceApi.product(id).then((r) => {
        const p = r.data.product
        setForm({
          ...empty,
          ...p,
          price: p.price_minor / 100,
          sale_price: p.sale_price_minor ? p.sale_price_minor / 100 : "",
        })
      })
  }, [id])
  const set = (k: keyof ProductInput, v: unknown) =>
    setForm((x) => ({ ...x, [k]: v }))
  const upload = async (file?: File) => {
    if (!file) return
    setBusy(true)
    try {
      const r = await adminCommerceApi.uploadImage(file)
      set("image", r.data.image)
      setMessage("Image uploaded.")
    } catch {
      setMessage("Image upload failed.")
    } finally {
      setBusy(false)
    }
  }
  const save = async (status: string) => {
    setBusy(true)
    setMessage("")
    try {
      id
        ? await adminCommerceApi.update(id, { ...form, status })
        : await adminCommerceApi.create({ ...form, status })
      localStorage.removeItem("kobani:admin-product-id")
      onNavigate("admin-products")
    } catch (e) {
      setMessage(
        e instanceof ApiError
          ? e.code.replaceAll("_", " ")
          : "Product could not be saved.",
      )
    } finally {
      setBusy(false)
    }
  }
  return (
    <AdminShell
      title={id ? "Edit Product" : "Create Product"}
      active="African Market"
      onNavigate={onNavigate}
    >
      <button onClick={() => onNavigate("admin-products")}>← Products</button>
      <div className="flex justify-between mt-4">
        <div>
          <p className="eyebrow">Catalogue editor</p>
          <h1 className="page-title">{id ? "Edit Product" : "Add Product"}</h1>
        </div>
        <div className="flex gap-2">
          <button
            disabled={busy}
            className="admin-outline"
            onClick={() => save("draft")}
          >
            Save draft
          </button>
          <button
            disabled={busy}
            className="admin-gold"
            onClick={() => save("active")}
          >
            Publish
          </button>
        </div>
      </div>
      {message && <div className="my-4 border rounded-xl p-3">{message}</div>}
      <section className="bg-white border rounded-2xl p-6 mt-6 grid md:grid-cols-2 gap-5">
        <label>
          Name
          <input
            className={input}
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </label>
        <label>
          SKU
          <input
            className={input}
            value={form.sku}
            onChange={(e) => set("sku", e.target.value)}
          />
        </label>
        <label>
          Category
          <select
            className={input}
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
          >
            {[
              "Clothing",
              "Jewellery",
              "Art",
              "Crafts",
              "Books",
              "Home & Living",
            ].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label>
          Origin
          <input
            className={input}
            value={form.origin}
            onChange={(e) => set("origin", e.target.value)}
          />
        </label>
        <label>
          Product currency
          <select className={input} value={form.currency || "GHS"} onChange={(e) => set("currency", e.target.value)}>
            <option value="GHS">GHS — no conversion</option>
            <option value="USD">USD — converted to GHS at checkout</option>
          </select>
        </label>
        <label>
          Price ({form.currency || "GHS"})
          <input
            type="number"
            min="0"
            step="0.01"
            className={input}
            value={form.price}
            onChange={(e) => set("price", +e.target.value)}
          />
        </label>
        <label>
          Sale price ({form.currency || "GHS"}, optional)
          <input
            type="number"
            min="0"
            step="0.01"
            className={input}
            value={form.sale_price ?? ""}
            onChange={(e) => set("sale_price", e.target.value)}
          />
        </label>
        <label>
          Stock
          <input
            type="number"
            min="0"
            className={input}
            value={form.stock}
            onChange={(e) => set("stock", +e.target.value)}
          />
        </label>
        <label>
          Low-stock alert
          <input
            type="number"
            min="0"
            className={input}
            value={form.low_stock_level}
            onChange={(e) => set("low_stock_level", +e.target.value)}
          />
        </label>
        <label className="md:col-span-2">
          Primary image
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className={`${input} pt-2`}
            onChange={(e) => upload(e.target.files?.[0])}
          />
        </label>
        <label className="md:col-span-2">
          Description
          <textarea
            className={`${input} min-h-32`}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </label>
        <label className="md:col-span-2">
          Product story
          <textarea
            className={`${input} min-h-32`}
            value={form.story}
            onChange={(e) => set("story", e.target.value)}
          />
        </label>
        <label className="flex gap-2">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => set("featured", e.target.checked)}
          />
          Feature on storefront
        </label>
      </section>
    </AdminShell>
  )
}
