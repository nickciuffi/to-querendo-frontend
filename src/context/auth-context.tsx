import * as React from "react"

import { AuthContext, type LoginPayload } from "@/context/auth-context-value"
import { clearAuth, readAuth, writeAuth } from "@/lib/auth-storage"
import { getRolesFromToken } from "@/lib/jwt"
import type { AuthUser, Role } from "@/lib/types"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const stored = React.useMemo(() => readAuth(), [])
  const [user, setUser] = React.useState<AuthUser | null>(stored?.user ?? null)
  const [token, setToken] = React.useState<string | null>(stored?.session.token ?? null)

  const roles = React.useMemo(() => getRolesFromToken(token), [token])
  const hasRole = React.useCallback((role: Role) => roles.includes(role), [roles])

  const login = React.useCallback(({ user: nextUser, session }: LoginPayload) => {
    writeAuth({ user: nextUser, session })
    setUser(nextUser)
    setToken(session.token)
  }, [])

  const logout = React.useCallback(() => {
    clearAuth()
    setUser(null)
    setToken(null)
  }, [])

  const updateUser = React.useCallback((nextUser: AuthUser) => {
    setUser(nextUser)
    const stored = readAuth()
    if (stored) writeAuth({ user: nextUser, session: stored.session })
  }, [])

  const value = React.useMemo(
    () => ({ user, token, roles, hasRole, login, logout, updateUser }),
    [user, token, roles, hasRole, login, logout, updateUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
