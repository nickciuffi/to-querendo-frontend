import * as React from "react"
import { MapPin, Star } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapboxMap } from "@/components/mapbox-map"
import { useAuth } from "@/hooks/use-auth"
import { getBeachByName, getVendorProductCount, VENDORS } from "@/lib/mock-data"

const FALLBACK_BEACH = { id: "copacabana", name: "Copacabana", city: "Rio de Janeiro", center: [-43.1822, -22.9711] as [number, number] }

export function MapPage() {
  const { user } = useAuth()
  // A API ainda não retorna coordenadas da praia atual, só o nome — tentamos casar
  // com o catálogo mockado e caímos no fallback quando não há correspondência.
  const beach = (user?.beach ? getBeachByName(user.beach.name) : undefined) ?? FALLBACK_BEACH
  const [selectedVendorId, setSelectedVendorId] = React.useState<string | null>(null)

  const selectedVendor = VENDORS.find((vendor) => vendor.id === selectedVendorId) ?? null
  const productCount = selectedVendor ? getVendorProductCount(selectedVendor.id) : 0
  console.log("Carregou página")

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-[4]">
        <MapboxMap
          beach={beach}
          vendors={VENDORS}
          selectedVendorId={selectedVendorId}
          onSelectVendor={setSelectedVendorId}
        />
      </div>

      <div className="flex-[1] min-h-[7.5rem] overflow-y-auto border-t border-border bg-card px-4 py-3">
        {!selectedVendor && (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-center">
            <MapPin className="size-5 text-brand-blue" />
            <p className="text-sm font-medium text-foreground">Toque em um vendedor no mapa</p>
            <p className="text-xs text-muted-foreground">
              {VENDORS.filter((v) => v.isOpen).length} vendedores abertos perto de você
            </p>
          </div>
        )}

        {selectedVendor && (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-3">
              <Avatar size="lg">
                <AvatarFallback className="bg-brand-orange/15 text-lg text-brand-orange">
                  {selectedVendor.avatarEmoji}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate font-heading text-sm font-semibold text-foreground">
                  {selectedVendor.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">{selectedVendor.specialty}</p>
              </div>
              <Badge
                variant={selectedVendor.isOpen ? "default" : "secondary"}
                className={selectedVendor.isOpen ? "bg-brand-blue text-white" : ""}
              >
                {selectedVendor.isOpen ? "Aberto" : "Fechado"}
              </Badge>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="size-3.5 fill-brand-yellow text-brand-yellow" />
                {selectedVendor.rating.toFixed(1)}
              </span>
              <span>{selectedVendor.distanceMeters} m de você</span>
              {productCount > 0 && <span>{productCount} produtos</span>}
            </div>

            <Button className="w-full bg-brand-orange text-white hover:bg-brand-orange/90">
              Tô Querendo
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
