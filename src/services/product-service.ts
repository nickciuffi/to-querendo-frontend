import { apiFetch } from "@/services/http-client"
import type { Product } from "@/lib/types"

interface ApiEnvelope<T> {
  response: T
  messages: string[]
}

interface ProdutoBaseResponse {
  id: number
  nome: string
  descricao: string
  urlFoto: string | null
  precoMinimo: string
  estaAtivo: boolean
}

function mapProduto(body: ProdutoBaseResponse): Product {
  return {
    id: String(body.id),
    name: body.nome,
    description: body.descricao,
    photoUrl: body.urlFoto,
    minPrice: Number(body.precoMinimo),
    active: body.estaAtivo,
  }
}

export async function getProdutosByPraia(idPraia: number): Promise<Product[]> {
  const { response } = await apiFetch<ApiEnvelope<ProdutoBaseResponse[]>>(
    `/produto-base?idPraia=${idPraia}`
  )
  return response.map(mapProduto)
}

export async function getProdutosBaseAtivos(): Promise<Product[]> {
  const { response } = await apiFetch<ApiEnvelope<ProdutoBaseResponse[]>>(
    "/produto-base"
  )
  return response.map(mapProduto)
}

export async function getProdutosBase(): Promise<Product[]> {
  const { response } = await apiFetch<ApiEnvelope<ProdutoBaseResponse[]>>(
    "/produto-base/todos"
  )
  return response.map(mapProduto)
}

export async function deleteProdutoBase(id: string): Promise<void> {
  await apiFetch<ApiEnvelope<unknown>>(`/produto-base/${id}`, {
    method: "DELETE",
  })
}

export interface CreateProdutoBasePayload {
  nome: string
  descricao: string
  precoMinimo: number
  urlFoto?: string
}

export async function createProdutoBase(payload: CreateProdutoBasePayload): Promise<Product> {
  const { response } = await apiFetch<ApiEnvelope<ProdutoBaseResponse>>("/produto-base", {
    method: "POST",
    body: payload,
  })
  return mapProduto(response)
}

export interface UpdateProdutoBasePayload {
  nome: string
  descricao: string
  precoMinimo: number
  estaAtivo: boolean
  urlFoto?: string
}

export async function updateProdutoBase(
  id: string,
  payload: UpdateProdutoBasePayload
): Promise<Product> {
  const { response } = await apiFetch<ApiEnvelope<ProdutoBaseResponse>>(
    `/produto-base/${id}`,
    {
      method: "PUT",
      body: payload,
    }
  )
  return mapProduto(response)
}
