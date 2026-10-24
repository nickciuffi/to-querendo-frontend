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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ApiError } from "@/services/http-client"
import { createPurchaseIntention } from "@/services/purchase-intention-service"
import type { Product } from "@/lib/types"

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function WantItModal({
  product,
  open,
  onOpenChange,
}: {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const descriptionId = useId()
  const observationsId = useId()
  const photoId = useId()

  const [description, setDescription] = useState("")
  const [observations, setObservations] = useState("")
  const [photo, setPhoto] = useState<File | null>(null)
  const [error, setError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function resetForm() {
    setDescription("")
    setObservations("")
    setPhoto(null)
    setError(false)
    setSubmitError(null)
  }

  async function handleConfirm() {
    if (!description.trim()) {
      setError(true)
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    try {
      await createPurchaseIntention({
        idProdutoBase: product.id,
        descricaoLocal: description.trim(),
        observacoes: observations.trim() || undefined,
        urlFotoLocal: photo ? await readFileAsDataUrl(photo) : undefined,
      })
      onOpenChange(false)
      resetForm()
    } catch (err) {
      setSubmitError(
        err instanceof ApiError ? err.message : "Não foi possível enviar. Tente novamente."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen)
        if (!nextOpen) resetForm()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tô Querendo {product.name}</DialogTitle>
          <DialogDescription>
            Conte aos vendedores onde você está.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={descriptionId}>Descrição: *</Label>
          <Textarea
            id={descriptionId}
            value={description}
            onChange={(event) => {
              setDescription(event.target.value)
              if (error) setError(false)
            }}
            placeholder="Ex: próximo ao quiosque do João, no guarda-sol verde, etc."
            aria-invalid={error}
          />
          {error && (
            <span className="text-xs text-destructive">
              Descrição é obrigatória.
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={observationsId}>Observações:</Label>
          <Textarea
            id={observationsId}
            value={observations}
            onChange={(event) => {
              setObservations(event.target.value)
              if (error) setError(false)
            }}
            placeholder="Ex: com manteiga, sem açucar, bem gelado, etc."
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={photoId}>Foto do local: (opcional)</Label>
          <input
            id={photoId}
            type="file"
            accept="image/*"
            onChange={(event) => setPhoto(event.target.files?.[0] ?? null)}
            className="text-sm text-muted-foreground file:mr-2 file:rounded-lg file:border-0 file:bg-muted file:px-2.5 file:py-1 file:text-sm file:font-medium file:text-foreground"
          />
        </div>
        {submitError && (
          <span className="text-xs text-destructive">{submitError}</span>
        )}

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />} disabled={isSubmitting}>
            Cancelar
          </DialogClose>
          <Button onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
