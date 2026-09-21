import * as React from "react"
import { ImageOff, MapPin } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./../../components/ui/tabs"
import { getPraias } from "@/services/beach-service"
import { getProdutosBase } from "@/services/product-service"
import type { Product, UserBeach } from "@/lib/types"

function BeachCard({ beach }: { beach: UserBeach }) {
  return (
    <Card className="gap-2 rounded-xl border-2 border-white/10 bg-[#0F172A] ring-0">
      <CardContent className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#FC800C]/15 text-[#FC800C]">
          <MapPin className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-heading text-sm font-semibold text-white">
            {beach.name}
          </p>
          <p className="truncate text-xs text-white/60">
            {beach.city}, {beach.state}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function ProductBaseCard({ product }: { product: Product }) {
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
          <Badge variant={product.active ? "default" : "outline"} className="shrink-0">
            {product.active ? "Ativo" : "Inativo"}
          </Badge>
        </div>
        <p className="line-clamp-2 text-xs text-white/60">{product.description}</p>
        <p className="text-sm font-semibold text-[#FC800C]">
          A partir de R$ {product.minPrice.toFixed(2)}
        </p>
      </CardContent>
    </Card>
  )
}

export function AdminPage() {
  const [beaches, setBeaches] = React.useState<UserBeach[]>([])
  const [isLoadingBeaches, setIsLoadingBeaches] = React.useState(false)
  const [beachesError, setBeachesError] = React.useState<string | null>(null)

  const [products, setProducts] = React.useState<Product[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = React.useState(false)
  const [productsError, setProductsError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false

    setIsLoadingBeaches(true)
    setBeachesError(null)
    getPraias()
      .then((result) => {
        if (!cancelled) setBeaches(result)
      })
      .catch(() => {
        if (!cancelled) setBeachesError("Não foi possível carregar as praias.")
      })
      .finally(() => {
        if (!cancelled) setIsLoadingBeaches(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  React.useEffect(() => {
    let cancelled = false

    setIsLoadingProducts(true)
    setProductsError(null)
    getProdutosBase()
      .then((result) => {
        if (!cancelled) setProducts(result)
      })
      .catch(() => {
        if (!cancelled) setProductsError("Não foi possível carregar os produtos base.")
      })
      .finally(() => {
        if (!cancelled) setIsLoadingProducts(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="px-4 py-1 text-white lg:px-30 mt-6 flex-1">
      <h2 className="text-3xl mt-4 font-bold leading-tight mb-2">Área do Administrador</h2>
      <p className=" leading-snug text-white/55 mb-6">
        Tome cuidado com o To querendo!!
      </p>
       <Tabs defaultValue="overview" className="w-full rounded-xl bg-[#1b2335] text-white dark">
      <TabsList className="w-full bg-transparent text-white">
        <TabsTrigger value="praias" className="h-[30px]">Praias</TabsTrigger>
        <TabsTrigger value="prod-base" className="h-[30px]">Produtos Base</TabsTrigger>
      </TabsList>
      <TabsContent value="praias">
        <Card>
          <CardHeader>
            <CardTitle>Praias</CardTitle>
            <CardDescription>
              Gerencie as praias e suas informações.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {isLoadingBeaches && (
                <p className="col-span-full py-6 text-center text-sm text-muted-foreground">
                  Carregando praias...
                </p>
              )}
              {!isLoadingBeaches && beachesError && (
                <p className="col-span-full py-6 text-center text-sm text-destructive">
                  {beachesError}
                </p>
              )}
              {!isLoadingBeaches &&
                !beachesError &&
                beaches.map((beach) => <BeachCard key={beach.id} beach={beach} />)}
              {!isLoadingBeaches && !beachesError && beaches.length === 0 && (
                <p className="col-span-full py-6 text-center text-sm text-muted-foreground">
                  Nenhuma praia cadastrada.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="prod-base">
        <Card>
          <CardHeader>
            <CardTitle>Produtos Base</CardTitle>
            <CardDescription>
              Gerencie os produtos base disponíveis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {isLoadingProducts && (
                <p className="col-span-full py-6 text-center text-sm text-muted-foreground">
                  Carregando produtos base...
                </p>
              )}
              {!isLoadingProducts && productsError && (
                <p className="col-span-full py-6 text-center text-sm text-destructive">
                  {productsError}
                </p>
              )}
              {!isLoadingProducts &&
                !productsError &&
                products.map((product) => (
                  <ProductBaseCard key={product.id} product={product} />
                ))}
              {!isLoadingProducts && !productsError && products.length === 0 && (
                <p className="col-span-full py-6 text-center text-sm text-muted-foreground">
                  Nenhum produto base cadastrado.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

    </Tabs>
    </div>
  )
}
