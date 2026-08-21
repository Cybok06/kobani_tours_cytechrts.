import { useCallback, useEffect, useState } from "react"
import type { Page } from "./App"
import { AdminShell } from "./AdminProductsPage"
import { ApiError, articleApi, resolveMediaUrl, type Article, type ArticleCategory } from "./api"

const date = (value?: string) => {
  if (!value) return "—"
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? "—" : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(parsed)
}
const label = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)
const categoryName = (article: Article) => article.category?.name || "Uncategorised"
const authorName = (article: Article) => article.author?.display_name || "KOBANI Editorial Team"

export default function AdminArticlesPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [articles, setArticles] = useState<Article[]>([])
  const [summary, setSummary] = useState<Record<string, number>>({})
  const [tab, setTab] = useState("all")
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [categories, setCategories] = useState<ArticleCategory[]>([])
  const [newCategory, setNewCategory] = useState("")

  const load = useCallback(async () => {
    setLoading(true); setError("")
    try {
      const response = await articleApi.adminList({ status: tab, search: query, limit: 50 })
      const rows = Array.isArray(response.data.articles) ? response.data.articles : []
      const fallbackSummary = rows.reduce<Record<string, number>>((totals, article) => {
        totals.total += 1
        totals[article.status] = (totals[article.status] || 0) + 1
        totals.total_views += Number(article.view_count || 0)
        return totals
      }, { total: 0, published: 0, draft: 0, scheduled: 0, archived: 0, total_views: 0 })
      setArticles(rows); setSummary(response.data.summary || fallbackSummary)
    } catch (reason) { setError(reason instanceof ApiError ? reason.code : "SERVER_ERROR") }
    finally { setLoading(false) }
  }, [tab, query])
  useEffect(() => { const timer = setTimeout(load, 250); return () => clearTimeout(timer) }, [load])

  const edit = (article?: Article) => {
    sessionStorage.setItem("kobani:articleEditorOrigin", "admin-articles")
    if (article) sessionStorage.setItem("kobani:editingArticleId", article.id)
    else sessionStorage.removeItem("kobani:editingArticleId")
    onNavigate("contributor-editor")
  }
  const action = async (article: Article, name: string, payload: Record<string, unknown> = {}) => {
    if (name === "delete") { if (!confirm(`Delete “${article.title}”?`)) return; await articleApi.remove(article.id) }
    else await articleApi.action(article.id, name, payload)
    await load()
  }
  const openCategories = async () => { setCategoriesOpen(true); setCategories((await articleApi.categories()).data.categories) }
  const addCategory = async () => { if (!newCategory.trim()) return; await articleApi.createCategory(newCategory.trim()); setNewCategory(""); setCategories((await articleApi.categories()).data.categories) }

  return <AdminShell title="Articles" active="Articles" onNavigate={onNavigate}>
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div><p className="eyebrow">Editorial management</p><h1 className="page-title">Articles</h1><p className="sub">Create, publish and manage the stories shown across KOBANI.</p></div>
      <div className="flex gap-2"><button onClick={openCategories} className="admin-outline">Manage Categories</button><button onClick={() => edit()} className="admin-gold">＋ Create Article</button></div>
    </div>
    <div className="metric-grid">
      {[['Published', summary.published || 0, '#27855C'], ['Drafts', summary.draft || 0, '#D59A32'], ['Scheduled', summary.scheduled || 0, '#356A9A'], ['Total Views', (summary.total_views || 0).toLocaleString(), '#C6A15B']].map(item => <div className="admin-metric" key={item[0]}><p>{item[0]}</p><b style={{ color: item[2] }}>{item[1]}</b></div>)}
    </div>
    <div className="bg-white border border-[#E8E1D3] rounded-2xl overflow-hidden">
      <div className="px-5 pt-4 border-b flex flex-col lg:flex-row gap-4 lg:items-end justify-between">
        <div className="flex gap-6 overflow-x-auto">{['all','published','draft','scheduled','archived'].map(value => <button onClick={() => setTab(value)} className={`pb-4 text-xs font-bold capitalize whitespace-nowrap border-b-2 ${tab === value ? 'border-[#C6A15B] text-black' : 'border-transparent text-[#888]'}`} key={value}>{value} <span className="ml-1 text-[9px] bg-[#F2EEE5] px-2 py-1 rounded-full">{value === 'all' ? summary.total || 0 : summary[value] || 0}</span></button>)}</div>
        <input value={query} onChange={event => setQuery(event.target.value)} className="admin-input mb-3" placeholder="Search articles..." />
      </div>
      {loading ? <div className="p-5 space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 animate-pulse rounded-xl bg-[#F2EEE5]" />)}</div> : error ? <div className="p-10 text-center"><p className="text-sm text-[#C84A4A]">Could not load articles ({error}).</p><button onClick={load} className="admin-outline mt-4">Try again</button></div> : !articles.length ? <div className="p-12 text-center"><h2 className="font-serif text-xl font-bold">No articles found</h2><p className="sub mt-2">Create the first article or change your filters.</p></div> :
      <div className="overflow-x-auto"><table className="admin-table min-w-[1050px]"><thead><tr>{['Article','Category','Author','Views','Date','Status','Actions'].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{articles.map(article => <tr key={article.id}>
        <td><div className="flex gap-3 items-center">{article.featured_image?.url ? <img src={resolveMediaUrl(article.featured_image.url)} alt="" className="w-16 h-12 rounded-lg object-cover" /> : <div className="w-16 h-12 rounded-lg bg-[#F2EEE5] grid place-items-center text-[#C6A15B]">K</div>}<div><b className="max-w-64 block">{article.title}</b>{article.is_featured && <span className="text-[9px] text-[#C6A15B]">Featured</span>}</div></div></td>
        <td><span className="pill neutral">{categoryName(article)}</span></td><td>{authorName(article)}</td><td>{Number(article.view_count || 0).toLocaleString()}</td><td>{date(article.published_at || article.updated_at)}</td><td><span className={`pill ${article.status === 'published' ? 'success' : article.status === 'draft' ? 'warning' : 'neutral'}`}>{label(article.status || 'draft')}</span></td>
        <td><div className="flex flex-wrap gap-1"><button onClick={() => edit(article)} className="admin-outline">Edit</button>{article.status === 'published' ? <button onClick={() => action(article, 'archive')} className="admin-outline">Archive</button> : article.status === 'archived' ? <button onClick={() => action(article, 'restore')} className="admin-outline">Restore</button> : <button onClick={() => action(article, 'publish')} className="admin-outline">Publish</button>}<button onClick={() => action(article, 'feature', { is_featured: !article.is_featured, featured_priority: 1 })} className="admin-outline">{article.is_featured ? 'Unfeature' : 'Feature'}</button><button onClick={() => action(article, 'delete')} className="admin-outline text-red-700">Delete</button></div></td>
      </tr>)}</tbody></table></div>}
    </div>
    {categoriesOpen && <div className="fixed inset-0 z-[100] bg-black/60 p-4 grid place-items-center" onMouseDown={event => { if (event.target === event.currentTarget) setCategoriesOpen(false) }}><section className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-[#FFFDF8] p-6"><div className="flex items-center"><div><p className="eyebrow">Editorial taxonomy</p><h2 className="font-serif text-2xl font-bold">Article Categories</h2></div><button className="ml-auto admin-outline" onClick={() => setCategoriesOpen(false)}>Close</button></div><div className="mt-5 flex gap-2"><input className="admin-input" value={newCategory} onChange={event => setNewCategory(event.target.value)} placeholder="New category name" /><button onClick={addCategory} className="admin-gold">Add</button></div><div className="mt-5 space-y-2">{categories.map(category => <div key={category.id} className="rounded-xl border bg-white p-4 flex items-center gap-3"><div><b>{category.name}</b><p className="text-[10px] text-[#888]">{category.article_count || 0} articles · /{category.slug}</p></div><button onClick={async () => { await articleApi.updateCategory(category.id, { is_active: !category.is_active }); setCategories((await articleApi.categories()).data.categories) }} className="ml-auto admin-outline">{category.is_active === false ? 'Activate' : 'Deactivate'}</button><button disabled={!!category.article_count} onClick={async () => { await articleApi.deleteCategory(category.id); setCategories((await articleApi.categories()).data.categories) }} className="admin-outline disabled:opacity-40">Delete</button></div>)}</div></section></div>}
  </AdminShell>
}
