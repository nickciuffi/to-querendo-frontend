import { apiFetch } from "@/services/http-client"
import { toAuthSession, type AuthSession, type LoginResponseBody } from "@/lib/auth-session"
import type { AuthUser } from "@/lib/types"

interface ApiEnvelope<T> {
  response: T
  messages: string[]
}

interface UsuarioMeusDadosResponse {
  email: string
  nome: string
  contaAtiva: boolean
  praiaAtual: string
  categoria: string
}

function mapUsuario(body: UsuarioMeusDadosResponse): AuthUser {
  return {
    name: body.nome,
    email: body.email,
    active: body.contaAtiva,
    beachName: body.praiaAtual,
    category: body.categoria,
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
  await apiFetch<ApiEnvelope<unknown>>("/usuario", {
    method: "POST",
    body: { nome, email, senha },
    auth: false,
  })
}
