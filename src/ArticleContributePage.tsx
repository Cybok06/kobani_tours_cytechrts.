import { useState, useRef, useCallback, useEffect } from 'react'
import {
  ArrowRightIcon, CheckIcon, ChevronRightIcon, XIcon, SearchIcon,
  ClockIcon, StarIcon, CheckCircleIcon
} from './icons'

type Page = 'home' | 'tours' | 'tour-details' | 'about' | 'gallery' | 'articles' | 'article-read' | 'contribute'

// ─── Icons not in the shared file ─────────────────────────────────────────────
const UploadIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
  </svg>
)
const AlertCircle = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)
const FileTextIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
)
const SendIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
)
const ImageIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
  </svg>
)
const TrashIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
  </svg>
)
const EyeIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
)
const PlusIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

// ─── Constants ─────────────────────────────────────────────────────────────────
const GOLD = '#C6A15B'
const CATS = ['African History', 'Culture', 'Travel Tips', 'Destinations', 'Luxury Travel', 'Company News']

const STEPS = ['Review Process', 'Drafting', 'Editorial', 'Published']

const GUIDELINES = [
  {
    icon: '📜',
    title: 'Allowed Topics',
    items: [
      'West & Pan-African history and heritage',
      'Cultural traditions, art, music, and oral history',
      'Destination guides and travel itineraries',
      'Luxury travel and sustainable tourism',
      'Architectural and archaeological discoveries',
      'First-hand travel experiences and narratives',
    ],
  },
  {
    icon: '🚫',
    title: 'Not Accepted',
    items: [
      'Purely promotional or commercial content',
      'Political commentary unrelated to heritage',
      'Content without citations or sources',
      'Previously published articles (must be original)',
    ],
  },
  {
    icon: '⚙️',
    title: 'Review Process',
    items: [
      'Initial screening within 3 business days',
      'Editorial review with written feedback',
      'One revision round if required',
      'Final approval and scheduling',
      'Publication with author credit and bio',
    ],
  },
  {
    icon: '📐',
    title: 'Publishing Standards',
    items: [
      'Minimum 800 words, ideal 1,200–2,500',
      'At least 3 verified references',
      'High-resolution featured image required',
      'Headings and subheadings for readability',
      'Factual claims must be attributable',
    ],
  },
]

const BENEFITS = [
  { icon: '👁', title: 'Audience Reach', desc: 'Published articles reach 40,000+ monthly readers across our platform and newsletter.' },
  { icon: '💰', title: 'Compensation', desc: 'Accepted contributors receive a publishing fee of $80–$200 depending on length and research depth.' },
  { icon: '🔗', title: 'Author Profile', desc: 'Your bio, photo, and social links are published alongside every article.' },
  { icon: '🏛', title: 'Archive Credit', desc: 'Your work joins the KOBANI permanent editorial archive with full attribution.' },
]

const DEMO_ARTICLES = [
  {
    img: 'https://images.unsplash.com/photo-1650414364063-5ac0233728f1?w=500&h=350&fit=crop&auto=format',
    category: 'African History',
    catColor: '#356A9A',
    title: 'The Hidden Architecture of Cape Coast Castle',
    author: 'Kwame Asante', authorInitials: 'KA',
    date: 'July 18, 2026', readTime: '9 min',
    status: 'Published', statusColor: '#27855C',
    views: '4.2k',
  },
  {
    img: 'https://images.unsplash.com/photo-1660675133902-acd1b057f75d?w=500&h=350&fit=crop&auto=format',
    category: 'Culture',
    catColor: '#7B5EA7',
    title: 'Understanding Kente: A Language Woven in Silk',
    author: 'Abena Mensah', authorInitials: 'AM',
    date: 'June 30, 2026', readTime: '7 min',
    status: 'Published', statusColor: '#27855C',
    views: '2.8k',
  },
  {
    img: 'https://images.unsplash.com/photo-1761364622323-833282bb4aef?w=500&h=350&fit=crop&auto=format',
    category: 'Travel Tips',
    catColor: '#27855C',
    title: '10 Essential Tips for First-Time Ghana Visitors',
    author: 'Yaw Darko', authorInitials: 'YD',
    date: 'June 14, 2026', readTime: '5 min',
    status: 'In Review', statusColor: '#C6A15B',
    views: '—',
  },
  {
    img: 'https://images.unsplash.com/photo-1728042107033-76b13feac547?w=500&h=350&fit=crop&auto=format',
    category: 'African History',
    catColor: '#356A9A',
    title: "The Ancient Empires of West Africa's Sahel",
    author: 'Yaw Darko', authorInitials: 'YD',
    date: 'April 22, 2026', readTime: '11 min',
    status: 'Draft', statusColor: '#9A9590',
    views: '—',
  },
]

// ─── Shared sub-components ─────────────────────────────────────────────────────
const Avatar = ({ initials, size = 32 }: { initials: string; size?: number }) => (
  <div className="rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
    style={{ width: size, height: size, background: 'linear-gradient(135deg,#C6A15B,#E9D6A8)', color: '#0B0B0B' }}>
    {initials}
  </div>
)

const Label = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
  <label className="block text-xs font-bold mb-1.5 tracking-wide" style={{ color: '#202020' }}>
    {children} {required && <span style={{ color: GOLD }}>*</span>}
  </label>
)

const FieldWrap = ({ children, error }: { children: React.ReactNode; error?: string }) => (
  <div className="mb-4">
    {children}
    {error && (
      <div className="flex items-center gap-1.5 mt-1.5 text-xs" style={{ color: '#C84A4A' }}>
        <AlertCircle size={12} /> {error}
      </div>
    )}
  </div>
)

