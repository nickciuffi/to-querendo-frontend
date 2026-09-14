import * as React from "react"

import { AuthContext, type LoginPayload } from "@/context/auth-context-value"
import { clearAuth, readAuth, writeAuth } from "@/lib/auth-storage"
import type { AuthUser } from "@/lib/types"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const stored = React.useMemo(() => readAuth(), [])
  const [user, setUser] = React.useState<AuthUser | null>(stored?.user ?? null)
  const [token, setToken] = React.useState<string | null>(stored?.session.token ?? null)

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

  const value = React.useMemo(
    () => ({ user, token, login, logout }),
    [user, token, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
