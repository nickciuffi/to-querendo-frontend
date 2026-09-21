import * as React from "react"

import type { AuthSession } from "@/lib/auth-session"
import type { AuthUser, Role } from "@/lib/types"

export interface LoginPayload {
  user: AuthUser
  session: AuthSession
}

export interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  roles: Role[]
  hasRole: (role: Role) => boolean
  login: (payload: LoginPayload) => void
  logout: () => void
  updateUser: (user: AuthUser) => void
}

export const AuthContext = React.createContext<AuthContextValue | null>(null)
