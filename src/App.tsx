import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { TopBar, Navbar, MobileDrawer, Newsletter, Footer } from "./layout"
import {
  Hero,
  SearchBox,
  TourCategories,
  FeaturedTours,
  WhyKobani,
  UpcomingJourney,
  AfricanMarket,
  Statistics,
  Testimonials,
  GalleryPreview,
  PaymentSection,
} from "./HomePage"
import HomeArticles from "./HomeArticles"
import ToursPage from "./ToursPage"
import TourDetailsPage from "./TourDetailsPage"
import AboutPage from "./AboutPage"
import GalleryPage from "./GalleryPage"
import ArticlesPage from "./ArticlesPage"
import ArticleReadPage from "./ArticleReadPage"
import ArticleContributePage from "./ArticleContributePage"
import MarketPage from "./MarketPage"
import MarketProductPage from "./MarketProductPage"
import MarketCartPage from "./MarketCartPage"
import MarketCheckoutPage from "./MarketCheckoutPage"
import MarketOrderSuccessPage from "./MarketOrderSuccessPage"
import CustomerDashboard from "./CustomerDashboard"
import CustomerBookingsPage from "./CustomerBookingsPage"
import CustomerBookingDetailPage from "./CustomerBookingDetailPage"
import CustomerPaymentsPage from "./CustomerPaymentsPage"
import CustomerProductOrdersPage from "./CustomerProductOrdersPage"
import CustomerSavedToursPage from "./CustomerSavedToursPage"
import CustomerProfilePage from "./CustomerProfilePage"
import CustomerSettingsPage from "./CustomerSettingsPage"
import CustomerNotificationsPage from "./CustomerNotificationsPage"
import ContributorDashboard from "./ContributorDashboard"
import ContributorArticleEditor from "./ContributorArticleEditor"
import AdminDashboard from "./AdminDashboard"
import AdminCustomersPage from "./AdminCustomersPage"
import AdminCustomerProfilePage from "./AdminCustomerProfilePage"
import AdminStaffRolesPage from "./AdminStaffRolesPage"
import AdminToursPage from "./AdminToursPage"
import AdminCreateTourPage from "./AdminCreateTourPage"
import AdminTourDatesPage from "./AdminTourDatesPage"
import AdminBookingsPage from "./AdminBookingsPage"
import AdminBookingDetailPage from "./AdminBookingDetailPage"
import AdminTravellersPage from "./AdminTravellersPage"
import AdminProductsPage from "./AdminProductsPage"
import AdminProductFormPage from "./AdminProductFormPage"
import AdminProductOrdersPage from "./AdminProductOrdersPage"
import AdminProductOrderDetailPage from "./AdminProductOrderDetailPage"
import AdminInventoryPage from "./AdminInventoryPage"
import AdminArticlesPage from "./AdminArticlesPage"
import AdminContributionsPage from "./AdminContributionsPage"
import AdminGalleryPage from "./AdminGalleryPage"
import AdminFAQsPage from "./AdminFAQsPage"
import AdminContentPage from "./AdminContentPage"
import AdminReviewsPage from "./AdminReviewsPage"
import AdminSubscribersPage from "./AdminSubscribersPage"
import AdminInboxPage from "./AdminInboxPage"
import AdminFinancePage from "./AdminFinancePage"
import AdminTransactionsPage from "./AdminTransactionsPage"
import AdminRefundsPage from "./AdminRefundsPage"
import AdminReportsPage from "./AdminReportsPage"
import AdminAnalyticsPage from "./AdminAnalyticsPage"
import AdminNotificationsPage from "./AdminNotificationsPage"
import AdminAuditLogsPage from "./AdminAuditLogsPage"
import AdminPaymentSettingsPage from "./AdminPaymentSettingsPage"
import AdminHotelsPage from "./AdminHotelsPage"
import AdminHotelFormPage from "./AdminHotelFormPage"
import AdminHotelDetailPage from "./AdminHotelDetailPage"
import HotelsPage from "./HotelsPage"
import HotelDetailsPage from "./HotelDetailsPage"
import SystemStatesPage from "./SystemStatesPage"
import ContactPage from "./ContactPage"
import FAQPage from "./FAQPage"
import LoginPage from "./LoginPage"
import RegisterPage from "./RegisterPage"
import VerifyEmailPage from "./VerifyEmailPage"
import LegalPage from "./LegalPage"
import BookingPage from "./BookingPage"
import BookingRequestPage from "./BookingRequestPage"
import BookingPaymentCallbackPage from "./BookingPaymentCallbackPage"
import { useAuth } from "./AuthContext"
import CookieConsent from "./CookieConsent"
import { Tour, tourApi } from "./api"
import { applySeo, organizationSchema } from "./seo"

