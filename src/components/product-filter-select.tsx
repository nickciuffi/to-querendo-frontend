import { Package } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/types"

/** Valor do filtro que representa "todos os produtos" (nenhum `idProdutoBase` específico). */
export const ALL_PRODUCTS = "all"

interface ProductFilterSelectProps {
  products: Product[]
  /** `ALL_PRODUCTS` ou o `id` (string) do produto base selecionado. */
  value: string
  onValueChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export function ProductFilterSelect({
  products,
  value,
  onValueChange,
  disabled,
  className,
}: ProductFilterSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(next) => next && onValueChange(next)}
      disabled={disabled}
    >
      <SelectTrigger
        aria-label="Filtrar vendedores por produto"
        className={cn(
          "h-9 w-full gap-1.5 border-border bg-background/95 px-2.5 text-sm font-medium shadow-md backdrop-blur",
          className
        )}
      >
        <Package className="size-4 shrink-0 text-brand-blue" />
        <SelectValue placeholder="Todos os produtos" className="truncate">
          {(selected: string) =>
            selected === ALL_PRODUCTS
              ? "Todos os produtos"
              : (products.find((p) => p.id === selected)?.name ?? selected)
          }
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="min-w-56" sideOffset={6}>
        <SelectItem value={ALL_PRODUCTS} className="py-2 text-sm">
          Todos os produtos
        </SelectItem>
        {products.map((product) => (
          <SelectItem key={product.id} value={product.id} className="py-2 text-sm">
            {product.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
