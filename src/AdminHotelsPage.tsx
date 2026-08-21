import { useEffect, useState } from "react"
import type { Page } from "./App"
import { adminHotelApi, type Hotel } from "./api"
import { AdminShell } from "./AdminProductsPage"
export default function AdminHotelsPage({
  onNavigate,
}: {
  onNavigate: (p: Page) => void
}) {
  const [hotels, setHotels] = useState<Hotel[]>([]),
    [summary, setSummary] = useState<Record<string, number>>({}),
    [q, setQ] = useState(""),
    [status, setStatus] = useState(""),
    [error, setError] = useState("")
  const load = () =>
    adminHotelApi
      .list({ search: q, status })
      .then((r) => {
        setHotels(r.data.hotels)
        setSummary(r.data.summary)
      })
      .catch(() => setError("Hotels could not be loaded."))
  useEffect(() => { void load() }, [status])
  return (
    <AdminShell title="Hotels" active="Hotels" onNavigate={onNavigate}>
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <p className="eyebrow">Hotel partners</p>
          <h1 className="page-title">Hotels</h1>
          <p className="sub">
            Manage hotel listings, reviews, contact activity and visibility.
          </p>
        </div>
        <button
          className="admin-gold"
          onClick={() => {
            sessionStorage.removeItem("kobani_admin_hotel_id")
            onNavigate("admin-hotel-form")
          }}
        >
          + Add Hotel
        </button>
      </div>
      <div className="metric-grid">
        {[
          ["Total Hotels", summary.total || 0],
          ["Published", summary.published || 0],
          ["Hotel Views", summary.views || 0],
          ["WhatsApp Clicks", summary.whatsapp_clicks || 0],
          ["Reviews", summary.reviews || 0],
        ].map((x) => (
          <div className="admin-metric" key={x[0]}>
            <p>{x[0]}</p>
            <b>{x[1]}</b>
          </div>
        ))}
      </div>
      <div className="grid sm:grid-cols-[1fr_200px_auto] gap-3 my-5">
        <input
          className="admin-input"
          placeholder="Search hotels or destinations"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
        />
        <select
          className="admin-input"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          <option>published</option>
          <option>draft</option>
          <option>archived</option>
        </select>
        <button className="admin-outline" onClick={load}>
          Search
        </button>
      </div>
      {error && <p className="text-red-700">{error}</p>}
      <div className="admin-table-card overflow-x-auto">
        <table className="admin-table min-w-[1100px]">
          <thead>
            <tr>
              {[
                "Hotel",
                "Location",
                "Stars",
                "Starting Price",
                "Rating",
                "Reviews",
                "Views",
                "WhatsApp",
                "Status",
                "Actions",
              ].map((x) => (
                <th key={x}>{x}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hotels.map((h) => (
              <tr key={h.id}>
                <td>
                  <div className="flex items-center gap-3">
                    {h.cover_image?.url && (
                      <img
                        className="w-14 h-12 rounded-lg object-cover"
                        src={h.cover_image.url}
                        alt=""
                      />
                    )}
                    <b>{h.name}</b>
                  </div>
                </td>
                <td>{[h.city, h.region].filter(Boolean).join(", ")}</td>
                <td>{h.star_rating ? `${h.star_rating} ★` : "Unrated"}</td>
                <td>
                  {h.price_from
                    ? `${h.currency} ${h.price_from.toLocaleString()}`
                    : "Contact hotel"}
                </td>
                <td>{h.rating_average || "—"}</td>
                <td>{h.rating_count}</td>
                <td>{h.total_views}</td>
                <td>{h.whatsapp_clicks}</td>
                <td>
                  <span
                    className={`pill ${
                      h.status === "published" ? "success" : "warning"
                    }`}
                  >
                    {h.status}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button
                      className="admin-outline"
                      onClick={() => {
                        sessionStorage.setItem("kobani_admin_hotel_id", h.id)
                        onNavigate("admin-hotel-detail")
                      }}
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        sessionStorage.setItem("kobani_admin_hotel_id", h.id)
                        onNavigate("admin-hotel-form")
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-700"
                      onClick={async () => {
                        if (confirm(`Archive ${h.name}?`)) {
                          await adminHotelApi.archive(h.id)
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
        {!hotels.length && (
          <div className="p-12 text-center">
            <h3 className="font-serif text-2xl">
              No hotels have been added yet.
            </h3>
            <button
              className="admin-gold mt-4"
              onClick={() => onNavigate("admin-hotel-form")}
            >
              Add Your First Hotel
            </button>
          </div>
        )}
      </div>
    </AdminShell>
  )
}
