import { apiFetch } from "@/services/http-client"
import type { SellerProduct } from "@/lib/types"

interface ApiEnvelope<T> {
  response: T
  messages: string[]
}

interface ProdutoEspecificoResponse {
  id: number
  nome: string
  descricao?: string | null
  urlFoto?: string | null
  idProdutoBase: number
  nomeProdutoBase: string
  idVendedor: number
  preco: number | string
  produtoAtivo: boolean
  produtoBaseAtivo: boolean
  tsCriacaoProduto: string
}

function mapProdutoEspecifico(body: ProdutoEspecificoResponse): SellerProduct {
  return {
    id: body.id,
    name: body.nome,
    description: body.descricao ?? "",
    baseProductId: body.idProdutoBase,
    baseProductName: body.nomeProdutoBase,
    photoUrl: body.urlFoto || null,
    price: Number(body.preco),
    active: body.produtoAtivo,
    baseProductActive: body.produtoBaseAtivo,
    createdAt: body.tsCriacaoProduto,
  }
}

export async function getMeusProdutos(): Promise<SellerProduct[]> {
  const { response } = await apiFetch<ApiEnvelope<ProdutoEspecificoResponse[]>>(
    "/produto-especifico/meus-produtos"
  )
  return response.map(mapProdutoEspecifico)
}

export interface CreateProdutoEspecificoPayload {
  idProdutoBase: number
  nome: string
  descricao?: string
  urlFoto?: string
  preco: number
}

export async function createProdutoEspecifico(
  payload: CreateProdutoEspecificoPayload
): Promise<SellerProduct> {
  const { response } = await apiFetch<ApiEnvelope<ProdutoEspecificoResponse>>(
    "/produto-especifico",
    {
      method: "POST",
      body: payload,
    }
  )
  return mapProdutoEspecifico(response)
}

export interface UpdateProdutoEspecificoPayload {
  nome: string
  descricao: string
  urlFoto: string
  preco: number
  produtoAtivo: boolean
}

export async function updateProdutoEspecifico(
  id: number,
  payload: UpdateProdutoEspecificoPayload
): Promise<SellerProduct> {
  const { response } = await apiFetch<ApiEnvelope<ProdutoEspecificoResponse>>(
    `/produto-especifico/${id}`,
    {
      method: "PUT",
      body: payload,
    }
  )
  return mapProdutoEspecifico(response)
}

export async function deleteProdutoEspecifico(id: number): Promise<void> {
  await apiFetch<ApiEnvelope<unknown>>(`/produto-especifico/${id}`, {
    method: "DELETE",
  })
}
