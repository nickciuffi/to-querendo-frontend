import { Star } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { getVendorById } from "@/lib/mock-data"
import type { Product } from "@/lib/types"

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

export function ProductCard({ product }: { product: Product }) {
  const vendor = getVendorById(product.vendorId)

  return (
    <Card className="gap-3">
      <CardHeader className="grid-cols-[auto_1fr] items-center gap-3">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-brand-yellow/25 text-3xl">
          {product.emoji}
        </div>
        <div className="min-w-0">
          <p className="truncate font-heading text-sm font-semibold text-foreground">
            {product.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">{product.description}</p>
        </div>
      </CardHeader>

      <CardContent className="flex items-center justify-between gap-2">
        <span className="text-base font-semibold text-brand-orange">
          {currency.format(product.price)}
        </span>
        {vendor && (
          <Badge variant="outline" className="gap-1 text-muted-foreground">
            <Star className="size-3 fill-brand-yellow text-brand-yellow" />
            {vendor.rating.toFixed(1)} · {vendor.name}
          </Badge>
        )}
      </CardContent>

      <CardFooter>
        <Button className="w-full bg-brand-orange text-white hover:bg-brand-orange/90">
          Tô Querendo
        </Button>
      </CardFooter>
    </Card>
  )
}
