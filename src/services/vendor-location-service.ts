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
  produtos: ProdutoEspecificoResponse[]
  latitude: number
  longitude: number
}

function isSellable(product: SellerProduct) {
  return product.active && product.baseProductActive
}

/**
 * Busca os vendedores da praia. Com `idProdutoBase` nulo, a rota devolve os
 * vendedores de todos os produtos; caso contrário, só os do produto informado.
 */
export async function getVendedoresDaPraia(
  idPraia: number,
  idProdutoBase: number | null
): Promise<MapVendor[]> {
  const params = new URLSearchParams({ idPraia: String(idPraia) })
  if (idProdutoBase !== null) params.set("idProdutoBase", String(idProdutoBase))

  const { response } = await apiFetch<ApiEnvelope<VendedorLocalizacaoResponse[]>>(
    `/vendedor/localizacao?${params}`
  )

  return response
    .map((body) => ({
      id: body.idVendedor,
      name: body.nomeVendedor,
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
