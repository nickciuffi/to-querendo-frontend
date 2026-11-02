import { apiFetch } from "@/services/http-client"
import {
  mapProdutoEspecifico,
  type ProdutoEspecificoResponse,
} from "@/services/seller-product-service"
import type { MapVendor, SellerProduct } from "@/lib/types"

interface ApiEnvelope<T> {
  response: T
  messages: string[]
}

interface VendedorLocalizacaoResponse {
  idVendedor: number
  nomeVendedor: string
  urlFotoPerfil?: string | null
  descricao?: string | null
  produtos: ProdutoEspecificoResponse[]
  latitude: number
  longitude: number
}

function isSellable(product: SellerProduct) {
  return product.active && product.baseProductActive
}

/**
 * Busca os vendedores da praia. Com `idsProdutoBase` nulo (ou vazio), a rota devolve os
 * vendedores de todos os produtos; caso contrário, os que vendem qualquer um dos produtos
 * informados (vão em `idsProdutosBase`, separados por vírgula: "1,2,4,5").
 *
 * Atenção: se algum id não for de um produto base ativo, a API responde 404 para a busca inteira.
 */
export async function getVendedoresDaPraia(
  idPraia: number,
  idsProdutoBase: number[] | null
): Promise<MapVendor[]> {
  let query = `idPraia=${idPraia}`
  // Ids numéricos separados por vírgula literal ("1,2,4,5"), sem o %2C do URLSearchParams.
  if (idsProdutoBase && idsProdutoBase.length > 0) {
    query += `&idsProdutosBase=${idsProdutoBase.join(",")}`
  }

  const { response } = await apiFetch<ApiEnvelope<VendedorLocalizacaoResponse[]>>(
    `/vendedor/localizacao?${query}`
  )

  return response
    .map((body) => ({
      id: body.idVendedor,
      name: body.nomeVendedor,
      photoUrl: body.urlFotoPerfil || null,
      description: body.descricao?.trim() ?? "",
      lat: body.latitude,
      lng: body.longitude,
      products: body.produtos.map(mapProdutoEspecifico),
    }))
    .filter((vendor) => vendor.products.length > 0)
    .map((vendor) => {
      const featuredProduct = vendor.products.find(isSellable) ?? vendor.products[0]
      return {
        ...vendor,
        featuredProduct,
        available: vendor.products.some(isSellable),
      }
    })
}
