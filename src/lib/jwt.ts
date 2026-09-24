import type { Role } from "@/lib/types"

interface DecodedJwtPayload {
  sub?: string
  roles?: string[]
  iat?: number
  exp?: number
}

const KNOWN_ROLES: readonly Role[] = ["ROLE_TURISTA", "ROLE_VENDEDOR", "ROLE_ADMIN"]

function base64UrlDecode(segment: string): string {
  const base64 = segment.replace(/-/g, "+").replace(/_/g, "/").padEnd(segment.length + ((4 - (segment.length % 4)) % 4), "=")
  const binary = atob(base64)
  const percentEncoded = Array.from(binary, (char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`).join("")
  return decodeURIComponent(percentEncoded)
}

function decodeJwtPayload(token: string): DecodedJwtPayload | null {
  try {
    const [, payload] = token.split(".")
    if (!payload) return null
    return JSON.parse(base64UrlDecode(payload)) as DecodedJwtPayload
  } catch {
    return null
  }
}

/** Momento de expiração do token (em ms, como `Date.now()`), lido do claim `exp`. */
export function getTokenExpiration(token: string): number | null {
  const payload = decodeJwtPayload(token)
  return typeof payload?.exp === "number" ? payload.exp * 1000 : null
}

export function getRolesFromToken(token: string | null): Role[] {
  if (!token) return []

  const payload = decodeJwtPayload(token)
  if (!payload || !Array.isArray(payload.roles)) return []

  return payload.roles.filter((role): role is Role => KNOWN_ROLES.includes(role as Role))
}
