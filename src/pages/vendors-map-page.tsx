import * as React from "react"
import { MapPin } from "lucide-react"

import { MapboxMap } from "@/components/mapbox-map"
import { SellerOnlineFloatingButton } from "@/components/vendedor/seller-online-floating-button"
import { useAuth } from "@/hooks/use-auth"
import { getBeachCenter } from "@/lib/coordinates"
import type { BuyerWithIntentions, MapMarker } from "@/lib/types"
import { getInitials } from "@/lib/utils"
import { getBanhistasComIntencao } from "@/services/purchase-intention-service"

const BUYER_RING_COLOR = "#FC800C"

/**
 * TODO: a rota `/intencao-compra/banhistas` ainda não devolve coordenadas. Até lá, espalhamos os
 * banhistas em volta do centro da praia só para visualizar o layout.
 */
function provisionalPosition(center: [number, number], index: number) {
  const angle = index * 2.4
  const radius = 0.0006 + 0.0003 * Math.floor(index / 6)
  return { lng: center[0] + Math.cos(angle) * radius, lat: center[1] + Math.sin(angle) * radius }
}

export function VendorsMapPage() {
  const { user } = useAuth()

  const beachId = user?.beach?.id
  const beachCenter = getBeachCenter(user?.beach)
  const [centerLng, centerLat] = beachCenter ?? [null, null]

  const [buyers, setBuyers] = React.useState<BuyerWithIntentions[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [selectedBuyerId, setSelectedBuyerId] = React.useState<number | null>(null)

  React.useEffect(() => {
    let cancelled = false

    async function loadBuyers() {
      try {
        const result = await getBanhistasComIntencao()
        if (!cancelled) setBuyers(result)
      } catch (err) {
        console.warn("Não foi possível carregar os banhistas.", err)
        if (!cancelled) setError("Não foi possível carregar os banhistas.")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadBuyers()

    return () => {
      cancelled = true
    }
  }, [])

  // Sem coordenadas da praia não há onde posicionar os banhistas (posições provisórias, ver TODO).
  const markers = React.useMemo<MapMarker[]>(() => {
    if (centerLng === null || centerLat === null) return []
    return buyers.map((buyer, index) => ({
      id: buyer.id,
      label: `${buyer.name} — ${buyer.intentions[0].baseProductName}`,
      ...provisionalPosition([centerLng, centerLat], index),
      photoUrl: buyer.intentions[0].photoUrl,
      initials: getInitials(buyer.name),
      ringColor: BUYER_RING_COLOR,
    }))
  }, [buyers, centerLng, centerLat])

  const selectedBuyer = buyers.find((buyer) => buyer.id === selectedBuyerId) ?? null

  return (
    <div className="flex flex-1 flex-col">
      <div className="relative min-h-0 flex-[4]">
        <div className="absolute inset-0">
          <MapboxMap
            center={beachCenter}
            markers={markers}
            selectedMarkerId={selectedBuyerId}
            onSelectMarker={setSelectedBuyerId}
            centerKey={String(beachId ?? "sem-praia")}
            offlineStyle={!user?.online}
          />
        </div>
      </div>

      <div className="flex-[1] min-h-[7.5rem] overflow-y-auto border-t border-border bg-card px-4 py-3">
        {!selectedBuyer && (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-center">
            <MapPin className="size-5 text-brand-blue" />
            {isLoading ? (
              <p className="text-sm font-medium text-foreground">Buscando banhistas...</p>
            ) : error ? (
              <p className="text-sm font-medium text-destructive">{error}</p>
            ) : !beachId ? (
              <p className="text-sm font-medium text-foreground">Escolha uma praia para ver os banhistas</p>
            ) : !beachCenter ? (
              <p className="text-sm font-medium text-foreground">
                A localização da sua praia ainda não foi cadastrada
              </p>
            ) : buyers.length === 0 ? (
              <p className="text-sm font-medium text-foreground">Nenhum banhista querendo comprar agora</p>
            ) : (
              <>
                <p className="text-sm font-medium text-foreground">Toque em um banhista no mapa</p>
                <p className="text-xs text-muted-foreground">
                  {buyers.length} {buyers.length === 1 ? "banhista querendo comprar" : "banhistas querendo comprar"}
                </p>
              </>
            )}
          </div>
        )}

        {selectedBuyer && (
          <div className="flex flex-col gap-2.5">
            <p className="truncate font-heading text-sm font-semibold text-foreground">
              {selectedBuyer.name}
            </p>

            <ul className="flex flex-col gap-2">
              {selectedBuyer.intentions.map((intention) => (
                <li key={intention.id} className="flex flex-col gap-0.5 text-xs">
                  <span className="font-medium text-foreground">{intention.baseProductName}</span>
                  <span className="text-muted-foreground">{intention.locationDescription}</span>
                  {intention.observations && (
                    <span className="text-muted-foreground">{intention.observations}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <SellerOnlineFloatingButton />
    </div>
  )
}
