import * as React from "react"
import { Power } from "lucide-react"

import { FloatingButton } from "@/components/floating-button"
import { useAuth } from "@/hooks/use-auth"
import { updateCurrentUser } from "@/services/auth-service"

/** Alterna o status online/offline do vendedor logado. */
export function SellerOnlineFloatingButton() {
  const { user, hasRole, updateUser } = useAuth()
  const [isSaving, setIsSaving] = React.useState(false)

  if (!user || !hasRole("ROLE_VENDEDOR")) return null

  const isOnline = user.online ?? false

  async function handleToggle() {
    if (!user) return

    const nextOnline = !isOnline
    setIsSaving(true)
    try {
      await updateCurrentUser({ online: nextOnline })
      updateUser({ ...user, online: nextOnline })
    } catch (err) {
      console.warn("Não foi possível alterar o status online.", err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <FloatingButton onClick={handleToggle} disabled={isSaving} aria-pressed={isOnline}>
      <span className="relative flex size-5 items-center justify-center">
        <Power className="size-5" />
        <span
          className={`absolute -top-0.5 -right-0.5 size-2 rounded-full ring-2 ring-[#FC800C] ${
            isOnline ? "bg-emerald-400" : "bg-white/60"
          }`}
        />
      </span>
      {isSaving ? "Salvando..." : isOnline ? "Ficar offline" : "Ficar online"}
    </FloatingButton>
  )
}