export type Page = "home" | "tours" | "tour-details" | "booking-request" | "hotels" | "hotel-details" | "admin-hotels" | "admin-hotel-form" | "admin-hotel-detail" | "about" | "gallery" | "articles" | "article-read" | "contribute" | "contributor-dashboard" | "contributor-editor" | "admin-dashboard" | "admin-customers" | "admin-customer-profile" | "admin-staff-roles" | "admin-tours" | "admin-create-tour" | "admin-tour-dates" | "admin-bookings" | "admin-booking-detail" | "admin-travellers" | "admin-products" | "admin-product-form" | "admin-product-orders" | "admin-product-order-detail" | "admin-inventory" | "admin-articles" | "admin-contributions" | "admin-gallery" | "admin-faqs" | "admin-content" | "admin-reviews" | "admin-subscribers" | "admin-inbox" | "admin-finance" | "admin-transactions" | "admin-refunds" | "admin-reports" | "admin-analytics" | "admin-notifications" | "admin-audit-logs" | "admin-payment-settings" | "system-states" | "market" | "market-product" | "market-cart" | "market-checkout" | "market-order-success" | "dashboard" | "customer-bookings" | "customer-booking-detail" | "customer-payments" | "customer-product-orders" | "customer-saved-tours" | "customer-notifications" | "customer-profile" | "customer-settings" | "contact" | "faq" | "login" | "register" | "verify-email" | "privacy-policy" | "terms-and-conditions" | "refund-policy" | "cancellation-policy" | "cookie-policy" | "booking" | "booking-travellers" | "booking-addons" | "booking-payment" | "booking-payment-callback" | "booking-confirmation" | "not-found"

