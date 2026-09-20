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
