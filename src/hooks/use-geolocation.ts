import * as React from "react"

export interface GeolocationPosition {
  latitude: number
  longitude: number
  /** Raio de precisão em metros. */
  accuracy: number
  timestamp: number
}

export type GeolocationErrorReason = "unsupported" | "permission-denied" | "unavailable" | "timeout"

export interface GeolocationError {
  reason: GeolocationErrorReason
  message: string
}

const ERROR_REASONS: Record<number, GeolocationErrorReason> = {
  1: "permission-denied",
  2: "unavailable",
  3: "timeout",
}

const UNSUPPORTED_ERROR: GeolocationError = {
  reason: "unsupported",
  message: "Seu navegador não permite acessar a localização.",
}

const isSupported = typeof navigator !== "undefined" && "geolocation" in navigator

/**
 * Acompanha a posição do usuário com `navigator.geolocation.watchPosition` enquanto
 * `enabled` for verdadeiro. A geolocalização só funciona em HTTPS ou em `localhost`.
 */
export function useGeolocation({ enabled = true }: { enabled?: boolean } = {}) {
  const [position, setPosition] = React.useState<GeolocationPosition | null>(null)
  const [error, setError] = React.useState<GeolocationError | null>(null)

  React.useEffect(() => {
    if (!enabled || !isSupported) return

    const watchId = navigator.geolocation.watchPosition(
      (result) => {
        setPosition({
          latitude: result.coords.latitude,
          longitude: result.coords.longitude,
          accuracy: result.coords.accuracy,
          timestamp: result.timestamp,
        })
        setError(null)
      },
      (err) => {
        setError({ reason: ERROR_REASONS[err.code] ?? "unavailable", message: err.message })
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [enabled])

  // Quando desabilitado (ex.: após logout), não expõe a última posição conhecida.
  if (!enabled) return { position: null, error: null }
  if (!isSupported) return { position: null, error: UNSUPPORTED_ERROR }
  return { position, error }
}
