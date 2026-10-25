import * as React from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

import type { MapMarker } from "@/lib/types"

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN
const DEFAULT_STYLE = "mapbox://styles/mapbox/streets-v12"
const OFFLINE_STYLE = "mapbox://styles/mapbox/light-v11"
const SELECTED_RING_COLOR = "#1e88e5"
const MARKER_FALLBACK_ICON = "🛒"
const BEACH_ZOOM = 15.5
// Visão do Brasil inteiro, usada só enquanto não há praia com coordenadas nem marcadores.
const NO_BEACH_CENTER: [number, number] = [-51.9, -14.2]
const NO_BEACH_ZOOM = 3.5

interface MapboxMapProps {
  /** Centro da praia selecionada, em `[longitude, latitude]`. `null` se ela não tiver coordenadas. */
  center: [number, number] | null
  markers: MapMarker[]
  selectedMarkerId: number | null
  onSelectMarker: (markerId: number) => void
  /**
   * Identifica a praia. Quando muda, o mapa volta para o centro dela — ou, se ela não tiver
   * coordenadas, para o primeiro marcador da próxima lista carregada.
   */
  centerKey: string
  /** Usa o estilo de mapa claro (ex.: vendedor offline). */
  offlineStyle?: boolean
}

/** Cor do anel do marcador: azul quando selecionado, senão a cor definida por quem o criou. */
function markerColor(marker: MapMarker, isSelected: boolean) {
  return isSelected ? SELECTED_RING_COLOR : marker.ringColor
}

function createMarkerElement(marker: MapMarker, isSelected: boolean) {
  const el = document.createElement("button")
  el.type = "button"
  el.setAttribute("aria-label", marker.label)
  el.style.cssText =
    "display:flex;align-items:center;justify-content:center;overflow:hidden;width:2.5rem;height:2.5rem;padding:0;border-radius:9999px;font-size:1.15rem;background:white;box-shadow:0 2px 6px rgba(0,0,0,.3);cursor:pointer;border:3px solid " +
    markerColor(marker, isSelected) +
    (marker.dimmed ? ";filter:grayscale(1);opacity:.85" : "")

  if (marker.photoUrl) {
    const img = document.createElement("img")
    img.src = marker.photoUrl
    img.alt = ""
    img.style.cssText = "width:100%;height:100%;object-fit:cover"
    img.addEventListener("error", () => {
      img.remove()
      el.textContent = marker.initials || MARKER_FALLBACK_ICON
      if (marker.initials) el.style.fontSize = "0.9rem"
    })
    el.appendChild(img)
  } else if (marker.initials) {
    el.textContent = marker.initials
    el.style.fontSize = "0.9rem"
    el.style.fontWeight = "600"
  } else {
    el.textContent = MARKER_FALLBACK_ICON
  }
  return el
}

export function MapboxMap({
  center,
  markers,
  selectedMarkerId,
  onSelectMarker,
  centerKey,
  offlineStyle = false,
}: MapboxMapProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const [map, setMap] = React.useState<mapboxgl.Map | null>(null)
  const onSelectMarkerRef = React.useRef(onSelectMarker)

  const mapStyle = offlineStyle ? OFFLINE_STYLE : DEFAULT_STYLE
  const appliedStyleRef = React.useRef(mapStyle)

  React.useEffect(() => {
    onSelectMarkerRef.current = onSelectMarker
  }, [onSelectMarker])

  React.useEffect(() => {
    if (!MAPBOX_TOKEN || !containerRef.current) return

    mapboxgl.accessToken = MAPBOX_TOKEN
    const instance = new mapboxgl.Map({
      container: containerRef.current,
      style: mapStyle,
      center: center ?? NO_BEACH_CENTER,
      zoom: center ? BEACH_ZOOM : NO_BEACH_ZOOM,
      attributionControl: false,
    })
    instance.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right")
    appliedStyleRef.current = mapStyle
    setMap(instance)

    return () => {
      instance.remove()
      setMap(null)
    }
    // O mapa é criado uma vez; trocas de praia são tratadas pelo efeito de centralização abaixo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (!map || appliedStyleRef.current === mapStyle) return
    map.setStyle(mapStyle)
    appliedStyleRef.current = mapStyle
  }, [map, mapStyle])

  React.useEffect(() => {
    if (!map) return

    const instances = markers.map((marker) => {
      const el = createMarkerElement(marker, marker.id === selectedMarkerId)
      el.addEventListener("click", (event) => {
        event.stopPropagation()
        onSelectMarkerRef.current(marker.id)
      })

      return new mapboxgl.Marker({ element: el }).setLngLat([marker.lng, marker.lat]).addTo(map)
    })

    return () => {
      instances.forEach((instance) => instance.remove())
    }
  }, [map, markers, selectedMarkerId])

  // Centraliza na praia uma vez por instância do mapa e por `centerKey`, para não reposicionar
  // enquanto o usuário navega. Sem coordenadas da praia, usa o primeiro marcador quando a lista chega.
  const centeredRef = React.useRef<{ map: mapboxgl.Map; key: string } | null>(null)
  React.useEffect(() => {
    if (!map) return
    const centered = centeredRef.current
    if (centered?.map === map && centered.key === centerKey) return

    const target: [number, number] | null =
      center ?? (markers.length > 0 ? [markers[0].lng, markers[0].lat] : null)
    if (!target) return

    centeredRef.current = { map, key: centerKey }
    map.jumpTo({ center: target, zoom: BEACH_ZOOM })
  }, [map, center, markers, centerKey])

  React.useEffect(() => {
    if (!map || !selectedMarkerId) return
    const marker = markers.find((item) => item.id === selectedMarkerId)
    if (marker) {
      map.easeTo({ center: [marker.lng, marker.lat], duration: 450 })
    }
  }, [map, selectedMarkerId, markers])

  if (!MAPBOX_TOKEN) {
    return (
      <FallbackMap
        markers={markers}
        selectedMarkerId={selectedMarkerId}
        onSelectMarker={onSelectMarker}
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
  markers,
  selectedMarkerId,
  onSelectMarker,
}: Pick<MapboxMapProps, "markers" | "selectedMarkerId" | "onSelectMarker">) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-linear-to-b from-brand-blue/40 via-brand-blue/20 to-brand-yellow/20">
      <p className="absolute inset-x-0 top-2 z-10 mx-auto w-fit rounded-full bg-background/80 px-3 py-1 text-center text-[0.65rem] text-muted-foreground backdrop-blur">
        Configure VITE_MAPBOX_TOKEN para ver o mapa real
      </p>
      {markers.map((marker, index) => {
        const position = FALLBACK_POSITIONS[index % FALLBACK_POSITIONS.length]
        const isSelected = marker.id === selectedMarkerId
        return (
          <button
            key={marker.id}
            type="button"
            aria-label={marker.label}
            onClick={() => onSelectMarker(marker.id)}
            className="absolute flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full border-[3px] bg-white text-lg shadow-md transition-transform"
            style={{
              top: position.top,
              left: position.left,
              borderColor: markerColor(marker, isSelected),
              filter: marker.dimmed ? "grayscale(1)" : undefined,
              transform: isSelected ? "translate(-50%, -50%) scale(1.15)" : "translate(-50%, -50%)",
            }}
          >
            {marker.photoUrl ? (
              <img src={marker.photoUrl} alt="" className="size-full object-cover" />
            ) : marker.initials ? (
              <span className="text-sm font-semibold">{marker.initials}</span>
            ) : (
              MARKER_FALLBACK_ICON
            )}
          </button>
        )
      })}
    </div>
  )
}
