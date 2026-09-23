import { CalendarClock, Package } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { SellerProduct } from "@/lib/types"

const priceFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

export function SellerProductCard({ product }: { product: SellerProduct }) {
  return (
    <Card className="gap-1.5 rounded-xl border-2 border-white/10 bg-[#0F172A] ring-0 py-0">
      <div className="relative flex h-24 flex-col items-center justify-center gap-1 overflow-hidden rounded-t-lg bg-gradient-to-b from-[#FC800C]/25 to-[#FC800C]/5">
        <Package className="size-7 text-white/40" />
        <span className="max-w-full truncate px-3 text-xs font-medium text-white/60">
          {product.baseProductName}
        </span>
        <Badge
          variant={product.active ? "default" : "outline"}
          className="absolute top-2 right-2"
        >
          {product.active ? "Ativo" : "Inativo"}
        </Badge>
      </div>
      <CardContent className="flex flex-1 flex-col gap-1.5 px-3 pb-3">
        <p className="line-clamp-2 font-heading text-sm font-semibold text-white">
          {product.name}
        </p>
        <p className="line-clamp-2 text-xs text-white/60">{product.description}</p>
        {!product.baseProductActive && (
          <p className="text-xs text-destructive">
            O produto base "{product.baseProductName}" está inativo. Portanto esse produto não vai aparecer para os clientes.
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
