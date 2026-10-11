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

interface VendorLocation {
  id: number
  name: string
  lat: number
  lng: number
  products: SellerProduct[]
}

async function getVendedoresLocalizacao(
  idProdutoBase: number,
  idPraia: number
): Promise<VendorLocation[]> {
  const { response } = await apiFetch<ApiEnvelope<VendedorLocalizacaoResponse[]>>(
    `/vendedor/localizacao?idProdutoBase=${idProdutoBase}&idPraia=${idPraia}`
  )
  return response.map((body) => ({
    id: body.idVendedor,
    name: body.nomeVendedor,
    lat: body.latitude,
    lng: body.longitude,
    products: body.produtos.map(mapProdutoEspecifico),
  }))
}

function isSellable(product: SellerProduct) {
  return product.active && product.baseProductActive
}

/**
 * Busca os vendedores da praia: consulta a rota de localização uma vez por
 * `idProdutoBase` informado e junta os resultados por vendedor.
 */
export async function getVendedoresDaPraia(
  idPraia: number,
  idsProdutoBase: number[]
): Promise<MapVendor[]> {
  const results = await Promise.allSettled(
    idsProdutoBase.map((idProdutoBase) => getVendedoresLocalizacao(idProdutoBase, idPraia))
  )

  // Se todas as consultas falharem, propaga o erro em vez de mostrar um mapa vazio.
  if (results.length > 0 && results.every((r) => r.status === "rejected")) {
    throw results[0].reason
  }

  const byVendor = new Map<number, VendorLocation>()
  for (const result of results) {
    if (result.status !== "fulfilled") continue
    for (const vendor of result.value) {
      const existing = byVendor.get(vendor.id)
      if (!existing) {
        byVendor.set(vendor.id, { ...vendor, products: [...vendor.products] })
        continue
      }
      for (const product of vendor.products) {
        if (!existing.products.some((p) => p.id === product.id)) existing.products.push(product)
      }
    }
  }

  return [...byVendor.values()]
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
