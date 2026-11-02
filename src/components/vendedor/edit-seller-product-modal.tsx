import { useEffect, useId, useState } from "react"

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
import { getProdutosBaseAtivos } from "@/services/product-service"
import { updateProdutoEspecifico } from "@/services/seller-product-service"
import type { SellerProduct } from "@/lib/types"
import { parsePrice, priceFormatter, validatePrice } from "./seller-product-price"

/**
 * Modal de edição de um produto do vendedor. O estado do formulário é inicializado a partir
 * de `product`, então quem usa deve passar `key={product?.id}` para reiniciá-lo a cada produto.
 */
export function EditSellerProductModal({
  product,
  onOpenChange,
  onUpdated,
}: {
  product: SellerProduct | null
  onOpenChange: (open: boolean) => void
  onUpdated: (product: SellerProduct) => void
}) {
  const baseProductId = useId()
  const nameId = useId()
  const descriptionId = useId()
  const priceId = useId()
  const photoId = useId()
  const activeId = useId()

  const [name, setName] = useState(product?.name ?? "")
  const [description, setDescription] = useState(product?.description ?? "")
  const [price, setPrice] = useState(product ? product.price.toFixed(2) : "")
  const photo = useImageUpload("produtos-especificos")
  // "Remover foto" só apaga a foto atual ao salvar; até lá dá para desfazer.
  const [removeCurrentPhoto, setRemoveCurrentPhoto] = useState(false)
  const [active, setActive] = useState(product?.active ?? true)
  const [minPrice, setMinPrice] = useState<number | null>(null)
  const [nameError, setNameError] = useState(false)
  const [priceError, setPriceError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // O produto do vendedor não traz o preço mínimo, então buscamos no produto base.
  // Se o produto base estiver inativo ele não vem na lista, e só a API valida o mínimo.
  const baseProductIdToLoad = product?.baseProductId
  useEffect(() => {
    if (baseProductIdToLoad === undefined) return

    let cancelled = false
    getProdutosBaseAtivos()
      .then((bases) => {
        const base = bases.find((item) => Number(item.id) === baseProductIdToLoad)
        if (!cancelled && base) setMinPrice(base.minPrice)
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [baseProductIdToLoad])

  async function handleConfirm() {
    if (!product) return

    const trimmedName = name.trim()
    const hasNameError = !trimmedName
    const nextPriceError = validatePrice(price, minPrice)

    setNameError(hasNameError)
    setPriceError(nextPriceError)

    if (hasNameError || nextPriceError) return

    setIsSubmitting(true)
    setSubmitError(null)
    try {
      // Upload antes de salvar: se falhar, o produto não é alterado. Sem arquivo novo, a foto
      // só muda se o vendedor pediu para removê-la (`""`); senão o campo é omitido e a API a mantém.
      const uploadedUrl = await photo.upload()
      const urlFoto = uploadedUrl ?? (removeCurrentPhoto ? "" : undefined)
      const updated = await updateProdutoEspecifico(product.id, {
        nome: trimmedName,
        descricao: description.trim(),
        urlFoto,
        preco: parsePrice(price),
        produtoAtivo: active,
      })
      onUpdated(updated)
      onOpenChange(false)
    } catch (err) {
      setSubmitError(
        err instanceof ApiError || err instanceof ImageUploadError
          ? err.message
          : "Não foi possível salvar o produto."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={product !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar produto</DialogTitle>
          <DialogDescription>Atualize as informações do seu produto.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={baseProductId}>Produto base:</Label>
          <Input id={baseProductId} value={product?.baseProductName ?? ""} disabled readOnly />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={nameId}>Nome: *</Label>
          <Input
            id={nameId}
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              if (nameError) setNameError(false)
            }}
            placeholder="Ex: Sorvete Kibon limão"
            aria-invalid={nameError}
          />
          {nameError && <span className="text-xs text-destructive">Nome é obrigatório.</span>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={descriptionId}>Descrição: (opcional)</Label>
          <Textarea
            id={descriptionId}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Ex: Picolé de limão bem gelado"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={priceId}>Preço: *</Label>
          <Input
            id={priceId}
            value={price}
            onChange={(event) => {
              setPrice(event.target.value)
              if (priceError) setPriceError(null)
            }}
            onBlur={() => {
              if (price.trim()) setPriceError(validatePrice(price, minPrice))
            }}
            placeholder={minPrice !== null ? minPrice.toFixed(2) : "Ex: 5.00"}
            inputMode="decimal"
            className="w-28"
            aria-invalid={priceError !== null}
          />
          {priceError ? (
            <span className="text-xs text-destructive">{priceError}</span>
          ) : (
            minPrice !== null && (
              <span className="text-xs text-muted-foreground">
                Preço mínimo para {product?.baseProductName}: {priceFormatter.format(minPrice)}
              </span>
            )
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <ImageFileInput
            id={photoId}
            label="Foto: (opcional)"
            file={photo.file}
            onFileChange={photo.setFile}
            currentImageUrl={removeCurrentPhoto ? null : product?.photoUrl}
            onRemoveCurrent={product?.photoUrl ? () => setRemoveCurrentPhoto(true) : undefined}
            disabled={isSubmitting}
          />
          {removeCurrentPhoto && !photo.file && (
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              A foto atual será removida ao salvar.
              <Button
                type="button"
                variant="link"
                size="sm"
                className="h-auto p-0 text-xs"
                onClick={() => setRemoveCurrentPhoto(false)}
                disabled={isSubmitting}
              >
                Desfazer
              </Button>
            </p>
          )}
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
        {submitError && <span className="text-xs text-destructive">{submitError}</span>}

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />} disabled={isSubmitting}>
            Cancelar
          </DialogClose>
          <Button onClick={handleConfirm} disabled={isSubmitting}>
            {photo.isUploading ? "Enviando imagem..." : isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
