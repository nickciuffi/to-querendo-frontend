import { useCallback, useEffect, useState } from "react"
import { MapPin } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { formatDistanceKm } from "@/lib/coordinates"
import { cn } from "@/lib/utils"
import { getCurrentUser } from "@/services/auth-service"
import { getPraiasProximas, updateUserBeach } from "@/services/beach-service"
import type { UserBeach } from "@/lib/types"

interface BeachSelectProps {
  /**
   * Modo controlado: quando `onValueChange` é passado, a troca de praia não é salva
   * na API — quem usa o componente decide quando persistir (ex.: formulário de perfil).
   */
  value?: number | null
  onValueChange?: (idPraia: number) => void
  id?: string
  className?: string
  disabled?: boolean
}

export function BeachSelect({ value, onValueChange, id, className, disabled }: BeachSelectProps = {}) {
  const { user, updateUser } = useAuth()
  const [beaches, setBeaches] = useState<UserBeach[]>([])
  const [isChanging, setIsChanging] = useState(false)

  const isControlled = onValueChange !== undefined
  const selectedId = isControlled ? (value ?? null) : (user?.beach?.id ?? null)

  // A lista depende da localização salva no servidor pelo LocationSync. Na primeira carga ela
  // pode ainda não ter chegado (lista vazia), então também recarregamos ao abrir o select.
  const loadBeaches = useCallback(() => {
    getPraiasProximas()
      .then(setBeaches)
      .catch(() => {})
  }, [])

  useEffect(() => {
    loadBeaches()
  }, [loadBeaches])

  async function handleChange(idPraia: number | null) {
    if (!idPraia || idPraia === selectedId) return

    if (isControlled) {
      onValueChange(idPraia)
      return
    }

    setIsChanging(true)
    try {
      await updateUserBeach(idPraia)
      const refreshedUser = await getCurrentUser()
      updateUser(refreshedUser)
    } catch {
      // exibir feedback de erro ao trocar de praia
    } finally {
      setIsChanging(false)
    }
  }

  if (!user) return null

  // A praia atual pode não estar entre as próximas (mais de 20 km ou sem coordenadas).
  // Ela entra como primeiro item para o valor selecionado continuar tendo uma opção.
  const currentBeach = user.beach
  const showCurrentBeach = currentBeach !== null && !beaches.some((b) => b.id === currentBeach.id)

  return (
    <Select
      value={selectedId}
      onValueChange={handleChange}
      onOpenChange={(open) => {
        if (open) loadBeaches()
      }}
      disabled={disabled || isChanging}
    >
      <SelectTrigger
        id={id}
        className={cn(
          "h-9 max-w-full gap-1.5 border-none bg-white/10 px-2.5 text-sm font-medium text-white hover:bg-white/15",
          className
        )}
      >
        <MapPin className="size-4 shrink-0 text-white" />
        <SelectValue placeholder="Escolha uma praia" className="truncate">
          {(value: number | null) => {
            const beach =
              beaches.find((b) => b.id === value) ??
              (value === user.beach?.id ? user.beach : undefined)
            return beach ? `${beach.name}, ${beach.city}` : "Escolha uma praia"
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="min-w-64" sideOffset={8}>
        {showCurrentBeach && (
          <SelectItem value={currentBeach.id} className="py-2 text-sm">
            <span className="flex w-full items-center justify-between gap-3">
              <span className="truncate">
                {currentBeach.name}, {currentBeach.city}
              </span>
              <span className="shrink-0 text-xs text-muted-foreground">atual</span>
            </span>
          </SelectItem>
        )}
        {/* A API já devolve ordenado da mais próxima para a mais distante: não reordenar. */}
        {beaches.map((beach) => (
          <SelectItem key={beach.id} value={beach.id} className="py-2 text-sm">
            <span className="flex w-full items-center justify-between gap-3">
              <span className="truncate">
                {beach.name}, {beach.city}
              </span>
              {beach.distanceKm != null && (
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatDistanceKm(beach.distanceKm)}
                </span>
              )}
            </span>
          </SelectItem>
        ))}
        {beaches.length === 0 && (
          <p className="px-2 py-3 text-center text-xs text-muted-foreground">
            Nenhuma praia a até 20 km. Ative a localização do dispositivo.
          </p>
        )}
      </SelectContent>
    </Select>
  )
}
