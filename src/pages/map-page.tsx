import * as React from "react"
import { MapPin } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapboxMap } from "@/components/mapbox-map"
import { useAuth } from "@/hooks/use-auth"
import { getBeachByName } from "@/lib/mock-data"
import type { MapVendor } from "@/lib/types"
import { getVendedoresDaPraia } from "@/services/vendor-location-service"

const FALLBACK_BEACH = { id: "copacabana", name: "Copacabana", city: "Rio de Janeiro", center: [-43.1822, -22.9711] as [number, number] }

const priceFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

export function MapPage() {
  const { user } = useAuth()

  const beach = (user?.beach ? getBeachByName(user.beach.name) : undefined) ?? FALLBACK_BEACH
  const beachId = user?.beach?.id

  const [loadedVendors, setVendors] = React.useState<MapVendor[]>([])
  const vendors = beachId ? loadedVendors : []
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [selectedVendorId, setSelectedVendorId] = React.useState<number | null>(null)

  React.useEffect(() => {
    if (!beachId) return

    let cancelled = false

    async function loadVendors(id: number) {
      setIsLoading(true)
      setError(null)
      setVendors([])
      setSelectedVendorId(null)
      try {
        const result = await getVendedoresDaPraia(id)
        if (!cancelled) setVendors(result)
      } catch {
        if (!cancelled) setError("Não foi possível carregar os vendedores dessa praia.")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadVendors(beachId)

    return () => {
      cancelled = true
    }
  }, [beachId])

  const selectedVendor = vendors.find((vendor) => vendor.id === selectedVendorId) ?? null
  const availableCount = vendors.filter((vendor) => vendor.available).length

  return (
    <div className="flex flex-1 flex-col">
      {/* O layout só tem altura mínima, então o mapa fica em posição absoluta para ter
          uma altura definida — o Mapbox não desenha em container com altura 0. */}
      <div className="relative min-h-0 flex-[4]">
        <div className="absolute inset-0">
          <MapboxMap
            beach={beach}
            vendors={vendors}
            selectedVendorId={selectedVendorId}
            onSelectVendor={setSelectedVendorId}
          />
        </div>
      </div>

      <div className="flex-[1] min-h-[7.5rem] overflow-y-auto border-t border-border bg-card px-4 py-3">
        {!selectedVendor && (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-center">
            <MapPin className="size-5 text-brand-blue" />
            {isLoading ? (
              <p className="text-sm font-medium text-foreground">Buscando vendedores...</p>
            ) : error ? (
              <p className="text-sm font-medium text-destructive">{error}</p>
            ) : !beachId ? (
              <p className="text-sm font-medium text-foreground">Escolha uma praia para ver os vendedores</p>
            ) : vendors.length === 0 ? (
              <p className="text-sm font-medium text-foreground">Nenhum vendedor encontrado nessa praia</p>
            ) : (
              <>
                <p className="text-sm font-medium text-foreground">Toque em um vendedor no mapa</p>
                <p className="text-xs text-muted-foreground">
                  {availableCount} {availableCount === 1 ? "vendedor disponível" : "vendedores disponíveis"} na praia
                </p>
              </>
            )}
          </div>
        )}

        {selectedVendor && (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-heading text-sm font-semibold text-foreground">
                  {selectedVendor.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {selectedVendor.products.length}{" "}
                  {selectedVendor.products.length === 1 ? "produto" : "produtos"}
                </p>
              </div>
              <Badge
                variant={selectedVendor.available ? "default" : "secondary"}
                className={selectedVendor.available ? "bg-brand-blue text-white" : ""}
              >
                {selectedVendor.available ? "Disponível" : "Indisponível"}
              </Badge>
            </div>

            <ul className="flex flex-col gap-1.5">
              {selectedVendor.products.map((product) => (
                <li key={product.id} className="flex items-center gap-2 text-xs">
                  <span className="min-w-0 flex-1 truncate text-foreground">{product.name}</span>
                  <span className="text-muted-foreground">{priceFormatter.format(product.price)}</span>
                  {!(product.active && product.baseProductActive) && (
                    <Badge variant="secondary">Indisponível</Badge>
                  )}
                </li>
              ))}
            </ul>

            <Button className="w-full bg-brand-orange text-white hover:bg-brand-orange/90">
              Tô Querendo
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
