import { FormEvent, useEffect, useState } from "react"
import type { Page } from "./App"
import { AdminShell } from "./AdminProductsPage"
import { ApiError, faqApi, type Faq } from "./api"

const categories = [
  ["booking", "Tour Booking"],
  ["payments", "Payments"],
  ["travel", "Travel Requirements"],
  ["cancellations", "Cancellations"],
  ["market", "African Market"],
  ["accounts", "Customer Accounts"],
] as const
const emptyForm = { question: "", answer: "", category: "booking" }
export default function AdminFAQsPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [items, setItems] = useState<Faq[]>([]), [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null), [loading, setLoading] = useState(true), [saving, setSaving] = useState(false), [error, setError] = useState("")
  const load = async () => { setLoading(true); setError(""); try { setItems((await faqApi.adminList()).data.faqs) } catch { setError("FAQs could not be loaded. Please try again.") } finally { setLoading(false) } }
  useEffect(() => { void load() }, [])
  const reset = () => { setEditingId(null); setForm(emptyForm); setError("") }
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!form.question.trim() || !form.answer.trim() || !form.category) { setError("Select a category and enter both a question and an answer."); return }
    setSaving(true); setError("")
    try { if (editingId) await faqApi.update(editingId, form); else await faqApi.create(form); reset(); await load() }
    catch (reason) { const apiError = reason as ApiError; setError(apiError.fields?.question || apiError.fields?.answer || "The FAQ could not be saved.") }
    finally { setSaving(false) }
  }
  return <AdminShell title="FAQs" active="FAQs" onNavigate={onNavigate}>
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Content management</p><h1 className="page-title">FAQs</h1><p className="sub">Add and maintain question-and-answer content shown on the public FAQ page.</p></div><button className="admin-outline" onClick={() => onNavigate("faq")}>Preview public FAQs</button></div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
      <section className="admin-table-card overflow-hidden"><div className="border-b border-[#E5DDCE] p-5"><h2 className="font-serif text-xl font-bold">Published FAQs</h2><p className="mt-1 text-xs text-[#777]">{items.length} managed question{items.length === 1 ? "" : "s"}</p></div>
        {loading ? <p className="p-8 text-sm text-[#777]">Loading FAQs...</p> : items.length === 0 ? <div className="p-10 text-center"><h3 className="font-serif text-xl font-bold">No managed FAQs yet</h3><p className="mt-2 text-sm text-[#777]">Use the form to publish your first question and answer.</p></div> : <div className="divide-y divide-[#EEE7DC]">{items.map(item => <article key={item.id} className="p-5"><span className="pill warning">{item.category_label}</span><h3 className="mt-3 font-serif text-lg font-bold text-[#161616]">{item.question}</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#68645D]">{item.answer}</p><div className="mt-4 flex gap-4"><button className="admin-outline" onClick={() => { setEditingId(item.id); setForm({ question: item.question, answer: item.answer, category: item.category }); setError(""); window.scrollTo({ top: 0, behavior: "smooth" }) }}>Edit</button><button className="px-3 text-xs font-bold text-red-700" onClick={async () => { if (!window.confirm(`Delete “${item.question}”?`)) return; try { await faqApi.remove(item.id); if (editingId === item.id) reset(); await load() } catch { setError("The FAQ could not be deleted.") } }}>Delete</button></div></article>)}</div>}
      </section>
      <form onSubmit={submit} className="h-fit rounded-2xl border border-[#E5DDCE] bg-white p-5 xl:sticky xl:top-24"><p className="eyebrow">{editingId ? "Edit FAQ" : "New FAQ"}</p><h2 className="mt-1 font-serif text-2xl font-bold">{editingId ? "Update question" : "Add a question"}</h2><label className="form-field mt-5"><span>Category</span><select className="admin-input w-full" value={form.category} onChange={event => setForm(current => ({ ...current, category: event.target.value }))}>{categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label className="form-field mt-4"><span>Question</span><input className="admin-input w-full" maxLength={300} value={form.question} onChange={event => setForm(current => ({ ...current, question: event.target.value }))} placeholder="What would guests like to know?" /></label><label className="form-field mt-4"><span>Answer</span><textarea className="admin-input min-h-44 w-full resize-y" maxLength={5000} value={form.answer} onChange={event => setForm(current => ({ ...current, answer: event.target.value }))} placeholder="Write a clear, helpful answer." /></label>{error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</p>}<div className="mt-5 flex justify-end gap-2">{editingId && <button type="button" className="admin-outline" onClick={reset}>Cancel</button>}<button type="submit" disabled={saving} className="admin-gold disabled:opacity-60">{saving ? "Saving..." : editingId ? "Save changes" : "Add FAQ"}</button></div></form>
    </div>
  </AdminShell>
}
