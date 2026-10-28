import { apiFetch } from "@/services/http-client"
import type { UserBeach } from "@/lib/types"

interface ApiEnvelope<T> {
  response: T
  messages: string[]
}

interface PraiaResponse {
  id: number
  nome: string
  cidade: string
  estado: string
  // Omitidos pela API quando nulos (praias antigas, ou rotas que não calculam distância).
  latitude?: number | null
  longitude?: number | null
  distanciaKm?: number | null
}

function mapPraia(body: PraiaResponse): UserBeach {
  return {
    id: body.id,
    name: body.nome,
    city: body.cidade,
    state: body.estado,
    latitude: body.latitude ?? null,
    longitude: body.longitude ?? null,
    distanceKm: body.distanciaKm ?? null,
  }
}

/** Admin: todas as praias (`GET /praia` — retorna 403 para quem não é admin). */
export async function getTodasPraias(): Promise<UserBeach[]> {
  const { response } = await apiFetch<ApiEnvelope<PraiaResponse[]>>("/praia")
  return response.map(mapPraia)
}

/**
 * Usuário comum: praias a até 20 km da localização salva no servidor, já ordenadas da mais
 * próxima para a mais distante. Vem vazia (sem erro) se o usuário ainda não tem localização.
 */
export async function getPraiasProximas(): Promise<UserBeach[]> {
  const { response } = await apiFetch<ApiEnvelope<PraiaResponse[]>>("/praia/proximas")
  return response.map(mapPraia)
}

export async function updateUserBeach(idPraia: number): Promise<void> {
  await apiFetch<ApiEnvelope<unknown>>("/usuario", {
    method: "PUT",
    body: { idPraia },
  })
}

export async function deletePraia(id: number): Promise<void> {
  await apiFetch<ApiEnvelope<unknown>>(`/praia/${id}`, {
    method: "DELETE",
  })
}

export interface CreatePraiaPayload {
  nome: string
  cidade: string
  estado: string
  latitude: number
  longitude: number
  urlFoto?: string
}

export async function createPraia(payload: CreatePraiaPayload): Promise<UserBeach> {
  const { response } = await apiFetch<ApiEnvelope<PraiaResponse>>("/praia", {
    method: "POST",
    body: payload,
  })
  return mapPraia(response)
}

export interface UpdatePraiaPayload {
  nome: string
  cidade: string
  estado: string
  latitude: number
  longitude: number
  urlFoto?: string
}

export async function updatePraia(id: number, payload: UpdatePraiaPayload): Promise<UserBeach> {
  const { response } = await apiFetch<ApiEnvelope<PraiaResponse>>(`/praia/${id}`, {
    method: "PUT",
    body: payload,
  })
  return mapPraia(response)
}
