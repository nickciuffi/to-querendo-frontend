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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ApiError } from "@/services/http-client"
import { getProdutosBaseAtivos } from "@/services/product-service"
import { createProdutoEspecifico } from "@/services/seller-product-service"
import type { Product, SellerProduct } from "@/lib/types"
import { parsePrice, priceFormatter, validatePrice } from "./seller-product-price"

export function CreateSellerProductModal({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (product: SellerProduct) => void
}) {
  const baseProductId = useId()
  const nameId = useId()
  const descriptionId = useId()
  const photoUrlId = useId()
  const priceId = useId()

  const [baseProducts, setBaseProducts] = useState<Product[]>([])
  const [isLoadingBaseProducts, setIsLoadingBaseProducts] = useState(true)
  const [baseProductsError, setBaseProductsError] = useState<string | null>(null)

  const [selectedBaseId, setSelectedBaseId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [photoUrl, setPhotoUrl] = useState("")
  const [price, setPrice] = useState("")
  const [baseProductError, setBaseProductError] = useState(false)
  const [nameError, setNameError] = useState(false)
  const [priceError, setPriceError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const selectedBase = baseProducts.find((product) => product.id === selectedBaseId) ?? null

  useEffect(() => {
    if (!open) return

    let cancelled = false

    // O estado de carregamento é reiniciado no resetForm, ao fechar o modal.
    getProdutosBaseAtivos()
      .then((result) => {
        if (!cancelled) {
          setBaseProducts(result)
          setBaseProductsError(null)
        }
      })
      .catch(() => {
        if (!cancelled) setBaseProductsError("Não foi possível carregar os produtos base.")
      })
      .finally(() => {
        if (!cancelled) setIsLoadingBaseProducts(false)
      })

    return () => {
      cancelled = true
    }
  }, [open])

  function resetForm() {
    setSelectedBaseId(null)
    setName("")
    setDescription("")
    setPhotoUrl("")
    setPrice("")
    setBaseProductError(false)
    setNameError(false)
    setPriceError(null)
    setSubmitError(null)
    setIsLoadingBaseProducts(true)
    setBaseProductsError(null)
  }

  async function handleConfirm() {
    const trimmedName = name.trim()
    const trimmedDescription = description.trim()

    const hasNameError = !trimmedName
    const nextPriceError = validatePrice(price, selectedBase?.minPrice ?? null)

    setBaseProductError(!selectedBase)
    setNameError(hasNameError)
    setPriceError(nextPriceError)

    if (!selectedBase || hasNameError || nextPriceError) return

    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const product = await createProdutoEspecifico({
        idProdutoBase: Number(selectedBase.id),
        nome: trimmedName,
        descricao: trimmedDescription || undefined,
        urlFoto: photoUrl.trim() || undefined,
        preco: parsePrice(price),
      })
      onCreated(product)
      onOpenChange(false)
      resetForm()
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Não foi possível adicionar o produto.")
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
          <DialogTitle>Adicionar produto</DialogTitle>
          <DialogDescription>
            Escolha um produto base e cadastre o seu produto com o seu preço.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={baseProductId}>Produto base: *</Label>
          <Select
            value={selectedBaseId}
            onValueChange={(value: string | null) => {
              setSelectedBaseId(value)
              if (baseProductError) setBaseProductError(false)
              // O preço mínimo depende do produto base, então revalidamos o preço já digitado.
              if (price.trim()) {
                const nextBase = baseProducts.find((product) => product.id === value) ?? null
                setPriceError(validatePrice(price, nextBase?.minPrice ?? null))
              }
            }}
            disabled={isLoadingBaseProducts || baseProducts.length === 0}
          >
            <SelectTrigger id={baseProductId} className="w-full" aria-invalid={baseProductError}>
              <SelectValue placeholder="Selecione um produto base">
                {(value: string | null) => {
                  if (isLoadingBaseProducts) return "Carregando produtos base..."
                  const base = baseProducts.find((product) => product.id === value)
                  return base ? base.name : "Selecione um produto base"
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {baseProducts.map((product) => (
                <SelectItem key={product.id} value={product.id} className="py-2">
                  <span className="flex w-full items-center justify-between gap-3">
                    <span className="truncate">{product.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      mín. {priceFormatter.format(product.minPrice)}
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {baseProductError && (
            <span className="text-xs text-destructive">Selecione um produto base.</span>
          )}
          {baseProductsError && (
            <span className="text-xs text-destructive">{baseProductsError}</span>
          )}
          {!isLoadingBaseProducts && !baseProductsError && baseProducts.length === 0 && (
            <span className="text-xs text-muted-foreground">
              Nenhum produto base ativo disponível.
            </span>
          )}
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
              if (price.trim()) setPriceError(validatePrice(price, selectedBase?.minPrice ?? null))
            }}
            placeholder={selectedBase ? selectedBase.minPrice.toFixed(2) : "Ex: 5.00"}
            inputMode="decimal"
            className="w-28"
            aria-invalid={priceError !== null}
          />
          {priceError ? (
            <span className="text-xs text-destructive">{priceError}</span>
          ) : (
            selectedBase && (
              <span className="text-xs text-muted-foreground">
                Preço mínimo para {selectedBase.name}: {priceFormatter.format(selectedBase.minPrice)}
              </span>
            )
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={photoUrlId}>URL da foto: (opcional)</Label>
          <Input
            id={photoUrlId}
            value={photoUrl}
            onChange={(event) => setPhotoUrl(event.target.value)}
            placeholder="https://..."
            inputMode="url"
          />
        </div>
        {submitError && <span className="text-xs text-destructive">{submitError}</span>}

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />} disabled={isSubmitting}>
            Cancelar
          </DialogClose>
          <Button onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? "Adicionando..." : "Adicionar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
