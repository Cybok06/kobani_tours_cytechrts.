import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { authApi, type Admin, type AuthUser, type Customer, type RegisterInput, type RegistrationResponse } from "./api"

type AuthValue = { user: AuthUser | null; isAuthenticated: boolean; isAdmin: boolean; isInitializing: boolean; register: (input: RegisterInput) => Promise<RegistrationResponse>; verifyEmail: (email: string, code: string) => Promise<Customer>; login: (email: string, password: string) => Promise<AuthUser>; adminLogin: (email: string, password: string) => Promise<Admin>; logout: () => Promise<void>; refreshUser: () => Promise<void> }
const AuthContext = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isInitializing, setInitializing] = useState(true)
  const refreshUser = useCallback(async () => { try { setUser((await authApi.me()).user) } catch { setUser(null) } }, [])
  useEffect(() => { refreshUser().finally(() => setInitializing(false)) }, [refreshUser])
  const value = useMemo<AuthValue>(() => ({
    user, isAuthenticated: user?.role === "customer" && user.emailVerified, isAdmin: user?.role === "admin", isInitializing,
    register: (input) => authApi.register(input),
    verifyEmail: async (email, code) => { const next = (await authApi.verifyEmail(email, code)).user as Customer; setUser(next); return next },
    login: async (email, password) => { const next = (await authApi.login(email, password)).user; setUser(next); return next },
    adminLogin: async (email, password) => { const next = (await authApi.adminLogin(email, password)).user as Admin; setUser(next); return next },
    logout: async () => { try { await authApi.logout() } finally { setUser(null) } }, refreshUser,
  }), [user, isInitializing, refreshUser])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error("useAuth must be used within AuthProvider"); return value }
