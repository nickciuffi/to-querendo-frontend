import { useId, useState } from "react"

import { ImageFileInput } from "@/components/image-file-input"
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
import { useImageUpload } from "@/hooks/use-image-upload"
import { ImageUploadError } from "@/services/arquivo-service"
import { ApiError } from "@/services/http-client"
import { createPurchaseIntention } from "@/services/purchase-intention-service"
import type { Product } from "@/lib/types"

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
  const photo = useImageUpload("intencoes-compra")
  const [error, setError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function resetForm() {
    setDescription("")
    setObservations("")
    photo.reset()
    setError(false)
    setSubmitError(null)
  }

  async function handleConfirm() {
    if (isSubmitting) return
    if (!description.trim()) {
      setError(true)
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    try {
      // Primeiro a foto (opcional): se o upload falhar, a intenção não é criada. Se a criação
      // falhar depois, a próxima tentativa reaproveita a foto já enviada.
      const urlFotoLocal = await photo.upload()
      await createPurchaseIntention({
        idProdutoBase: product.id,
        descricaoLocal: description.trim(),
        observacoes: observations.trim() || undefined,
        urlFotoLocal,
      })
      onOpenChange(false)
      resetForm()
    } catch (err) {
      setSubmitError(
        err instanceof ApiError || err instanceof ImageUploadError
          ? err.message
          : "Não foi possível enviar. Tente novamente."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        // Não deixa fechar no meio do envio.
        if (isSubmitting && !nextOpen) return
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
        <ImageFileInput
          id={photoId}
          label="Foto do local: (opcional)"
          file={photo.file}
          onFileChange={photo.setFile}
          disabled={isSubmitting}
        />
        {submitError && (
          <span className="text-xs text-destructive">{submitError}</span>
        )}

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />} disabled={isSubmitting}>
            Cancelar
          </DialogClose>
          <Button onClick={handleConfirm} disabled={isSubmitting}>
            {photo.isUploading ? "Enviando imagem..." : isSubmitting ? "Enviando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
