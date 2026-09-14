import { Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getOnlineSellersCount } from "@/lib/mock-data"
import type { Product } from "@/lib/types"

export function ProductCard({ product }: { product: Product }) {
  const onlineSellers = getOnlineSellersCount(product.id)

  return (
    <Card className="gap-1.5 rounded-xl border-2 border-[#FC800C] bg-[#0F172A] ring-0 py-0">
      <div className="flex h-40 items-center justify-center rounded-lg bg-gradient-to-b from-[#FC800C]/25 to-[#FC800C]/5 text-3xl">
        {product.emoji}
      </div>

      <CardContent className="flex flex-col gap-1.5 px-3 pb-3">
        <div className="min-w-0">
          <p className="truncate font-heading text-sm font-semibold text-white">
            {product.name}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-white/60">
            <Users className="size-3" />
            <span className="truncate">{onlineSellers} vendedores online</span>
          </div>
        </div>

        <Button
          size="sm"
          className="w-full rounded-full bg-[#FC800C] text-white hover:bg-[#FC800C]/90"
        >
          Tô Querendo
        </Button>
      </CardContent>
    </Card>
  )
}
