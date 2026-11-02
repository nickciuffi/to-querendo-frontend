import { useId, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ApiError } from "@/services/http-client"
import { concludePurchaseIntention } from "@/services/purchase-intention-service"
import type { PurchaseIntention } from "@/lib/types"

const OTHER_REASON = "outro"
const MAX_OTHER_REASON_LENGTH = 200

// O texto da opção é o que vai para a API em `motivo`.
const REASONS = ["Já comprei", "Não quero mais", "Vou embora da praia"]

/**
 * Confirmação para concluir uma intenção de compra. O estado do formulário vale para uma
 * intenção, então quem usa deve passar `key={intention?.id}` para reiniciá-lo a cada pedido.
 */
export function ConcludeIntentionModal({
  intention,
  onOpenChange,
  onConcluded,
}: {
  intention: PurchaseIntention | null
  onOpenChange: (open: boolean) => void
  onConcluded: (intention: PurchaseIntention) => void
}) {
  const reasonId = useId()
  const otherReasonId = useId()

  const [reason, setReason] = useState<string | null>(null)
  const [otherReason, setOtherReason] = useState("")
  const [reasonError, setReasonError] = useState(false)
  const [otherReasonError, setOtherReasonError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const isOtherReason = reason === OTHER_REASON

  async function handleConfirm() {
    if (!intention) return

    const trimmedOtherReason = otherReason.trim()
    const hasReasonError = reason === null
    const hasOtherReasonError = isOtherReason && !trimmedOtherReason

    setReasonError(hasReasonError)
    setOtherReasonError(hasOtherReasonError)

    if (reason === null || hasOtherReasonError) return

    setIsSubmitting(true)
    setSubmitError(null)
    try {
      await concludePurchaseIntention({
        idProdutoBase: intention.baseProductId,
        motivo: isOtherReason ? trimmedOtherReason : reason,
      })
      onConcluded(intention)
      onOpenChange(false)
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Não foi possível concluir o pedido.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={intention !== null}
      onOpenChange={(open) => {
        if (!isSubmitting) onOpenChange(open)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Concluir pedido</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja concluir o pedido de "{intention?.baseProductName}"? Os vendedores
            deixarão de ver este pedido.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor={reasonId}>Motivo: *</Label>
          <Select
            value={reason}
            onValueChange={(value: string | null) => {
              setReason(value)
              if (reasonError) setReasonError(false)
              setOtherReasonError(false)
            }}
          >
            <SelectTrigger id={reasonId} className="w-full" aria-invalid={reasonError}>
              <SelectValue placeholder="Selecione um motivo">
                {(value: string | null) =>
                  value === OTHER_REASON ? "Outro motivo" : (value ?? "Selecione um motivo")
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {REASONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
              <SelectItem value={OTHER_REASON}>Outro motivo</SelectItem>
            </SelectContent>
          </Select>
          {reasonError && <span className="text-xs text-destructive">Selecione um motivo.</span>}
        </div>

        {isOtherReason && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={otherReasonId}>Explique o motivo: *</Label>
            <Input
              id={otherReasonId}
              value={otherReason}
              onChange={(event) => {
                setOtherReason(event.target.value)
                if (otherReasonError) setOtherReasonError(false)
              }}
              maxLength={MAX_OTHER_REASON_LENGTH}
              placeholder="Ex: Encontrei um quiosque aqui perto"
              aria-invalid={otherReasonError}
              autoFocus
            />
            <div className="flex items-start justify-between gap-2">
              {otherReasonError ? (
                <span className="text-xs text-destructive">Explique o motivo.</span>
              ) : (
                <span />
              )}
              <span className="shrink-0 text-xs text-muted-foreground">
                {otherReason.length}/{MAX_OTHER_REASON_LENGTH}
              </span>
            </div>
          </div>
        )}

        {submitError && <span className="text-xs text-destructive">{submitError}</span>}

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />} disabled={isSubmitting}>
            Cancelar
          </DialogClose>
          <Button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="bg-[#FC800C] text-white hover:bg-[#FC800C]/90"
          >
            {isSubmitting ? "Concluindo..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
