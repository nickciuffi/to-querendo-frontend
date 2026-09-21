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
}

function mapPraia(body: PraiaResponse): UserBeach {
  return {
    id: body.id,
    name: body.nome,
    city: body.cidade,
    state: body.estado,
  }
}

export async function getPraias(): Promise<UserBeach[]> {
  const { response } = await apiFetch<ApiEnvelope<PraiaResponse[]>>("/praia")
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
  urlFoto?: string
}

export async function updatePraia(id: number, payload: UpdatePraiaPayload): Promise<UserBeach> {
  const { response } = await apiFetch<ApiEnvelope<PraiaResponse>>(`/praia/${id}`, {
    method: "PUT",
    body: payload,
  })
  return mapPraia(response)
}
