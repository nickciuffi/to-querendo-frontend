import * as React from "react"
import { MapPin, ShoppingBag } from "lucide-react"

import { ImageLightbox } from "@/components/image-lightbox"
import { MapDetailsPanel } from "@/components/map-details-panel"
import { MapStatusPill } from "@/components/map-status-pill"
import { MapboxMap } from "@/components/mapbox-map"
import { ProfileAvatar } from "@/components/profile-avatar"
import { INTENTION_PHOTO_FALLBACK_URL } from "@/components/vendedor/buyer-intention-card"
import { SellerOnlineFloatingButton } from "@/components/vendedor/seller-online-floating-button"
import { useAuth } from "@/hooks/use-auth"
import { getBeachCenter } from "@/lib/coordinates"
import type { BuyerWithIntentions, MapMarker } from "@/lib/types"
import { formatDateTimeBR, getInitials } from "@/lib/utils"
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
      // Foto de perfil do banhista; sem foto, o pin mostra as iniciais.
      photoUrl: buyer.photoUrl,
      initials: getInitials(buyer.name),
      ringColor: BUYER_RING_COLOR,
    }))
  }, [buyers, centerLng, centerLat])

  const selectedBuyer = buyers.find((buyer) => buyer.id === selectedBuyerId) ?? null
  // A API devolve as intenções da mais recente para a mais antiga: a primeira tem o último local.
  const lastIntention = selectedBuyer?.intentions[0] ?? null

  // Mensagem que flutua sobre o mapa enquanto nenhum comprador está selecionado.
  function getStatus(): { title: string; description?: string; tone?: "error" } {
    if (isLoading) return { title: "Buscando banhistas..." }
    if (error) return { title: error, tone: "error" }
    if (!beachId) return { title: "Escolha uma praia para ver os banhistas" }
    if (!beachCenter) return { title: "A localização da sua praia ainda não foi cadastrada" }
    if (buyers.length === 0) return { title: "Nenhum banhista querendo comprar agora" }
    return {
      title: "Toque em um banhista no mapa",
      description: `${buyers.length} ${buyers.length === 1 ? "banhista querendo comprar" : "banhistas querendo comprar"}`,
    }
  }
  const status = getStatus()

  return (
    <div className="flex flex-1 flex-col">
      {/* Sem painel de detalhes aberto, o mapa ocupa todo o espaço. */}
      <div className="relative min-h-0 flex-1">
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
        {!selectedBuyer && (
          <MapStatusPill
            title={status.title}
            description={status.description}
            tone={status.tone}
            className="left-3 top-3 w-[calc(100%-4.5rem)] max-w-xs"
          />
        )}
      </div>

      {selectedBuyer && lastIntention && (
        <MapDetailsPanel
          onClose={() => setSelectedBuyerId(null)}
          closeLabel="Fechar detalhes do comprador"
        >
          <div className="flex flex-col gap-3">
            {/* pr-12: o X do painel fica à direita desta linha. */}
            <header className="flex items-center gap-3 pr-12">
              <ProfileAvatar name={selectedBuyer.name} photoUrl={selectedBuyer.photoUrl} />
              <div className="min-w-0">
                <p className="truncate font-heading text-base font-semibold text-foreground">
                  {selectedBuyer.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedBuyer.intentions.length}{" "}
                  {selectedBuyer.intentions.length === 1 ? "pedido ativo" : "pedidos ativos"}
                </p>
              </div>
            </header>

            <div className="grid grid-cols-2 gap-3">
              <section className="flex min-w-0 flex-col gap-2 rounded-xl border border-border bg-muted/40 p-3">
                <h3 className="flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
                  <ShoppingBag className="size-3.5" />
                  Quer comprar
                </h3>
                <ul className="flex flex-col divide-y divide-border">
                  {selectedBuyer.intentions.map((intention) => (
                    <li key={intention.id} className="flex flex-col gap-0.5 py-1.5 text-xs first:pt-0 last:pb-0">
                      <span className="font-medium text-foreground">{intention.baseProductName}</span>
                      {intention.observations ? (
                        <span className="break-words text-muted-foreground">{intention.observations}</span>
                      ) : (
                        <span className="italic text-muted-foreground/70">Sem observações</span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="flex min-w-0 flex-col gap-2 rounded-xl border border-border bg-muted/40 p-3">
                <h3 className="flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
                  <MapPin className="size-3.5" />
                  Último local
                </h3>
                <ImageLightbox
                  src={lastIntention.photoUrl || INTENTION_PHOTO_FALLBACK_URL}
                  alt={`Local de ${selectedBuyer.name}`}
                  className="aspect-[4/3] w-full max-w-56 sm:max-w-40"
                />
                <p className="break-words text-xs text-foreground">{lastIntention.locationDescription}</p>
                <span className="text-[0.65rem] text-muted-foreground">
                  Atualizado em {formatDateTimeBR(lastIntention.createdAt)}
                </span>
              </section>
            </div>
          </div>
        </MapDetailsPanel>
      )}

      <SellerOnlineFloatingButton />
    </div>
  )
}
