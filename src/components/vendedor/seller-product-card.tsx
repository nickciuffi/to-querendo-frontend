import { CalendarClock, Package, Pencil, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { SellerProduct } from "@/lib/types"
import { priceFormatter } from "./seller-product-price"

export function SellerProductCard({
  product,
  onEdit,
  onDelete,
}: {
  product: SellerProduct
  onEdit: (product: SellerProduct) => void
  onDelete: (product: SellerProduct) => void
}) {
  return (
    <Card className="gap-1.5 rounded-xl border-2 border-white/10 bg-[#0F172A] ring-0 py-0">
      <div className="relative flex h-24 flex-col items-center justify-center gap-1 overflow-hidden rounded-t-lg bg-gradient-to-b from-[#FC800C]/25 to-[#FC800C]/5">
        {product.photoUrl ? (
          <img src={product.photoUrl} alt={product.name} className="size-full object-cover" />
        ) : (
          <>
            <Package className="size-7 text-white/40" />
            <span className="max-w-full truncate px-3 text-xs font-medium text-white/60">
              {product.baseProductName}
            </span>
          </>
        )}
        <Badge
          variant={product.active ? "default" : "secondary"}
          className="absolute top-2 right-2"
        >
          {product.active ? "Ativo" : "Inativo"}
        </Badge>
      </div>
      <CardContent className="flex flex-1 flex-col gap-1.5 px-3 pb-3">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 font-heading text-sm font-semibold text-white">
            {product.name}
          </p>
          <div className="-mt-1 -mr-1 flex shrink-0 items-center">
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-white/60 hover:bg-white/10 hover:text-white"
              onClick={() => onEdit(product)}
            >
              <Pencil />
              <span className="sr-only">Editar produto</span>
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-white/60 hover:bg-destructive/20 hover:text-destructive"
              onClick={() => onDelete(product)}
            >
              <Trash2 />
              <span className="sr-only">Excluir produto</span>
            </Button>
          </div>
        </div>
          <p className="text-[0.65rem] font-medium uppercase tracking-wide text-white/40">
            {product.baseProductName}
          </p>
        <p className="line-clamp-2 text-xs text-white/60">{product.description}</p>
        {!product.baseProductActive && (
          <p className="text-xs text-destructive">
            O produto base "{product.baseProductName}" está inativo. então este produto não vai aparecer para os clientes.
          </p>
        )}
        <p className="mt-auto text-sm font-semibold text-[#FC800C]">
          {priceFormatter.format(product.price)}
        </p>
        <span className="flex items-center gap-1 text-[0.65rem] text-white/40">
          <CalendarClock className="size-3" />
          Criado em {product.createdAt}
        </span>
      </CardContent>
    </Card>
  )
}