const inputBase = (focused: boolean, error?: string) => ({
  background: '#F8F4EA',
  border: `1.5px solid ${error ? '#C84A4A' : focused ? GOLD : '#E6DFD2'}`,
  color: '#202020',
  outline: 'none',
  transition: 'border-color 0.2s',
})

// ─── Upload Zone ───────────────────────────────────────────────────────────────
type UploadState = 'idle' | 'dragging' | 'uploading' | 'done' | 'error'
interface UploadZoneProps {
  label: string
  multiple?: boolean
  files: string[]
  onAdd: (names: string[]) => void
  onRemove: (i: number) => void
  accept?: string
}
const UploadZone = ({ label, multiple, files, onAdd, onRemove, accept = 'image/*' }: UploadZoneProps) => {
  const [state, setState] = useState<UploadState>('idle')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (flist: FileList | null) => {
    if (!flist || flist.length === 0) return
    setState('uploading')
    setTimeout(() => {
      const names = Array.from(flist).map(f => f.name)
      onAdd(names)
      setState('done')
    }, 1200)
  }

  const bgColor = state === 'dragging' ? 'rgba(198,161,91,0.08)' : '#F8F4EA'
  const borderColor = state === 'dragging' ? GOLD : state === 'error' ? '#C84A4A' : '#E6DFD2'

  return (
    <div>
      <div
        className="rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all"
        style={{ border: `2px dashed ${borderColor}`, background: bgColor, minHeight: 110 }}
        onDragOver={e => { e.preventDefault(); setState('dragging') }}
        onDragLeave={() => setState('idle')}
        onDrop={e => { e.preventDefault(); setState('idle'); handleFiles(e.dataTransfer.files) }}
        onClick={() => inputRef.current?.click()}>
        <input ref={inputRef} type="file" accept={accept} multiple={multiple} className="hidden"
          onChange={e => handleFiles(e.target.files)} />
        {state === 'uploading' ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: `${GOLD} transparent transparent transparent` }} />
            <span className="text-xs" style={{ color: '#6F6B63' }}>Uploading…</span>
          </div>
        ) : (
          <>
            <div style={{ color: GOLD }}><UploadIcon size={22} /></div>
            <div className="mt-2 text-xs font-semibold" style={{ color: '#202020' }}>{label}</div>
            <div className="text-xs mt-0.5" style={{ color: '#9A9590' }}>Drag & drop or click to browse · JPG, PNG, WebP</div>
          </>
        )}
      </div>
      {files.length > 0 && (
        <div className="mt-2 space-y-1.5">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ background: 'rgba(198,161,91,0.07)', border: '1px solid rgba(198,161,91,0.2)' }}>
              <ImageIcon size={13} />
              <span className="text-xs flex-1 truncate font-medium" style={{ color: '#202020' }}>{f}</span>
              <div className="flex items-center gap-2 text-xs" style={{ color: '#9A9590' }}>
                <span>Uploaded</span>
                <span className="text-green-600">✓</span>
              </div>
              <button onClick={() => onRemove(i)} className="ml-1 p-0.5 rounded transition-colors hover:text-red-500" style={{ color: '#9A9590' }}>
                <TrashIcon size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Form types ────────────────────────────────────────────────────────────────
