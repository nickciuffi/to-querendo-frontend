import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { WantItModal } from "@/components/want-it-modal"
import type { MapVendor, Product, SellerProduct } from "@/lib/types"

const priceFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

function toBaseProduct(sellerProduct: SellerProduct): Product {
  return {
    id: String(sellerProduct.baseProductId),
    name: sellerProduct.baseProductName,
    description: sellerProduct.description,
    photoUrl: sellerProduct.photoUrl,
    minPrice: sellerProduct.price,
    active: sellerProduct.active && sellerProduct.baseProductActive,
  }
}

export function VendorProductsModal({
  vendor,
  open,
  onOpenChange,
}: {
  vendor: MapVendor
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [wantedProduct, setWantedProduct] = useState<Product | null>(null)

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{vendor.name}</DialogTitle>
            <DialogDescription>
              Escolha um produto para contar que você tá querendo.
            </DialogDescription>
          </DialogHeader>

          <ul className="flex flex-col gap-2">
            {vendor.products.map((product) => {
              const sellable = product.active && product.baseProductActive

              return (
                <li
                  key={product.id}
                  className="flex items-center gap-2 rounded-lg border border-border p-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {product.name}
                    </p>
                    {product.description && (
                      <p className="truncate text-xs text-muted-foreground">
                        {product.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {priceFormatter.format(product.price)}
                    </p>
                  </div>
                  {sellable ? (
                    <Button
                      size="sm"
                      className="shrink-0 bg-brand-orange text-white hover:bg-brand-orange/90"
                      onClick={() => {
                        setWantedProduct(toBaseProduct(product))
                        onOpenChange(false)
                      }}
                    >
                      Tô Querendo
                    </Button>
                  ) : (
                    <Badge variant="secondary" className="shrink-0">
                      Indisponível
                    </Badge>
                  )}
                </li>
              )
            })}
          </ul>
        </DialogContent>
      </Dialog>

      {wantedProduct && (
        <WantItModal
          product={wantedProduct}
          open={wantedProduct !== null}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) setWantedProduct(null)
          }}
        />
      )}
    </>
  )
}
