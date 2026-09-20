import { apiFetch } from "@/services/http-client"

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
