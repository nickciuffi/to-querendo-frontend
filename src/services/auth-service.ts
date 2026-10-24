import { apiFetch } from "@/services/http-client"
import { toAuthSession, type AuthSession, type LoginResponseBody } from "@/lib/auth-session"
import { readAuth } from "@/lib/auth-storage"
import { getTokenExpiration } from "@/lib/jwt"
import type { AuthUser } from "@/lib/types"

interface ApiEnvelope<T> {
  response: T
  messages: string[]
}

interface UsuarioMeusDadosResponse {
  email: string
  nome: string
  telefone: string | null
  cpf: string | null
  urlFoto: string | null
  praiaAtual: { id: number; nome: string; cidade: string; estado: string } | null
  categoria: { id: number; descricao: string } | null
  descricao: string,
  online: boolean,
}

function mapUsuario(body: UsuarioMeusDadosResponse): AuthUser {
  return {
    name: body.nome,
    email: body.email,
    phone: body.telefone,
    cpf: body.cpf,
    photoUrl: body.urlFoto,
    beach: body.praiaAtual
      ? {
          id: body.praiaAtual.id,
          name: body.praiaAtual.nome,
          city: body.praiaAtual.cidade,
          state: body.praiaAtual.estado,
        }
      : null,
    category: body.categoria
      ? { id: body.categoria.id, description: body.categoria.descricao }
      : null,
    description: body.descricao,
    online: body.online,
  }
}

async function fetchMeusDados(session: AuthSession): Promise<AuthUser> {
  const { response } = await apiFetch<ApiEnvelope<UsuarioMeusDadosResponse>>("/usuario/meus-dados", {
    // O token ainda não foi salvo no contexto/localStorage neste ponto do fluxo de login,
    // então passamos o header manualmente em vez de deixar o apiFetch buscá-lo do storage.
    auth: false,
    headers: { Authorization: `${session.tokenType} ${session.token}` },
  })
  return mapUsuario(response)
}

export async function getCurrentUser(): Promise<AuthUser> {
  const { response } = await apiFetch<ApiEnvelope<UsuarioMeusDadosResponse>>("/usuario/meus-dados")
  return mapUsuario(response)
}

export async function login(email: string, senha: string): Promise<{ user: AuthUser; session: AuthSession }> {
  const { response } = await apiFetch<ApiEnvelope<LoginResponseBody>>("/auth/login", {
    method: "POST",
    body: { email, senha },
    auth: false,
  })

  const session = toAuthSession(response)
  const user = await fetchMeusDados(session)

  return { user, session }
}

export async function register(nome: string, email: string, senha: string): Promise<void> {
  await apiFetch<ApiEnvelope<unknown>>("/usuario/cadastrar", {
    method: "POST",
    body: { nome, email, senha },
    auth: false,
  })
}

export interface UpdateCurrentUserPayload {
  nome?: string
  telefone?: string
  cpf?: string
  urlFoto?: string
  idPraia?: number
  /** Campos de vendedor: só são alterados quando enviados. */
  descricao?: string
  online?: boolean
}

/**
 * Atualiza os dados do usuário autenticado. A API ignora campos ausentes/`null`,
 * então só os campos preenchidos devem ser enviados.
 */
export async function updateCurrentUser(payload: UpdateCurrentUserPayload): Promise<void> {
  await apiFetch<ApiEnvelope<unknown>>("/usuario", {
    method: "PUT",
    body: payload,
  })
}

interface UpgradeVendedorResponse extends UsuarioMeusDadosResponse {
  /** Token novo, já com a role de vendedor. */
  token: string
}

/**
 * Promove o usuário logado a vendedor (`POST /vendedor`). A API devolve os dados do usuário
 * e um token novo com `ROLE_VENDEDOR`, que deve substituir a sessão atual.
 */
export async function upgradeToVendedor(
  descricao?: string
): Promise<{ user: AuthUser; session: AuthSession }> {
  const { response } = await apiFetch<ApiEnvelope<UpgradeVendedorResponse>>("/vendedor", {
    method: "POST",
    body: { descricao },
  })

  const currentSession = readAuth()?.session
  const session: AuthSession = {
    token: response.token,
    tokenType: currentSession?.tokenType ?? "Bearer",
    // A resposta não traz a validade, então usamos o `exp` do próprio JWT.
    expiresAt: getTokenExpiration(response.token) ?? currentSession?.expiresAt ?? Date.now() + 60 * 60 * 1000,
  }

  return { user: mapUsuario(response), session }
}