const CUSTOMER_PAGES = new Set<Page>(["booking-request", "dashboard", "customer-bookings", "customer-booking-detail", "customer-payments", "customer-product-orders", "customer-saved-tours", "customer-notifications", "customer-profile", "customer-settings"])
const ADMIN_PAGES = new Set<Page>(["admin-dashboard", "admin-customers", "admin-customer-profile", "admin-staff-roles", "admin-tours", "admin-create-tour", "admin-tour-dates", "admin-bookings", "admin-booking-detail", "admin-travellers", "admin-products", "admin-product-form", "admin-product-orders", "admin-product-order-detail", "admin-inventory", "admin-articles", "admin-contributions", "admin-gallery", "admin-content", "admin-reviews", "admin-subscribers", "admin-inbox", "admin-finance", "admin-transactions", "admin-refunds", "admin-reports", "admin-analytics", "admin-notifications", "admin-audit-logs", "admin-payment-settings", "contributor-editor"])
ADMIN_PAGES.add("admin-hotels"); ADMIN_PAGES.add("admin-hotel-form"); ADMIN_PAGES.add("admin-hotel-detail")
ADMIN_PAGES.add("admin-faqs")
const PAGE_PATHS: Partial<Record<Page, string>> = {
  home: "/", tours: "/tours", hotels: "/hotels", about: "/about", gallery: "/gallery", articles: "/articles", market: "/market", contact: "/contact", faq: "/faq", login: "/login", register: "/create-account", "verify-email": "/verify-email", dashboard: "/customer/dashboard",
  "privacy-policy": "/privacy-policy", "terms-and-conditions": "/terms-and-conditions", "refund-policy": "/refund-policy", "cancellation-policy": "/cancellation-policy", "cookie-policy": "/cookie-policy",
  "customer-bookings": "/customer/bookings", "customer-booking-detail": "/customer/bookings/details",
  "customer-payments": "/customer/payments", "customer-product-orders": "/customer/product-orders",
  "customer-saved-tours": "/customer/saved-tours", "customer-notifications": "/customer/notifications", "customer-profile": "/customer/profile", "customer-settings": "/customer/settings",
  "admin-dashboard": "/admin/dashboard", "admin-customers": "/admin/customers", "admin-staff-roles": "/admin/staff-roles",
  "admin-hotels": "/admin/hotels", "admin-hotel-form": "/admin/hotels/new", "admin-hotel-detail": "/admin/hotels/details",
  "admin-tours": "/admin/tours", "admin-bookings": "/admin/bookings", "admin-products": "/admin/products",
  "admin-product-form": "/admin/products/new", "admin-product-orders": "/admin/product-orders", "admin-product-order-detail": "/admin/product-orders/details", "admin-inventory": "/admin/inventory",
  "market-product": "/market/product", "market-cart": "/market/cart", "market-checkout": "/market/checkout", "market-order-success": "/market/payment/callback",
  booking: "/booking", "booking-request": "/booking/request", "booking-payment-callback": "/booking/payment/callback",
  "admin-articles": "/admin/articles", "admin-gallery": "/admin/gallery", "admin-faqs": "/admin/faqs", "admin-finance": "/admin/payments",
  "admin-transactions": "/admin/transactions", "admin-refunds": "/admin/refunds",
  "admin-subscribers": "/admin/subscribers",
  "admin-inbox": "/admin/messages",
  "admin-reports": "/admin/reports", "admin-audit-logs": "/admin/audit-logs", "admin-payment-settings": "/admin/settings/payments",
  "admin-analytics": "/admin/visitor-analytics",
}
const pageFromPath = (): Page => {
  const path = window.location.pathname.length > 1 ? window.location.pathname.replace(/\/+$/, "") : "/"
  if (["/terms", "/terms-of-service"].includes(path)) { window.history.replaceState({}, "", "/terms-and-conditions"); return "terms-and-conditions" }
  if (path === "/privacy") { window.history.replaceState({}, "", "/privacy-policy"); return "privacy-policy" }
  return path.startsWith("/articles/") ? "article-read" : path.startsWith("/admin/bookings/") ? "admin-booking-detail" : path.startsWith("/admin/customers/") ? "admin-customer-profile" : path === "/admin/finance" ? "admin-finance" : path.startsWith("/tours/") ? "tour-details" : path.startsWith("/hotels/") ? "hotel-details" : (Object.entries(PAGE_PATHS).find(([, route]) => route === path)?.[0] as Page) || "not-found"
}

