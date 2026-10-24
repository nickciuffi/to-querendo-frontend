import * as React from "react"

import { BuyerIntentionCard } from "@/components/vendedor/buyer-intention-card"
import { getBanhistasComIntencao } from "@/services/purchase-intention-service"
import type { BuyerWithIntentions } from "@/lib/types"

export function BeachBuyerIntentionsSection() {
  const [buyers, setBuyers] = React.useState<BuyerWithIntentions[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false

    getBanhistasComIntencao()
      .then((result) => {
        if (!cancelled) setBuyers(result)
      })
      .catch(() => {
        if (!cancelled) setError("Não foi possível carregar as intenções de compra dessa praia.")
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const cards = buyers.flatMap((buyer) =>
    buyer.intentions.map((intention) => ({ buyerName: buyer.name, intention }))
  )

  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 px-4 lg:px-30 pt-3 pb-4">
      {isLoading && (
        <p className="col-span-full py-10 text-center text-sm text-white/70">
          Carregando intenções de compra...
        </p>
      )}
      {!isLoading && error && (
        <p className="col-span-full py-10 text-center text-sm text-destructive">{error}</p>
      )}
      {!isLoading &&
        !error &&
        cards.map(({ buyerName, intention }) => (
          <BuyerIntentionCard key={intention.id} buyerName={buyerName} intention={intention} />
        ))}
      {!isLoading && !error && cards.length === 0 && (
        <p className="col-span-full py-10 text-center text-sm text-white/70">
          Nenhuma intenção de compra na sua praia agora.
        </p>
      )}
    </section>
  )
}
