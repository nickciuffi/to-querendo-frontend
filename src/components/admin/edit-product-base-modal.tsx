import { useEffect, useId, useState } from "react"

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
import { ApiError } from "@/services/http-client"
import { updateProdutoBase } from "@/services/product-service"
import type { Product } from "@/lib/types"

export function EditProductBaseModal({
  product,
  onOpenChange,
  onUpdated,
}: {
  product: Product | null
  onOpenChange: (open: boolean) => void
  onUpdated: (product: Product) => void
}) {
  const nameId = useId()
  const descriptionId = useId()
  const priceId = useId()
  const photoUrlId = useId()
  const activeId = useId()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [photoUrl, setPhotoUrl] = useState("")
  const [active, setActive] = useState(true)
  const [nameError, setNameError] = useState(false)
  const [descriptionError, setDescriptionError] = useState(false)
  const [priceError, setPriceError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (product) {
      setName(product.name)
      setDescription(product.description)
      setMinPrice(String(product.minPrice))
      setPhotoUrl(product.photoUrl ?? "")
      setActive(product.active)
      setNameError(false)
      setDescriptionError(false)
      setPriceError(false)
      setSubmitError(null)
    }
  }, [product])

  async function handleConfirm() {
    if (!product) return

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
      const updated = await updateProdutoBase(product.id, {
        nome: trimmedName,
        descricao: trimmedDescription,
        precoMinimo: price,
        estaAtivo: active,
        urlFoto: photoUrl.trim() || undefined,
      })
      onUpdated(updated)
      onOpenChange(false)
    } catch (err) {
      setSubmitError(
        err instanceof ApiError ? err.message : "Não foi possível salvar o produto base."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={product !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar produto base</DialogTitle>
          <DialogDescription>
            Atualize as informações do produto base.
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
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={photoUrlId}>URL da foto: (opcional)</Label>
          <Input
            id={photoUrlId}
            value={photoUrl}
            onChange={(event) => setPhotoUrl(event.target.value)}
            placeholder="https://..."
          />
        </div>
        <Label htmlFor={activeId} className="cursor-pointer">
          <input
            id={activeId}
            type="checkbox"
            checked={active}
            onChange={(event) => setActive(event.target.checked)}
            className="size-4 accent-[#FC800C]"
          />
          Produto ativo
        </Label>
        {submitError && (
          <span className="text-xs text-destructive">{submitError}</span>
        )}

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />} disabled={isSubmitting}>
            Cancelar
          </DialogClose>
          <Button onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
