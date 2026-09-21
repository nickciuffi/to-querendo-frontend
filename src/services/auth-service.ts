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
  telefone: string | null
  cpf: string | null
  urlFoto: string | null
  contaAtiva: boolean
  praiaAtual: { id: number; nome: string; cidade: string; estado: string } | null
  categoria: { id: number; descricao: string } | null
}

function mapUsuario(body: UsuarioMeusDadosResponse): AuthUser {
  return {
    name: body.nome,
    email: body.email,
    active: body.contaAtiva,
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
  await apiFetch<ApiEnvelope<unknown>>("/usuario", {
    method: "POST",
    body: { nome, email, senha },
    auth: false,
  })
}
