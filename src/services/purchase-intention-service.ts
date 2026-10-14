import { apiFetch } from "@/services/http-client"
import type { PurchaseIntention } from "@/lib/types"

interface ApiEnvelope<T> {
  response: T
  messages: string[]
}

export interface CreatePurchaseIntentionPayload {
  idProdutoBase: string
  descricaoLocal: string
  observacoes?: string
  urlFotoLocal?: string
}

export async function createPurchaseIntention(
    payload: CreatePurchaseIntentionPayload
  ):
  Promise<void> {
    await apiFetch<ApiEnvelope<unknown>>("/intencao-compra", {
      method: "POST",
      body: payload,
    })
  }

export interface IntencaoCompraResponse {
  id: number
  idUsuario: number
  idProdutoBase: number
  nomeProdutoBase: string
  descricaoLocal: string
  observacoes?: string | null
  urlFotoLocal?: string | null
  tsCriacaoIntencao: string
}

function mapIntencaoCompra(body: IntencaoCompraResponse): PurchaseIntention {
  return {
    id: body.id,
    baseProductId: body.idProdutoBase,
    baseProductName: body.nomeProdutoBase,
    locationDescription: body.descricaoLocal,
    observations: body.observacoes ?? "",
    photoUrl: body.urlFotoLocal || null,
    createdAt: body.tsCriacaoIntencao,
  }
}

export async function getMinhasIntencoes(): Promise<PurchaseIntention[]> {
  const { response } = await apiFetch<ApiEnvelope<IntencaoCompraResponse[]>>(
    "/intencao-compra/minhas-intencoes"
  )
  return response.map(mapIntencaoCompra)
}
