import * as React from "react"
import { Store } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/use-auth"
import { upgradeToVendedor } from "@/services/auth-service"
import { ApiError } from "@/services/http-client"

const MAX_DESCRIPTION_LENGTH = 500

export function BecomeSellerCard() {
  const { login } = useAuth()
  const descriptionId = React.useId()

  const [description, setDescription] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleUpgrade() {
    setIsSubmitting(true)
    setError(null)
    try {
      const { user, session } = await upgradeToVendedor(description.trim() || undefined)
      // Substitui token e usuário no contexto e no localStorage. Como as roles vêm do token,
      // a tela passa a mostrar a área de vendedor sem precisar de um novo login.
      login({ user, session })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível concluir o cadastro de vendedor.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-[#1b2335] p-4">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#FC800C]/15 text-[#FC800C]">
          <Store className="size-5" />
        </div>
        <div>
          <p className="font-semibold">Venda na praia com o Tô Querendo</p>
          <p className="text-sm leading-snug text-white/55">
            Cadastre seus produtos e receba pedidos dos turistas que estão perto de você.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={descriptionId} className="text-white/80">
          Descrição do seu negócio (opcional)
        </Label>
        <Textarea
          id={descriptionId}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={MAX_DESCRIPTION_LENGTH}
          placeholder="Ex: Bebidas geladinhas e petiscos na areia"
          disabled={isSubmitting}
          className="border-white/15 bg-white/5 text-white placeholder:text-white/35 focus-visible:border-[#FC800C] focus-visible:ring-[#FC800C]/30"
        />
        <span className="self-end text-xs text-white/40">
          {description.length}/{MAX_DESCRIPTION_LENGTH}
        </span>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button
        onClick={handleUpgrade}
        disabled={isSubmitting}
        className="h-10 w-full bg-[#FC800C] text-white hover:bg-[#FC800C]/90"
      >
        {isSubmitting ? "Cadastrando..." : "Virar vendedor"}
      </Button>
    </div>
  )
}
