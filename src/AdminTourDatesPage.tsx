import { useEffect, useMemo, useState } from "react";
import type { Page } from "./App";
import { AdminShell } from "./AdminProductsPage";
import { ApiError, departureApi, Tour, TourDeparture, tourApi } from "./api";

const empty = {
  tour_id: "",
  start_date: "",
  end_date: "",
  capacity: "12",
  price: "",
  currency: "GHS",
  booking_deadline: "",
  status: "open",
  notes: "",
};
const errorText = (e: unknown) =>
  e instanceof ApiError
    ? e.code.replaceAll("_", " ")
    : "Unable to complete request";
export default function AdminTourDatesPage({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  const [departures, setDepartures] = useState<TourDeparture[]>([]),
    [tours, setTours] = useState<Tour[]>([]),
    [form, setForm] = useState(empty),
    [open, setOpen] = useState(false),
    [notice, setNotice] = useState(""),
    [search, setSearch] = useState(""),
    [status, setStatus] = useState(""),
    [saving, setSaving] = useState(false);
  const load = async () => {
    try {
      const [d, t] = await Promise.all([
        departureApi.list(),
        tourApi.adminList({ limit: 100 }),
      ]);
      setDepartures(d.data.departures);
      setTours(t.data.tours);
      setForm((f) => ({
        ...f,
        tour_id: f.tour_id || t.data.tours[0]?.id || "",
      }));
    } catch (e) {
      setNotice(errorText(e));
    }
  };
  useEffect(() => {
    load();
  }, []);
  const shown = useMemo(
    () =>
      departures.filter(
        (x) =>
          (!status || x.status === status) &&
          (!search ||
            `${x.tour_title} ${x.code}`
              .toLowerCase()
              .includes(search.toLowerCase())),
      ),
    [departures, status, search],
  );
  const save = async () => {
    if (!form.tour_id || !form.start_date || !form.end_date) {
      setNotice("Select a tour and enter both travel dates.");
      return;
    }
    setSaving(true);
    try {
      await departureApi.create({
        ...form,
        capacity: Number(form.capacity),
        price: Number(form.price),
      });
      setOpen(false);
      setForm({ ...empty, tour_id: tours[0]?.id || "" });
      setNotice("Departure created and capacity is now live.");
      await load();
    } catch (e) {
      setNotice(errorText(e));
    } finally {
      setSaving(false);
    }
  };
  const remove = async (x: TourDeparture) => {
    if (!confirm(`Remove departure ${x.code}?`)) return;
    try {
      await departureApi.remove(x.id);
      await load();
      setNotice("Departure removed.");
    } catch (e) {
      setNotice(errorText(e));
    }
  };
  const changeStatus = async (x: TourDeparture, value: string) => {
    try {
      await departureApi.update(x.id, { status: value });
      await load();
    } catch (e) {
      setNotice(errorText(e));
    }
  };
  const stats = {
    upcoming: departures.filter(
      (x) =>
        x.start_date >= new Date().toISOString().slice(0, 10) &&
        !["cancelled", "closed"].includes(x.status),
    ).length,
    places: departures.reduce((n, x) => n + x.available, 0),
    full: departures.filter((x) => x.status === "full").length,
  };
  const input = "h-11 border rounded-xl px-3 text-sm w-full";
  return (
    <AdminShell title="Tour Dates" active="Tour Dates" onNavigate={onNavigate}>
      <header className="h-20 bg-white border-b px-4 sm:px-8 flex items-center">
        <button
          onClick={() => onNavigate("admin-tours")}
          className="border rounded-xl px-4 py-2 text-sm"
        >
          ← Tours
        </button>
        <div className="ml-4">
          <h1 className="font-serif text-xl font-bold">
            Tour Dates & Capacity
          </h1>
          <p className="text-xs text-[#888]">
            Live operational inventory for every departure.
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="ml-auto bg-[#C6A15B] px-4 py-3 rounded-xl text-sm font-bold"
        >
          + Add Departure
        </button>
      </header>
      {notice && (
        <button
          onClick={() => setNotice("")}
          className="fixed z-40 top-20 left-1/2 -translate-x-1/2 bg-black text-white rounded-xl px-5 py-3 text-xs"
        >
          {notice}
        </button>
      )}
      <main className="max-w-[1400px] mx-auto p-4 sm:p-7">
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            ["Upcoming departures", stats.upcoming],
            ["Available places", stats.places],
            ["Fully booked", stats.full],
          ].map(([a, b]) => (
            <div className="bg-white border rounded-2xl p-5" key={a}>
              <span className="text-[10px] uppercase text-[#888]">{a}</span>
              <b className="font-serif text-3xl block mt-2">{b}</b>
            </div>
          ))}
        </div>
        <div className="bg-white border rounded-2xl p-4 mt-5 grid sm:grid-cols-2 gap-3">
          <input
            className={input}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tour or departure code…"
          />
          <select
            className={input}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All statuses</option>
            {["open", "limited", "full", "closed", "cancelled"].map((x) => (
              <option value={x} key={x}>
                {x}
              </option>
            ))}
          </select>
        </div>
        <section className="bg-white border rounded-2xl overflow-hidden mt-5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left">
              <thead className="bg-[#FCFAF5] text-[10px] uppercase text-[#888]">
                <tr>
                  {[
                    "Departure",
                    "Dates",
                    "Capacity",
                    "Availability",
                    "Price",
                    "Status",
                    "Action",
                  ].map((x) => (
                    <th className="px-5 py-3" key={x}>
                      {x}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shown.map((x) => (
                  <tr key={x.id} className="border-t text-sm">
                    <td className="px-5 py-4">
                      <b>{x.tour_title}</b>
                      <div className="text-xs text-[#888]">{x.code}</div>
                    </td>
                    <td className="px-5 py-4">
                      {x.start_date}
                      <div className="text-xs text-[#888]">to {x.end_date}</div>
                    </td>
                    <td className="px-5 py-4">
                      {x.booked} booked / {x.capacity}
                    </td>
                    <td className="px-5 py-4">
                      <div className="w-32 h-2 rounded-full bg-[#EDE6D9]">
                        <div
                          className="h-full bg-[#C6A15B] rounded-full"
                          style={{
                            width: `${Math.min(100, (x.booked / x.capacity) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-[#777]">
                        {x.available} remaining
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold">
                      {x.currency} {x.price.toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={x.status}
                        onChange={(e) => changeStatus(x, e.target.value)}
                        className="border rounded-lg px-2 py-1.5 text-xs"
                      >
                        {["open", "limited", "full", "closed", "cancelled"].map(
                          (s) => (
                            <option key={s}>{s}</option>
                          ),
                        )}
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => remove(x)}
                        className="border border-red-200 text-red-600 rounded-lg px-3 py-2 text-xs"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!shown.length && (
              <div className="p-14 text-center text-[#777]">
                No departures have been scheduled.
              </div>
            )}
          </div>
        </section>
      </main>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 grid place-items-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl">
            <div className="flex justify-between">
              <div>
                <h2 className="font-serif text-3xl font-bold">Add departure</h2>
                <p className="text-sm text-[#777]">
                  Capacity and availability are calculated by the backend.
                </p>
              </div>
              <button onClick={() => setOpen(false)} className="text-2xl">
                ×
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              <label className="sm:col-span-2">
                <span className="text-xs">Tour</span>
                <select
                  className={`${input} mt-1`}
                  value={form.tour_id}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, tour_id: e.target.value }))
                  }
                >
                  {tours.map((x) => (
                    <option value={x.id} key={x.id}>
                      {x.title}
                    </option>
                  ))}
                </select>
              </label>
              {[
                ["Start date", "start_date", "date"],
                ["End date", "end_date", "date"],
                ["Capacity", "capacity", "number"],
                ["Price per adult", "price", "number"],
                ["Booking deadline", "booking_deadline", "date"],
              ].map(([label, key, type]) => (
                <label key={key}>
                  <span className="text-xs">{label}</span>
                  <input
                    type={type}
                    className={`${input} mt-1`}
                    value={form[key as keyof typeof form]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                  />
                </label>
              ))}
              <label>
                <span className="text-xs">Currency</span>
                <input
                  className={`${input} mt-1`}
                  value={form.currency}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, currency: e.target.value }))
                  }
                />
              </label>
              <label className="sm:col-span-2">
                <span className="text-xs">Operations notes</span>
                <textarea
                  className="border rounded-xl p-3 w-full mt-1"
                  rows={3}
                  value={form.notes}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notes: e.target.value }))
                  }
                />
              </label>
            </div>
            <button
              disabled={saving}
              onClick={save}
              className="w-full bg-[#C6A15B] rounded-xl py-3 font-bold mt-6"
            >
              {saving ? "Creating…" : "Create departure"}
            </button>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