export default function App() {
  const { t, i18n } = useTranslation()
  const { isAuthenticated, isAdmin, isInitializing } = useAuth()
  const [page, setPage] = useState<Page>(pageFromPath)
  const [mobileOpen, setMobileOpen] = useState(false)

  const navigate = (p: Page) => {
    setPage(p)
    const path = PAGE_PATHS[p]
    if (path && window.location.pathname !== path) window.history.pushState({}, "", path)
    setMobileOpen(false)
    window.scrollTo({ top: 0, behavior: "auto" })
  }
  const navigateTour = (slug: string) => {
    sessionStorage.setItem("kobani_selected_tour_slug", slug)
    window.history.pushState({}, "", `/tours/${encodeURIComponent(slug)}`)
    setPage("tour-details")
    window.scrollTo({ top: 0, behavior: "auto" })
  }
  const navigateHotel = (slug: string) => {
    window.history.pushState({}, "", `/hotels/${encodeURIComponent(slug)}`)
    setPage("hotel-details")
    window.scrollTo({ top: 0, behavior: "auto" })
  }
  const startTourBooking = async (summary: Tour) => {
    try {
      const tour = (await tourApi.publicDetail(summary.slug)).data.tour
      const departure = tour.departures?.find(item => item.available > 0 && ["open", "limited"].includes(item.status))
      if (!departure) { navigateTour(summary.slug); return }
      sessionStorage.setItem("kobani_booking_selection", JSON.stringify({ tour_id: tour.id, tour_slug: tour.slug, tour_title: tour.title, subtitle: tour.short_description, departure_id: departure.id, start_date: departure.start_date, end_date: departure.end_date, adults: 1, children: 0, price_adult: departure.price, price_child: tour.child_price, currency: tour.currency, image: tour.featured_image?.url, location: `${tour.destination} · ${tour.country}`, duration_days: tour.duration_days, available: departure.available, capacity: departure.capacity, category: tour.category?.name }))
      sessionStorage.removeItem("kobani_booking_idempotency")
      navigate("booking")
    } catch { navigateTour(summary.slug) }
  }

  useEffect(() => {
    const onPopState = () => setPage(pageFromPath())
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])

  useEffect(() => {
    if (!isInitializing && CUSTOMER_PAGES.has(page) && !isAuthenticated) {
      sessionStorage.setItem("kobani:returnPage", page)
      window.history.replaceState({}, "", "/login")
      setPage("login")
    }
  }, [page, isAuthenticated, isInitializing])

  useEffect(() => {
    if (!isInitializing && ADMIN_PAGES.has(page) && !isAdmin) {
      window.history.replaceState({}, "", "/login")
      setPage("login")
    }
  }, [page, isAdmin, isInitializing])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" })
    // Record-specific metadata is applied after a published hotel loads.
    if (page === "hotel-details") return
    const names: Partial<Record<Page, string>> = {
      home: "Home",
      tours: "Tours",
      hotels: "Hotels",
      "hotel-details": "Hotel Details",
      "tour-details": "Tour Details",
      about: "About Us",
      gallery: "Gallery",
      articles: "Articles",
      "article-read": "Article",
      contribute: "Contribute",
      "contributor-dashboard": "Contributor Dashboard",
      "contributor-editor": "Article Editor",
      market: "African Market",
      "market-product": "Product Details",
      "market-cart": "Shopping Cart",
      "market-checkout": "Checkout",
      "market-order-success": "Order Confirmed",
      dashboard: "Customer Dashboard",
      "customer-bookings": "My Bookings",
      "customer-booking-detail": "Booking Details",
      "customer-payments": "Payments",
      "customer-product-orders": "Product Orders",
      "customer-saved-tours": "Saved Tours",
      "customer-notifications": "Notifications",
      "customer-profile": "Profile",
      "customer-settings": "Account Settings",
      contact: "Contact Us",
      faq: "FAQs",
      login: "Login",
      register: "Create Account",
      "verify-email": "Verify Email",
      booking: "Select Tour Date",
      "booking-travellers": "Traveller Information",
      "booking-addons": "Add-ons",
      "booking-payment": "Secure Payment",
      "booking-confirmation": "Booking Confirmed",
      "privacy-policy": "Privacy Policy",
      "terms-and-conditions": "Terms and Conditions",
      "refund-policy": "Refund Policy",
      "cancellation-policy": "Cancellation Policy",
      "cookie-policy": "Cookie Policy",
      "admin-dashboard": "Admin Dashboard",
      "admin-customers": "Customers",
      "admin-customer-profile": "Customer Profile",
      "admin-staff-roles": "Staff & Roles",
      "admin-tours": "Tours Management",
      "admin-create-tour": "Create Tour",
      "admin-tour-dates": "Tour Dates",
      "admin-bookings": "Bookings",
      "admin-booking-detail": "Booking Details",
      "admin-travellers": "Travellers",
      "admin-products": "Products",
      "admin-product-form": "Product Editor",
      "admin-product-orders": "Product Orders",
      "admin-product-order-detail": "Order Details",
      "admin-inventory": "Inventory",
      "admin-articles": "Articles Management",
      "admin-contributions": "Contributions",
      "admin-gallery": "Gallery Management",
      "admin-faqs": "FAQs Management",
      "admin-content": "Website Content",
      "admin-reviews": "Reviews & Testimonials",
      "admin-subscribers": "Subscribers", "admin-inbox": "Messages",
      "admin-finance": "Finance Dashboard",
      "admin-transactions": "Transactions",
      "admin-refunds": "Refunds",
      "admin-reports": "Reports",
      "admin-notifications": "Notifications",
      "admin-audit-logs": "Audit Logs",
      "admin-payment-settings": "Payment Settings",
      "admin-hotels": "Hotels",
      "admin-hotel-form": "Hotel Editor",
      "admin-hotel-detail": "Hotel Details",
      "system-states": "System States",
      "not-found": "Page Not Found",
    }
    const publicSeo: Partial<Record<Page, { title: string; description: string }>> = {
      home: { title: "KOBANI Historical & Luxury Tours | Ghana Heritage Travel", description: "Discover premium Ghana heritage, cultural and luxury tours with KOBANI, based in Accra—where heritage meets luxury." },
      tours: { title: "Ghana Heritage & Luxury Tours | KOBANI Tours", description: "Explore KOBANI's historical, cultural, educational, private and luxury Ghana tours, thoughtfully designed for meaningful travel." },
      hotels: { title: "Luxury Hotels & Stays in Ghana | KOBANI", description: "Discover hand-picked hotels, resorts and heritage stays for your journey through Ghana." },
      about: { title: "About KOBANI | Ghana Historical & Luxury Tour Company", description: "Learn how KOBANI combines Ghana's authentic heritage, expert local guidance and refined hospitality in every journey." },
      gallery: { title: "Ghana Tour Gallery | KOBANI Historical & Luxury Tours", description: "View moments from KOBANI heritage, cultural and luxury travel experiences across Ghana." },
      articles: { title: "Ghana Travel, History & Culture Articles | KOBANI", description: "Read thoughtful stories and practical insights about Ghanaian history, culture, heritage and luxury travel." },
      market: { title: "KOBANI African Market | Authentic Ghanaian Products", description: "Discover a curated selection of African products and meaningful keepsakes from KOBANI." },
      contact: { title: "Contact KOBANI Historical & Luxury Tours", description: "Contact KOBANI in Accra to discuss a Ghana heritage, cultural, educational, executive or private luxury tour." },
      faq: { title: "Ghana Tour Frequently Asked Questions | KOBANI", description: "Find answers about booking, payments, travel preparation and KOBANI's historical and luxury tours in Ghana." },
      "privacy-policy": { title: "Privacy Policy | KOBANI Historical & Luxury Tours", description: "Read how KOBANI Historical & Luxury Tours handles personal information and protects your privacy." },
      "terms-and-conditions": { title: "Terms and Conditions | KOBANI Tours", description: "Review the terms and conditions governing use of the KOBANI website and travel services." },
      "refund-policy": { title: "Refund Policy | KOBANI Historical & Luxury Tours", description: "Review how refund eligibility and processing apply to KOBANI tours and travel services." },
      "cancellation-policy": { title: "Cancellation Policy | KOBANI Historical & Luxury Tours", description: "Review the cancellation, rescheduling and itinerary-change terms for KOBANI travel services." },
      "cookie-policy": { title: "Cookie Policy | KOBANI Historical & Luxury Tours", description: "Learn how KOBANI uses essential cookies and preferences on its website." },
    }
    const utilityPages = new Set<Page>(["login", "register", "verify-email", "contribute", "contributor-dashboard", "contributor-editor", "booking", "booking-travellers", "booking-addons", "booking-payment", "booking-payment-callback", "booking-confirmation", "market-product", "market-cart", "market-checkout", "market-order-success", "system-states", "not-found"])
    const configured = publicSeo[page]
    const noindex = CUSTOMER_PAGES.has(page) || ADMIN_PAGES.has(page) || utilityPages.has(page)
    applySeo({
      title: configured?.title || `KOBANI | ${names[page] || t("brand.descriptor")}`,
      description: configured?.description || "Secure KOBANI account and travel service page.",
      path: window.location.pathname,
      noindex,
      nofollow: noindex,
      structuredData: page === "home" ? organizationSchema() : undefined,
    })
  }, [page, i18n.resolvedLanguage, t])

  if (isInitializing && CUSTOMER_PAGES.has(page)) return <div className="min-h-screen grid place-items-center bg-[#F8F4EA] text-sm text-[#6F6B63]">Checking your session...</div>
  if (isInitializing && ADMIN_PAGES.has(page)) return <div className="min-h-screen grid place-items-center bg-[#0B0B0B] text-sm text-[#C6A15B]">Checking administrator session...</div>
  if (CUSTOMER_PAGES.has(page) && !isAuthenticated) return null
  if (ADMIN_PAGES.has(page) && !isAdmin) return null

  // Auth pages render without site chrome
  if (page === "login") return <LoginPage onNavigate={navigate} />
  if (page === "register") return <RegisterPage onNavigate={navigate} />
  if (page === "verify-email") return <VerifyEmailPage onNavigate={navigate} />
  if (page === "privacy-policy") return <LegalPage kind="privacy" onNavigate={navigate} />
  if (page === "terms-and-conditions") return <LegalPage kind="terms" onNavigate={navigate} />
  if (page === "refund-policy") return <LegalPage kind="refund" onNavigate={navigate} />
  if (page === "cancellation-policy") return <LegalPage kind="cancellation" onNavigate={navigate} />
  if (page === "cookie-policy") return <LegalPage kind="cookies" onNavigate={navigate} />
  if (page === "booking") return <BookingPage onNavigate={navigate} />
  if (page === "booking-request") return <BookingRequestPage onNavigate={navigate} />
  if (page === "booking-travellers" || page === "booking-addons" || page === "booking-payment")
    return <BookingPage onNavigate={navigate} />
  if (page === "booking-payment-callback") return <BookingPaymentCallbackPage onNavigate={navigate} />
  if (page === "booking-confirmation") return <BookingPaymentCallbackPage onNavigate={navigate} />
  if (page === "dashboard") return <CustomerDashboard onNavigate={navigate} />
  if (page === "customer-bookings")
    return <CustomerBookingsPage onNavigate={navigate} />
  if (page === "customer-booking-detail")
    return <CustomerBookingDetailPage onNavigate={navigate} />
  if (page === "customer-payments")
    return <CustomerPaymentsPage onNavigate={navigate} />
  if (page === "customer-product-orders")
    return <CustomerProductOrdersPage onNavigate={navigate} />
  if (page === "customer-saved-tours")
    return <CustomerSavedToursPage onNavigate={navigate} />
  if (page === "customer-notifications")
    return <CustomerNotificationsPage onNavigate={navigate} />
  if (page === "customer-profile")
    return <CustomerProfilePage onNavigate={navigate} />
  if (page === "customer-settings")
    return <CustomerSettingsPage onNavigate={navigate} />
  if (page === "contributor-dashboard")
    return <ContributorDashboard onNavigate={navigate} />
  if (page === "contributor-editor")
    return <ContributorArticleEditor onNavigate={navigate} />
  if (page === "admin-dashboard")
    return <AdminDashboard onNavigate={navigate} />
  if (page === "admin-customers")
    return <AdminCustomersPage onNavigate={navigate} />
  if (page === "admin-customer-profile")
    return <AdminCustomerProfilePage onNavigate={navigate} />
  if (page === "admin-staff-roles")
    return <AdminStaffRolesPage onNavigate={navigate} />
  if (page === "admin-tours") return <AdminToursPage onNavigate={navigate} />
  if (page === "admin-create-tour")
    return <AdminCreateTourPage onNavigate={navigate} />
  if (page === "admin-tour-dates")
    return <AdminTourDatesPage onNavigate={navigate} />
  if (page === "admin-bookings")
    return <AdminBookingsPage onNavigate={navigate} />
  if (page === "admin-booking-detail")
    return <AdminBookingDetailPage onNavigate={navigate} />
  if (page === "admin-travellers")
    return <AdminTravellersPage onNavigate={navigate} />
  if (page === "admin-products")
    return <AdminProductsPage onNavigate={navigate} />
  if (page === "admin-product-form")
    return <AdminProductFormPage onNavigate={navigate} />
  if (page === "admin-product-orders")
    return <AdminProductOrdersPage onNavigate={navigate} />
  if (page === "admin-product-order-detail")
    return <AdminProductOrderDetailPage onNavigate={navigate} />
  if (page === "admin-inventory")
    return <AdminInventoryPage onNavigate={navigate} />
  if (page === "admin-articles")
    return <AdminArticlesPage onNavigate={navigate} />
  if (page === "admin-contributions")
    return <AdminContributionsPage onNavigate={navigate} />
  if (page === "admin-gallery")
    return <AdminGalleryPage onNavigate={navigate} />
  if (page === "admin-faqs")
    return <AdminFAQsPage onNavigate={navigate} />
  if (page === "admin-content")
    return <AdminContentPage onNavigate={navigate} />
  if (page === "admin-reviews")
    return <AdminReviewsPage onNavigate={navigate} />
  if (page === "admin-subscribers")
    return <AdminSubscribersPage onNavigate={navigate} />
  if (page === "admin-inbox")
    return <AdminInboxPage onNavigate={navigate} />
  if (page === "admin-finance")
    return <AdminFinancePage onNavigate={navigate} />
  if (page === "admin-transactions")
    return <AdminTransactionsPage onNavigate={navigate} />
  if (page === "admin-refunds")
    return <AdminRefundsPage onNavigate={navigate} />
  if (page === "admin-reports")
    return <AdminReportsPage onNavigate={navigate} />
  if (page === "admin-analytics")
    return <AdminAnalyticsPage onNavigate={navigate} />
  if (page === "admin-notifications")
    return <AdminNotificationsPage onNavigate={navigate} />
  if (page === "admin-audit-logs")
    return <AdminAuditLogsPage onNavigate={navigate} />
  if (page === "admin-payment-settings")
    return <AdminPaymentSettingsPage onNavigate={navigate} />
  if (page === "admin-hotels") return <AdminHotelsPage onNavigate={navigate} />
  if (page === "admin-hotel-form") return <AdminHotelFormPage onNavigate={navigate} />
  if (page === "admin-hotel-detail") return <AdminHotelDetailPage onNavigate={navigate} />
  if (page === "system-states")
    return <SystemStatesPage onNavigate={navigate} />

  return (
    <div style={{ fontFamily: "var(--font-sans)", background: "#FFFDF8" }}>
      <TopBar onNavigate={navigate} />
      <Navbar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        currentPage={page}
        onNavigate={navigate}
      />
      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onNavigate={navigate}
      />

      <main>
        {page === "home" && (
          <>
            <Hero onToursClick={() => navigate("tours")} onContactClick={() => navigate("contact")} />
            <SearchBox onNavigate={navigate} />
            <TourCategories onNavigate={navigate} />
            <FeaturedTours
              onViewDetails={navigateTour}
              onBookNow={startTourBooking}
              onNavigate={navigate}
            />
            <WhyKobani onNavigate={navigate} />
            <UpcomingJourney onNavigate={navigate} />
            <AfricanMarket onNavigate={navigate} />
            <Statistics />
            <HomeArticles onNavigate={navigate} />
            <Testimonials onNavigate={navigate} />
            <GalleryPreview onNavigate={navigate} />
            <PaymentSection />
          </>
        )}

        {page === "tours" && (
          <ToursPage
            onViewDetails={navigateTour}
            onBookNow={startTourBooking}
            onNavigate={navigate}
          />
        )}

        {page === "tour-details" && <TourDetailsPage onNavigate={navigate} />}
        {page === "hotels" && <HotelsPage onNavigate={navigate} onHotel={navigateHotel} />}
        {page === "hotel-details" && <HotelDetailsPage onNavigate={navigate} onHotel={navigateHotel} />}

        {page === "about" && <AboutPage onNavigate={navigate} />}

        {page === "gallery" && <GalleryPage onNavigate={navigate} />}

        {page === "articles" && <ArticlesPage onNavigate={navigate} />}

        {page === "article-read" && <ArticleReadPage onNavigate={navigate} />}

        {page === "contribute" && (
          <ArticleContributePage onNavigate={navigate} />
        )}

        {page === "market" && <MarketPage onNavigate={navigate} />}

        {page === "market-product" && (
          <MarketProductPage onNavigate={navigate} />
        )}

        {page === "market-cart" && <MarketCartPage onNavigate={navigate} />}

        {page === "market-checkout" && (
          <MarketCheckoutPage onNavigate={navigate} />
        )}

        {page === "market-order-success" && (
          <MarketOrderSuccessPage onNavigate={navigate} />
        )}

        {page === "contact" && <ContactPage onNavigate={navigate} />}

        {page === "faq" && <FAQPage onNavigate={navigate} />}

        {page === "not-found" && <section className="mx-auto max-w-3xl px-4 py-24 text-center"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#C6A15B]">404</p><h1 className="mt-4 font-serif text-5xl font-bold">Page not found</h1><p className="mt-4 text-[#6F6B63]">The page you requested does not exist or may have moved.</p><button onClick={() => navigate("home")} className="mt-8 rounded-full bg-[#0B0B0B] px-7 py-3 text-sm font-bold text-white">Return home</button></section>}
      </main>

      <Newsletter />
      <Footer onNavigate={navigate} />
      <CookieConsent page={page} />
    </div>
  )
}
