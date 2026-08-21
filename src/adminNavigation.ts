import type { Page } from "./App"

const adminRoutes: Record<string, Page> = {
  Dashboard: "admin-dashboard",
  Tours: "admin-tours",
  Hotels: "admin-hotels",
  "Tour Dates": "admin-tour-dates",
  Bookings: "admin-bookings",
  Travellers: "admin-travellers",
  Customers: "admin-customers",
  Payments: "admin-finance",
  Finance: "admin-finance",
  Transactions: "admin-transactions",
  Refunds: "admin-refunds",
  "African Market": "admin-products",
  "Product Orders": "admin-product-orders",
  Inventory: "admin-inventory",
  Articles: "admin-articles",
  Contributions: "admin-contributions",
  Gallery: "admin-gallery",
  FAQs: "admin-faqs",
  "Website Content": "admin-content",
  Testimonials: "admin-reviews",
  Subscribers: "admin-subscribers",
  Messages: "admin-inbox",
  Reports: "admin-reports",
  "Visitor Analytics": "admin-analytics",
  Notifications: "admin-notifications",
  Users: "admin-staff-roles",
  Roles: "admin-staff-roles",
  "Users & Roles": "admin-staff-roles",
  "Audit Logs": "admin-audit-logs",
  "Payment Settings": "admin-payment-settings",
  "System States": "system-states",
}

export function navigateAdmin(label: string, onNavigate: (page: Page) => void) {
  const page = adminRoutes[label]
  if (page) onNavigate(page)
}

export const adminNavSections = [
  {
    title: "Operations",
    items: [
      "Dashboard",
      "Tours",
      "Hotels",
      "Tour Dates",
      "Bookings",
      "Travellers",
      "Customers",
      "Payments",
      "Refunds",
    ],
  },
  {
    title: "Commerce",
    items: ["African Market", "Product Orders", "Inventory"],
  },
  {
    title: "Content",
    items: [
      "Articles",
      "Contributions",
      "Gallery",
      "FAQs",
      "Testimonials",
      "Subscribers",
      "Messages",
    ],
  },
  {
    title: "Administration",
    items: ["Reports", "Visitor Analytics", "Users", "Roles", "Payment Settings", "Audit Logs"],
  },
] as const
