export interface AuthSession {
  token: string
  tokenType: string
  expiresAt: number
}

export interface LoginResponseBody {
  token: string
  tipo: string
  expiraEmMs: number
}

export function toAuthSession(body: LoginResponseBody): AuthSession {
  return {
    token: body.token,
    tokenType: body.tipo,
    expiresAt: Date.now() + body.expiraEmMs,
  }
}

export function isSessionExpired(session: AuthSession): boolean {
  return Date.now() >= session.expiresAt
}
