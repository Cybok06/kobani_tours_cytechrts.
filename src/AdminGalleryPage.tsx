import { useCallback, useEffect, useRef, useState } from "react";
import type { Page } from "./App";
import { AdminShell } from "./AdminProductsPage";
import {
  ApiError,
  galleryApi,
  mediaApi,
  type ArticleImage,
  type GalleryItem,
} from "./api";

const uploadedDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
const field = "admin-input w-full";

export default function AdminGalleryPage({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  const [items, setItems] = useState<GalleryItem[]>([]),
    [categories, setCategories] = useState<{ name: string; count: number }[]>(
      [],
    );
  const [search, setSearch] = useState(""),
    [categoryFilter, setCategoryFilter] = useState(""),
    [dateFrom, setDateFrom] = useState(""),
    [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [uploadOpen, setUploadOpen] = useState(false),
    [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]),
    [selecting, setSelecting] = useState(false),
    [notice, setNotice] = useState("");
  const [files, setFiles] = useState<File[]>([]),
    [previews, setPreviews] = useState<string[]>([]),
    [uploadedCount, setUploadedCount] = useState(0),
    [title, setTitle] = useState(""),
    [category, setCategory] = useState(""),
    [location, setLocation] = useState(""),
    [caption, setCaption] = useState(""),
    [altText, setAltText] = useState(""),
    [isPublic, setIsPublic] = useState(true),
    [uploadError, setUploadError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await galleryApi.adminList({
        search,
        category: categoryFilter,
        date_from: dateFrom,
        date_to: dateTo,
        limit: 100,
      });
      setItems(response.data.items);
      setCategories(response.data.categories);
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.code : "SERVER_ERROR");
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, dateFrom, dateTo]);
  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [load]);
  useEffect(
    () => () => {
      previews.forEach((value) => URL.revokeObjectURL(value));
    },
    [previews],
  );

  const chooseFiles = (chosen?: FileList | null) => {
    if (!chosen?.length) return;
    previews.forEach((value) => URL.revokeObjectURL(value));
    const next = Array.from(chosen).slice(0, 20);
    setFiles(next);
    setPreviews(next.map((value) => URL.createObjectURL(value)));
    setUploadedCount(0);
    setUploadError(
      chosen.length > 20
        ? "A maximum of 20 images can be uploaded in one album."
        : "",
    );
  };
  const resetUpload = () => {
    previews.forEach((value) => URL.revokeObjectURL(value));
    setFiles([]);
    setPreviews([]);
    setUploadedCount(0);
    setTitle("");
    setCategory("");
    setLocation("");
    setCaption("");
    setAltText("");
    setIsPublic(true);
    setUploadError("");
    setUploadOpen(false);
  };
  const upload = async () => {
    const missing = [
      !files.length && "Choose one or more images.",
      !title.trim() && "Enter an album title.",
      !category.trim() && "Enter a category.",
      !altText.trim() && "Enter image alt text.",
    ].filter(Boolean);
    if (missing.length) {
      setUploadError(missing.join(" "));
      return;
    }
    setUploading(true);
    setUploadError("");
    try {
      const images: ArticleImage[] = [];
      for (let index = 0; index < files.length; index += 1) {
        images.push(
          (await mediaApi.uploadImage(files[index], "gallery_image")).data
            .image,
        );
        setUploadedCount(index + 1);
      }
      const shared = {
        title: title.trim(),
        category: category.trim(),
        location: location.trim(),
        caption: caption.trim(),
        alt_text: altText.trim(),
        is_public: isPublic,
      };
      if (images.length > 1)
        await galleryApi.createBatch({ ...shared, images });
      else await galleryApi.create({ ...shared, image: images[0] });
      const count = images.length;
      resetUpload();
      setNotice(
        count > 1
          ? `${count} images uploaded as one album.`
          : "Image uploaded to Cloudflare and added to the gallery.",
      );
      await load();
      setTimeout(() => setNotice(""), 3500);
    } catch (reason) {
      setUploadError(
        reason instanceof ApiError
          ? reason.code.replaceAll("_", " ")
          : "Could not upload the gallery image",
      );
    } finally {
      setUploading(false);
    }
  };
  const removeSelected = async () => {
    if (
      !selected.length ||
      !confirm(`Remove ${selected.length} selected image(s) from the gallery?`)
    )
      return;
    await Promise.all(selected.map((id) => galleryApi.remove(id)));
    setSelected([]);
    setSelecting(false);
    await load();
  };
  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  const visibility = async (item: GalleryItem) => {
    await galleryApi.update(item.id, { is_public: !item.is_public });
    await load();
  };

  return (
    <AdminShell title="Gallery" active="Gallery" onNavigate={onNavigate}>
      {notice && (
        <div className="fixed left-1/2 top-5 z-[110] -translate-x-1/2 rounded-xl bg-[#27855C] px-5 py-3 text-xs font-bold text-white shadow-xl">
          ✓ {notice}
        </div>
      )}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="eyebrow">Media library</p>
          <h1 className="page-title">Gallery</h1>
          <p className="sub">
            Upload and organise the images displayed in the public gallery.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelecting(!selecting);
              setSelected([]);
            }}
            className="admin-outline"
          >
            {selecting ? "Cancel Selection" : "Select Images"}
          </button>
          <button onClick={() => setUploadOpen(true)} className="admin-gold">
            ⇧ Upload Image
          </button>
        </div>
      </div>
      <section className="my-6 rounded-2xl border bg-white p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(220px,1fr)_220px_170px_170px]">
          <input
            className={field}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by media title, category or location…"
          />
          <select
            className={field}
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name} ({item.count})
              </option>
            ))}
          </select>
          <label className="text-[10px] text-[#777]">
            Uploaded from
            <input
              type="date"
              className={`${field} mt-1`}
              value={dateFrom}
              onChange={(event) => setDateFrom(event.target.value)}
            />
          </label>
          <label className="text-[10px] text-[#777]">
            Uploaded to
            <input
              type="date"
              className={`${field} mt-1`}
              value={dateTo}
              onChange={(event) => setDateTo(event.target.value)}
            />
          </label>
        </div>
      </section>
      {selecting && (
        <div className="sticky top-24 z-20 mb-5 flex items-center gap-3 rounded-xl bg-black px-5 py-3 text-white shadow-xl">
          <b>{selected.length} selected</b>
          <button
            onClick={() => setSelected(items.map((item) => item.id))}
            className="ml-auto text-xs"
          >
            Select all
          </button>
          <button
            disabled={!selected.length}
            onClick={removeSelected}
            className="text-xs text-red-300 disabled:opacity-40"
          >
            Delete selected
          </button>
        </div>
      )}
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-2xl bg-[#EEE8DD]"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border bg-white p-12 text-center">
          <b>Gallery could not be loaded ({error}).</b>
          <button onClick={load} className="admin-outline mt-4 block mx-auto">
            Try again
          </button>
        </div>
      ) : items.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {items.map((item) => (
            <article
              key={item.id}
              onClick={() => selecting && toggle(item.id)}
              className={`cursor-pointer overflow-hidden rounded-2xl border bg-white transition hover:-translate-y-1 ${selected.includes(item.id) ? "border-[#C6A15B] ring-2 ring-[#C6A15B]" : "border-[#E8E1D3]"}`}
            >
              <div className="relative aspect-[4/3] bg-[#EEE8DD]">
                <img
                  src={item.image.url}
                  alt={item.alt_text}
                  className="h-full w-full object-cover"
                />
                {selecting && (
                  <span
                    className={`absolute left-3 top-3 grid h-7 w-7 place-items-center rounded-md border-2 ${selected.includes(item.id) ? "border-[#C6A15B] bg-[#C6A15B]" : "border-white bg-white"}`}
                  >
                    {selected.includes(item.id) ? "✓" : ""}
                  </span>
                )}
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    visibility(item);
                  }}
                  className={`absolute right-3 top-3 pill ${item.is_public ? "success" : "neutral"}`}
                >
                  {item.is_public ? "Public" : "Private"}
                </button>
                {item.album_id && <span className="absolute bottom-3 left-3 rounded-full bg-black/75 px-3 py-1.5 text-[9px] font-bold text-white">Album · {item.album_position}/{item.album_size}</span>}
              </div>
              <div className="p-4">
                <h2 className="font-serif text-lg font-bold">{item.title}</h2>
                <p className="mt-1 text-[10px] text-[#8B826F]">
                  {item.category}
                  {item.location ? ` · ${item.location}` : ""}
                </p>
                {item.caption && (
                  <p className="mt-3 line-clamp-2 text-xs text-[#777]">
                    {item.caption}
                  </p>
                )}
                <div className="mt-4 flex justify-between border-t pt-3 text-[10px] text-[#999]">
                  <span>Cloudflare Image</span>
                  <time dateTime={item.uploaded_at}>
                    {uploadedDate(item.uploaded_at)}
                  </time>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border bg-white p-14 text-center">
          <h2 className="font-serif text-2xl font-bold">
            No gallery images found
          </h2>
          <p className="mt-2 text-xs text-[#777]">
            Upload an image or change the current filters.
          </p>
        </div>
      )}
      {uploadOpen && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-black/65 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !uploading)
              resetUpload();
          }}
        >
          <section className="my-6 w-full max-w-2xl overflow-hidden rounded-2xl bg-white">
            <header className="flex items-center border-b p-6">
              <div>
                <p className="eyebrow">Cloudflare media</p>
                <h2 className="font-serif text-2xl font-bold">
                  Upload Gallery Images
                </h2>
              </div>
              <button
                disabled={uploading}
                onClick={resetUpload}
                className="ml-auto text-2xl"
              >
                ×
              </button>
            </header>
            <div className="space-y-5 p-6">
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={(event) => chooseFiles(event.target.files)}
              />
              {uploading ? (
                <div className="rounded-2xl border-2 border-[#C6A15B]/50 bg-[#FCF9F2] p-10 text-center">
                  <span className="mx-auto block h-11 w-11 animate-spin rounded-full border-4 border-[#E7DCC5] border-t-[#C6A15B]" />
                  <b className="mt-4 block">Uploading to Cloudflare…</b>
                  <p className="mt-1 text-xs text-[#888]">
                    {uploadedCount} of {files.length} images secured
                  </p>
                  <div className="mx-auto mt-4 h-1.5 max-w-sm overflow-hidden rounded-full bg-[#E7DCC5]">
                    <div className="h-full rounded-full bg-[#C6A15B] transition-all" style={{ width: `${files.length ? (uploadedCount / files.length) * 100 : 0}%` }} />
                  </div>
                </div>
              ) : previews.length ? (
                <div className="relative overflow-hidden rounded-2xl bg-[#EEE8DD] p-2">
                  <div className="grid max-h-80 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
                    {previews.map((value, index) => <div key={value} className="relative aspect-square overflow-hidden rounded-xl"><img src={value} alt={`Selected image ${index + 1}`} className="h-full w-full object-cover" /><span className="absolute bottom-1 right-1 rounded-full bg-black/70 px-2 py-1 text-[9px] text-white">{index + 1}</span></div>)}
                  </div>
                  <span className="absolute left-4 top-4 rounded-full bg-[#C6A15B] px-3 py-1.5 text-[10px] font-bold">{files.length} {files.length === 1 ? "image" : "images"} selected</span>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute bottom-3 right-3 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white"
                  >
                    Change selection
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full rounded-2xl border-2 border-dashed border-[#D8CBAF] bg-[#FCF9F2] p-12 text-center"
                >
                  <b className="block text-3xl text-[#C6A15B]">⇧</b>
                  <b className="mt-3 block">Choose one or multiple images</b>
                  <p className="mt-1 text-xs text-[#888]">
                    JPG, PNG or WebP · Up to 20 images · Maximum 8 MB each
                  </p>
                </button>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="form-field">
                  <span>Album title *</span>
                  <input
                    className={field}
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                  />
                </label>
                <label className="form-field">
                  <span>Category *</span>
                  <input
                    className={field}
                    list="gallery-category-options"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    placeholder="e.g. Historical Tours"
                  />
                  <datalist id="gallery-category-options">
                    {categories.map((item) => (
                      <option key={item.name} value={item.name} />
                    ))}
                  </datalist>
                </label>
                <label className="form-field">
                  <span>Location</span>
                  <input
                    className={field}
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="Cape Coast, Ghana"
                  />
                </label>
                <label className="form-field">
                  <span>Image alt text *</span>
                  <input
                    className={field}
                    value={altText}
                    onChange={(event) => setAltText(event.target.value)}
                    placeholder="Describe what appears in the image"
                  />
                </label>
              </div>
              <label className="form-field">
                <span>Caption</span>
                <textarea
                  className={`${field} min-h-24 py-3`}
                  value={caption}
                  onChange={(event) => setCaption(event.target.value)}
                />
              </label>
              <label className="flex items-center gap-3 text-xs">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(event) => setIsPublic(event.target.checked)}
                  className="h-4 w-4 accent-[#C6A15B]"
                />
                Display this album on the public Gallery page
              </label>
              {uploadError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-800">
                  <b>Upload failed</b>
                  <p className="mt-1">{uploadError}</p>
                </div>
              )}
            </div>
            <footer className="flex justify-end gap-2 border-t bg-[#FAF8F3] p-5">
              <button
                disabled={uploading}
                onClick={resetUpload}
                className="admin-outline"
              >
                Cancel
              </button>
              <button
                disabled={uploading}
                onClick={upload}
                className="admin-gold disabled:opacity-50"
              >
                {uploading ? `Uploading ${uploadedCount}/${files.length}…` : files.length > 1 ? `Create Album with ${files.length} Images` : "Upload to Gallery"}
              </button>
            </footer>
          </section>
        </div>
      )}
    </AdminShell>
  );
}
