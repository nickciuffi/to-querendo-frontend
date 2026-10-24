import { getAuthHeader } from "@/lib/auth-storage"

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080"

export interface ApiRequestOptions extends Omit<RequestInit, "headers" | "body"> {
  headers?: HeadersInit
  body?: unknown
  /**
   * Anexa o header `Authorization: Bearer <token>` automaticamente.
   * Padrão `true` — use `false` apenas em endpoints públicos (login/cadastro).
   */
  auth?: boolean
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

export async function apiFetch<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { auth = true, body, headers, ...rest } = options

  const finalHeaders = new Headers(headers)
  finalHeaders.set("Content-Type", "application/json")

  if (auth) {
    for (const [key, value] of Object.entries(getAuthHeader())) {
      finalHeaders.set(key, value)
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    let message = response.statusText || `Erro ${response.status}`
    try {
      const data = (await response.clone().json()) as { messages?: string[] }
      if (data.messages && data.messages.length > 0) {
        message = data.messages.join(" ")
      }
    } catch {
      // corpo de erro não é JSON (ou está vazio) — mantém o statusText
    }
    throw new ApiError(response.status, message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}