interface FormData {
  title: string; category: string; summary: string; content: string
  references: string; authorName: string; authorBio: string
  email: string; social: string; agreed: boolean
}
interface FormErrors { [k: string]: string }
type FormState = 'editing' | 'draft-saved' | 'submitting' | 'success' | 'error'

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ArticleContributePage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return <main className="min-h-[70vh] bg-[#F8F4EA] px-4 py-20"><section className="mx-auto max-w-3xl rounded-2xl border border-[#E6DFD2] bg-white p-8 text-center shadow-sm sm:p-12"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#C6A15B]">KOBANI Stories</p><h1 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">Article contributions are currently unavailable</h1><p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#6F6B63]">If you would like to share a heritage, culture or travel story with KOBANI, please contact our team. We will provide the current editorial guidance directly.</p><div className="mt-7 flex flex-wrap justify-center gap-3"><button onClick={() => onNavigate('contact' as Page)} className="btn-gold rounded-xl px-6 py-3 text-sm font-semibold text-[#0B0B0B]">Contact KOBANI</button><button onClick={() => onNavigate('articles')} className="rounded-xl border border-[#C6A15B] px-6 py-3 text-sm font-semibold text-[#9A7636]">Back to Articles</button></div></section></main>
  /* Submission UI is retained below for a future verified backend integration. */
  const [form, setForm] = useState<FormData>({
    title: '', category: '', summary: '', content: '',
    references: '', authorName: '', authorBio: '', email: '', social: '', agreed: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [formState, setFormState] = useState<FormState>('editing')
  const [focusedField, setFocusedField] = useState('')
  const [featuredFiles, setFeaturedFiles] = useState<string[]>([])
  const [supportFiles, setSupportFiles] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write')
  const [draftTime, setDraftTime] = useState('')
  const [refInput, setRefInput] = useState('')
  const [refList, setRefList] = useState<string[]>([])
  const contentRef = useRef<HTMLTextAreaElement>(null)

  const set = (key: keyof FormData, value: string | boolean) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const fi = (field: string) => ({
    onFocus: () => setFocusedField(field),
    onBlur: () => setFocusedField(''),
  })

  const wordCount = form.content.trim() ? form.content.trim().split(/\s+/).length : 0
  const readTime = Math.max(1, Math.round(wordCount / 200))

  const validate = (): boolean => {
    const e: FormErrors = {}
    if (!form.title.trim()) e.title = 'Article title is required'
    else if (form.title.length < 10) e.title = 'Title must be at least 10 characters'
    if (!form.category) e.category = 'Please select a category'
    if (!form.summary.trim()) e.summary = 'Short summary is required'
    else if (form.summary.length < 50) e.summary = 'Summary must be at least 50 characters'
    if (!form.content.trim()) e.content = 'Article content is required'
    else if (wordCount < 100) e.content = `Content must be at least 100 words (currently ${wordCount})`
    if (featuredFiles.length === 0) e.featured = 'A featured image is required'
    if (!form.authorName.trim()) e.authorName = 'Author name is required'
    if (!form.authorBio.trim()) e.authorBio = 'Author biography is required'
    if (!form.email.trim()) e.email = 'Email address is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email address'
    if (!form.agreed) e.agreed = 'You must agree to the publishing agreement'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const saveDraft = () => {
    const now = new Date()
    setDraftTime(`${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`)
    setFormState('draft-saved')
    setTimeout(() => setFormState('editing'), 3000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      setFormState('error')
      return
    }
    setFormState('submitting')
    setTimeout(() => setFormState('success'), 2200)
  }

  // Auto-save indicator pulse
  useEffect(() => {
    if (form.content.length > 50 && form.title.length > 0) {
      const t = setTimeout(saveDraft, 30000)
      return () => clearTimeout(t)
    }
  }, [form.content, form.title])

  const addRef = () => {
    if (refInput.trim()) {
      setRefList(prev => [...prev, refInput.trim()])
      setRefInput('')
    }
  }

  // ── Success screen ───────────────────────────────────────────────────────────
  if (formState === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20" style={{ background: '#F8F4EA' }}>
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(39,133,92,0.1)', border: '2px solid rgba(39,133,92,0.3)' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#27855C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div className="text-xs font-bold tracking-[0.18em] uppercase mb-3" style={{ color: GOLD }}>Submission Received</div>
          <h2 className="font-serif font-bold text-3xl mb-4" style={{ fontFamily: 'var(--font-serif)', color: '#0B0B0B' }}>
            Thank You, {form.authorName.split(' ')[0] || 'Contributor'}!
          </h2>
          <p className="text-sm leading-relaxed mb-2" style={{ color: '#6F6B63' }}>
            Your article <strong style={{ color: '#202020' }}>"{form.title}"</strong> has been submitted successfully to the KOBANI editorial team.
          </p>
          <p className="text-sm leading-relaxed mb-8" style={{ color: '#6F6B63' }}>
            We'll send a confirmation to <strong style={{ color: '#202020' }}>{form.email}</strong> and follow up with editorial feedback within 3 business days.
          </p>

          {/* Review timeline */}
          <div className="rounded-2xl p-5 mb-8 text-left" style={{ background: '#FFFFFF', border: '1px solid #E6DFD2' }}>
            <div className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#9A9590' }}>What Happens Next</div>
            <div className="space-y-3">
              {STEPS.map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: i === 0 ? GOLD : 'rgba(198,161,91,0.1)', color: i === 0 ? '#0B0B0B' : '#9A9590' }}>
                    {i === 0 ? '✓' : i + 1}
                  </div>
                  <span className="text-sm" style={{ color: i === 0 ? '#202020' : '#9A9590', fontWeight: i === 0 ? 600 : 400 }}>{step}</span>
                  {i === 0 && <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(198,161,91,0.15)', color: GOLD }}>Active</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button onClick={() => onNavigate('articles')} className="px-6 py-3 rounded-xl text-sm font-semibold" style={{ background: '#FFFFFF', border: '1.5px solid #E6DFD2', color: '#202020' }}>
              Browse Articles
            </button>
            <button onClick={() => { setFormState('editing'); setForm({ title:'',category:'',summary:'',content:'',references:'',authorName:'',authorBio:'',email:'',social:'',agreed:false }); setFeaturedFiles([]); setSupportFiles([]); setRefList([]) }}
              className="btn-gold px-6 py-3 rounded-xl text-sm font-semibold" style={{ color: '#0B0B0B' }}>
              Submit Another
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#F8F4EA' }}>

      {/* ── Banner ────────────────────────────────────────────────────────────── */}
      <section className="px-4 pt-8 pb-0">
        <div className="mx-auto" style={{ maxWidth: 1280 }}>
          <div className="relative overflow-hidden rounded-2xl" style={{ minHeight: 240 }}>
            <img src="https://images.unsplash.com/photo-1721468184185-214871ec4411?w=1400&h=400&fit=crop&auto=format"
              alt="Person writing at a desk" className="absolute inset-0 w-full h-full object-cover object-top" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(120deg,rgba(11,11,11,0.9) 0%,rgba(11,11,11,0.6) 60%,rgba(11,11,11,0.25) 100%)' }} />
            <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg,${GOLD},#E9D6A8,${GOLD})` }} />
            <div className="relative z-10 px-8 py-12 md:px-14" style={{ minHeight: 240 }}>
              <nav className="flex items-center gap-2 text-xs mb-5" style={{ color: '#E9D6A8' }}>
                <button onClick={() => onNavigate('home')} style={{ background:'none',border:'none',cursor:'pointer',color:'inherit' }} className="hover:text-[#C6A15B] transition-colors">Home</button>
                <ChevronRightIcon size={11} />
                <button onClick={() => onNavigate('articles')} style={{ background:'none',border:'none',cursor:'pointer',color:'inherit' }} className="hover:text-[#C6A15B] transition-colors">Articles</button>
                <ChevronRightIcon size={11} />
                <span style={{ color: GOLD }}>Contribute</span>
              </nav>
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
                style={{ background: 'rgba(198,161,91,0.2)', border: '1px solid rgba(198,161,91,0.35)', color: '#E9D6A8' }}>
                ✍️ Open for Submissions
              </div>
              <h1 className="font-serif font-bold mb-2" style={{ fontFamily: 'var(--font-serif)', color: '#FFFFFF', fontSize: 'clamp(1.6rem,4vw,2.6rem)' }}>
                Contribute an Article
              </h1>
              <p style={{ color: '#E9D6A8', maxWidth: 500, fontSize: 15, lineHeight: 1.7 }}>
                Share your expertise with 40,000+ readers. We publish historians, travellers, guides, and cultural voices from across Africa and the diaspora.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Two-column: Guidelines + Form ────────────────────────────────────── */}
      <section className="px-4 py-10">
        <div className="mx-auto flex flex-col xl:flex-row gap-8 items-start" style={{ maxWidth: 1280 }}>

          {/* ─── LEFT COLUMN ──────────────────────────────────────────────────── */}
          <div className="xl:w-96 flex-shrink-0 space-y-5 xl:sticky xl:top-24">

            {/* Guidelines */}
            {GUIDELINES.map(g => (
              <div key={g.title} className="rounded-2xl p-5" style={{ background: '#FFFFFF', border: '1px solid #E6DFD2', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
                <div className="flex items-center gap-2 mb-3 pb-3" style={{ borderBottom: '1px solid #F0EBE0' }}>
                  <span className="text-lg">{g.icon}</span>
                  <div className="font-serif font-bold text-sm" style={{ fontFamily: 'var(--font-serif)', color: '#0B0B0B' }}>{g.title}</div>
                </div>
                <ul className="space-y-2">
                  {g.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: '#6F6B63' }}>
                      <span className="mt-0.5 flex-shrink-0" style={{ color: GOLD }}>›</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Benefits */}
            <div className="rounded-2xl p-5" style={{ background: '#0B0B0B', border: '1px solid #2A2A2A' }}>
              <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid #1F1F1F' }}>
                <span className="text-lg">🌟</span>
                <div className="font-serif font-bold text-sm text-white" style={{ fontFamily: 'var(--font-serif)' }}>Benefits of Contributing</div>
              </div>
              <div className="space-y-4">
                {BENEFITS.map(b => (
                  <div key={b.title} className="flex items-start gap-3">
                    <div className="text-lg flex-shrink-0">{b.icon}</div>
                    <div>
                      <div className="text-xs font-bold mb-0.5" style={{ color: '#E9D6A8' }}>{b.title}</div>
                      <div className="text-xs leading-relaxed" style={{ color: '#6F6B63' }}>{b.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Review timeline visual */}
            <div className="rounded-2xl p-5" style={{ background: '#FFFFFF', border: '1px solid #E6DFD2' }}>
              <div className="font-serif font-bold text-sm mb-4 pb-3" style={{ fontFamily: 'var(--font-serif)', color: '#0B0B0B', borderBottom: '1px solid #F0EBE0' }}>
                ⏱ Typical Timeline
              </div>
              {[
                { label: 'Submit article', time: 'Day 0', color: GOLD },
                { label: 'Initial screening', time: 'Day 1–3', color: '#9A9590' },
                { label: 'Editorial feedback', time: 'Day 4–7', color: '#9A9590' },
                { label: 'Revision (if needed)', time: 'Day 8–10', color: '#9A9590' },
                { label: 'Publication', time: 'Day 11–14', color: '#9A9590' },
              ].map((step, i, arr) => (
                <div key={step.label} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: i === 0 ? GOLD : 'rgba(198,161,91,0.12)', border: `1.5px solid ${i === 0 ? GOLD : '#E6DFD2'}` }}>
                      {i === 0 && <div className="w-2 h-2 rounded-full bg-black" />}
                    </div>
                    {i < arr.length - 1 && <div className="w-px flex-1 mt-0.5" style={{ background: '#E6DFD2', minHeight: 20 }} />}
                  </div>
                  <div className="pb-3 flex items-center gap-2 flex-1">
                    <span className="text-xs font-medium" style={{ color: i === 0 ? '#202020' : '#9A9590' }}>{step.label}</span>
                    <span className="ml-auto text-xs" style={{ color: '#C6A15B' }}>{step.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── RIGHT COLUMN: FORM ──────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Status bar */}
            <div className="flex items-center justify-between mb-5 px-1">
              <div className="flex items-center gap-2">
                {formState === 'draft-saved' && (
                  <div className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(198,161,91,0.1)', border: '1px solid rgba(198,161,91,0.25)', color: GOLD }}>
                    <CheckIcon size={11} /> Draft saved at {draftTime}
                  </div>
                )}
                {formState === 'error' && (
                  <div className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(200,74,74,0.08)', border: '1px solid rgba(200,74,74,0.25)', color: '#C84A4A' }}>
                    <AlertCircle size={11} /> Please fix errors before submitting
                  </div>
                )}
                {wordCount > 0 && (
                  <div className="text-xs" style={{ color: '#9A9590' }}>
                    {wordCount} words · ~{readTime} min read
                    {wordCount < 800 && <span style={{ color: '#C84A4A' }}> (min 800)</span>}
                    {wordCount >= 800 && <span style={{ color: '#27855C' }}> ✓</span>}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setActiveTab('write')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{ background: activeTab === 'write' ? GOLD : '#FFFFFF', color: activeTab === 'write' ? '#0B0B0B' : '#6F6B63', border: `1px solid ${activeTab === 'write' ? GOLD : '#E6DFD2'}` }}>
                  <FileTextIcon size={12} /> Write
                </button>
                <button onClick={() => setActiveTab('preview')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{ background: activeTab === 'preview' ? GOLD : '#FFFFFF', color: activeTab === 'preview' ? '#0B0B0B' : '#6F6B63', border: `1px solid ${activeTab === 'preview' ? GOLD : '#E6DFD2'}` }}>
                  <EyeIcon size={12} /> Preview
                </button>
              </div>
            </div>

            {/* Preview mode */}
            {activeTab === 'preview' ? (
              <div className="rounded-2xl p-8" style={{ background: '#FFFFFF', border: '1.5px solid #E6DFD2' }}>
                {form.title ? (
                  <>
                    {form.category && (
                      <div className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4" style={{ background: 'rgba(53,106,154,0.1)', color: '#356A9A' }}>
                        {form.category}
                      </div>
                    )}
                    <h2 className="font-serif font-bold text-2xl mb-3 leading-snug" style={{ fontFamily: 'var(--font-serif)', color: '#0B0B0B' }}>
                      {form.title || 'Article Title Preview'}
                    </h2>
                    {form.summary && (
                      <p className="text-sm leading-relaxed mb-4 pb-4" style={{ color: '#6F6B63', borderBottom: '1px solid #E6DFD2' }}>{form.summary}</p>
                    )}
                    {form.authorName && (
                      <div className="flex items-center gap-3 mb-6">
                        <Avatar initials={form.authorName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2) || 'AU'} size={36} />
                        <div>
                          <div className="text-sm font-semibold" style={{ color: '#202020' }}>{form.authorName}</div>
                          <div className="text-xs" style={{ color: '#9A9590' }}>Today · {readTime} min read</div>
                        </div>
                      </div>
                    )}
                    {featuredFiles[0] && (
                      <div className="rounded-xl overflow-hidden mb-6" style={{ height: 200, background: '#F0EBE0' }}>
                        <div className="w-full h-full flex items-center justify-center" style={{ color: '#9A9590' }}>
                          <div className="text-center">
                            <ImageIcon size={28} />
                            <div className="text-xs mt-1">{featuredFiles[0]}</div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#3A3630' }}>
                      {form.content || <span style={{ color: '#9A9590' }}>Article content will appear here…</span>}
                    </div>
                    {refList.length > 0 && (
                      <div className="mt-8 pt-6" style={{ borderTop: '1px solid #E6DFD2' }}>
                        <div className="font-bold text-sm mb-3" style={{ color: '#202020' }}>References</div>
                        <ol className="space-y-1">
                          {refList.map((r, i) => (
                            <li key={i} className="text-xs" style={{ color: '#6F6B63' }}>{i+1}. {r}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="py-16 text-center" style={{ color: '#9A9590' }}>
                    <FileTextIcon size={36} />
                    <div className="mt-3 text-sm">Start filling in the form to see a preview here</div>
                  </div>
                )}
              </div>
            ) : (
              /* ── WRITE MODE ─────────────────────────────────────────────── */
              <form onSubmit={handleSubmit} noValidate>
                {/* Card wrapper */}
                <div className="rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', border: '1.5px solid #E6DFD2', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>

                  {/* Section: Article Details */}
                  <div className="px-7 pt-7 pb-5" style={{ borderBottom: '1.5px solid #F0EBE0' }}>
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: GOLD, color: '#0B0B0B' }}>1</div>
                      <div className="font-serif font-bold text-base" style={{ fontFamily: 'var(--font-serif)', color: '#0B0B0B' }}>Article Details</div>
                    </div>

                    <FieldWrap error={errors.title}>
                      <Label required>Article Title</Label>
                      <input value={form.title} onChange={e => set('title', e.target.value)}
                        placeholder="e.g. The Cultural Significance of the Ashanti Stool"
                        className="w-full px-4 py-3 rounded-xl text-sm"
                        style={inputBase(focusedField === 'title', errors.title)}
                        {...fi('title')} />
                      <div className="flex justify-end mt-1">
                        <span className="text-xs" style={{ color: form.title.length > 80 ? '#C84A4A' : '#9A9590' }}>{form.title.length}/120</span>
                      </div>
                    </FieldWrap>

                    <FieldWrap error={errors.category}>
                      <Label required>Category</Label>
                      <div className="flex flex-wrap gap-2">
                        {CATS.map(cat => (
                          <button key={cat} type="button" onClick={() => set('category', cat)}
                            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                            style={{
                              background: form.category === cat ? GOLD : '#F8F4EA',
                              color: form.category === cat ? '#0B0B0B' : '#6F6B63',
                              border: `1.5px solid ${form.category === cat ? GOLD : errors.category ? '#C84A4A' : '#E6DFD2'}`,
                            }}>
                            {cat}
                          </button>
                        ))}
                      </div>
                      {errors.category && <div className="flex items-center gap-1.5 mt-1.5 text-xs" style={{ color: '#C84A4A' }}><AlertCircle size={12} /> {errors.category}</div>}
                    </FieldWrap>

                    <FieldWrap error={errors.summary}>
                      <Label required>Short Summary</Label>
                      <textarea value={form.summary} onChange={e => set('summary', e.target.value)}
                        placeholder="A 1–2 sentence description shown in article listings and search results…"
                        rows={3} className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                        style={inputBase(focusedField === 'summary', errors.summary)}
                        {...fi('summary')} />
                      <div className="flex items-center justify-between mt-1">
                        {!errors.summary && <span className="text-xs" style={{ color: form.summary.length >= 50 ? '#27855C' : '#9A9590' }}>{form.summary.length >= 50 ? '✓ Good length' : `${Math.max(0, 50 - form.summary.length)} more chars needed`}</span>}
                        <span className="text-xs ml-auto" style={{ color: '#9A9590' }}>{form.summary.length}/240</span>
                      </div>
                    </FieldWrap>
                  </div>

                  {/* Section: Article Content */}
                  <div className="px-7 py-5" style={{ borderBottom: '1.5px solid #F0EBE0' }}>
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: GOLD, color: '#0B0B0B' }}>2</div>
                      <div className="font-serif font-bold text-base" style={{ fontFamily: 'var(--font-serif)', color: '#0B0B0B' }}>Article Content</div>
                    </div>

                    <FieldWrap error={errors.content}>
                      <div className="flex items-center justify-between mb-1.5">
                        <Label required>Content</Label>
                        <div className="flex items-center gap-2 text-xs" style={{ color: '#9A9590' }}>
                          <ClockIcon size={11} /> {wordCount} words · ~{readTime} min read
                        </div>
                      </div>
                      {/* Minimal toolbar */}
                      <div className="flex items-center gap-1 px-3 py-2 rounded-t-xl" style={{ background: '#F8F4EA', border: '1.5px solid #E6DFD2', borderBottom: 'none' }}>
                        {['H2', 'H3', 'B', 'I', '""', '—'].map(t => (
                          <button key={t} type="button" className="w-7 h-7 rounded flex items-center justify-center text-xs font-semibold transition-colors hover:bg-white"
                            style={{ color: '#6F6B63' }}
                            onClick={() => {
                              if (contentRef.current) {
                                const el = contentRef.current
                                const s = el.selectionStart, e2 = el.selectionEnd
                                const sel = el.value.slice(s, e2)
                                const map: Record<string, string> = { H2: `\n## ${sel}\n`, H3: `\n### ${sel}\n`, B: `**${sel}**`, I: `*${sel}*`, '""': `\n> ${sel}\n`, '—': '—' }
                                const replacement = map[t] || sel
                                set('content', el.value.slice(0, s) + replacement + el.value.slice(e2))
                              }
                            }}>
                            {t}
                          </button>
                        ))}
                      </div>
                      <textarea ref={contentRef} value={form.content} onChange={e => set('content', e.target.value)}
                        placeholder="Write your full article here. You can use ## for H2 headings, **bold**, *italic*, and > for blockquotes…"
                        rows={18} className="w-full px-4 py-3 rounded-b-xl text-sm font-mono leading-relaxed resize-y"
                        style={{ ...inputBase(focusedField === 'content', errors.content), borderTopLeftRadius: 0, borderTopRightRadius: 0, minHeight: 340, fontSize: 13 }}
                        {...fi('content')} />
                      {!errors.content && wordCount >= 800 && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-xs" style={{ color: '#27855C' }}>
                          <CheckIcon size={11} /> Great — your article meets the minimum length requirement
                        </div>
                      )}
                    </FieldWrap>
                  </div>

                  {/* Section: Images */}
                  <div className="px-7 py-5" style={{ borderBottom: '1.5px solid #F0EBE0' }}>
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: GOLD, color: '#0B0B0B' }}>3</div>
                      <div className="font-serif font-bold text-base" style={{ fontFamily: 'var(--font-serif)', color: '#0B0B0B' }}>Images</div>
                    </div>

                    <div className="mb-4">
                      <Label required>Featured Image</Label>
                      <p className="text-xs mb-2" style={{ color: '#9A9590' }}>Main image shown in listings and at the top of the article. Min. 1200×630px recommended.</p>
                      <UploadZone label="Upload featured image" files={featuredFiles}
                        onAdd={names => setFeaturedFiles(prev => [...prev, ...names].slice(0,1))}
                        onRemove={i => setFeaturedFiles(prev => prev.filter((_,j) => j !== i))} />
                      {errors.featured && <div className="flex items-center gap-1.5 mt-1.5 text-xs" style={{ color: '#C84A4A' }}><AlertCircle size={12} /> {errors.featured}</div>}
                    </div>

                    <div>
                      <Label>Supporting Images</Label>
                      <p className="text-xs mb-2" style={{ color: '#9A9590' }}>Up to 6 inline images. Reference them in your text as [image-1], [image-2], etc.</p>
                      <UploadZone label="Upload supporting images" multiple files={supportFiles}
                        onAdd={names => setSupportFiles(prev => [...prev, ...names].slice(0,6))}
                        onRemove={i => setSupportFiles(prev => prev.filter((_,j) => j !== i))} />
                    </div>
                  </div>

                  {/* Section: References */}
                  <div className="px-7 py-5" style={{ borderBottom: '1.5px solid #F0EBE0' }}>
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: GOLD, color: '#0B0B0B' }}>4</div>
                      <div className="font-serif font-bold text-base" style={{ fontFamily: 'var(--font-serif)', color: '#0B0B0B' }}>References</div>
                    </div>
                    <Label>Add References <span className="font-normal text-xs" style={{ color: '#9A9590' }}>(min. 3 required)</span></Label>
                    <div className="flex gap-2 mb-3">
                      <input value={refInput} onChange={e => setRefInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addRef())}
                        placeholder="Author, Title, Publisher, Year — or URL"
                        className="flex-1 px-4 py-2.5 rounded-xl text-sm"
                        style={inputBase(focusedField === 'ref')} {...fi('ref')} />
                      <button type="button" onClick={addRef}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 flex-shrink-0"
                        style={{ background: 'rgba(198,161,91,0.1)', color: GOLD, border: `1.5px solid rgba(198,161,91,0.3)` }}>
                        <PlusIcon size={13} /> Add
                      </button>
                    </div>
                    {refList.length > 0 ? (
                      <ol className="space-y-2">
                        {refList.map((r, i) => (
                          <li key={i} className="flex items-start gap-2 px-3 py-2 rounded-lg"
                            style={{ background: '#F8F4EA', border: '1px solid #E6DFD2' }}>
                            <span className="text-xs font-bold mt-0.5 flex-shrink-0" style={{ color: GOLD }}>{i+1}.</span>
                            <span className="text-xs flex-1" style={{ color: '#202020' }}>{r}</span>
                            <button type="button" onClick={() => setRefList(prev => prev.filter((_,j) => j !== i))}
                              className="flex-shrink-0 p-0.5 rounded hover:text-red-500 transition-colors" style={{ color: '#9A9590' }}>
                              <XIcon size={12} />
                            </button>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <div className="text-xs text-center py-4 rounded-xl" style={{ color: '#9A9590', background: '#F8F4EA', border: '1px dashed #E6DFD2' }}>
                        No references added yet — at least 3 are required
                      </div>
                    )}
                    {refList.length > 0 && refList.length < 3 && (
                      <div className="flex items-center gap-1.5 mt-2 text-xs" style={{ color: '#C84A4A' }}>
                        <AlertCircle size={12} /> {3 - refList.length} more reference{3 - refList.length > 1 ? 's' : ''} required
                      </div>
                    )}
                    {refList.length >= 3 && (
                      <div className="flex items-center gap-1.5 mt-2 text-xs" style={{ color: '#27855C' }}>
                        <CheckIcon size={11} /> {refList.length} references added — requirement met
                      </div>
                    )}
                  </div>

                  {/* Section: Author Info */}
                  <div className="px-7 py-5" style={{ borderBottom: '1.5px solid #F0EBE0' }}>
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: GOLD, color: '#0B0B0B' }}>5</div>
                      <div className="font-serif font-bold text-base" style={{ fontFamily: 'var(--font-serif)', color: '#0B0B0B' }}>About You</div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FieldWrap error={errors.authorName}>
                        <Label required>Full Name</Label>
                        <input value={form.authorName} onChange={e => set('authorName', e.target.value)}
                          placeholder="Your full name" className="w-full px-4 py-3 rounded-xl text-sm"
                          style={inputBase(focusedField === 'authorName', errors.authorName)}
                          {...fi('authorName')} />
                      </FieldWrap>
                      <FieldWrap error={errors.email}>
                        <Label required>Email Address</Label>
                        <input value={form.email} onChange={e => set('email', e.target.value)}
                          type="email" placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl text-sm"
                          style={inputBase(focusedField === 'email', errors.email)}
                          {...fi('email')} />
                      </FieldWrap>
                    </div>

                    <FieldWrap error={errors.authorBio}>
                      <Label required>Author Biography</Label>
                      <textarea value={form.authorBio} onChange={e => set('authorBio', e.target.value)}
                        placeholder="2–4 sentences about your background, expertise, and connection to the subject. This will appear on the published article."
                        rows={4} className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                        style={inputBase(focusedField === 'authorBio', errors.authorBio)}
                        {...fi('authorBio')} />
                    </FieldWrap>

                    <FieldWrap>
                      <Label>Social Profile URL</Label>
                      <input value={form.social} onChange={e => set('social', e.target.value)}
                        placeholder="https://twitter.com/yourhandle or LinkedIn URL"
                        className="w-full px-4 py-3 rounded-xl text-sm"
                        style={inputBase(focusedField === 'social')}
                        {...fi('social')} />
                    </FieldWrap>
                  </div>

                  {/* Section: Agreement + Actions */}
                  <div className="px-7 py-6">
                    {/* Agreement */}
                    <div className={`rounded-xl p-4 mb-6 ${errors.agreed ? 'border' : ''}`}
                      style={{ background: '#F8F4EA', border: `1.5px solid ${errors.agreed ? '#C84A4A' : '#E6DFD2'}` }}>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <div className="relative mt-0.5 flex-shrink-0">
                          <input type="checkbox" className="sr-only" checked={form.agreed} onChange={e => set('agreed', e.target.checked)} />
                          <div className="w-5 h-5 rounded flex items-center justify-center transition-all"
                            style={{ background: form.agreed ? GOLD : '#FFFFFF', border: `2px solid ${form.agreed ? GOLD : '#D0C8BC'}` }}
                            onClick={() => set('agreed', !form.agreed)}>
                            {form.agreed && <CheckIcon size={11} />}
                          </div>
                        </div>
                        <div className="text-xs leading-relaxed" style={{ color: '#6F6B63' }}>
                          I confirm this article is my original work, that I hold the rights to all submitted images, and I agree to KOBANI's{' '}
                          <a href="/terms-and-conditions" style={{ color: GOLD }} className="underline underline-offset-2">contributor publishing agreement</a>.
                          I understand KOBANI may edit the article for clarity, length, and house style.
                        </div>
                      </label>
                      {errors.agreed && <div className="flex items-center gap-1.5 mt-2 text-xs" style={{ color: '#C84A4A' }}><AlertCircle size={12} /> {errors.agreed}</div>}
                    </div>

                    {/* Validation summary */}
                    {formState === 'error' && Object.keys(errors).length > 0 && (
                      <div className="rounded-xl p-4 mb-5" style={{ background: 'rgba(200,74,74,0.05)', border: '1.5px solid rgba(200,74,74,0.25)' }}>
                        <div className="flex items-center gap-2 mb-2 text-xs font-bold" style={{ color: '#C84A4A' }}>
                          <AlertCircle size={13} /> {Object.keys(errors).length} field{Object.keys(errors).length > 1 ? 's' : ''} need{Object.keys(errors).length === 1 ? 's' : ''} attention
                        </div>
                        <ul className="space-y-1">
                          {Object.entries(errors).map(([, msg]) => (
                            <li key={msg} className="text-xs" style={{ color: '#C84A4A' }}>› {msg}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <button type="button" onClick={saveDraft}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                        style={{ background: '#FFFFFF', border: '1.5px solid #E6DFD2', color: '#202020' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = GOLD; (e.currentTarget as HTMLElement).style.color = GOLD }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E6DFD2'; (e.currentTarget as HTMLElement).style.color = '#202020' }}>
                        <FileTextIcon size={14} />
                        Save Draft
                      </button>
                      <button type="submit"
                        disabled={formState === 'submitting'}
                        className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all"
                        style={{ background: formState === 'submitting' ? '#D6C498' : GOLD, color: '#0B0B0B', cursor: formState === 'submitting' ? 'not-allowed' : 'pointer' }}>
                        {formState === 'submitting' ? (
                          <>
                            <div className="w-4 h-4 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(0,0,0,0.3) transparent transparent transparent' }} />
                            Submitting…
                          </>
                        ) : (
                          <>
                            <SendIcon size={14} />
                            Submit for Review
                          </>
                        )}
                      </button>
                      <span className="text-xs ml-auto" style={{ color: '#9A9590' }}>* Required fields</span>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Demo Articles ─────────────────────────────────────────────────────── */}
      <section className="px-4 py-14" style={{ background: '#FFFFFF', borderTop: '1.5px solid #E6DFD2' }}>
        <div className="mx-auto" style={{ maxWidth: 1280 }}>
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-xs font-bold tracking-[0.18em] uppercase mb-2" style={{ color: GOLD }}>✦ Community Submissions</div>
              <h2 className="font-serif font-bold text-2xl" style={{ fontFamily: 'var(--font-serif)', color: '#0B0B0B' }}>
                Recent Contributor Articles
              </h2>
            </div>
            <button onClick={() => onNavigate('articles')} className="hidden sm:flex items-center gap-1.5 text-sm font-semibold" style={{ color: GOLD }}>
              View All <ArrowRightIcon size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {DEMO_ARTICLES.map((a, i) => (
              <div key={i} className="rounded-2xl overflow-hidden flex flex-col group transition-all duration-300"
                style={{ background: '#F8F4EA', border: '1px solid #E6DFD2' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.09)'; (e.currentTarget as HTMLElement).style.borderColor = GOLD; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.borderColor = '#E6DFD2'; (e.currentTarget as HTMLElement).style.transform = 'none' }}>
                <div className="relative overflow-hidden" style={{ height: 160 }}>
                  <img src={a.img} alt={a.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: a.catColor }}>{a.category}</span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: a.status === 'Published' ? 'rgba(39,133,92,0.9)' : a.status === 'In Review' ? 'rgba(198,161,91,0.9)' : 'rgba(154,149,144,0.9)', color: '#FFFFFF' }}>
                      {a.status}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <div className="font-serif font-bold text-xs mb-2 leading-snug flex-1"
                    style={{ fontFamily: 'var(--font-serif)', color: '#0B0B0B' }}>{a.title}</div>
                  <div className="flex items-center gap-2 pt-3" style={{ borderTop: '1px solid #E6DFD2' }}>
                    <Avatar initials={a.authorInitials} size={24} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate" style={{ color: '#202020' }}>{a.author}</div>
                      <div className="text-xs" style={{ color: '#9A9590' }}>{a.date}</div>
                    </div>
                    {a.views !== '—' && (
                      <div className="text-xs" style={{ color: '#9A9590' }}>👁 {a.views}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats bar */}
          <div className="mt-8 rounded-2xl p-6 grid grid-cols-2 sm:grid-cols-4 gap-4" style={{ background: '#F8F4EA', border: '1px solid #E6DFD2' }}>
            {[
              { value: '47', label: 'Contributors', icon: '✍️' },
              { value: '128', label: 'Articles Published', icon: '📰' },
              { value: '40k+', label: 'Monthly Readers', icon: '👁' },
              { value: '$80–$200', label: 'Per Article', icon: '💰' },
            ].map(s => (
              <div key={s.label} className="text-center py-1">
                <div className="text-xl mb-1">{s.icon}</div>
                <div className="font-serif font-bold text-xl" style={{ fontFamily: 'var(--font-serif)', color: '#0B0B0B' }}>{s.value}</div>
                <div className="text-xs mt-0.5" style={{ color: '#9A9590' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
