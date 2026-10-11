import * as React from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

import { useAuth } from "@/hooks/use-auth"
import type { Beach, MapVendor } from "@/lib/types"

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN
const DEFAULT_STYLE = "mapbox://styles/mapbox/streets-v12"
const OFFLINE_SELLER_STYLE = "mapbox://styles/mapbox/light-v11"
const PRODUCT_FALLBACK_ICON = "🛒"

interface MapboxMapProps {
  beach: Beach
  vendors: MapVendor[]
  selectedVendorId: number | null
  onSelectVendor: (vendorId: number) => void
  /** Quando muda, o mapa volta a centralizar no primeiro vendedor da próxima lista carregada. */
  centerKey: string
}

/** Cor do anel do marcador: azul = selecionado, verde = disponível, cinza = indisponível. */
function markerColor(vendor: MapVendor, isSelected: boolean) {
  if (isSelected) return "#1e88e5"
  return vendor.available ? "#22c55e" : "#9ca3af"
}

function createMarkerElement(vendor: MapVendor, isSelected: boolean) {
  const el = document.createElement("button")
  el.type = "button"
  el.setAttribute("aria-label", `${vendor.name} — ${vendor.featuredProduct.baseProductName}`)
  el.style.cssText =
    "display:flex;align-items:center;justify-content:center;overflow:hidden;width:2.5rem;height:2.5rem;padding:0;border-radius:9999px;font-size:1.15rem;background:white;box-shadow:0 2px 6px rgba(0,0,0,.3);cursor:pointer;border:3px solid " +
    markerColor(vendor, isSelected) +
    (vendor.available ? "" : ";filter:grayscale(1);opacity:.85")

  const photoUrl = vendor.featuredProduct.photoUrl
  if (photoUrl) {
    const img = document.createElement("img")
    img.src = photoUrl
    img.alt = ""
    img.style.cssText = "width:100%;height:100%;object-fit:cover"
    img.addEventListener("error", () => {
      img.remove()
      el.textContent = PRODUCT_FALLBACK_ICON
    })
    el.appendChild(img)
  } else {
    el.textContent = PRODUCT_FALLBACK_ICON
  }
  return el
}

export function MapboxMap({
  beach,
  vendors,
  selectedVendorId,
  onSelectVendor,
  centerKey,
}: MapboxMapProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const [map, setMap] = React.useState<mapboxgl.Map | null>(null)
  const onSelectVendorRef = React.useRef(onSelectVendor)
  const { user, hasRole } = useAuth()

  // Vendedor offline vê o mapa em estilo claro; demais usuários mantêm o padrão.
  const isOfflineSeller = !!user && hasRole("ROLE_VENDEDOR") && !user.online
  const mapStyle = isOfflineSeller ? OFFLINE_SELLER_STYLE : DEFAULT_STYLE
  const appliedStyleRef = React.useRef(mapStyle)

  React.useEffect(() => {
    onSelectVendorRef.current = onSelectVendor
  }, [onSelectVendor])

  React.useEffect(() => {
    if (!MAPBOX_TOKEN || !containerRef.current) return

    mapboxgl.accessToken = MAPBOX_TOKEN
    const instance = new mapboxgl.Map({
      container: containerRef.current,
      style: mapStyle,
      center: beach.center,
      zoom: 15.5,
      attributionControl: false,
    })
    instance.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right")
    appliedStyleRef.current = mapStyle
    setMap(instance)

    return () => {
      instance.remove()
      setMap(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beach.id])

  React.useEffect(() => {
    if (!map || appliedStyleRef.current === mapStyle) return
    map.setStyle(mapStyle)
    appliedStyleRef.current = mapStyle
  }, [map, mapStyle])

  React.useEffect(() => {
    if (!map) return

    const markers = vendors.map((vendor) => {
      const el = createMarkerElement(vendor, vendor.id === selectedVendorId)
      el.addEventListener("click", (event) => {
        event.stopPropagation()
        onSelectVendorRef.current(vendor.id)
      })

      return new mapboxgl.Marker({ element: el }).setLngLat([vendor.lng, vendor.lat]).addTo(map)
    })

    return () => {
      markers.forEach((marker) => marker.remove())
    }
  }, [map, vendors, selectedVendorId])

  // Centraliza no primeiro vendedor assim que a lista carrega. Roda uma vez por instância do
  // mapa e por `centerKey` (praia + filtro), para não reposicionar enquanto o usuário navega.
  const centeredRef = React.useRef<{ map: mapboxgl.Map; key: string } | null>(null)
  React.useEffect(() => {
    if (!map || vendors.length === 0) return
    const centered = centeredRef.current
    if (centered?.map === map && centered.key === centerKey) return
    centeredRef.current = { map, key: centerKey }
    map.jumpTo({ center: [vendors[0].lng, vendors[0].lat] })
  }, [map, vendors, centerKey])

  React.useEffect(() => {
    if (!map || !selectedVendorId) return
    const vendor = vendors.find((item) => item.id === selectedVendorId)
    if (vendor) {
      map.easeTo({ center: [vendor.lng, vendor.lat], duration: 450 })
    }
  }, [map, selectedVendorId, vendors])

  if (!MAPBOX_TOKEN) {
    return (
      <FallbackMap
        vendors={vendors}
        selectedVendorId={selectedVendorId}
        onSelectVendor={onSelectVendor}
      />
    )
  }

  return <div ref={containerRef} className="h-full w-full" />
}

const FALLBACK_POSITIONS = [
  { top: "28%", left: "35%" },
  { top: "55%", left: "62%" },
  { top: "70%", left: "22%" },
  { top: "40%", left: "78%" },
  { top: "18%", left: "60%" },
]

function FallbackMap({
  vendors,
  selectedVendorId,
  onSelectVendor,
}: Omit<MapboxMapProps, "beach" | "centerKey">) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-linear-to-b from-brand-blue/40 via-brand-blue/20 to-brand-yellow/20">
      <p className="absolute inset-x-0 top-2 z-10 mx-auto w-fit rounded-full bg-background/80 px-3 py-1 text-center text-[0.65rem] text-muted-foreground backdrop-blur">
        Configure VITE_MAPBOX_TOKEN para ver o mapa real
      </p>
      {vendors.map((vendor, index) => {
        const position = FALLBACK_POSITIONS[index % FALLBACK_POSITIONS.length]
        const isSelected = vendor.id === selectedVendorId
        return (
          <button
            key={vendor.id}
            type="button"
            aria-label={vendor.name}
            onClick={() => onSelectVendor(vendor.id)}
            className="absolute flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full border-[3px] bg-white text-lg shadow-md transition-transform"
            style={{
              top: position.top,
              left: position.left,
              borderColor: markerColor(vendor, isSelected),
              filter: vendor.available ? undefined : "grayscale(1)",
              transform: isSelected ? "translate(-50%, -50%) scale(1.15)" : "translate(-50%, -50%)",
            }}
          >
            {vendor.featuredProduct.photoUrl ? (
              <img
                src={vendor.featuredProduct.photoUrl}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              PRODUCT_FALLBACK_ICON
            )}
          </button>
        )
      })}
    </div>
  )
}
