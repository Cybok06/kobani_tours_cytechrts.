import { useEffect, useState } from "react";
import type { Page } from "./App";
import { AdminShell } from "./AdminProductsPage";
import { adminTravellerApi, Traveller } from "./api";

export default function AdminTravellersPage({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  const [people, setPeople] = useState<Traveller[]>([]),
    [summary, setSummary] = useState<Record<string, number>>({}),
    [search, setSearch] = useState(""),
    [kind, setKind] = useState(""),
    [nationality, setNationality] = useState(""),
    [loading, setLoading] = useState(true),
    [detail, setDetail] = useState<Traveller>(),
    [notice, setNotice] = useState("");
  const load = () => {
    setLoading(true);
    adminTravellerApi
      .list({ search, traveller_type: kind, nationality })
      .then((r) => {
        setPeople(r.data.travellers);
        setSummary(r.data.summary);
      })
      .catch(() => setNotice("Could not load travellers."))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    const timer = setTimeout(load, 180);
    return () => clearTimeout(timer);
  }, [search, kind, nationality]);
  const update = async (id: string, payload: Record<string, unknown>) => {
    try {
      const r = await adminTravellerApi.update(id, payload);
      setPeople((x) =>
        x.map((p) => (p.id === id ? { ...p, ...r.data.traveller } : p)),
      );
      setDetail((x) => (x?.id === id ? { ...x, ...r.data.traveller } : x));
      setNotice("Traveller updated.");
    } catch {
      setNotice("Traveller update failed.");
    }
  };
  const nationalities = [...new Set(people.map((x) => x.nationality).filter(Boolean))];
  return (
    <AdminShell title="Travellers" active="Travellers" onNavigate={onNavigate}>
          {notice && (
            <button
              onClick={() => setNotice("")}
              className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-5 py-3 rounded-xl text-xs"
            >
              {notice}
            </button>
          )}
          <div>
            <p className="text-[10px] tracking-[.2em] text-[#B88B39] font-bold">
              TOUR OPERATIONS
            </p>
            <h2 className="font-serif text-4xl font-bold">
              Traveller Management
            </h2>
            <p className="text-sm text-[#777] mt-1">
              Real confirmed traveller manifests and requirements.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-7">
            {[
              ["Total travellers", summary.total || 0],
              ["Adults", summary.adults || 0],
              ["Children", summary.children || 0],
              ["Special requirements", summary.special_requirements || 0],
            ].map(([a, b]) => (
              <div className="bg-white border rounded-2xl p-5" key={String(a)}>
                <span className="text-[9px] uppercase text-[#888]">{a}</span>
                <b className="font-serif text-3xl block mt-2">{b}</b>
              </div>
            ))}
          </div>
          <div className="bg-white border rounded-2xl p-4 mt-5 grid md:grid-cols-3 gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search traveller name…"
              className="h-11 border rounded-xl px-4 text-sm"
            />
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value)}
              className="h-11 border rounded-xl px-3 text-sm"
            >
              <option value="">All traveller types</option>
              <option value="adult">Adults</option>
              <option value="child">Children</option>
              <option value="infant">Infants</option>
            </select>
            <select
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className="h-11 border rounded-xl px-3 text-sm"
            >
              <option value="">All nationalities</option>
              {nationalities.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </div>
          <section className="bg-white border rounded-2xl overflow-hidden mt-5">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left">
                <thead className="bg-[#FCFAF5] text-[9px] uppercase text-[#888]">
                  <tr>
                    {[
                      "Traveller",
                      "Booking",
                      "Tour & date",
                      "Type",
                      "Nationality",
                      "Requirements",
                      "Documents",
                      "Action",
                    ].map((x) => (
                      <th className="px-4 py-3" key={x}>
                        {x}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {people.map((x) => (
                    <tr className="border-t text-xs" key={x.id}>
                      <td className="px-4 py-4">
                        <b>{x.full_name}</b>
                        {x.is_lead && (
                          <span className="block text-[9px] text-[#A97925]">
                            Lead traveller
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 font-bold">
                        {x.booking_reference}
                      </td>
                      <td className="px-4 py-4">
                        <b>{x.tour_title}</b>
                        <span className="block text-[10px] text-[#888]">
                          {x.departure_date}
                        </span>
                      </td>
                      <td className="px-4 py-4">{x.traveller_type}</td>
                      <td className="px-4 py-4">{x.nationality || "—"}</td>
                      <td className="px-4 py-4">
                        {x.dietary_requirements ||
                        x.accessibility_requirements ? (
                          <span className="text-amber-700">
                            Review required
                          </span>
                        ) : (
                          "None"
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-1 bg-[#F1ECE2] rounded-full">
                          {x.document_status.replaceAll("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => setDetail(x)}
                          className="bg-[#111] text-white px-3 py-2 rounded-lg"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {loading && (
                <div className="p-16 text-center text-[#777]">
                  Loading travellers…
                </div>
              )}
              {!loading && !people.length && (
                <div className="p-16 text-center">
                  <h3 className="font-serif text-2xl font-bold">
                    No travellers found
                  </h3>
                  <p className="text-sm text-[#777] mt-2">
                    Travellers appear after a verified first payment confirms a
                    booking.
                  </p>
                </div>
              )}
            </div>
          </section>
      {detail && (
        <>
          <button
            onClick={() => setDetail(undefined)}
            className="fixed inset-0 bg-black/40 z-40"
          />
          <aside className="fixed right-0 inset-y-0 w-full max-w-md bg-white z-50 shadow-2xl overflow-y-auto">
            <div className="bg-[#111] text-white p-6">
              <button
                onClick={() => setDetail(undefined)}
                className="float-right text-xl"
              >
                ×
              </button>
              <p className="text-[10px] text-[#C6A15B] tracking-[.2em]">
                TRAVELLER PROFILE
              </p>
              <h2 className="font-serif text-3xl font-bold mt-2">
                {detail.full_name}
              </h2>
              <p className="text-white/50 text-xs mt-2">
                {detail.booking_reference} · {detail.tour_title}
              </p>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-[#F8F4EA] p-4 rounded-xl">
                  <span className="text-xs text-[#888]">Type</span>
                  <b className="block">{detail.traveller_type}</b>
                </div>
                <div className="bg-[#F8F4EA] p-4 rounded-xl">
                  <span className="text-xs text-[#888]">Nationality</span>
                  <b className="block">
                    {detail.nationality || "Not supplied"}
                  </b>
                </div>
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold">Requirements</h3>
                <p className="text-sm mt-3">
                  <b>Dietary:</b> {detail.dietary_requirements || "None"}
                </p>
                <p className="text-sm mt-2">
                  <b>Accessibility:</b>{" "}
                  {detail.accessibility_requirements || "None"}
                </p>
                <p className="text-sm mt-2">
                  <b>Special requests:</b> {detail.special_requests || "None"}
                </p>
              </div>
              <label className="block text-xs font-bold">
                Document status
                <select
                  value={detail.document_status}
                  onChange={(e) =>
                    update(detail.id, { document_status: e.target.value })
                  }
                  className="w-full h-11 border rounded-xl px-3 mt-2"
                >
                  <option value="not_required">Not required</option>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="expired">Expired</option>
                </select>
              </label>
              <button
                onClick={() => {
                  sessionStorage.setItem(
                    "kobani_admin_booking_id",
                    detail.booking_id,
                  );
                  onNavigate("admin-booking-detail");
                }}
                className="w-full bg-[#C6A15B] rounded-xl py-3 font-bold"
              >
                View booking
              </button>
            </div>
          </aside>
        </>
      )}
    </AdminShell>
  );
}
