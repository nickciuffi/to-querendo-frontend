import * as React from "react"

import type { AuthUser } from "@/lib/types"

export interface AuthContextValue {
  user: AuthUser | null
  login: (user: AuthUser) => void
  logout: () => void
}

export const AuthContext = React.createContext<AuthContextValue | null>(null)
