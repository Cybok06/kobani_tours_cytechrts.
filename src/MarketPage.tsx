import { useEffect, useMemo, useState } from "react"
import type { Page } from "./App"
import { marketApi, type MarketProduct, resolveMediaUrl } from "./api"
import { addToCart, readCart, setSelectedProduct } from "./marketCart"
const money = (minor: number, currency: string) =>
  new Intl.NumberFormat("en-GH", { style: "currency", currency }).format(
    minor / 100,
  )
export default function MarketPage({
  onNavigate,
}: {
  onNavigate: (p: Page) => void
}) {
  const [products, setProducts] = useState<MarketProduct[]>([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [search, setSearch] = useState(""),
    [category, setCategory] = useState("All"),
    [cartCount, setCartCount] = useState(() =>
      readCart().reduce((n, x) => n + x.quantity, 0),
    )
  useEffect(() => {
    marketApi
      .list()
      .then((r) => setProducts(r.data.products))
      .catch(() =>
        setError("The market could not be loaded. Please try again."),
      )
      .finally(() => setLoading(false))
  }, [])
  const categories = useMemo(
    () => ["All", ...new Set(products.map((x) => x.category))],
    [products],
  )
  const shown = products.filter(
    (x) =>
      (category === "All" || x.category === category) &&
      `${x.name} ${x.origin}`.toLowerCase().includes(search.toLowerCase()),
  )
  const view = (p: MarketProduct) => {
    setSelectedProduct(p.slug)
    onNavigate("market-product")
  }
  const add = (p: MarketProduct) => {
    addToCart(p)
    setCartCount(readCart().reduce((n, x) => n + x.quantity, 0))
  }
  return (
    <div className="min-h-screen bg-[#F8F4EA]">
      <section className="bg-[#0B0B0B] text-white px-4 py-16">
        <div className="max-w-[1240px] mx-auto">
          <p className="eyebrow text-[#C6A15B]">African Market</p>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold max-w-3xl">
            Authentic African products and heritage pieces
          </h1>
          <p className="text-[#CFC7B9] mt-4 max-w-2xl">
            Shop artisan-made pieces sourced with care. Every purchase supports
            African craft and community.
          </p>
        </div>
      </section>
      <main className="max-w-[1240px] mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border p-4 flex flex-col sm:flex-row gap-3">
          <input
            className="admin-input flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products or origin..."
          />
          <select
            className="admin-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <button
            className="admin-gold"
            onClick={() => onNavigate("market-cart")}
          >
            Cart ({cartCount})
          </button>
        </div>
        {loading && (
          <div className="py-20 text-center">Loading the market…</div>
        )}
        {error && (
          <div className="my-8 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}
        {!loading && !error && !shown.length && (
          <div className="py-20 text-center">
            <h2 className="font-serif text-2xl font-bold">
              No products available
            </h2>
            <p className="text-sm text-[#777] mt-2">
              Published products from the admin catalogue will appear here.
            </p>
          </div>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-7">
          {shown.map((p) => (
            <article
              key={p.id}
              className="bg-white rounded-2xl border overflow-hidden group"
            >
              <button
                className="aspect-square w-full bg-[#EEE8DD] overflow-hidden"
                onClick={() => view(p)}
              >
                {p.image_url ? (
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                    src={resolveMediaUrl(p.image_url)}
                    alt={p.name}
                  />
                ) : (
                  <span className="text-[#999]">No image</span>
                )}
              </button>
              <div className="p-4">
                <p className="text-[10px] uppercase tracking-wider text-[#9A7A3A]">
                  {p.category} · {p.origin}
                </p>
                <button
                  onClick={() => view(p)}
                  className="font-serif text-lg font-bold text-left mt-1 hover:text-[#A77D2E]"
                >
                  {p.name}
                </button>
                <p className="text-xs text-[#9A702B] mt-1">{"★".repeat(Math.round(p.rating_average || 0))}{"☆".repeat(5 - Math.round(p.rating_average || 0))} <span className="text-[#777]">({p.rating_count || 0})</span></p>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <b>{money(p.sale_price_minor || p.price_minor, p.currency)}</b>
                    {p.sale_price_minor && (
                      <small className="line-through text-[#999] ml-2">
                        {money(p.price_minor, p.currency)}
                      </small>
                    )}
                  </div>
                  <button
                    disabled={!p.stock}
                    onClick={() => add(p)}
                    className="admin-gold disabled:opacity-40"
                  >
                    {p.stock ? "Add" : "Sold out"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
