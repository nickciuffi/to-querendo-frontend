import * as React from "react"

import type { AuthSession } from "@/lib/auth-session"
import type { AuthUser } from "@/lib/types"

export interface LoginPayload {
  user: AuthUser
  session: AuthSession
}

export interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  login: (payload: LoginPayload) => void
  logout: () => void
}

export const AuthContext = React.createContext<AuthContextValue | null>(null)
