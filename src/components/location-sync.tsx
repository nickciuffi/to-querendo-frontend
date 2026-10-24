import * as React from "react"

import { useAuth } from "@/hooks/use-auth"
import { useGeolocation, type GeolocationPosition } from "@/hooks/use-geolocation"
import { updateLocalizacao } from "@/services/localizacao-service"

const SEND_INTERVAL_MS = 10_000

/**
 * Envia a localização do usuário logado para a API a cada 10 segundos.
 * Começa assim que o usuário loga e para no logout.
 */
export function LocationSync() {
  const { user } = useAuth()
  const enabled = user !== null

  const { position, error } = useGeolocation({ enabled })

  const positionRef = React.useRef<GeolocationPosition | null>(null)
  const isSendingRef = React.useRef(false)

  React.useEffect(() => {
    positionRef.current = position
  }, [position])

  const sendLatestPosition = React.useCallback(async () => {
    const latest = positionRef.current
    if (!latest || isSendingRef.current) return

    isSendingRef.current = true
    try {
      await updateLocalizacao(latest.latitude, latest.longitude)
    } catch (err) {
      console.warn("Não foi possível enviar a localização.", err)
    } finally {
      isSendingRef.current = false
    }
  }, [])

  // Primeiro envio assim que a posição inicial chega, sem esperar os 10 segundos.
  const hasPosition = position !== null
  React.useEffect(() => {
    if (enabled && hasPosition) void sendLatestPosition()
  }, [enabled, hasPosition, sendLatestPosition])

  React.useEffect(() => {
    if (!enabled) return

    const intervalId = window.setInterval(() => void sendLatestPosition(), SEND_INTERVAL_MS)
    return () => window.clearInterval(intervalId)
  }, [enabled, sendLatestPosition])

  React.useEffect(() => {
    if (error) console.warn(`Geolocalização indisponível (${error.reason}): ${error.message}`)
  }, [error])

  return null
}
