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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useImageUpload } from "@/hooks/use-image-upload"
import { ImageUploadError } from "@/services/arquivo-service"
import { ApiError } from "@/services/http-client"
import { createProdutoBase } from "@/services/product-service"
import type { Product } from "@/lib/types"

export function CreateProductBaseModal({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (product: Product) => void
}) {
  const nameId = useId()
  const descriptionId = useId()
  const priceId = useId()
  const photoId = useId()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const photo = useImageUpload("produtos-base")
  const [nameError, setNameError] = useState(false)
  const [descriptionError, setDescriptionError] = useState(false)
  const [priceError, setPriceError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function resetForm() {
    setName("")
    setDescription("")
    setMinPrice("")
    photo.reset()
    setNameError(false)
    setDescriptionError(false)
    setPriceError(false)
    setSubmitError(null)
  }

  async function handleConfirm() {
    const trimmedName = name.trim()
    const trimmedDescription = description.trim()
    const price = Number(minPrice.replace(",", "."))

    const hasNameError = !trimmedName
    const hasDescriptionError = !trimmedDescription
    const hasPriceError = !minPrice.trim() || Number.isNaN(price) || price < 0

    setNameError(hasNameError)
    setDescriptionError(hasDescriptionError)
    setPriceError(hasPriceError)

    if (hasNameError || hasDescriptionError || hasPriceError) return

    setIsSubmitting(true)
    setSubmitError(null)
    try {
      // Upload antes de salvar: se falhar, o endpoint de criação/edição não é chamado.
      const urlFoto = await photo.upload()
      const product = await createProdutoBase({
        nome: trimmedName,
        descricao: trimmedDescription,
        precoMinimo: price,
        urlFoto,
      })
      onCreated(product)
      onOpenChange(false)
      resetForm()
    } catch (err) {
      setSubmitError(
        err instanceof ApiError || err instanceof ImageUploadError ? err.message : "Não foi possível criar o produto base."
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
          <DialogTitle>Criar produto base</DialogTitle>
          <DialogDescription>
            Cadastre um novo produto base disponível para as praias.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={nameId}>Nome: *</Label>
          <Input
            id={nameId}
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              if (nameError) setNameError(false)
            }}
            placeholder="Ex: Espetinho"
            aria-invalid={nameError}
          />
          {nameError && (
            <span className="text-xs text-destructive">Nome é obrigatório.</span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={descriptionId}>Descrição: *</Label>
          <Textarea
            id={descriptionId}
            value={description}
            onChange={(event) => {
              setDescription(event.target.value)
              if (descriptionError) setDescriptionError(false)
            }}
            placeholder="Ex: Comida espetada em um palito"
            aria-invalid={descriptionError}
          />
          {descriptionError && (
            <span className="text-xs text-destructive">Descrição é obrigatória.</span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={priceId}>Preço mínimo: *</Label>
          <Input
            id={priceId}
            value={minPrice}
            onChange={(event) => {
              setMinPrice(event.target.value)
              if (priceError) setPriceError(false)
            }}
            placeholder="Ex: 5.00"
            inputMode="decimal"
            className="w-28"
            aria-invalid={priceError}
          />
          {priceError && (
            <span className="text-xs text-destructive">Informe um preço mínimo válido.</span>
          )}
        </div>
        <ImageFileInput
          id={photoId}
          label="Foto: (opcional)"
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
            {photo.isUploading ? "Enviando imagem..." : isSubmitting ? "Criando..." : "Criar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
