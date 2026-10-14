import * as React from "react"

import { PurchaseIntentionCard } from "@/components/purchase-intention-card"
import { ApiError } from "@/services/http-client"
import { getProdutosBaseAtivos } from "@/services/product-service"
import { getMinhasIntencoes } from "@/services/purchase-intention-service"
import type { PurchaseIntention } from "@/lib/types"

export function PedidosPage() {
  const [intentions, setIntentions] = React.useState<PurchaseIntention[]>([])
  const [productPhotosById, setProductPhotosById] = React.useState<Map<number, string | null>>(new Map())
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false

    Promise.all([getMinhasIntencoes(), getProdutosBaseAtivos()])
      .then(([intencoes, produtos]) => {
        if (!cancelled) {
          setIntentions(intencoes)
          setProductPhotosById(new Map(produtos.map((produto) => [Number(produto.id), produto.photoUrl])))
          setError(null)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Não foi possível carregar seus pedidos.")
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
    <div className="pb-8 flex-1 mx-auto w-full max-w-3xl px-4 text-white lg:px-0">
      <div className="mx-auto mt-6 w-full">
        <h2 className="text-3xl font-bold leading-tight">Meus pedidos</h2>
        <p className="leading-snug text-white/55">Acompanhe as intenções de compra que você registrou.</p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {isLoading && (
            <p className="col-span-full py-6 text-center text-sm text-white/60">Carregando pedidos...</p>
          )}
          {!isLoading && error && (
            <p className="col-span-full py-6 text-center text-sm text-destructive">{error}</p>
          )}
          {!isLoading &&
            !error &&
            intentions.map((intention) => (
              <PurchaseIntentionCard
                key={intention.id}
                intention={intention}
                baseProductPhotoUrl={productPhotosById.get(intention.baseProductId) ?? null}
              />
            ))}
          {!isLoading && !error && intentions.length === 0 && (
            <p className="col-span-full py-6 text-center text-sm text-white/60">
              Você ainda não registrou nenhuma intenção de compra.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
