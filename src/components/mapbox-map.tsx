import * as React from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

import type { Beach, Vendor } from "@/lib/types"

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

interface MapboxMapProps {
  beach: Beach
  vendors: Vendor[]
  selectedVendorId: string | null
  onSelectVendor: (vendorId: string) => void
}

function markerColor(vendor: Vendor, isSelected: boolean) {
  if (isSelected) return "#1e88e5"
  return vendor.isOpen ? "#ff7a29" : "#9ca3af"
}

export function MapboxMap({ beach, vendors, selectedVendorId, onSelectVendor }: MapboxMapProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const [map, setMap] = React.useState<mapboxgl.Map | null>(null)
  const onSelectVendorRef = React.useRef(onSelectVendor)

  React.useEffect(() => {
    onSelectVendorRef.current = onSelectVendor
  }, [onSelectVendor])

  React.useEffect(() => {
    console.log("Carregou mapa")
    if (!MAPBOX_TOKEN || !containerRef.current) return

    mapboxgl.accessToken = MAPBOX_TOKEN
    const instance = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: beach.center,
      zoom: 15.5,
      attributionControl: false,
    })
    instance.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right")
    setMap(instance)

    return () => {
      instance.remove()
      setMap(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beach.id])

  React.useEffect(() => {
    if (!map) return

    const markers = vendors.map((vendor) => {
      const el = document.createElement("button")
      el.type = "button"
      el.setAttribute("aria-label", vendor.name)
      el.style.cssText =
        "display:flex;align-items:center;justify-content:center;width:2.25rem;height:2.25rem;border-radius:9999px;border:2px solid white;font-size:1.05rem;box-shadow:0 2px 6px rgba(0,0,0,.25);cursor:pointer;background:" +
        markerColor(vendor, vendor.id === selectedVendorId)
      el.textContent = vendor.avatarEmoji
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
}: Omit<MapboxMapProps, "beach">) {
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
            className="absolute flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white text-base shadow-md transition-transform"
            style={{
              top: position.top,
              left: position.left,
              background: markerColor(vendor, isSelected),
              transform: isSelected ? "translate(-50%, -50%) scale(1.15)" : "translate(-50%, -50%)",
            }}
          >
            {vendor.avatarEmoji}
          </button>
        )
      })}
    </div>
  )
}
