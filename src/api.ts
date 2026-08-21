import i18n from "./i18n"

export const API_BASE = (
  import.meta.env.VITE_KOBANI_API_BASE_URL ||
  "https://www.cytechdevhub.com/kobani/api"
).replace(/\/$/, "")

export class ApiError extends Error {
  code: string
  fields?: Record<string, string>
  constructor(code = "SERVER_ERROR", fields?: Record<string, string>) {
    super(code)
    this.code = code
    this.fields = fields
  }
}

export type Faq = { id: string; question: string; answer: string; category: string; category_label: string; created_at: string | null; updated_at: string | null }
export type FaqInput = { question: string; answer: string; category: string }
export const faqApi = {
  publicList: () => request<{ success: true; data: { faqs: Faq[] } }>("/public/faqs"),
  adminList: () => request<{ success: true; data: { faqs: Faq[] } }>("/admin/faqs"),
  create: (payload: FaqInput) => request<{ success: true; data: { faq: Faq } }>("/admin/faqs", { method: "POST", body: JSON.stringify(payload) }),
  update: (id: string, payload: FaqInput) => request<{ success: true; data: { faq: Faq } }>(`/admin/faqs/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  remove: (id: string) => request<{ success: true }>(`/admin/faqs/${id}`, { method: "DELETE" }),
}

const cookie = (name: string) =>
  document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${name}=`))
    ?.split("=")
    .slice(1)
    .join("=")
const csrfKey = (name: "access" | "refresh") => `kobani:csrf:${name}`
const storedCsrf = (name: "access" | "refresh") =>
  sessionStorage.getItem(csrfKey(name)) || cookie(`csrf_${name}_token`)
const rememberCsrf = (body: Record<string, unknown>) => {
  if (typeof body.csrfAccessToken === "string")
    sessionStorage.setItem(csrfKey("access"), body.csrfAccessToken)
  if (typeof body.csrfRefreshToken === "string")
    sessionStorage.setItem(csrfKey("refresh"), body.csrfRefreshToken)
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  retry = true,
): Promise<T> {
  const method = (init.method || "GET").toUpperCase()
  const csrf =
    method !== "GET"
      ? storedCsrf(path === "/auth/refresh" ? "refresh" : "access")
      : undefined
  const isForm = init.body instanceof FormData
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Accept-Language": i18n.resolvedLanguage || i18n.language || "en",
      ...(!isForm ? { "Content-Type": "application/json" } : {}),
      ...(csrf ? { "X-CSRF-TOKEN": decodeURIComponent(csrf) } : {}),
      ...init.headers,
    },
  })
  const body = await response.json().catch(() => ({}))
  if (response.ok) rememberCsrf(body)
  if (
    !response.ok &&
    retry &&
    path !== "/auth/refresh" &&
    response.status === 401 &&
    ["TOKEN_EXPIRED", "UNAUTHORIZED"].includes(body.code)
  ) {
    try {
      await request("/auth/refresh", { method: "POST" }, false)
      return request<T>(path, init, false)
    } catch {
      /* original error below */
    }
  }
  if (!response.ok) throw new ApiError(body.code, body.fields)
  return body as T
}

