import { useEffect, useMemo, useState } from "react"
import type { Page } from "./App"
import {
  articleApi,
  resolveMediaUrl,
  type Article,
  type ArticleCategory,
} from "./api"
import { ArrowRightIcon, SearchIcon } from "./icons"
import { useTranslation } from "react-i18next"

const formatDate = (value?: string) =>
  value
    ? new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(
        new Date(value),
      )
    : ""
const ArticleCard = ({
  article,
  read,
}: {
  article: Article
  read: (article: Article) => void
}) => (
  <a
    href={`/articles/${encodeURIComponent(article.slug)}`}
    onClick={(event) => { event.preventDefault(); read(article) }}
    className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#E6DFD2] bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#C6A15B] hover:shadow-xl"
  >
    <div className="relative aspect-[16/10] overflow-hidden bg-[#EEE7D9]">
      {article.featured_image?.url ? (
        <img
          src={resolveMediaUrl(article.featured_image.url)}
          alt={article.featured_image.alt_text || article.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="grid h-full place-items-center font-serif text-3xl text-[#C6A15B]">
          KOBANI
        </div>
      )}
      <span className="absolute left-3 top-3 rounded-full bg-[#C6A15B] px-3 py-1 text-[10px] font-bold text-black">
        {article.category.name}
      </span>
    </div>
    <div className="flex flex-1 flex-col p-5">
      <h2 className="font-serif text-xl font-bold leading-snug">
        {article.title}
      </h2>
      <p className="mt-3 line-clamp-3 text-xs leading-6 text-[#6F6B63]">
        {article.excerpt}
      </p>
      <div className="mt-5 flex items-center border-t border-[#EEE8DD] pt-4">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#E9D6A8] text-xs font-bold">
          {article.author.initials}
        </span>
        <div className="ml-2">
          <b className="block text-xs">{article.author.display_name}</b>
          <span className="text-[10px] text-[#999]">
            {formatDate(article.published_at)} · {article.reading_time_minutes}{" "}
            min read
          </span>
        </div>
        <span className="ml-auto text-[#C6A15B]">
          <ArrowRightIcon size={15} />
        </span>
      </div>
    </div>
  </a>
)

export default function ArticlesPage({
  onNavigate,
}: {
  onNavigate: (p: Page) => void
}) {
  const { i18n } = useTranslation()
  const initial = new URLSearchParams(location.search)
  const [articles, setArticles] = useState<Article[]>([]),
    [featured, setFeatured] = useState<Article | null>(null),
    [popular, setPopular] = useState<Article[]>([]),
    [categories, setCategories] = useState<ArticleCategory[]>([])
  const [category, setCategory] = useState(initial.get("category") || ""),
    [search, setSearch] = useState(initial.get("search") || ""),
    [sort, setSort] = useState(initial.get("sort") || "newest")
  const [total, setTotal] = useState(0),
    [loading, setLoading] = useState(true),
    [failed, setFailed] = useState(false)
  useEffect(() => {
    articleApi
      .overview()
      .then((response) => {
        setFeatured(response.data.featured)
        setPopular(response.data.popular)
        setCategories(response.data.categories)
      })
      .catch(() => setFailed(true))
  }, [i18n.resolvedLanguage])
  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true)
      setFailed(false)
      try {
        const response = await articleApi.publicList({
          category,
          search,
          sort,
          limit: 24,
        })
        setArticles(response.data.articles)
        setTotal(response.data.total)
        const params = new URLSearchParams()
        if (category) params.set("category", category)
        if (search) params.set("search", search)
        if (sort !== "newest") params.set("sort", sort)
        history.replaceState(
          {},
          "",
          `/articles${params.toString() ? `?${params}` : ""}`,
        )
      } catch {
        setFailed(true)
      } finally {
        setLoading(false)
      }
    }, 350)
    return () => clearTimeout(timer)
  }, [category, search, sort, i18n.resolvedLanguage])
  const read = (article: Article) => {
    history.pushState({}, "", `/articles/${article.slug}`)
    onNavigate("article-read")
  }
  const displayedFeatured = useMemo(
    () =>
      featured && (!category || featured.category.slug === category)
        ? featured
        : null,
    [featured, category],
  )
  return (
    <div className="bg-[#FFFDF8] text-[#0B0B0B]">
      <section
        className="relative overflow-hidden bg-[#0B0B0B] bg-cover bg-center px-4 py-20 text-white sm:py-28"
        style={{ backgroundImage: 'url("/images/hero_section/lux_tour.png")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/30" />
        <div className="relative mx-auto max-w-[1240px]">
          <p className="text-xs font-bold uppercase tracking-[.25em] text-[#C6A15B]">
            Stories & Insights
          </p>
          <h1 className="mt-4 max-w-4xl font-serif text-4xl font-bold leading-tight drop-shadow-lg sm:text-6xl">
            Africa, told with depth and distinction.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75">
            Historical perspectives, cultural stories and considered travel
            guidance from the KOBANI editorial team.
          </p>
        </div>
      </section>
      {displayedFeatured && (
        <section className="px-4 py-14">
          <a
            href={`/articles/${encodeURIComponent(displayedFeatured.slug)}`}
            onClick={(event) => { event.preventDefault(); read(displayedFeatured) }}
            className="mx-auto grid max-w-[1240px] cursor-pointer overflow-hidden rounded-3xl border border-[#E6DFD2] bg-white lg:grid-cols-2"
          >
            <div className="min-h-[340px] bg-[#EEE7D9]">
              {displayedFeatured.featured_image?.url && (
                <img
                  src={resolveMediaUrl(displayedFeatured.featured_image.url)}
                  alt={
                    displayedFeatured.featured_image.alt_text ||
                    displayedFeatured.title
                  }
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-12">
              <p className="text-xs font-bold uppercase tracking-widest text-[#C6A15B]">
                ✦ Featured Article · {displayedFeatured.category.name}
              </p>
              <h2 className="mt-4 font-serif text-3xl font-bold leading-tight sm:text-4xl">
                {displayedFeatured.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#6F6B63]">
                {displayedFeatured.excerpt}
              </p>
              <p className="mt-7 text-xs font-bold">
                {displayedFeatured.author.display_name} ·{" "}
                {displayedFeatured.reading_time_minutes} min read
              </p>
            </div>
          </a>
        </section>
      )}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex gap-2 overflow-x-auto pb-3">
            {[{ name: "All", slug: "", id: "all" }, ...categories].map(
              (item) => (
                <button
                  key={item.id}
                  onClick={() => setCategory(item.slug)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold ${
                    category === item.slug
                      ? "bg-[#0B0B0B] text-white"
                      : "border border-[#E2DBCE] bg-white"
                  }`}
                >
                  {item.name}
                  {item.article_count !== undefined
                    ? ` (${item.article_count})`
                    : ""}
                </button>
              ),
            )}
          </div>
          <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
            <main>
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <h2 className="font-serif text-2xl font-bold">
                  Latest Articles{" "}
                  <span className="text-[#C6A15B]">{total}</span>
                </h2>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="ml-auto rounded-xl border border-[#E2DBCE] bg-white px-4 py-3 text-xs"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="most_viewed">Most viewed</option>
                  <option value="title_asc">Title A–Z</option>
                </select>
              </div>
              {loading ? (
                <div className="grid gap-5 md:grid-cols-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-96 animate-pulse rounded-2xl bg-[#EEE8DD]"
                    />
                  ))}
                </div>
              ) : failed ? (
                <div className="rounded-2xl border bg-white p-12 text-center">
                  <h3 className="font-serif text-xl font-bold">
                    Articles are temporarily unavailable
                  </h3>
                  <p className="mt-2 text-xs text-[#777]">
                    Please try again shortly.
                  </p>
                </div>
              ) : articles.length ? (
                <div className="grid gap-5 md:grid-cols-2">
                  {articles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      read={read}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border bg-white p-12 text-center">
                  <h3 className="font-serif text-xl font-bold">
                    {search || category ? "No stories match your search" : "KOBANI Stories are being prepared"}
                  </h3>
                  <p className="mt-2 text-xs text-[#777]">
                    {search || category ? "Try another category or search phrase." : "We are preparing heritage insights, destination guides and thoughtful travel inspiration for our community."}
                  </p>
                </div>
              )}
            </main>
            <aside className="space-y-6">
              <section className="rounded-2xl border bg-white p-5">
                <h3 className="font-serif text-lg font-bold">
                  Search Articles
                </h3>
                <div className="mt-4 flex items-center rounded-xl border border-[#E2DBCE] px-3">
                  <SearchIcon size={16} />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="h-11 min-w-0 flex-1 bg-transparent px-2 text-xs outline-none"
                    placeholder="Search stories..."
                  />
                </div>
              </section>
              <section className="rounded-2xl border bg-white p-5">
                <h3 className="font-serif text-lg font-bold">
                  Popular Articles
                </h3>
                <div className="mt-4 divide-y">
                  {popular.map((article, index) => (
                    <button
                      key={article.id}
                      onClick={() => read(article)}
                      className="flex w-full gap-3 py-4 text-left"
                    >
                      <span className="font-serif text-xl font-bold text-[#C6A15B]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>
                        <b className="line-clamp-2 text-xs leading-5">
                          {article.title}
                        </b>
                        <small className="mt-1 block text-[9px] text-[#999]">
                          {article.view_count.toLocaleString()} views
                        </small>
                      </span>
                    </button>
                  ))}
                </div>
              </section>
              <button
                onClick={() => onNavigate("contact")}
                className="w-full rounded-2xl bg-[#0B0B0B] p-6 text-left text-white"
              >
                <span className="text-xs font-bold text-[#C6A15B]">
                  Interested in contributing?
                </span>
                <b className="mt-2 block font-serif text-xl">
                  Contact Our Editorial Team
                </b>
              </button>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
