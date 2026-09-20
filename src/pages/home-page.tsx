import * as React from "react"
import { LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BeachSelect } from "@/components/beach-select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { InstructionsSection } from "@/components/instructions-section"
import { ProductCard } from "@/components/product-card"
import { useAuth } from "@/hooks/use-auth"
import { getProdutosByPraia } from "@/services/product-service"
import type { Product } from "@/lib/types"

export function HomePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const beachId = user?.beach?.id

  const [products, setProducts] = React.useState<Product[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = React.useState(false)
  const [productsError, setProductsError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!beachId) return

    let cancelled = false

    async function loadProducts(id: number) {
      setIsLoadingProducts(true)
      setProductsError(null)
      try {
        const result = await getProdutosByPraia(id)
        if (!cancelled) setProducts(result)
      } catch {
        if (!cancelled) setProductsError("Não foi possível carregar os produtos dessa praia.")
      } finally {
        if (!cancelled) setIsLoadingProducts(false)
      }
    }

    loadProducts(beachId)

    return () => {
      cancelled = true
    }
  }, [beachId])

  const firstName = user?.name.split(" ")[0] ?? "visitante"
  const initial = (user?.name.trim()[0] ?? "?").toUpperCase()

  function handleLogout() {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#0F172A]">
      <div className="sticky top-0 z-10 backdrop-blur">
        <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-4 bg-[#1b2335]">
          <div className="min-w-0">
            <p className="text-xs text-white/70">Olá, {firstName} 👋</p>
            <BeachSelect />
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

        {/* <div className="flex gap-2 overflow-x-auto px-4 py-3">
          {CATEGORIES.map((item) => (
            <Badge
              key={item.id}
              onClick={() => setCategory(item.id)}
              variant={category === item.id ? "default" : "outline"}
              className={
                category === item.id
                  ? "h-7 shrink-0 cursor-pointer bg-brand-orange px-3 text-white"
                  : "h-7 shrink-0 cursor-pointer border-white/20 bg-white/10 px-3 text-white/80"
              }
            >
              {item.label}
            </Badge>
          ))}
        </div> */}
      </div>
      <div className="px-4 pt-3 text-white lg:px-30 mt-10">
          <h2 className="text-3xl font-bold leading-tight">O que você está querendo hoje?</h2>
          <p className=" leading-snug text-white/55">
            Avise os vendedores da praia e receba atendimento mais rápido direto no seu guarda-sol
          </p>
      </div>
      <div className="px-4 pt-6 font-bold text-white lg:px-30">
        Disponível na {user?.beach ? `${user.beach.name}, ${user.beach.city}` : "Escolha uma praia"}
      </div>
      <section className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 px-4 lg:px-30 pt-3 pb-4">
        {isLoadingProducts && (
          <p className="col-span-full py-10 text-center text-sm text-white/70">
            Carregando produtos...
          </p>
        )}
        {!isLoadingProducts && productsError && (
          <p className="col-span-full py-10 text-center text-sm text-destructive">
            {productsError}
          </p>
        )}
        {!isLoadingProducts &&
          !productsError &&
          products.map((product) => <ProductCard key={product.id} product={product} />)}
        {!isLoadingProducts && !productsError && products.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-white/70">
            {beachId ? "Nenhum produto encontrado nessa praia." : "Escolha uma praia para ver os produtos."}
          </p>
        )}
      </section>

      <InstructionsSection />
    </div>
  )
}
