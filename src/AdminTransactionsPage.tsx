import type { Page } from "./App"
import AdminFinancePage from "./AdminFinancePage"
export default function AdminTransactionsPage({ onNavigate }: { onNavigate: (p: Page) => void }) { return <AdminFinancePage onNavigate={onNavigate}/> }