export type Customer = {
  id: string
  fullName: string
  email: string
  phoneCountryCode: string
  phoneNumber: string
  countryOfResidence: string
  role: "customer"
  preferredLanguage: string
  emailVerified: boolean
}
export type Admin = {
  id: string
  fullName: string
  email: string
  role: "admin"
  status: "active"
  preferredLanguage: string
  emailVerified: true
  staff?: boolean
  roleName?: string
  permissions?: string[]
}
export type AuthUser = Customer | Admin
export type RegisterInput = {
  fullName: string
  email: string
  phoneCountryCode: string
  phoneNumber: string
  countryOfResidence: string
  password: string
  preferredLanguage: string
  acceptTerms: true
  termsVersion: string
  privacyVersion: string
}
type AuthResponse = {
  success: true
  user: AuthUser
  csrfAccessToken?: string
  csrfRefreshToken?: string
}
export type RegistrationResponse = {
  success: true
  verificationRequired: true
  email: string
  expiresInSeconds: number
  resendAvailableInSeconds: number
}
export const authApi = {
  register: (input: RegisterInput) =>
    request<RegistrationResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  verifyEmail: (email: string, code: string) =>
    request<AuthResponse>("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    }),
  resendVerification: (email: string) =>
    request<{
      success: true
      expiresInSeconds: number
      resendAvailableInSeconds: number
    }>("/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  login: (email: string, password: string) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  adminLogin: (email: string, password: string) =>
    request<AuthResponse>("/auth/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  me: () => request<AuthResponse>("/auth/me"),
  logout: async () => {
    try {
      return await request<{ success: true }>(
        "/auth/logout",
        { method: "POST" },
        false,
      )
    } finally {
      sessionStorage.removeItem(csrfKey("access"))
      sessionStorage.removeItem(csrfKey("refresh"))
    }
  },
}
export type CustomerProfile = {
  date_of_birth?: string
  gender?: string
  address?: string
  city?: string
  nationality?: string
  emergency_name?: string
  emergency_phone?: string
  emergency_relationship?: string
}
export type CustomerPreferences = {
  notifications: {
    email: boolean
    sms: boolean
    whatsapp: boolean
    marketing: boolean
  }
  privacy: { analytics: boolean personalization: boolean }
  currency: string
  language: string
}
export type CustomerAccount = {
  user: Customer
  profile: CustomerProfile
  preferences: CustomerPreferences
}
export const customerAccountApi = {
  get: () =>
    request<{ success: true data: CustomerAccount }>("/customer/account"),
  updateProfile: (payload: Record<string, string>) =>
    request<{ success: true data: CustomerAccount }>("/customer/profile", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  updatePreferences: (payload: CustomerPreferences) =>
    request<{ success: true data: CustomerAccount }>("/customer/preferences", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  changePassword: (current_password: string, new_password: string) =>
    request<{ success: true }>("/customer/password", {
      method: "POST",
      body: JSON.stringify({ current_password, new_password }),
    }),
  deleteAccount: (password: string, confirmation: string) =>
    request<{ success: true }>("/customer/account", {
      method: "DELETE",
      body: JSON.stringify({ password, confirmation }),
    }),
}

export type CustomerNotification = {
  id: string
  title: string
  message: string
  type: string
  is_read: boolean
  action_page?: string | null
  created_at?: string | null
}
export const customerNotificationApi = {
  list: () =>
    request<{
      success: true
      data: { notifications: CustomerNotification[] unread_count: number }
    }>("/customer/notifications"),
  markRead: (id: string) =>
    request<{ success: true }>(`/customer/notifications/${id}/read`, {
      method: "PATCH",
      body: "{}",
    }),
  markAllRead: () =>
    request<{ success: true }>("/customer/notifications/read-all", {
      method: "PATCH",
      body: "{}",
    }),
  remove: (id: string) =>
    request<{ success: true }>(`/customer/notifications/${id}`, {
      method: "DELETE",
    }),
}

export type CustomerProductOrderItem = {
  name: string
  variant: string
  quantity: number
  unit_price_minor: number
  currency?: "GHS" | "USD"
  unit_charge_minor?: number
  charge_currency?: "GHS"
  usd_to_ghs_rate?: string
  image?: string | null
}
export type CustomerProductOrder = {
  id: string
  reference: string
  status: string
  payment_status: string
  currency: string
  total_minor: number
  items: CustomerProductOrderItem[]
  tracking_number?: string | null
  tracking_url?: string | null
  estimated_delivery?: string | null
  created_at?: string | null
}
export const customerProductOrderApi = {
  list: () =>
    request<{ success: true data: { orders: CustomerProductOrder[] } }>(
      "/customer/product-orders",
    ),
  get: (id: string) =>
    request<{ success: true data: { order: CustomerProductOrder } }>(
      `/customer/product-orders/${id}`,
    ),
}

export type MarketProduct = {
  id: string
  name: string
  slug: string
  sku: string
  category: string
  description: string
  story: string
  origin: string
  currency: "GHS" | "USD"
  price_minor: number
  sale_price_minor?: number | null
  stock: number
  low_stock_level: number
  sales?: number
  rating_average: number
  rating_count: number
  status: string
  featured: boolean
  image?: ArticleImage | null
  image_url: string
  gallery: ArticleImage[]
  variants: Record<string, unknown>
  shipping: Record<string, unknown>
  seo: Record<string, unknown>
  created_at?: string | null
  updated_at?: string | null
}
export type ProductReview = { id: string; product_id: string; reviewer_name: string; rating: number; comment: string; verified_purchase: boolean; created_at?: string | null; updated_at?: string | null }
export type ProductOrder = CustomerProductOrder & {
  subtotal_minor: number
  delivery_minor: number
  fulfilment: string
  shipping: string
  delivery_address: Record<string, string>
  notes: string
  customer?: { name: string email: string phone: string }
  updated_at?: string | null
}
export type ProductInput = {
  name: string
  sku: string
  category: string
  currency?: string
  description?: string
  story?: string
  origin?: string
  price: number
  sale_price?: number | string | null
  stock: number
  low_stock_level: number
  status: string
  featured?: boolean
  image?: ArticleImage | null
  gallery?: ArticleImage[]
  variants?: Record<string, unknown>
  shipping?: Record<string, unknown>
  seo?: Record<string, unknown>
}
export const marketApi = {
  list: () =>
    request<{
      success: true
      data: { products: MarketProduct[] categories: string[] }
    }>("/public/products"),
  get: (slug: string) =>
    request<{ success: true data: { product: MarketProduct reviews: ProductReview[] } }>(
      `/public/products/${encodeURIComponent(slug)}`,
    ),
  review: (productId: string, payload: { rating: number; comment: string }) =>
    request<{ success: true; data: { review: ProductReview } }>(`/customer/products/${productId}/reviews`, { method: "POST", body: JSON.stringify(payload) }),
  checkout: (payload: Record<string, unknown>) =>
    request<{
      success: true
      data: {
        order: ProductOrder
        authorization_url: string
        access_code: string
      }
    }>("/customer/product-orders/checkout", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  verify: (reference: string) =>
    request<{ success: true data: { order: ProductOrder } }>(
      "/public/product-orders/paystack/verify",
      { method: "POST", body: JSON.stringify({ reference }) },
    ),
}
export const adminCommerceApi = {
  products: () =>
    request<{ success: true data: { products: MarketProduct[] } }>(
      "/admin/products",
    ),
  product: (id: string) =>
    request<{ success: true data: { product: MarketProduct } }>(
      `/admin/products/${id}`,
    ),
  create: (payload: ProductInput) =>
    request<{ success: true data: { product: MarketProduct } }>(
      "/admin/products",
      { method: "POST", body: JSON.stringify(payload) },
    ),
  update: (id: string, payload: Partial<ProductInput>) =>
    request<{ success: true data: { product: MarketProduct } }>(
      `/admin/products/${id}`,
      { method: "PATCH", body: JSON.stringify(payload) },
    ),
  remove: (id: string) =>
    request<{ success: true }>(`/admin/products/${id}`, { method: "DELETE" }),
  inventory: () =>
    request<{
      success: true
      data: { products: MarketProduct[] stock_value_minor: number }
    }>("/admin/inventory"),
  adjustStock: (
    id: string,
    payload: { kind: string quantity: number reason: string notes?: string },
  ) =>
    request<{ success: true data: { product: MarketProduct } }>(
      `/admin/products/${id}/stock-adjustments`,
      { method: "POST", body: JSON.stringify(payload) },
    ),
  orders: () =>
    request<{ success: true data: { orders: ProductOrder[] } }>(
      "/admin/product-orders",
    ),
  order: (id: string) =>
    request<{ success: true data: { order: ProductOrder } }>(
      `/admin/product-orders/${id}`,
    ),
  updateOrder: (id: string, payload: Record<string, string>) =>
    request<{ success: true data: { order: ProductOrder } }>(
      `/admin/product-orders/${id}`,
      { method: "PATCH", body: JSON.stringify(payload) },
    ),
  uploadImage: (file: File) => mediaApi.uploadImage(file, "product_image"),
}
export type PaymentSettings = {
  provider: string
  enabled: boolean
  currency: "GHS"
  usd_to_ghs_rate: string
  secret_key_configured: boolean
  public_key_configured: boolean
  secret_key_masked?: string | null
  public_key_masked?: string | null
  source: string
  updated_at?: string | null
  updated_by_name?: string | null
}
export type PaymentSettingsAudit = {
  id: string
  action: string
  admin_name?: string
  admin_email?: string
  changed_fields: string[]
  previous: Record<string, unknown>
  current: Record<string, unknown>
  location?: {
    latitude: number
    longitude: number
    accuracy_m: number
    captured_at: string
  } | null
  ip_address?: string
  user_agent?: string
  created_at: string
}
export const paymentSettingsApi = {
  get: () =>
    request<{ success: true data: { settings: PaymentSettings } }>(
      "/admin/settings/payments",
    ),
  update: (payload: Record<string, unknown>) =>
    request<{ success: true data: { settings: PaymentSettings } }>(
      "/admin/settings/payments",
      { method: "PUT", body: JSON.stringify(payload) },
    ),
  audit: () =>
    request<{ success: true data: { events: PaymentSettingsAudit[] } }>(
      "/admin/settings/payments/audit",
    ),
}

export type AuditLogEvent = {
  id: string
  created_at: string
  action: string
  outcome: "success" | "failed" | string
  actor_type: string
  actor_id?: string | null
  actor_name?: string | null
  actor_email?: string | null
  ip_address?: string | null
  user_agent?: string | null
  request_path?: string | null
  details: Record<string, unknown>
}
export const auditLogsApi = {
  list: () =>
    request<{ success: true; data: { events: AuditLogEvent[] } }>(
      "/admin/audit-logs",
    ),
}

export type StaffRole = { id: string; name: string; slug: string; description: string; permissions: string[]; assigned_user_count: number; is_active?: boolean }
export type StaffUser = { id: string; full_name: string; email: string; role: string; role_id: string; role_slug: string; permissions: string[]; status: "active" | "inactive" | "invited"; last_login_at?: string | null; activated_at?: string | null }
export const staffApi = {
  list: () => request<{ success: true; data: { staff: StaffUser[] } }>("/admin/staff"),
  roles: () => request<{ success: true; data: { roles: StaffRole[] } }>("/admin/roles"),
  permissions: () => request<{ success: true; data: { permissions: string[] } }>("/admin/permissions"),
  create: (payload: { full_name: string; email: string; role_id: string; password: string }) => request<{ success: true; data: { staff: StaffUser } }>("/admin/staff", { method: "POST", body: JSON.stringify(payload) }),
  update: (id: string, payload: { role_id?: string; status?: "active" | "inactive"; password?: string }) => request<{ success: true; data: { staff: StaffUser } }>(`/admin/staff/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  createRole: (payload: { name: string; description: string; permissions: string[] }) => request<{ success: true; data: { role: StaffRole } }>("/admin/roles", { method: "POST", body: JSON.stringify(payload) }),
  updateRole: (id: string, payload: { name?: string; description?: string; permissions: string[] }) => request<{ success: true; data: { roles: StaffRole[] } }>(`/admin/roles/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
}

export type ArticleCategory = {
  id: string
  name: string
  slug: string
  color_key: string
  description?: string
  is_active?: boolean
  display_order?: number
  article_count?: number
}
export type ArticleImage = {
  storage_key: string
  url: string
  alt_text?: string
  caption?: string
  mime_type?: string
  size?: number
}
export type Article = {
  id: string
  title: string
  slug: string
  excerpt: string
  content_html?: string
  content_text?: string
  category: ArticleCategory
  author: {
    id: string
    display_name: string
    initials: string
    profile_image_url?: string
    job_title?: string
  }
  status: "draft" | "scheduled" | "published" | "archived"
  view_count: number
  reading_time_minutes: number
  published_at?: string
  scheduled_for?: string
  updated_at: string
  featured_image?: ArticleImage
  is_featured: boolean
  is_editors_pick: boolean
  featured_priority: number
  tags?: string[]
  references?: string[]
  author_bio?: string
  seo?: Record<string, unknown>
  related_articles?: Article[]
}
export type ArticleInput = {
  title: string
  slug?: string
  excerpt: string
  content_html: string
  category_id: string
  status: string
  scheduled_for?: string
  featured_image?: ArticleImage
  is_featured?: boolean
  is_editors_pick?: boolean
  tags?: string[]
  references?: string[]
  author_bio?: string
  seo?: Record<string, unknown>
}
const queryString = (params: Record<string, string | number | undefined>) => {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value))
  })
  const text = query.toString()
  return text ? `?${text}` : ""
}
export const resolveMediaUrl = (url?: string) =>
  !url
    ? ""
    : url.startsWith("/api/")
      ? `${API_BASE.replace(/\/api$/, "")}${url}`
      : url
export const mediaApi = {
  uploadImage: (file: File, purpose = "general", variant?: string) => {
    const body = new FormData()
    body.append("image", file)
    body.append("purpose", purpose)
    if (variant) body.append("variant", variant)
    return request<{ success: true data: { image: ArticleImage } }>(
      "/admin/media/images",
      { method: "POST", body },
    )
  },
}
export type HotelImage = ArticleImage
export type HotelReview = {
  id: string
  hotel_id: string
  user_id?: string
  reviewer_name: string
  rating: number
  title?: string
  comment: string
  status: "pending" | "approved" | "rejected" | "flagged"
  verified_guest: boolean
  created_at: string
}
export type Hotel = {
  id: string
  name: string
  slug: string
  short_description: string
  full_description?: string
  country: string
  region: string
  city: string
  area?: string
  street_address?: string
  gps_address?: string
  latitude?: number
  longitude?: number
  hotel_type: string
  star_rating?: number
  cover_image?: HotelImage
  logo?: HotelImage
  gallery_images: HotelImage[]
  phone?: string
  whatsapp_number: string
  email?: string
  website?: string
  whatsapp_message_template?: string
  price_from?: number
  price_to?: number
  currency: string
  pricing_note?: string
  amenities: string[]
  room_types: Record<string, unknown>[]
  highlights: string[]
  check_in_time?: string
  check_out_time?: string
  cancellation_policy?: string
  children_policy?: string
  pet_policy?: string
  smoking_policy?: string
  other_policy?: string
  custom_fields: { label: string value: string }[]
  nearby_attractions: { name: string distance: string description: string }[]
  seo_title?: string
  seo_description?: string
  featured: boolean
  verified: boolean
  status: "draft" | "published" | "archived"
  whatsapp_clicks: number
  total_views: number
  conversion_rate: number
  rating_average: number
  rating_count: number
  created_at?: string
  updated_at?: string
}
export type HotelInput = Partial<Omit<Hotel, "id" | "whatsapp_clicks" | "total_views" | "conversion_rate" | "rating_average" | "rating_count">> & {
  name?: string
}
export const hotelApi = {
  list: (params: Record<string, string | number | undefined> = {}) =>
    request<{
      success: true
      data: { hotels: Hotel[] regions: string[] cities: string[] }
    }>(`/public/hotels${queryString(params)}`),
  detail: (slug: string) =>
    request<{
      success: true
      data: { hotel: Hotel reviews: HotelReview[] related: Hotel[] }
    }>(`/public/hotels/${encodeURIComponent(slug)}`),
  whatsappUrl: (id: string, source: string) =>
    `${API_BASE}/public/hotels/${encodeURIComponent(id)}/whatsapp?source=${encodeURIComponent(source)}`,
  review: (
    id: string,
    payload: { rating: number title?: string comment: string },
  ) =>
    request<{ success: true data: { review: HotelReview } }>(
      `/public/hotels/${id}/reviews`,
      { method: "POST", body: JSON.stringify(payload) },
    ),
  upload: (file: File) => mediaApi.uploadImage(file, "hotel_image"),
}
export const adminHotelApi = {
  list: (params: Record<string, string | number | undefined> = {}) =>
    request<{
      success: true
      data: { hotels: Hotel[] summary: Record<string, number> }
    }>(`/admin/hotels${queryString(params)}`),
  get: (id: string) =>
    request<{ success: true data: { hotel: Hotel } }>(`/admin/hotels/${id}`),
  create: (payload: HotelInput) =>
    request<{ success: true data: { hotel: Hotel } }>("/admin/hotels", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id: string, payload: HotelInput) =>
    request<{ success: true data: { hotel: Hotel } }>(`/admin/hotels/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  archive: (id: string) =>
    request<{ success: true }>(`/admin/hotels/${id}`, { method: "DELETE" }),
  analytics: (id: string, days = 30) =>
    request<{
      success: true
      data: {
        hotel: Hotel
        timeline: { date: string type: string count: number }[]
      }
    }>(`/admin/hotels/${id}/analytics?days=${days}`),
  reviews: (id: string, status = "") =>
    request<{ success: true data: { reviews: HotelReview[] } }>(
      `/admin/hotels/${id}/reviews${status ? `?status=${status}` : ""}`,
    ),
  moderate: (
    id: string,
    payload: { status?: string verified_guest?: boolean },
  ) =>
    request<{ success: true data: { review: HotelReview } }>(
      `/admin/hotel-reviews/${id}`,
      { method: "PATCH", body: JSON.stringify(payload) },
    ),
}
export type GalleryItem = {
  id: string
  title: string
  category: string
  location: string
  caption: string
  alt_text: string
  image: ArticleImage
  is_public: boolean
  uploaded_at: string
  updated_at?: string
  album_id?: string
  album_title?: string
  album_position?: number
  album_size?: number
}
export type GalleryInput = {
  title: string
  category: string
  location?: string
  caption?: string
  alt_text: string
  image: ArticleImage
  is_public: boolean
}
export const galleryApi = {
  publicList: (params: Record<string, string | number | undefined> = {}) =>
    request<{
      success: true
      data: {
        items: GalleryItem[]
        categories: { name: string count: number }[]
        pagination: { total: number pages: number }
      }
    }>(`/public/gallery${queryString(params)}`),
  adminList: (params: Record<string, string | number | undefined> = {}) =>
    request<{
      success: true
      data: {
        items: GalleryItem[]
        categories: { name: string count: number }[]
        pagination: { total: number pages: number }
      }
    }>(`/admin/gallery${queryString(params)}`),
  create: (payload: GalleryInput) =>
    request<{ success: true data: { item: GalleryItem } }>("/admin/gallery", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  createBatch: (
    payload: Omit<GalleryInput, "image"> & { images: ArticleImage[] },
  ) =>
    request<{
      success: true
      data: { items: GalleryItem[] album_id: string count: number }
    }>("/admin/gallery/batch", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id: string, payload: Partial<GalleryInput>) =>
    request<{ success: true data: { item: GalleryItem } }>(
      `/admin/gallery/${id}`,
      { method: "PATCH", body: JSON.stringify(payload) },
    ),
  remove: (id: string) =>
    request<{ success: true }>(`/admin/gallery/${id}`, { method: "DELETE" }),
}
export const articleApi = {
  publicList: (params: Record<string, string | number | undefined> = {}) =>
    request<{
      success: true
      data: { articles: Article[] total: number page: number pages: number }
    }>(`/public/articles${queryString(params)}`),
  overview: () =>
    request<{
      success: true
      data: {
        featured: Article | null
        popular: Article[]
        categories: ArticleCategory[]
        total: number
      }
    }>("/public/articles/overview"),
  publicDetail: (slug: string) =>
    request<{ success: true data: { article: Article } }>(
      `/public/articles/${encodeURIComponent(slug)}`,
    ),
  adminList: (params: Record<string, string | number | undefined> = {}) =>
    request<{
      success: true
      data: {
        articles: Article[]
        summary: Record<string, number>
        pagination: { total: number }
      }
    }>(`/admin/articles${queryString(params)}`),
  adminDetail: (id: string) =>
    request<{ success: true data: { article: Article } }>(
      `/admin/articles/${id}`,
    ),
  create: (payload: ArticleInput) =>
    request<{ success: true data: { article: Article } }>("/admin/articles", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id: string, payload: Partial<ArticleInput>) =>
    request<{ success: true data: { article: Article } }>(
      `/admin/articles/${id}`,
      { method: "PATCH", body: JSON.stringify(payload) },
    ),
  action: (id: string, action: string, payload: Record<string, unknown> = {}) =>
    request<{ success: true data: { article: Article } }>(
      `/admin/articles/${id}/${action}`,
      { method: "POST", body: JSON.stringify(payload) },
    ),
  remove: (id: string) =>
    request<{ success: true }>(`/admin/articles/${id}`, { method: "DELETE" }),
  categories: () =>
    request<{ success: true data: { categories: ArticleCategory[] } }>(
      "/admin/article-categories",
    ),
  createCategory: (name: string) =>
    request<{ success: true }>("/admin/article-categories", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),
  updateCategory: (id: string, payload: Record<string, unknown>) =>
    request<{ success: true }>(`/admin/article-categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  deleteCategory: (id: string) =>
    request<{ success: true }>(`/admin/article-categories/${id}`, {
      method: "DELETE",
    }),
  uploadImage: (file: File) =>
    mediaApi.uploadImage(file, "article_featured_image"),
}

export type TourCategory = {
  id: string
  name: string
  slug: string
  description?: string
  is_active?: boolean
  display_order?: number
  tour_count?: number
}
export type TourDeparture = {
  id: string
  code: string
  tour_id: string
  tour_title: string
  start_date: string
  end_date: string
  capacity: number
  booked: number
  held: number
  available: number
  price: number
  currency: string
  booking_deadline?: string
  status: "open" | "limited" | "full" | "closed" | "cancelled"
  notes?: string
}
export type TourPackage = {
  id: string
  name: string
  tier_label: string
  badge: string
  short_description: string
  currency: string
  pricing_basis: "per_person" | "per_adult_child" | "per_couple" | "per_group" | "flat_package"
  price: number
  adult_price: number
  child_price: number
  same_price_for_all: boolean
  days: number
  nights: number
  hotel_standard: string
  accommodation_description: string
  room_type: string
  transport_type: string
  transport_description: string
  meal_plan: string
  meals_description: string
  activities: string[]
  highlights: string[]
  itinerary: {
    day: number
    title: string
    description: string
    activities: string[]
  }[]
  inclusions: string[]
  exclusions: string[]
  requirements: string[]
  min_guests: number
  max_guests: number
  private_group_only: boolean
  corporate_only: boolean
  allow_individual_booking: boolean
  deposit_enabled: boolean
  deposit_type: "percentage" | "fixed"
  deposit_value: number
  balance_due_days_before_departure: number
  full_payment_allowed: boolean
  active: boolean
  display_order: number
  legacy?: boolean
}
export type Tour = {
  id: string
  code: string
  title: string
  slug: string
  category: TourCategory | null
  destination: string
  country: string
  short_description: string
  description?: string
  adult_price: number
  child_price: number
  currency: string
  deposit_percent: number
  duration_days: number
  featured_image?: ArticleImage
  flyer_image?: ArticleImage
  booking_mode?: "legacy_checkout" | "flyer_request"
  notes?: string
  booking_count?: number
  gallery?: ArticleImage[]
  is_featured: boolean
  status: "draft" | "published" | "archived"
  departure_count: number
  total_capacity: number
  total_booked: number
  next_departure?: string
  departures?: TourDeparture[]
  saved_count?: number
  saved_at?: string
  itinerary?: { day: number title: string description: string }[]
  inclusions?: string[]
  exclusions?: string[]
  requirements?: string[]
  accommodation?: string
  transport?: string
  meals?: string
  cancellation_policy?: string
  video_url?: string
  faqs?: { question: string answer: string }[]
  seo?: Record<string, unknown>
  related_tours?: Tour[]
  created_at?: string
  updated_at?: string
  tour_type: string
  target_audiences: string[]
  destinations: {
    name: string
    region: string
    type: string
    description: string
  }[]
  highlights: string[]
  availability_type: string
  min_group_size: number
  max_group_size: number
  private_group_only: boolean
  corporate_only: boolean
  packages: TourPackage[]
  package_count: number
  starting_price: number
  min_duration_days: number
  max_duration_days: number
}
export type TourInput = {
  title: string
  slug?: string
  category_id: string
  destination: string
  country: string
  short_description?: string
  description?: string
  adult_price?: number
  child_price?: number
  currency?: string
  deposit_percent?: number
  duration_days?: number
  featured_image?: ArticleImage
  flyer_image?: ArticleImage
  booking_mode?: "legacy_checkout" | "flyer_request"
  notes?: string
  gallery?: ArticleImage[]
  itinerary?: { title: string description: string }[]
  inclusions?: string[]
  exclusions?: string[]
  requirements?: string[]
  accommodation?: string
  transport?: string
  meals?: string
  cancellation_policy?: string
  video_url?: string
  faqs?: { question: string answer: string }[]
  seo?: Record<string, unknown>
  is_featured?: boolean
  status: string
  tour_type?: string
  target_audiences?: string[]
  destinations?: Tour["destinations"]
  highlights?: string[]
  availability_type?: string
  min_group_size?: number
  max_group_size?: number
  private_group_only?: boolean
  corporate_only?: boolean
  packages?: TourPackage[]
}
type TourListData = {
  tours: Tour[]
  categories: TourCategory[]
  pagination: { page: number limit: number total: number pages: number }
}
export const tourApi = {
  publicList: (params: Record<string, string | number | undefined> = {}) =>
    request<{ success: true data: TourListData }>(
      `/public/tours${queryString(params)}`,
    ),
  overview: () =>
    request<{ success: true data: { featured: Tour[] total: number } }>(
      "/public/tours/overview",
    ),
  publicDetail: (slug: string) =>
    request<{ success: true data: { tour: Tour } }>(
      `/public/tours/${encodeURIComponent(slug)}`,
    ),
  adminList: (params: Record<string, string | number | undefined> = {}) =>
    request<{ success: true data: TourListData }>(
      `/admin/tours${queryString(params)}`,
    ),
  adminDetail: (id: string) =>
    request<{ success: true data: { tour: Tour } }>(`/admin/tours/${id}`),
  create: (payload: TourInput) =>
    request<{ success: true data: { tour: Tour } }>("/admin/tours", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id: string, payload: Partial<TourInput>) =>
    request<{ success: true data: { tour: Tour } }>(`/admin/tours/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  action: (
    id: string,
    action: "publish" | "archive" | "restore" | "duplicate",
  ) =>
    request<{ success: true data: { tour: Tour } }>(
      `/admin/tours/${id}/${action}`,
      { method: "POST", body: "{}" },
    ),
  remove: (id: string) =>
    request<{ success: true }>(`/admin/tours/${id}`, { method: "DELETE" }),
  categories: () =>
    request<{ success: true data: { categories: TourCategory[] } }>(
      "/admin/tour-categories",
    ),
  uploadImage: (file: File) => mediaApi.uploadImage(file, "tour_image"),
}
export const savedTourApi = {
  list: () =>
    request<{ success: true data: { tours: Tour[] saved_ids: string[] } }>(
      "/customer/saved-tours",
    ),
  save: (tourId: string) =>
    request<{
      success: true
      data: { tour_id: string saved: true saved_count: number }
    }>(`/customer/saved-tours/${tourId}`, { method: "POST", body: "{}" }),
  remove: (tourId: string) =>
    request<{
      success: true
      data: { tour_id: string saved: false saved_count: number }
    }>(`/customer/saved-tours/${tourId}`, { method: "DELETE" }),
}
export const departureApi = {
  list: (params: Record<string, string | number | undefined> = {}) =>
    request<{ success: true data: { departures: TourDeparture[] } }>(
      `/admin/departures${queryString(params)}`,
    ),
  create: (payload: Record<string, unknown>) =>
    request<{ success: true data: { departure: TourDeparture } }>(
      "/admin/departures",
      { method: "POST", body: JSON.stringify(payload) },
    ),
  update: (id: string, payload: Record<string, unknown>) =>
    request<{ success: true data: { departure: TourDeparture } }>(
      `/admin/departures/${id}`,
      { method: "PATCH", body: JSON.stringify(payload) },
    ),
  remove: (id: string) =>
    request<{ success: true }>(`/admin/departures/${id}`, { method: "DELETE" }),
}

export type BookingPrice = {
  counts: { adults: number children: number infants: number spaces: number }
  adult_unit: string
  child_unit: string
  total: string
  deposit: string
  amount_due: string
  total_minor: number
  deposit_minor: number
  currency: string
  available?: number
  deposit_percent: string
  package_id: string
  package_name: string
  pricing_basis: string
  deposit_enabled: boolean
  full_payment_allowed: boolean
}
export type BookingTravellerInput = {
  first_name: string
  last_name: string
  date_of_birth?: string
  nationality?: string
  traveller_type: "adult" | "child" | "infant"
  dietary_requirements?: string
  accessibility_requirements?: string
  special_requests?: string
}
export type Booking = {
  id: string
  booking_reference: string
  customer: { id: string full_name: string email: string phone: string }
  tour: {
    id: string
    title: string
    slug: string
    destination: string
    country: string
    featured_image?: ArticleImage
  }
  departure: { id: string code: string start_date: string end_date: string }
  package: {
    id: string
    name: string
    duration?: { days: number nights: number }
    hotel?: string
    room?: string
    transport?: string
    meals?: string
    activities?: string[]
    itinerary?: TourPackage["itinerary"]
    inclusions?: string[]
  }
  traveller_summary: {
    adults: number
    children: number
    infants: number
    spaces: number
  }
  total: string
  paid: string
  balance: string
  total_minor: number
  paid_minor: number
  balance_minor: number
  deposit: string
  currency: string
  booking_status: string
  payment_status: string
  reservation_active: boolean
  reservation_expires_at: string
  price_breakdown?: BookingPrice
  travellers?: Array<BookingTravellerInput & {
    id?: string
    full_name?: string
    document_status?: string
  }>
  payments?: Payment[]
  audit?: { action: string created_at: string }[]
  created_at: string
  workflow?: "flyer_request"
  request_details?: string
  preferred_date?: string
  traveller_count?: number
  last_activity_at?: string
  admin_unread?: boolean
  customer_unread?: boolean
  messages?: BookingMessage[]
  invoices?: BookingInvoice[]
}
export type BookingMessage = { id: string; sender_type: "customer"|"admin"|"system"; sender_id?: string; message: string; created_at: string; read_at?: string }
export type BookingInvoice = { id:string; invoice_number:string; booking_id:string; booking_reference:string; purpose:string; description:string; amount_minor:number; amount:string; currency:string; status:string; issue_date:string; due_date?:string; paid_at?:string; created_at:string }
export type Payment = {
  id: string
  payment_reference: string
  provider: string
  payment_type: string
  amount: string
  amount_minor: number
  currency: string
  status: string
  fulfilled: boolean
  paid_at?: string
  created_at: string
}
export type Traveller = BookingTravellerInput & {
  id: string
  full_name: string
  booking_id: string
  customer_id: string
  tour_id: string
  departure_id: string
  booking_reference?: string
  tour_title?: string
  departure_date?: string
  is_lead: boolean
  document_status: string
  status: string
}
const bookingToken = () =>
  sessionStorage.getItem("kobani_booking_access_token") || ""
export const bookingApi = {
  calculatePrice: (payload: Record<string, unknown>) =>
    request<{ success: true data: { price: BookingPrice } }>(
      "/public/bookings/price",
      { method: "POST", body: JSON.stringify(payload) },
    ),
  create: (payload: Record<string, unknown>, idempotencyKey: string) =>
    request<{
      success: true
      data: { booking: Booking booking_access_token: string | null }
    }>("/public/bookings", {
      method: "POST",
      headers: { "Idempotency-Key": idempotencyKey },
      body: JSON.stringify(payload),
    }),
  get: (id: string) =>
    request<{ success: true data: { booking: Booking } }>(
      `/public/bookings/${id}`,
      { headers: { "X-KOBANI-BOOKING-TOKEN": bookingToken() } },
    ),
  cancel: (id: string) =>
    request<{ success: true }>(`/public/bookings/${id}/cancel`, {
      method: "POST",
      headers: { "X-KOBANI-BOOKING-TOKEN": bookingToken() },
      body: "{}",
    }),
  initializePaystack: (id: string, paymentOption: string) =>
    request<{
      success: true
      data: {
        booking_reference: string
        payment_reference: string
        access_code: string
        authorization_url: string
        amount: string
        currency: string
        charge_amount: string
        charge_amount_minor: number
        charge_currency: "GHS"
        usd_to_ghs_rate: string
      }
    }>(`/public/bookings/${id}/payments/paystack/initialize`, {
      method: "POST",
      headers: { "X-KOBANI-BOOKING-TOKEN": bookingToken() },
      body: JSON.stringify({ payment_option: paymentOption }),
    }),
  verifyPaystack: (reference: string) =>
    request<{
      success: true
      data: { state: string booking: Booking payment: Payment }
    }>("/public/payments/paystack/verify", {
      method: "POST",
      body: JSON.stringify({ reference }),
    }),
}
export type CustomerPayment = Payment & {
  kind?: "tour_booking" | "product_order"
  booking_id: string
  booking_reference: string
  tour_title: string
  method: string
  order_id?: string
  order_reference?: string
}
export type CustomerPaymentSummary = {
  currency: string
  paid_minor: number
  outstanding_minor: number
  successful_count: number
  outstanding_count: number
  by_currency?: Array<{ currency: string paid_minor: number outstanding_minor: number }>
  tour_payment_count?: number
  product_payment_count?: number
}
export const customerBookingApi = {
  createRequest: (payload: Record<string, unknown>, idempotencyKey: string) => request<{success:true;data:{booking:Booking}}>("/customer/booking-requests",{method:"POST",headers:{"Idempotency-Key":idempotencyKey},body:JSON.stringify(payload)}),
  create: (payload: Record<string, unknown>, idempotencyKey: string) =>
    request<{
      success: true
      data: { booking: Booking booking_access_token: null }
    }>("/customer/bookings", {
      method: "POST",
      headers: { "Idempotency-Key": idempotencyKey },
      body: JSON.stringify(payload),
    }),
  list: () =>
    request<{ success: true data: { bookings: Booking[] } }>(
      "/customer/bookings",
    ),
  get: (id: string) =>
    request<{ success: true data: { booking: Booking } }>(
      `/customer/bookings/${id}`,
    ),
  sendMessage: (id:string,message:string)=>request<{success:true;data:{message:BookingMessage}}>(`/customer/bookings/${id}/messages`,{method:"POST",body:JSON.stringify({message})}),
  payInvoice: (bookingId:string,invoiceId:string)=>request<{success:true;data:{authorization_url:string;payment_reference:string;invoice_number:string}}>(`/customer/bookings/${bookingId}/invoices/${invoiceId}/pay`,{method:"POST",body:"{}"}),
  cancel: (id: string) =>
    request<{ success: true }>(`/customer/bookings/${id}/cancel`, {
      method: "POST",
      body: "{}",
    }),
  initializePayment: (
    id: string,
    paymentOption: "deposit" | "full_payment" | "outstanding_balance",
  ) =>
    request<{
      success: true
      data: {
        booking_reference: string
        payment_reference: string
        access_code: string
        authorization_url: string
        amount: string
        currency: string
        charge_amount: string
        charge_amount_minor: number
        charge_currency: "GHS"
        usd_to_ghs_rate: string
      }
    }>(`/customer/bookings/${id}/payments/paystack/initialize`, {
      method: "POST",
      body: JSON.stringify({ payment_option: paymentOption }),
    }),
  payOutstanding: (id: string) =>
    customerBookingApi.initializePayment(id, "outstanding_balance"),
  payments: () =>
    request<{
      success: true
      data: {
        payments: CustomerPayment[]
        outstanding_bookings: Booking[]
        summary: CustomerPaymentSummary
      }
    }>("/customer/payments"),
}
export const adminBookingApi = {
  list: (params: Record<string, string | number | undefined> = {}) =>
    request<{
      success: true
      data: {
        bookings: Booking[]
        summary: Record<string, number>
        pagination: { total: number pages: number }
      }
    }>(`/admin/bookings${queryString(params)}`),
  get: (id: string) =>
    request<{ success: true data: { booking: Booking } }>(
      `/admin/bookings/${id}`,
    ),
  action: (id: string, action: string) =>
    request<{ success: true data: { booking: Booking } }>(
      `/admin/bookings/${id}/${action}`,
      { method: "POST", body: "{}" },
    ),
  sendMessage: (id:string,message:string)=>request<{success:true;data:{message:BookingMessage}}>(`/admin/bookings/${id}/messages`,{method:"POST",body:JSON.stringify({message})}),
  createInvoice: (id:string,payload:Record<string,unknown>)=>request<{success:true;data:{invoice:BookingInvoice}}>(`/admin/bookings/${id}/invoices`,{method:"POST",body:JSON.stringify(payload)}),
  cancelInvoice: (bookingId:string,invoiceId:string)=>request<{success:true;data:{invoice:BookingInvoice}}>(`/admin/bookings/${bookingId}/invoices/${invoiceId}/cancel`,{method:"POST",body:"{}"}),
  manualPayment: (payload: Record<string, unknown>) =>
    request<{ success: true data: { booking: Booking payment: Payment } }>(
      "/admin/payments/manual",
      { method: "POST", body: JSON.stringify(payload) },
    ),
  exportUrl: () => `${API_BASE}/admin/bookings/export`,
}
export const adminTravellerApi = {
  list: (params: Record<string, string | number | undefined> = {}) =>
    request<{
      success: true
      data: { travellers: Traveller[] summary: Record<string, number> }
    }>(`/admin/travellers${queryString(params)}`),
  get: (id: string) =>
    request<{ success: true data: { traveller: Traveller } }>(
      `/admin/travellers/${id}`,
    ),
  update: (id: string, payload: Record<string, unknown>) =>
    request<{ success: true data: { traveller: Traveller } }>(
      `/admin/travellers/${id}`,
      { method: "PATCH", body: JSON.stringify(payload) },
    ),
}

export type AdminCustomer = {
  id: string
  full_name: string
  email: string
  phone: string
  country: string
  status: string
  account_type: string
  email_verified: boolean
  created_at: string
  total_bookings: number
  confirmed_bookings: number
  cancelled_bookings: number
  upcoming_bookings: number
  lifetime_value_minor: number
  lifetime_value: string
  outstanding_minor: number
  outstanding: string
  refund_total_minor: number
  refund_total: string
  last_booking_at?: string
  last_payment_at?: string
  bookings?: Booking[]
  payments?: AdminPayment[]
  refunds?: AdminRefund[]
  travellers?: Traveller[]
}
export type AdminPayment = Payment & {
  booking_reference: string
  booking_id: string
  customer_id: string
  customer_name: string
  customer_email: string
  tour_title: string
  refunded_minor: number
  refunded: string
  method?: string
  provider_transaction_id?: string
}
export type AdminRefund = {
  id: string
  refund_reference: string
  booking_id: string
  booking_reference: string
  payment_id: string
  payment_reference: string
  provider: string
  customer_id: string
  customer_name: string
  customer_email: string
  tour_title: string
  amount_minor: number
  amount: string
  currency: string
  reason: string
  status: string
  provider_refund_id?: string
  notes?: string
  created_at: string
  updated_at: string
  completed_at?: string
}
export const adminCustomerApi = {
  list: (params: Record<string, string | number | undefined> = {}) =>
    request<{
      success: true
      data: {
        customers: AdminCustomer[]
        summary: Record<string, number>
        pagination: { total: number }
      }
    }>(`/admin/customers${queryString(params)}`),
  get: (id: string) =>
    request<{ success: true data: { customer: AdminCustomer } }>(
      `/admin/customers/${id}`,
    ),
  update: (id: string, payload: Record<string, unknown>) =>
    request<{ success: true data: { customer: AdminCustomer } }>(
      `/admin/customers/${id}`,
      { method: "PATCH", body: JSON.stringify(payload) },
    ),
  action: (id: string, action: "deactivate" | "restore") =>
    request<{ success: true data: { customer: AdminCustomer } }>(
      `/admin/customers/${id}/${action}`,
      { method: "POST", body: "{}" },
    ),
}
export const adminPaymentApi = {
  list: (params: Record<string, string | number | undefined> = {}) =>
    request<{
      success: true
      data: {
        payments: AdminPayment[]
        summary: Record<string, number>
        pagination: { total: number }
      }
    }>(`/admin/payments${queryString(params)}`),
  get: (id: string) =>
    request<{ success: true data: { payment: AdminPayment } }>(
      `/admin/payments/${id}`,
    ),
  verify: (id: string) =>
    request<{ success: true data: unknown }>(`/admin/payments/${id}/verify`, {
      method: "POST",
      body: "{}",
    }),
}
export const adminRefundApi = {
  list: (params: Record<string, string | number | undefined> = {}) =>
    request<{
      success: true
      data: {
        refunds: AdminRefund[]
        summary: Record<string, number>
        pagination: { total: number }
      }
    }>(`/admin/refunds${queryString(params)}`),
  create: (payload: Record<string, unknown>) =>
    request<{ success: true data: { refund: AdminRefund } }>("/admin/refunds", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  get: (id: string) =>
    request<{ success: true data: { refund: AdminRefund } }>(
      `/admin/refunds/${id}`,
    ),
  action: (id: string, action: string, payload: Record<string, unknown> = {}) =>
    request<{ success: true data: { refund: AdminRefund } }>(
      `/admin/refunds/${id}/${action}`,
      { method: "POST", body: JSON.stringify(payload) },
    ),
}
export type Subscriber = {
  id: string
  email: string
  status: string
  country_code: string
  region: string
  city: string
  location: string
  source: string
  subscribed_at: string
  updated_at: string
  unsubscribed_at?: string
}
export const subscriberApi = {
  subscribe: (email: string) =>
    request<{
      success: true
      data: { subscriber: Subscriber created: boolean }
    }>("/public/subscribers", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  list: (params: Record<string, string | number | undefined> = {}) =>
    request<{
      success: true
      data: {
        subscribers: Subscriber[]
        summary: Record<string, number>
        pagination: { total: number }
      }
    }>(`/admin/subscribers${queryString(params)}`),
  action: (id: string, action: "unsubscribe" | "reactivate") =>
    request<{ success: true data: { subscriber: Subscriber } }>(
      `/admin/subscribers/${id}/${action}`,
      { method: "POST", body: "{}" },
    ),
  exportUrl: () => `${API_BASE}/admin/subscribers/export`,
}
export type ContactMessageInput = {
  name: string
  email: string
  phone?: string
  subject?: string
  enquiry_type: string
  message: string
}
export type ContactMessage = ContactMessageInput & {
  id: string
  preview: string
  is_read: boolean
  created_at: string
}
export const contactMessageApi = {
  submit: (payload: ContactMessageInput) =>
    request<{ success: true data: { message: ContactMessage } }>(
      "/public/contact/messages",
      { method: "POST", body: JSON.stringify(payload) },
    ),
  adminList: (params: { status?: string search?: string } = {}) =>
    request<{
      success: true
      data: { messages: ContactMessage[] unread_count: number }
    }>(`/admin/messages${queryString(params)}`),
  adminGet: (id: string) =>
    request<{ success: true data: { message: ContactMessage } }>(
      `/admin/messages/${id}`,
    ),
  unreadCount: () =>
    request<{ success: true data: { unread_count: number } }>(
      "/admin/messages/unread-count",
    ),
  markRead: (id: string, is_read: boolean) =>
    request<{ success: true }>(`/admin/messages/${id}/read`, {
      method: "PATCH",
      body: JSON.stringify({ is_read }),
    }),
}
export type DashboardSnapshot = {
  generated_at: string
  range_days: number
  metrics: {
    page_views: number
    unique_visitors: number
    bookings: number
    total_bookings: number
    customers: number
    active_subscribers: number
    upcoming_departures: number
    open_balances: number
  }
  finance: {
    currency: string
    gross_minor: number
    refunded_minor: number
    net_minor: number
    outstanding_minor: number
  }[]
  monthly: {
    month: string
    label: string
    bookings: number
    revenue: { currency: string amount_minor: number }[]
  }[]
  booking_statuses: { status: string count: number }[]
  top_countries: { country: string views: number }[]
  pending: {
    unpaid_bookings: number
    refund_requests: number
    held_reservations: number
    draft_articles: number
  }
  recent_bookings: Booking[]
  recent_payments: AdminPayment[]
}
export const adminDashboardApi = {
  get: (days = 30) =>
    request<{ success: true data: DashboardSnapshot }>(
      `/admin/dashboard?days=${days}`,
    ),
  navigationCounts: () =>
    request<{
      success: true
      data: { counts: Record<string, number> generated_at: string }
    }>("/admin/navigation-counts"),
}
