import { apiFetch } from "@/services/http-client"
import type { SellerProduct } from "@/lib/types"

interface ApiEnvelope<T> {
  response: T
  messages: string[]
}

interface ProdutoEspecificoResponse {
  id: number
  nome: string
  descricao: string
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
    description: body.descricao,
    baseProductId: body.idProdutoBase,
    baseProductName: body.nomeProdutoBase,
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
