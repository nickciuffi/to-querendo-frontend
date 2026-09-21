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
  precoMinimo: number
  estaAtivo: boolean
}

function mapProduto(body: ProdutoBaseResponse): Product {
  return {
    id: String(body.id),
    name: body.nome,
    description: body.descricao,
    photoUrl: body.urlFoto,
    minPrice: body.precoMinimo,
    active: body.estaAtivo,
  }
}

export async function getProdutosByPraia(idPraia: number): Promise<Product[]> {
  const { response } = await apiFetch<ApiEnvelope<ProdutoBaseResponse[]>>(
    `/produto-base?idPraia=${idPraia}`
  )
  return response.map(mapProduto)
}
