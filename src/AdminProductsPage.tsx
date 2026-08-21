import { useEffect, useState } from "react"
import type { Page } from "./App"
import AdminSidebar from "./AdminSidebar"
import { adminCommerceApi, type MarketProduct, resolveMediaUrl } from "./api"
const money = (n: number, currency: string) =>
  new Intl.NumberFormat("en-GH", { style: "currency", currency }).format(
    n / 100,
  )
export default function AdminProductsPage({
  onNavigate,
}: {
  onNavigate: (p: Page) => void
}) {
  const [items, setItems] = useState<MarketProduct[]>([]),
    [q, setQ] = useState(""),
    [error, setError] = useState("")
  const load = () =>
    adminCommerceApi
      .products()
      .then((r) => setItems(r.data.products))
      .catch(() => setError("Products could not be loaded."))
  useEffect(() => { void load() }, [])
  const shown = items.filter((x) =>
    `${x.name} ${x.sku} ${x.category}`.toLowerCase().includes(q.toLowerCase()),
  )
  return (
    <AdminShell
      title="African Market"
      active="African Market"
      onNavigate={onNavigate}
    >
      <div className="flex justify-between items-end">
        <div>
          <p className="eyebrow">Commerce</p>
          <h1 className="page-title">African Market</h1>
          <p className="sub">
            Publish products to the storefront and manage pricing.
          </p>
        </div>
        <button
          className="admin-gold"
          onClick={() => {
            localStorage.removeItem("kobani:admin-product-id")
            onNavigate("admin-product-form")
          }}
        >
          + Add Product
        </button>
      </div>
      <div className="metric-grid">
        {[
          ["Products", items.length],
          ["Published", items.filter((x) => x.status === "active").length],
          [
            "Low stock",
            items.filter((x) => x.stock > 0 && x.stock <= x.low_stock_level)
              .length,
          ],
          ["Out of stock", items.filter((x) => !x.stock).length],
        ].map((x) => (
          <div className="admin-metric" key={x[0]}>
            <p>{x[0]}</p>
            <b>{x[1]}</b>
          </div>
        ))}
      </div>
      <input
        className="admin-input w-full my-5"
        placeholder="Search products, SKU or category..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {error && <p className="text-red-700">{error}</p>}
      <div className="admin-table-card overflow-x-auto">
        <table className="admin-table min-w-[850px]">
          <thead>
            <tr>
              {[
                "Product",
                "SKU",
                "Category",
                "Price",
                "Stock",
                "Sales",
                "Status",
                "Actions",
              ].map((x) => (
                <th key={x}>{x}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="flex gap-3 items-center">
                    {p.image_url && (
                      <img
                        src={resolveMediaUrl(p.image_url)}
                        className="w-14 h-12 object-cover rounded-lg"
                      />
                    )}
                    <b>{p.name}</b>
                  </div>
                </td>
                <td>{p.sku}</td>
                <td>{p.category}</td>
                <td>{money(p.sale_price_minor || p.price_minor, p.currency)}</td>
                <td>{p.stock}</td>
                <td>{p.sales || 0}</td>
                <td>
                  <span
                    className={`pill ${
                      p.status === "active" ? "success" : "warning"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button
                      className="admin-outline"
                      onClick={() => {
                        localStorage.setItem("kobani:admin-product-id", p.id)
                        onNavigate("admin-product-form")
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-700"
                      onClick={async () => {
                        if (confirm(`Archive ${p.name}?`)) {
                          await adminCommerceApi.remove(p.id)
                          load()
                        }
                      }}
                    >
                      Archive
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  )
}
export function AdminShell({
  title,
  active,
  onNavigate,
  children,
}: {
  title: string
  active: string
  onNavigate: (p: Page) => void
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const side = (
    <AdminSidebar
      active={active}
      onNavigate={onNavigate}
      onClose={() => setOpen(false)}
    />
  )
  return (
    <div className="min-h-screen bg-[#F8F4EA] flex">
      <div className="hidden xl:block fixed inset-y-0 left-0 w-60">{side}</div>
      {open && (
        <>
          <button
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 xl:hidden"
          />
          <div className="fixed inset-y-0 left-0 z-50 w-72">{side}</div>
        </>
      )}
      <div className="flex-1 min-w-0 xl:ml-60">
        <header className="h-20 bg-white border-b px-4 sm:px-6 flex items-center sticky top-0 z-30">
          <button
            onClick={() => setOpen(true)}
            className="xl:hidden border rounded-xl w-10 h-10"
          >
            ☰
          </button>
          <b className="ml-3 font-serif">{title}</b>
        </header>
        <main className="p-4 sm:p-6 max-w-[1550px] mx-auto">{children}</main>
      </div>
    </div>
  )
}
