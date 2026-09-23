import { ImageOff, Pencil, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Product } from "@/lib/types"

export function ProductBaseCard({
  product,
  onEdit,
  onDelete,
}: {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}) {
  return (
    <Card className="gap-1.5 rounded-xl border-2 border-white/10 bg-[#0F172A] ring-0 py-0">
      <div className="flex h-32 items-center justify-center overflow-hidden rounded-t-lg bg-gradient-to-b from-[#FC800C]/25 to-[#FC800C]/5">
        {product.photoUrl ? (
          <img
            src={product.photoUrl}
            alt={product.name}
            className="size-full object-cover"
          />
        ) : (
          <ImageOff className="size-8 text-white/40" />
        )}
      </div>
      <CardContent className="flex flex-col gap-1.5 px-3 pb-3">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate font-heading text-sm font-semibold text-white">
            {product.name}
          </p>
          <div className="flex shrink-0 items-center gap-1">
            <Badge variant={product.active ? "default" : "outline"}>
              {product.active ? "Ativo" : "Inativo"}
            </Badge>
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
        <p className="line-clamp-2 text-xs text-white/60">{product.description}</p>
        <p className="text-sm font-semibold text-[#FC800C]">
          A partir de R$ {product.minPrice.toFixed(2)}
        </p>
      </CardContent>
    </Card>
  )
}
