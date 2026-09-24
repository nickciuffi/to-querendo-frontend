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
import { Header } from "@/components/layout/header"
import { BecomeSellerFloatingButton } from "@/components/vendedor/become-seller-floating-button"
import { SellerOnlineFloatingButton } from "@/components/vendedor/seller-online-floating-button"

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

  return (
    <div>
      <div className="px-4 pt-1 text-white lg:px-30 mt-6">
          <BeachSelect />
          <h2 className="text-3xl mt-4 font-bold leading-tight">O que você está querendo hoje?</h2>
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
      <BecomeSellerFloatingButton />
      <SellerOnlineFloatingButton />
    </div>
  )
}
