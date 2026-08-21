import { useEffect, useMemo, useRef, useState } from "react"
import type { Page } from "./App"
import { ApiError, articleApi, resolveMediaUrl, type ArticleCategory, type ArticleImage, type ArticleInput } from "./api"

const input = "w-full rounded-xl border border-[#E2DBCE] bg-white px-3.5 text-sm outline-none focus:border-[#C6A15B] focus:ring-2 focus:ring-[#C6A15B]/10"
const Field = ({ label, children, help }: { label: string; children: React.ReactNode; help?: string }) => <label className="block"><span className="text-xs font-bold">{label}</span>{help && <span className="ml-2 text-[9px] text-[#9A9590]">{help}</span>}<div className="mt-2">{children}</div></label>
const Card = ({ title, children }: { title: string; children: React.ReactNode }) => <section className="rounded-2xl border border-[#E6DFD2] bg-white p-5 sm:p-6"><h2 className="mb-5 font-serif text-lg font-bold">{title}</h2>{children}</section>
const htmlFromText = (text: string) => text.split(/\n{2,}/).filter(Boolean).map(paragraph => `<p>${paragraph.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>")}</p>`).join("")
const textFromHtml = (value = "") => value.replace(/<br\s*\/?\s*>/gi, "\n").replace(/<\/p>/gi, "\n\n").replace(/<[^>]+>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").trim()

export default function ContributorArticleEditor({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const editingId = sessionStorage.getItem("kobani:editingArticleId") || ""
  const [articleId, setArticleId] = useState(editingId)
  const [categories, setCategories] = useState<ArticleCategory[]>([])
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [image, setImage] = useState<ArticleImage | undefined>()
  const [altText, setAltText] = useState("")
  const [caption, setCaption] = useState("")
  const [tags, setTags] = useState("")
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [featured, setFeatured] = useState(false)
  const [editorsPick, setEditorsPick] = useState(false)
  const [scheduleAt, setScheduleAt] = useState("")
  const [status, setStatus] = useState("draft")
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [publishErrors, setPublishErrors] = useState<string[]>([])
  const [preview, setPreview] = useState(false)
  const [publishedModal, setPublishedModal] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const generatedSlug = useMemo(() => title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), [title])
  const words = content.trim() ? content.trim().split(/\s+/).length : 0

  useEffect(() => { (async () => {
    try {
      const categoryResponse = await articleApi.categories(); setCategories(categoryResponse.data.categories)
      if (!categoryId && categoryResponse.data.categories[0]) setCategoryId(categoryResponse.data.categories[0].id)
      if (editingId) {
        const article = (await articleApi.adminDetail(editingId)).data.article
        setTitle(article.title); setSlug(article.slug); setExcerpt(article.excerpt); setContent(textFromHtml(article.content_html)); setCategoryId(article.category.id)
        setImage(article.featured_image); setAltText(article.featured_image?.alt_text || ""); setCaption(article.featured_image?.caption || "")
        setTags((article.tags || []).join(", ")); setMetaTitle(String(article.seo?.meta_title || "")); setMetaDescription(String(article.seo?.meta_description || ""))
        setFeatured(article.is_featured); setEditorsPick(article.is_editors_pick); setStatus(article.status)
        if (article.scheduled_for) setScheduleAt(new Date(article.scheduled_for).toISOString().slice(0,16))
      }
    } catch (reason) { setMessage(reason instanceof ApiError ? reason.code : "Could not load the editor") }
    finally { setLoading(false) }
  })() }, [])

  const payload = (nextStatus: string): ArticleInput => ({ title, slug: slug || generatedSlug, excerpt, content_html: htmlFromText(content), category_id: categoryId, status: nextStatus,
    ...(nextStatus === "scheduled" ? { scheduled_for: new Date(scheduleAt).toISOString() } : {}),
    featured_image: image ? { ...image, alt_text: altText.trim(), caption: caption.trim() } : undefined,
    is_featured: featured, is_editors_pick: editorsPick, tags: tags.split(",").map(item => item.trim()).filter(Boolean),
    seo: { meta_title: metaTitle.trim() || title, meta_description: metaDescription.trim() || excerpt, keywords: tags.split(",").map(item => item.trim()).filter(Boolean), allow_indexing: nextStatus === "published" },
  })
  const save = async (nextStatus: string) => {
    const missing: string[] = []
    if (!title.trim()) missing.push("Add an article title.")
    if (!categoryId) missing.push("Select an article category.")
    if (!content.trim()) missing.push("Write the article content.")
    if (nextStatus === "published" || nextStatus === "scheduled") {
      if (!image?.url) missing.push("Upload a featured image.")
      if (!altText.trim()) missing.push("Add descriptive alt text for the featured image.")
    }
    if (nextStatus === "scheduled" && !scheduleAt) missing.push("Choose a future publication date and time.")
    if (missing.length) { setPublishErrors(missing); setMessage(""); return }
    setPublishErrors([]); setBusy(true); setMessage("")
    try {
      if (nextStatus === "scheduled" && !scheduleAt) throw new ApiError("INVALID_SCHEDULE_DATE")
      const response = articleId ? await articleApi.update(articleId, payload(nextStatus)) : await articleApi.create(payload(nextStatus))
      setArticleId(response.data.article.id); sessionStorage.setItem("kobani:editingArticleId", response.data.article.id); setStatus(response.data.article.status)
      if (nextStatus === "published") {
        setMessage(""); setPublishedModal(true)
        window.setTimeout(() => { sessionStorage.removeItem("kobani:editingArticleId"); sessionStorage.removeItem("kobani:articleEditorOrigin"); onNavigate("admin-articles") }, 2200)
      } else setMessage(nextStatus === "scheduled" ? "Article scheduled successfully." : "Draft saved successfully.")
    } catch (reason) {
      const code = reason instanceof ApiError ? reason.code : "SERVER_ERROR"
      const explanations: Record<string, string> = {
        ARTICLE_TITLE_REQUIRED: "Add an article title.", ARTICLE_CONTENT_REQUIRED: "Write the article content.",
        CATEGORY_NOT_FOUND: "Select a valid active category.", ARTICLE_SLUG_EXISTS: "This article URL is already in use. Change the slug.",
        IMAGE_REQUIRED: "Upload a featured image and add its alt text before publishing.",
        INVALID_SCHEDULE_DATE: "Choose a future publication date and time.", SERVER_ERROR: "The server could not save the article. Check the backend terminal log.",
      }
      setPublishErrors([explanations[code] || code.replaceAll("_", " ")]); setMessage("")
    }
    finally { setBusy(false) }
  }
  const upload = async (file?: File) => {
    if (!file) return; setBusy(true); setUploading(true); setUploadError(""); setMessage("")
    try { const uploaded = (await articleApi.uploadImage(file)).data.image; setImage(uploaded); setMessage("Featured image uploaded to Cloudflare successfully.") }
    catch (reason) { const text = reason instanceof ApiError ? reason.code.replaceAll("_", " ") : "Could not reach the image upload service"; setUploadError(text); setMessage("") }
    finally { setBusy(false); setUploading(false); if (fileRef.current) fileRef.current.value = "" }
  }
  const back = () => { sessionStorage.removeItem("kobani:editingArticleId"); const origin = sessionStorage.getItem("kobani:articleEditorOrigin"); sessionStorage.removeItem("kobani:articleEditorOrigin"); onNavigate(origin === "admin-articles" ? "admin-articles" : "contributor-dashboard") }

  if (loading) return <div className="min-h-screen bg-[#F8F4EA] p-6"><div className="mx-auto max-w-5xl space-y-4">{[1,2,3,4].map(i => <div key={i} className="h-28 animate-pulse rounded-2xl bg-white" />)}</div></div>
  return <div className="min-h-screen bg-[#F8F4EA] text-[#0B0B0B]">
    <header className="sticky top-0 z-40 flex min-h-16 items-center gap-3 bg-[#0B0B0B] px-4 text-white sm:px-6"><button onClick={back} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10" aria-label="Back">←</button><span className="grid h-8 w-8 place-items-center rounded-full bg-[#C6A15B] font-black text-black">K</span><div><h1 className="font-serif font-bold">{articleId ? "Edit Article" : "New Article"}</h1><p className="text-[9px] capitalize text-[#888]">{status} · {words} words · {Math.max(1, Math.ceil(words / 220))} min read</p></div><button onClick={() => setPreview(true)} className="ml-auto rounded-xl border border-white/20 px-4 py-2 text-xs font-bold">Preview</button></header>
    <main className="mx-auto grid max-w-[1400px] gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_330px]">
      <div className="space-y-5">
        {message && <div className={`rounded-xl border p-4 text-xs font-semibold ${message.includes("success") || message.includes("live") || message.includes("uploaded") ? "border-green-200 bg-green-50 text-green-800" : "border-[#E2DBCE] bg-white"}`}>{message}</div>}
        <Card title="Article details"><div className="space-y-5"><Field label="Title"><input className={`${input} h-12 font-serif text-lg font-bold`} value={title} onChange={event => setTitle(event.target.value)} placeholder="Enter a compelling article title" /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Slug"><input className={`${input} h-11`} value={slug || generatedSlug} onChange={event => setSlug(event.target.value)} /></Field><Field label="Category"><select className={`${input} h-11`} value={categoryId} onChange={event => setCategoryId(event.target.value)}>{categories.filter(category => category.is_active !== false).map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select></Field></div><Field label="Excerpt" help="Shown on the homepage and article cards"><textarea className={`${input} resize-none py-3`} rows={4} maxLength={300} value={excerpt} onChange={event => setExcerpt(event.target.value)} /></Field><Field label="Tags" help="Separate with commas"><input className={`${input} h-11`} value={tags} onChange={event => setTags(event.target.value)} placeholder="Ghana, Heritage, Culture" /></Field></div></Card>
        <Card title="Featured image"><input ref={fileRef} type="file" className="hidden" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={event => upload(event.target.files?.[0])} />{uploading ? <div className="overflow-hidden rounded-2xl border-2 border-[#C6A15B]/50 bg-[#FFFDF8] px-6 py-12 text-center" role="status" aria-live="polite"><span className="mx-auto block h-10 w-10 animate-spin rounded-full border-4 border-[#E7DCC5] border-t-[#C6A15B]" /><b className="mt-4 block text-sm">Uploading to Cloudflare…</b><p className="mt-1 text-[10px] text-[#888]">Please keep this page open while your image is secured.</p><div className="mx-auto mt-5 h-1.5 max-w-sm overflow-hidden rounded-full bg-[#E7DCC5]"><div className="h-full w-1/2 animate-[pulse_1s_ease-in-out_infinite] rounded-full bg-[#C6A15B]" /></div></div> : image ? <div><div className="relative overflow-hidden rounded-2xl bg-[#F2EEE5]"><img src={resolveMediaUrl(image.url)} alt={altText} className="aspect-[16/9] w-full object-cover" /><div className="absolute left-3 top-3 rounded-full bg-[#27855C] px-3 py-1.5 text-[10px] font-bold text-white">✓ Uploaded to Cloudflare</div><button disabled={uploading} onClick={() => fileRef.current?.click()} className="absolute bottom-3 right-3 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white disabled:opacity-50">Replace image</button></div><div className="mt-3 rounded-xl border border-green-200 bg-green-50 p-3"><p className="text-[10px] font-bold text-green-800">Cloudflare delivery URL</p><a href={image.url} target="_blank" rel="noreferrer" className="mt-1 block break-all text-[10px] text-green-700 underline">{image.url}</a></div></div> : <button disabled={uploading} onClick={() => fileRef.current?.click()} className="flex w-full flex-col items-center rounded-2xl border-2 border-dashed border-[#D9D0C2] bg-[#FFFDF8] py-12 disabled:cursor-wait disabled:opacity-60"><b className="text-sm">Upload featured image</b><p className="mt-1 text-[10px] text-[#888]">JPG, PNG or WebP · Maximum 8 MB</p></button>}{uploadError && <div role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-800"><b>Image upload failed</b><p className="mt-1">{uploadError}. Confirm the KOBANI backend was restarted, then try again.</p></div>}<div className="mt-3 grid gap-3 sm:grid-cols-2"><input disabled={uploading} className={`${input} h-11 disabled:opacity-50`} value={altText} onChange={event => setAltText(event.target.value)} placeholder="Required image alt text" /><input disabled={uploading} className={`${input} h-11 disabled:opacity-50`} value={caption} onChange={event => setCaption(event.target.value)} placeholder="Image caption or credit" /></div></Card>
        <Card title="Article content"><textarea className={`${input} min-h-[500px] resize-y p-5 font-serif leading-7`} value={content} onChange={event => setContent(event.target.value)} placeholder="Begin your story here…\n\nSeparate paragraphs with a blank line." /></Card>
        <Card title="Search and social preview"><div className="space-y-4"><Field label="SEO title"><input className={`${input} h-11`} maxLength={70} value={metaTitle} onChange={event => setMetaTitle(event.target.value)} placeholder={title || "Article title"} /></Field><Field label="SEO description"><textarea className={`${input} resize-none py-3`} rows={3} maxLength={180} value={metaDescription} onChange={event => setMetaDescription(event.target.value)} placeholder={excerpt || "Article description"} /></Field><div className="rounded-xl border bg-[#FFFDF8] p-4"><p className="text-[10px] text-green-700">kobanitours.com/articles/{slug || generatedSlug}</p><h3 className="mt-1 text-base font-semibold text-blue-800">{metaTitle || title || "Article title"}</h3><p className="mt-1 text-xs text-[#666]">{metaDescription || excerpt || "Article description"}</p></div></div></Card>
      </div>
      <aside className="lg:sticky lg:top-24 lg:self-start"><section className="rounded-2xl border bg-white p-5"><p className="text-[9px] uppercase tracking-widest text-[#999]">Publishing</p><h2 className="mt-1 font-serif text-xl font-bold capitalize">{status}</h2>{publishErrors.length > 0 && <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4"><b className="text-xs text-red-800">Complete these items:</b><ul className="mt-2 space-y-1 text-[10px] leading-5 text-red-700">{publishErrors.map(item => <li key={item}>• {item}</li>)}</ul></div>}<div className="mt-5 space-y-3"><button disabled={busy} onClick={() => save("draft")} className="admin-outline w-full disabled:opacity-50">{busy ? "Saving…" : "Save Draft"}</button><button disabled={busy} onClick={() => save("published")} className="admin-gold w-full disabled:opacity-50">{busy ? "Publishing…" : "Publish Now"}</button><div className="border-t pt-4"><label className="text-xs font-bold">Schedule publication</label><input type="datetime-local" className={`${input} mt-2 h-11`} value={scheduleAt} onChange={event => setScheduleAt(event.target.value)} /><button disabled={busy || !scheduleAt} onClick={() => save("scheduled")} className="admin-outline mt-2 w-full disabled:opacity-40">Schedule</button></div><label className="flex items-center gap-3 border-t pt-4 text-xs"><input type="checkbox" checked={featured} onChange={event => setFeatured(event.target.checked)} className="h-4 w-4 accent-[#C6A15B]" />Feature on Articles page</label><label className="flex items-center gap-3 text-xs"><input type="checkbox" checked={editorsPick} onChange={event => setEditorsPick(event.target.checked)} className="h-4 w-4 accent-[#C6A15B]" />Editor’s Pick</label></div></section></aside>
    </main>
    {preview && <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/70 p-4 sm:p-8" onMouseDown={event => { if (event.target === event.currentTarget) setPreview(false) }}><article className="mx-auto max-w-4xl rounded-2xl bg-[#FFFDF8] p-6 sm:p-10"><button className="float-right admin-outline" onClick={() => setPreview(false)}>Close</button><p className="eyebrow">{categories.find(category => category.id === categoryId)?.name}</p><h1 className="mt-3 max-w-3xl font-serif text-4xl font-bold">{title || "Untitled article"}</h1><p className="mt-4 text-[#6F6B63]">{excerpt}</p>{image && <img src={resolveMediaUrl(image.url)} alt={altText} className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover" />}<div className="mt-8 whitespace-pre-wrap font-serif text-base leading-8">{content}</div></article></div>}
    {publishedModal && <div className="fixed inset-0 z-[120] grid place-items-center bg-black/65 p-4" role="dialog" aria-modal="true" aria-labelledby="published-title"><section className="w-full max-w-md rounded-3xl border border-[#C6A15B]/30 bg-[#FFFDF8] p-8 text-center shadow-2xl"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#27855C] text-3xl text-white">✓</div><p className="mt-6 text-[10px] font-bold uppercase tracking-[.22em] text-[#C6A15B]">Publication complete</p><h2 id="published-title" className="mt-2 font-serif text-3xl font-bold">Article Published</h2><p className="mt-3 text-sm leading-6 text-[#6F6B63]">“{title}” is now live and available on the KOBANI website.</p><div className="mt-5 h-1 overflow-hidden rounded-full bg-[#E7DCC5]"><div className="h-full w-full origin-left animate-[pulse_1s_ease-in-out_infinite] bg-[#C6A15B]" /></div><p className="mt-2 text-[10px] text-[#999]">Returning to Articles management…</p><button onClick={() => { sessionStorage.removeItem("kobani:editingArticleId"); sessionStorage.removeItem("kobani:articleEditorOrigin"); onNavigate("admin-articles") }} className="admin-gold mt-6 w-full">Back to Articles</button></section></div>}
  </div>
}
