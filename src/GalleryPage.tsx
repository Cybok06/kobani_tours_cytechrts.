import { useCallback, useEffect, useMemo, useState } from "react";
import type { Page } from "./App";
import { ApiError, galleryApi, type GalleryItem } from "./api";
import {
  SearchIcon,
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightIcon,
} from "./icons";

const uploadedDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));

export default function GalleryPage({
  onNavigate,
}: {
  onNavigate: (page: Page) => void;
}) {
  const initial = new URLSearchParams(location.search);
  const [items, setItems] = useState<GalleryItem[]>([]),
    [categories, setCategories] = useState<{ name: string; count: number }[]>(
      [],
    );
  const [search, setSearch] = useState(initial.get("search") || ""),
    [category, setCategory] = useState(initial.get("category") || ""),
    [dateFrom, setDateFrom] = useState(initial.get("date_from") || ""),
    [dateTo, setDateTo] = useState(initial.get("date_to") || "");
  const [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [activeAlbum, setActiveAlbum] = useState<string | null>(null),
    [lightbox, setLightbox] = useState<number | null>(null),
    [total, setTotal] = useState(0);
  const albums = useMemo(() => {
    const grouped = new Map<string, GalleryItem[]>();
    items.forEach((item) => { const key = item.album_id || item.id; grouped.set(key, [...(grouped.get(key) || []), item]) });
    return Array.from(grouped, ([key, albumItems]) => ({ key, items: albumItems.sort((a, b) => (a.album_position || 1) - (b.album_position || 1)), cover: albumItems[0] }));
  }, [items]);
  const activeItems = activeAlbum ? albums.find((album) => album.key === activeAlbum)?.items || [] : [];
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await galleryApi.publicList({
        search,
        category,
        date_from: dateFrom,
        date_to: dateTo,
        limit: 100,
      });
      setItems(response.data.items);
      setCategories(response.data.categories);
      setTotal(response.data.pagination.total);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      if (dateFrom) params.set("date_from", dateFrom);
      if (dateTo) params.set("date_to", dateTo);
      history.replaceState(
        {},
        "",
        `/gallery${params.toString() ? `?${params}` : ""}`,
      );
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.code : "SERVER_ERROR");
    } finally {
      setLoading(false);
    }
  }, [search, category, dateFrom, dateTo]);
  useEffect(() => {
    const timer = setTimeout(load, 350);
    return () => clearTimeout(timer);
  }, [load]);
  useEffect(() => {
    if (lightbox === null) return;
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
      if (event.key === "ArrowLeft")
        setLightbox((index) =>
          index === null ? null : (index - 1 + activeItems.length) % activeItems.length,
        );
      if (event.key === "ArrowRight")
        setLightbox((index) =>
          index === null ? null : (index + 1) % activeItems.length,
        );
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [lightbox, activeItems.length]);
  const clear = () => {
    setSearch("");
    setCategory("");
    setDateFrom("");
    setDateTo("");
  };
  const active = lightbox === null ? null : activeItems[lightbox];
  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#0B0B0B]">
      <section className="relative overflow-hidden bg-[#0B0B0B] px-4 py-20 text-white sm:py-28">
        <div className="absolute inset-0 bg-[url('/images/hero_section/tourss.jpg')] bg-cover bg-center opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-black/20" />
        <div className="relative mx-auto max-w-[1240px]">
          <p className="text-xs font-bold uppercase tracking-[.24em] text-[#C6A15B]">
            The KOBANI Gallery
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl font-bold leading-tight sm:text-7xl">
            Moments worth remembering.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/65">
            Explore destinations, heritage and luxury experiences captured
            across KOBANI journeys.
          </p>
        </div>
      </section>
      <section className="sticky top-16 z-30 border-b border-[#E6DFD2] bg-[#FFFDF8]/95 px-4 py-4 backdrop-blur">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_220px_170px_170px]">
            <div className="flex items-center rounded-xl border border-[#E2DBCE] bg-white px-3">
              <SearchIcon size={16} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-11 min-w-0 flex-1 px-2 text-xs outline-none"
                placeholder="Search by title, category or location…"
              />
            </div>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-xl border border-[#E2DBCE] bg-white px-3 text-xs"
            >
              <option value="">All categories</option>
              {categories.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name} ({item.count})
                </option>
              ))}
            </select>
            <label className="text-[9px] uppercase tracking-wider text-[#777]">
              Uploaded from
              <input
                type="date"
                value={dateFrom}
                onChange={(event) => setDateFrom(event.target.value)}
                className="mt-1 block h-10 w-full rounded-xl border border-[#E2DBCE] bg-white px-2 text-xs normal-case"
              />
            </label>
            <label className="text-[9px] uppercase tracking-wider text-[#777]">
              Uploaded to
              <input
                type="date"
                value={dateTo}
                onChange={(event) => setDateTo(event.target.value)}
                className="mt-1 block h-10 w-full rounded-xl border border-[#E2DBCE] bg-white px-2 text-xs normal-case"
              />
            </label>
          </div>
          <div className="mt-3 flex items-center text-[10px] text-[#888]">
            <span>
              {total} {total === 1 ? "image" : "images"} · {albums.length} {albums.length === 1 ? "album" : "albums"}
            </span>
            {(search || category || dateFrom || dateTo) && (
              <button
                onClick={clear}
                className="ml-auto font-bold text-[#C6A15B]"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </section>
      <main className="mx-auto max-w-[1240px] px-4 py-12">
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-[4/3] animate-pulse rounded-2xl bg-[#EEE8DD]"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border bg-white p-14 text-center">
            <h2 className="font-serif text-2xl font-bold">
              Gallery temporarily unavailable
            </h2>
            <p className="mt-2 text-xs text-[#777]">{error}</p>
            <button
              onClick={load}
              className="mt-5 rounded-full bg-[#0B0B0B] px-6 py-3 text-xs font-bold text-white"
            >
              Try again
            </button>
          </div>
        ) : albums.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((album) => (
              <article
                key={album.key}
                onClick={() => { setActiveAlbum(album.key); setLightbox(0) }}
                className="group cursor-zoom-in overflow-hidden rounded-2xl border border-[#E6DFD2] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`grid aspect-[4/3] gap-0.5 overflow-hidden bg-[#E8E1D3] ${album.items.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                  {album.items.slice(0, 4).map((item, imageIndex) => <div key={item.id} className={`relative overflow-hidden ${album.items.length === 3 && imageIndex === 0 ? "row-span-2" : ""}`}><img src={item.image.url} alt={item.alt_text} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />{imageIndex === 3 && album.items.length > 4 && <span className="absolute inset-0 grid place-items-center bg-black/60 font-serif text-3xl font-bold text-white">+{album.items.length - 3}</span>}</div>)}
                </div>
                <div className="p-5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#C6A15B]">
                    {album.cover.category}
                  </span>
                  <div className="mt-1 flex items-start gap-3"><h2 className="font-serif text-xl font-bold">{album.cover.album_title || album.cover.title}</h2>{album.items.length > 1 && <span className="ml-auto whitespace-nowrap rounded-full bg-[#F2EADB] px-2.5 py-1 text-[9px] font-bold">▧ {album.items.length} photos</span>}</div>
                  <div className="mt-3 flex justify-between text-[10px] text-[#777]">
                    <span>{album.cover.location}</span>
                    <time dateTime={album.cover.uploaded_at}>
                      {uploadedDate(album.cover.uploaded_at)}
                    </time>
                  </div>
                  {album.cover.caption && <p className="mt-3 line-clamp-2 text-xs leading-5 text-[#777]">{album.cover.caption}</p>}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border bg-white p-16 text-center">
            <h2 className="font-serif text-3xl font-bold">No images found</h2>
            <p className="mt-3 text-sm text-[#777]">
              Try another title, category or upload-date range.
            </p>
            <button
              onClick={clear}
              className="mt-6 rounded-full bg-[#0B0B0B] px-6 py-3 text-xs font-bold text-white"
            >
              Clear filters
            </button>
          </div>
        )}
      </main>
      <section className="bg-[#0B0B0B] px-4 py-16 text-center text-white">
        <p className="text-xs font-bold uppercase tracking-widest text-[#C6A15B]">
          Experience the story
        </p>
        <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">
          See these moments for yourself.
        </h2>
        <button
          onClick={() => onNavigate("tours")}
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#C6A15B] px-7 py-3 text-xs font-bold text-black"
        >
          Explore Tours <ArrowRightIcon size={14} />
        </button>
      </section>
      {active && lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/95 p-4"
          role="dialog"
          aria-modal="true"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) { setLightbox(null); setActiveAlbum(null) }
          }}
        >
          <button
            onClick={() => { setLightbox(null); setActiveAlbum(null) }}
            className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white"
            aria-label="Close"
          >
            <XIcon size={20} />
          </button>
          {activeItems.length > 1 && (
            <>
              <button
                onClick={() =>
                  setLightbox((lightbox - 1 + activeItems.length) % activeItems.length)
                }
                className="absolute left-3 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white sm:left-6"
                aria-label="Previous"
              >
                <ChevronLeftIcon size={22} />
              </button>
              <button
                onClick={() => setLightbox((lightbox + 1) % activeItems.length)}
                className="absolute right-3 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white sm:right-6"
                aria-label="Next"
              >
                <ChevronRightIcon size={22} />
              </button>
            </>
          )}
          <figure className="max-h-[92vh] max-w-6xl">
            <img
              src={active.image.url}
              alt={active.alt_text}
              className="max-h-[78vh] max-w-full rounded-xl object-contain"
            />
            <figcaption className="mt-4 text-center text-white">
              <h2 className="font-serif text-xl font-bold">{active.title}</h2>
              {activeItems.length > 1 && <p className="mt-1 text-[10px] font-bold text-[#C6A15B]">Photo {lightbox + 1} of {activeItems.length}</p>}
              <p className="mt-1 text-xs text-white/60">
                {active.category}
                {active.location ? ` · ${active.location}` : ""} · Uploaded{" "}
                {uploadedDate(active.uploaded_at)}
              </p>
              {active.caption && (
                <p className="mx-auto mt-2 max-w-xl text-xs text-white/70">
                  {active.caption}
                </p>
              )}
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}
