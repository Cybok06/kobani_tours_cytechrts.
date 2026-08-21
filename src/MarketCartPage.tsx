import { useState } from "react"
import type { Page } from "./App"
import { readCart, writeCart, type CartItem } from "./marketCart"
import { resolveMediaUrl } from "./api"
const money = (n: number, currency: string) =>
  new Intl.NumberFormat("en-GH", { style: "currency", currency }).format(
    n / 100,
  )
export default function MarketCartPage({
  onNavigate,
}: {
  onNavigate: (p: Page) => void
}) {
  const [items, setItems] = useState<CartItem[]>(readCart)
  const save = (next: CartItem[]) => {
    setItems(next)
    writeCart(next)
  }
  const total = items.reduce(
    (n, x) =>
      n + (x.product.sale_price_minor || x.product.price_minor) * x.quantity,
    0,
  )
  const cartCurrencies = new Set(items.map((item) => item.product.currency))
  const singleCurrency = cartCurrencies.size === 1 ? items[0]?.product.currency : undefined
  return (
    <main className="min-h-screen bg-[#F8F4EA] px-4 py-10">
      <div className="max-w-[1050px] mx-auto">
        <button onClick={() => onNavigate("market")}>
          ← Continue shopping
        </button>
        <h1 className="font-serif text-4xl font-bold mt-5">
          Your Shopping Cart
        </h1>
        {!items.length ? (
          <div className="bg-white border rounded-2xl p-16 text-center mt-8">
            <p>Your cart is empty.</p>
            <button
              className="admin-gold mt-4"
              onClick={() => onNavigate("market")}
            >
              Explore the market
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_330px] gap-6 mt-8">
            <section className="space-y-4">
              {items.map((x, i) => (
                <article
                  className="bg-white border rounded-2xl p-4 flex gap-4"
                  key={`${x.product.id}-${x.variant}`}
                >
                  <img
                    src={resolveMediaUrl(x.product.image_url)}
                    alt=""
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <b className="font-serif text-lg">{x.product.name}</b>
                    <p className="text-sm text-[#777]">
                      {money(
                        x.product.sale_price_minor || x.product.price_minor,
                        x.product.currency,
                      )}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <button
                        className="admin-outline"
                        onClick={() =>
                          save(
                            items.map((v, j) =>
                              j === i
                                ? {
                                    ...v,
                                    quantity: Math.max(1, v.quantity - 1),
                                  }
                                : v,
                            ),
                          )
                        }
                      >
                        −
                      </button>
                      <span className="p-3">{x.quantity}</span>
                      <button
                        className="admin-outline"
                        disabled={x.quantity >= x.product.stock}
                        onClick={() =>
                          save(
                            items.map((v, j) =>
                              j === i ? { ...v, quantity: v.quantity + 1 } : v,
                            ),
                          )
                        }
                      >
                        +
                      </button>
                      <button
                        className="ml-auto text-red-700 text-sm"
                        onClick={() => save(items.filter((_, j) => j !== i))}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>
            <aside className="bg-white border rounded-2xl p-6 h-fit">
              <h2 className="font-serif text-xl font-bold">Order summary</h2>
              <div className="flex justify-between mt-6">
                <span>Subtotal</span>
                <b>{singleCurrency ? money(total, singleCurrency) : "Converted total shown at checkout"}</b>
              </div>
              <p className="text-xs text-[#777] mt-3">
                Paystack charges in GHS. USD items are converted using the current admin exchange rate; delivery is calculated at checkout.
              </p>
              <button
                className="admin-gold w-full mt-6"
                onClick={() => onNavigate("market-checkout")}
              >
                Proceed to checkout
              </button>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}
