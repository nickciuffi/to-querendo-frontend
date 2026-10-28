import { apiFetch } from "@/services/http-client"
import type { BuyerWithIntentions, PurchaseIntention } from "@/lib/types"

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

interface BanhistaIntencaoResponse {
  idUsuario: number
  nomeUsuario: string
  intencoesCompra: IntencaoCompraResponse[]
}

/** Banhistas com intenção de compra (por enquanto, todos; sem filtro por produto do vendedor). */
export async function getBanhistasComIntencao(): Promise<BuyerWithIntentions[]> {
  const { response } = await apiFetch<ApiEnvelope<BanhistaIntencaoResponse[]>>(
    "/intencao-compra/banhistas"
  )
  return (response ?? [])
    .map((body) => ({
      id: body.idUsuario,
      name: body.nomeUsuario,
      intentions: (body.intencoesCompra ?? []).map(mapIntencaoCompra),
    }))
    .filter((buyer) => buyer.intentions.length > 0)
}

export async function getMinhasIntencoes(): Promise<PurchaseIntention[]> {
  const { response } = await apiFetch<ApiEnvelope<IntencaoCompraResponse[]>>(
    "/intencao-compra/minhas-intencoes"
  )
  return response.map(mapIntencaoCompra)
}

export interface ConcludePurchaseIntentionPayload {
  idProdutoBase: number
  /** Texto livre de até 200 caracteres (a API só exige que não seja vazio). */
  motivo: string
}

/**
 * Conclui a intenção de compra ativa do usuário para o produto base. A API não apaga o registro:
 * ela marca a intenção como inativa e guarda o motivo e a data da conclusão.
 */
export async function concludePurchaseIntention(payload: ConcludePurchaseIntentionPayload): Promise<void> {
  await apiFetch<ApiEnvelope<unknown>>("/intencao-compra", {
    method: "DELETE",
    body: payload,
  })
}
