import { useEffect, useState } from "react"
import type { Page } from "./App"
import { ApiError, marketApi, type MarketProduct, type ProductReview, resolveMediaUrl } from "./api"
import { addToCart, selectedProduct } from "./marketCart"
import { useAuth } from "./AuthContext"
const money = (n: number, currency: string) =>
  new Intl.NumberFormat("en-GH", { style: "currency", currency }).format(
    n / 100,
  )
export default function MarketProductPage({
  onNavigate,
}: {
  onNavigate: (p: Page) => void
}) {
  const { isAuthenticated } = useAuth()
  const [p, setP] = useState<MarketProduct | null>(null),
    [reviews, setReviews] = useState<ProductReview[]>([]),
    [qty, setQty] = useState(1),
    [error, setError] = useState(""),
    [rating, setRating] = useState(5),
    [comment, setComment] = useState(""),
    [reviewBusy, setReviewBusy] = useState(false),
    [reviewNotice, setReviewNotice] = useState("")
  const load = async () => {
    const slug = selectedProduct()
    if (!slug) return onNavigate("market")
    try { const response = await marketApi.get(slug); setP(response.data.product); setReviews(response.data.reviews || []) }
    catch { setError("This product is no longer available.") }
  }
  useEffect(() => {
    void load()
  }, [onNavigate])
  const submitReview = async () => {
    if (!p) return
    if (!isAuthenticated) { onNavigate("login"); return }
    if (comment.trim().length < 10) return setReviewNotice("Please write at least 10 characters about the product.")
    setReviewBusy(true); setReviewNotice("")
    try { await marketApi.review(p.id, { rating, comment: comment.trim() }); setComment(""); setReviewNotice("Thank you. Your rating has been published."); await load() }
    catch (err) { setReviewNotice(err instanceof ApiError ? err.code.replaceAll("_", " ") : "Your review could not be saved.") }
    finally { setReviewBusy(false) }
  }
  if (error)
    return (
      <div className="p-20 text-center">
        {error}
        <br />
        <button
          className="admin-gold mt-4"
          onClick={() => onNavigate("market")}
        >
          Back to market
        </button>
      </div>
    )
  if (!p) return <div className="p-20 text-center">Loading…</div>
  return (
    <main className="min-h-screen bg-[#F8F4EA] px-4 py-10">
      <div className="max-w-[1100px] mx-auto">
        <button className="mb-6 text-sm" onClick={() => onNavigate("market")}>
          ← Back to African Market
        </button>
        <div className="grid md:grid-cols-2 gap-10 bg-white rounded-3xl border p-5 sm:p-8">
          <div className="aspect-square rounded-2xl overflow-hidden bg-[#EEE8DD]">
            {p.image_url && (
              <img
                src={resolveMediaUrl(p.image_url)}
                alt={p.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="py-3">
            <p className="eyebrow">
              {p.category} · {p.origin}
            </p>
            <h1 className="font-serif text-4xl font-bold">{p.name}</h1>
            <p className="mt-2 text-sm text-[#8A682C]"><span aria-label={`${p.rating_average} out of 5 stars`}>{"★".repeat(Math.round(p.rating_average || 0))}{"☆".repeat(5 - Math.round(p.rating_average || 0))}</span> <b>{p.rating_average ? p.rating_average.toFixed(1) : "New"}</b> · {p.rating_count || 0} reviews</p>
            <p className="text-2xl font-bold mt-4">
              {money(p.sale_price_minor || p.price_minor, p.currency)}
            </p>
            <p className="text-[#666] leading-7 mt-6 whitespace-pre-line">
              {p.description}
            </p>
            {p.story && (
              <div className="mt-6">
                <h2 className="font-serif text-xl font-bold">The story</h2>
                <p className="text-sm text-[#666] leading-6 mt-2 whitespace-pre-line">
                  {p.story}
                </p>
              </div>
            )}
            <p className="mt-6 text-sm">
              {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
            </p>
            <div className="flex gap-3 mt-4">
              <input
                type="number"
                min={1}
                max={p.stock}
                value={qty}
                onChange={(e) =>
                  setQty(Math.max(1, Math.min(p.stock, +e.target.value || 1)))
                }
                className="admin-input w-24"
              />
              <button
                disabled={!p.stock}
                className="admin-gold flex-1 disabled:opacity-40"
                onClick={() => {
                  addToCart(p, qty)
                  onNavigate("market-cart")
                }}
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
        <section className="grid lg:grid-cols-[360px_1fr] gap-6 mt-8">
          <div className="bg-white border rounded-2xl p-6 h-fit"><p className="eyebrow">Customer feedback</p><h2 className="font-serif text-2xl font-bold">Rate this product</h2><div className="flex gap-1 mt-4" aria-label="Choose rating">{[1,2,3,4,5].map((value) => <button type="button" key={value} onClick={() => setRating(value)} className={`text-3xl ${value <= rating ? "text-[#C6A15B]" : "text-[#D8D3CA]"}`} aria-label={`${value} stars`}>★</button>)}</div><textarea className="admin-input w-full min-h-28 mt-4" maxLength={2000} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience with this product…" />{reviewNotice && <p className="text-sm mt-3">{reviewNotice}</p>}<button disabled={reviewBusy} onClick={() => void submitReview()} className="admin-gold w-full mt-4 disabled:opacity-50">{reviewBusy ? "Saving…" : isAuthenticated ? "Publish Rating" : "Sign in to Rate"}</button><p className="text-xs text-[#777] mt-3">One rating per customer. Submitting again updates your previous rating.</p></div>
          <div className="bg-white border rounded-2xl p-6"><div className="flex justify-between items-end"><div><p className="eyebrow">Ratings & reviews</p><h2 className="font-serif text-2xl font-bold">What customers say</h2></div><b>{p.rating_count || 0} reviews</b></div><div className="space-y-4 mt-5">{reviews.map((review) => <article className="border rounded-xl p-4" key={review.id}><div className="flex justify-between gap-3"><div><b>{review.reviewer_name}</b>{review.verified_purchase && <span className="pill success ml-2">Verified purchase</span>}</div><span className="text-[#C6A15B]" aria-label={`${review.rating} stars`}>{"★".repeat(review.rating)}{"☆".repeat(5-review.rating)}</span></div><p className="text-sm leading-6 mt-3">{review.comment}</p><small className="text-[#888]">{review.created_at ? new Date(review.created_at).toLocaleDateString() : ""}</small></article>)}{!reviews.length && <div className="py-14 text-center text-[#777]">No ratings yet. Be the first customer to rate this product.</div>}</div></div>
        </section>
      </div>
    </main>
  )
}
