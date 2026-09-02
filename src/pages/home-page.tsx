import * as React from "react"
import { LogOut, MapPin } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProductCard } from "@/components/product-card"
import { useAuth } from "@/hooks/use-auth"
import { getBeachById, PRODUCTS } from "@/lib/mock-data"
import type { ProductCategory } from "@/lib/types"

const CATEGORIES: { id: ProductCategory | "todos"; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "bebida", label: "Bebidas" },
  { id: "comida", label: "Comidas" },
  { id: "acai", label: "Açaí" },
  { id: "acessorio", label: "Acessórios" },
]

export function HomePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const beach = user ? getBeachById(user.beachId) : undefined
  const [category, setCategory] = React.useState<ProductCategory | "todos">("todos")

  const products =
    category === "todos" ? PRODUCTS : PRODUCTS.filter((product) => product.category === category)

  const firstName = user?.name.split(" ")[0] ?? "visitante"
  const initial = (user?.name.trim()[0] ?? "?").toUpperCase()

  function handleLogout() {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur">
        <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-4">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Olá, {firstName} 👋</p>
            <div className="flex items-center gap-1 text-sm font-medium text-foreground">
              <MapPin className="size-3.5 text-brand-blue" />
              <span className="truncate">{beach ? `${beach.name}, ${beach.city}` : "Escolha uma praia"}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
              <Avatar className="cursor-pointer">
                <AvatarFallback className="bg-brand-orange/15 text-brand-orange">
                  {initial}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  <p className="truncate font-medium text-foreground">{user?.name}</p>
                  <p className="truncate text-xs font-normal text-muted-foreground">{user?.email}</p>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                <LogOut />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <div className="flex gap-2 overflow-x-auto px-4 py-3">
          {CATEGORIES.map((item) => (
            <Badge
              key={item.id}
              onClick={() => setCategory(item.id)}
              variant={category === item.id ? "default" : "outline"}
              className={
                category === item.id
                  ? "h-7 shrink-0 cursor-pointer bg-brand-orange px-3 text-white"
                  : "h-7 shrink-0 cursor-pointer px-3 text-muted-foreground"
              }
            >
              {item.label}
            </Badge>
          ))}
        </div>
      </div>

      <section className="grid grid-cols-1 gap-3 px-4 pt-3 pb-4 sm:grid-cols-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {products.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
            Nenhum produto encontrado nessa categoria.
          </p>
        )}
      </section>
    </div>
  )
}
