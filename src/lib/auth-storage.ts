import { isSessionExpired, type AuthSession } from "@/lib/auth-session"
import type { AuthUser } from "@/lib/types"

const STORAGE_KEY = "to-querendo:auth"

export interface StoredAuth {
  user: AuthUser
  session: AuthSession
}

export function readAuth(): StoredAuth | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as StoredAuth
    if (!parsed.session || isSessionExpired(parsed.session)) {
      window.localStorage.removeItem(STORAGE_KEY)
      return null
    }

    return parsed
  } catch {
    return null
  }
}

export function writeAuth(auth: StoredAuth): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
}

export function clearAuth(): void {
  window.localStorage.removeItem(STORAGE_KEY)
}

export function getAuthHeader(): Record<string, string> {
  const auth = readAuth()
  if (!auth) return {}
  return { Authorization: `${auth.session.tokenType} ${auth.session.token}` }
}
