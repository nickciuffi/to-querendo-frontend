import * as React from "react"

import { SellerProductCard } from "@/components/vendedor/seller-product-card"
import { ApiError } from "@/services/http-client"
import { getMeusProdutos } from "@/services/seller-product-service"
import type { SellerProduct } from "@/lib/types"

export function SellerProductList() {
  const [products, setProducts] = React.useState<SellerProduct[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false

    getMeusProdutos()
      .then((result) => {
        if (!cancelled) setProducts(result)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Não foi possível carregar seus produtos.")
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {isLoading && (
        <p className="col-span-full py-6 text-center text-sm text-white/60">Carregando produtos...</p>
      )}
      {!isLoading && error && (
        <p className="col-span-full py-6 text-center text-sm text-destructive">{error}</p>
      )}
      {!isLoading &&
        !error &&
        products.map((product) => <SellerProductCard key={product.id} product={product} />)}
      {!isLoading && !error && products.length === 0 && (
        <p className="col-span-full py-6 text-center text-sm text-white/60">
          Você ainda não tem nenhum produto cadastrado.
        </p>
      )}
    </div>
  )
}
