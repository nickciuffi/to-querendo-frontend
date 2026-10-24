import { useEffect, useState } from "react"
import { MapPin } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"
import { getCurrentUser } from "@/services/auth-service"
import { getPraias, updateUserBeach } from "@/services/beach-service"
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

  useEffect(() => {
    getPraias()
      .then(setBeaches)
      .catch(() => {})
  }, [])

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

  return (
    <Select
      value={selectedId}
      onValueChange={handleChange}
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
        {beaches.map((beach) => (
          <SelectItem key={beach.id} value={beach.id} className="py-2 text-sm">
            {beach.name}, {beach.city}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
