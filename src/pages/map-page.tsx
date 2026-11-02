import * as React from "react"
import { Package, Store } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ImageLightbox } from "@/components/image-lightbox"
import { MapDetailsPanel } from "@/components/map-details-panel"
import { MapStatusPill } from "@/components/map-status-pill"
import { MapboxMap } from "@/components/mapbox-map"
import { ProfileAvatar } from "@/components/profile-avatar"
import { VendorProductsModal } from "@/components/vendor-products-modal"
import { useAuth } from "@/hooks/use-auth"
import { getBeachCenter } from "@/lib/coordinates"
import { ACTIVE_ORDERS, ALL_PRODUCTS, ProductFilterSelect } from "@/components/product-filter-select"
import type { MapMarker, MapVendor, Product } from "@/lib/types"
import { getProdutosByPraia } from "@/services/product-service"
import { getMinhasIntencoes } from "@/services/purchase-intention-service"
import { getVendedoresDaPraia } from "@/services/vendor-location-service"

const priceFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

// Chave da busca de vendedores sem filtro de produto (todos os produtos da praia).
const ALL_VENDORS_KEY = "todos"

export function MapPage() {
  const { user } = useAuth()

  const beachId = user?.beach?.id
  const beachCenter = getBeachCenter(user?.beach)

  const [loadedVendors, setVendors] = React.useState<MapVendor[]>([])
  const vendors = React.useMemo(() => (beachId ? loadedVendors : []), [beachId, loadedVendors])
  const [products, setProducts] = React.useState<Product[] | null>(null)
  const [productFilter, setProductFilter] = React.useState(ACTIVE_ORDERS)
  // Produtos base das intenções de compra ativas do usuário (null = ainda carregando).
  const [activeOrderProductIds, setActiveOrderProductIds] = React.useState<number[] | null>(null)
  const [ordersError, setOrdersError] = React.useState<string | null>(null)
  const [ordersReloadKey, setOrdersReloadKey] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [selectedVendorId, setSelectedVendorId] = React.useState<number | null>(null)
  const [isVendorProductsModalOpen, setIsVendorProductsModalOpen] = React.useState(false)

  // Produtos da praia: alimentam as opções do filtro.
  React.useEffect(() => {
    if (!beachId) return

    let cancelled = false

    async function loadProducts(id: number) {
      setProducts(null)
      setProductFilter(ACTIVE_ORDERS)
      setError(null)
      try {
        const result = await getProdutosByPraia(id)
        if (!cancelled) setProducts(result)
      } catch {
        if (!cancelled) setError("Não foi possível carregar os produtos dessa praia.")
      }
    }

    loadProducts(beachId)

    return () => {
      cancelled = true
    }
  }, [beachId])

  // Pedidos ativos: definem os produtos do filtro "Produtos com pedido ativo". São recarregados
  // quando o modal do vendedor fecha, porque é por ele que se faz um pedido novo no mapa.
  React.useEffect(() => {
    let cancelled = false

    async function loadActiveOrders() {
      try {
        const intentions = await getMinhasIntencoes()
        if (!cancelled) {
          setActiveOrderProductIds([...new Set(intentions.map((intention) => intention.baseProductId))])
          setOrdersError(null)
        }
      } catch {
        if (!cancelled) setOrdersError("Não foi possível carregar seus pedidos.")
      }
    }

    loadActiveOrders()

    return () => {
      cancelled = true
    }
  }, [ordersReloadKey])

  // Produtos que vão na busca de vendedores. No filtro de pedidos ativos, só os produtos dos
  // pedidos que estão entre os produtos ativos da praia: a API responde 404 para a busca inteira
  // se receber algum produto base inativo. `null` = ainda não dá para buscar.
  const vendorQueryKey = React.useMemo<string | null>(() => {
    if (!products) return null
    if (productFilter === ALL_PRODUCTS) return ALL_VENDORS_KEY
    if (productFilter !== ACTIVE_ORDERS) return productFilter
    if (!activeOrderProductIds) return null
    const beachProductIds = new Set(products.map((product) => Number(product.id)))
    return activeOrderProductIds.filter((id) => beachProductIds.has(id)).join(",")
  }, [products, productFilter, activeOrderProductIds])

  // Vendedores: os produtos do filtro vão no `idsProdutosBase` da rota.
  React.useEffect(() => {
    if (!beachId || vendorQueryKey === null) return

    let cancelled = false

    async function loadVendors(id: number, queryKey: string) {
      setError(null)
      setVendors([])
      setSelectedVendorId(null)

      const ids = queryKey === ALL_VENDORS_KEY ? null : queryKey.split(",").filter(Boolean).map(Number)
      // Sem produto nenhum para filtrar, não chamamos a API: sem ids ela traria todos os vendedores.
      if (ids && ids.length === 0) return

      setIsLoading(true)
      try {
        const result = await getVendedoresDaPraia(id, ids)
        if (!cancelled) setVendors(result)
      } catch {
        if (!cancelled) setError("Não foi possível carregar os vendedores dessa praia.")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadVendors(beachId, vendorQueryKey)

    return () => {
      cancelled = true
    }
  }, [beachId, vendorQueryKey])

  const markers = React.useMemo<MapMarker[]>(
    () =>
      vendors.map((vendor) => ({
        id: vendor.id,
        label: `${vendor.name} — ${vendor.featuredProduct.baseProductName}`,
        lat: vendor.lat,
        lng: vendor.lng,
        photoUrl: vendor.featuredProduct.photoUrl,
        // Verde = disponível, cinza = indisponível.
        ringColor: vendor.available ? "#22c55e" : "#9ca3af",
        dimmed: !vendor.available,
      })),
    [vendors]
  )

  const selectedVendor = vendors.find((vendor) => vendor.id === selectedVendorId) ?? null
  const availableCount = vendors.filter((vendor) => vendor.available).length
  const isActiveOrdersFilter = productFilter === ACTIVE_ORDERS
  const isWaitingOrders = isActiveOrdersFilter && activeOrderProductIds === null && !ordersError

  // Mensagem que flutua sobre o mapa enquanto nenhum vendedor está selecionado.
  function getStatus(): { title: string; description?: string; tone?: "error" } {
    if (isLoading || isWaitingOrders) return { title: "Buscando vendedores..." }
    if (error) return { title: error, tone: "error" }
    if (!beachId) return { title: "Escolha uma praia para ver os vendedores" }
    if (isActiveOrdersFilter && ordersError) return { title: ordersError, tone: "error" }
    if (isActiveOrdersFilter && activeOrderProductIds?.length === 0) {
      return {
        title: "Você não tem pedidos ativos",
        description: "Faça um pedido ou escolha outro filtro para ver os vendedores",
      }
    }
    if (isActiveOrdersFilter && vendors.length === 0) {
      return { title: "Nenhum vendedor dos produtos dos seus pedidos nessa praia" }
    }
    if (vendors.length === 0) return { title: "Nenhum vendedor encontrado nessa praia" }
    return {
      title: "Toque em um vendedor no mapa",
      description: `${availableCount} ${availableCount === 1 ? "vendedor disponível" : "vendedores disponíveis"} na praia`,
    }
  }
  const status = getStatus()

  return (
    <div className="flex flex-1 flex-col">
      {/* O layout só tem altura mínima, então o mapa fica em posição absoluta para ter
          uma altura definida — o Mapbox não desenha em container com altura 0. Sem painel de
          detalhes aberto, o mapa ocupa todo o espaço. */}
      <div className="relative min-h-0 flex-1">
        <div className="absolute inset-0">
          <MapboxMap
            center={beachCenter}
            markers={markers}
            selectedMarkerId={selectedVendorId}
            onSelectMarker={setSelectedVendorId}
            centerKey={String(beachId ?? "sem-praia")}
          />
        </div>
        {/* Fica dentro do container do mapa (abaixo do header) e deixa livre o canto direito,
            onde ficam os controles de zoom do Mapbox. */}
        <div className="absolute left-3 top-3 z-10 w-[calc(100%-4.5rem)] max-w-xs">
          <ProductFilterSelect
            products={products ?? []}
            value={productFilter}
            onValueChange={setProductFilter}
            disabled={!beachId || products === null}
          />
        </div>
        {!selectedVendor && (
          <MapStatusPill
            title={status.title}
            description={status.description}
            tone={status.tone}
            className="left-3 top-14 w-[calc(100%-4.5rem)] max-w-xs"
          />
        )}
      </div>

      {selectedVendor && (
        <MapDetailsPanel
          onClose={() => setSelectedVendorId(null)}
          closeLabel="Fechar detalhes do vendedor"
        >
          <div className="flex min-h-0 flex-auto flex-col gap-3 pt-11">
            {/* pt-11: faixa livre no topo para o X do painel. As colunas podem encolher (min-h-0)
                para que, com muitos produtos, só a lista de produtos role. */}
            <div className="flex min-h-0 flex-auto flex-col gap-3 sm:flex-row">
              <section className="flex min-w-0 shrink-0 flex-col gap-2.5 rounded-xl border border-border bg-muted/40 p-3 sm:min-h-0 sm:flex-[2] sm:overflow-y-auto">
                <div className="flex items-center gap-3">
                  <ProfileAvatar name={selectedVendor.name} photoUrl={selectedVendor.photoUrl} />
                  <div className="flex min-w-0 max-w-full flex-col items-start gap-1">
                    <p className="max-w-full truncate font-heading text-base font-semibold text-foreground">
                      {selectedVendor.name}
                    </p>
                    <Badge
                      variant={selectedVendor.available ? "default" : "secondary"}
                      className={selectedVendor.available ? "bg-brand-blue text-white" : ""}
                    >
                      {selectedVendor.available ? "Disponível" : "Indisponível"}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
                    <Store className="size-3.5" />
                    Sobre o negócio
                  </h3>
                  {selectedVendor.description ? (
                    <p className="break-words text-xs text-foreground">{selectedVendor.description}</p>
                  ) : (
                    <p className="text-xs italic text-muted-foreground/70">Sem descrição</p>
                  )}
                </div>
              </section>

              <section className="flex min-h-0 min-w-0 flex-auto flex-col gap-2 rounded-xl border border-border bg-muted/40 p-3 sm:flex-[3]">
                <h3 className="flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
                  <Package className="size-3.5" />
                  {selectedVendor.products.length}{" "}
                  {selectedVendor.products.length === 1 ? "produto" : "produtos"}
                </h3>
                <ul className="-mr-1.5 flex min-h-0 flex-auto flex-col gap-2 overflow-y-auto pr-1.5">
                  {selectedVendor.products.map((product) => {
                    const isSellable = product.active && product.baseProductActive
                    return (
                      <li
                        key={product.id}
                        className="flex gap-2.5 rounded-lg border border-border bg-card p-2"
                      >
                        {product.photoUrl ? (
                          <ImageLightbox
                            src={product.photoUrl}
                            alt={product.name}
                            className="size-12 shrink-0 rounded-md"
                          />
                        ) : (
                          <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                            <Package className="size-5" />
                          </span>
                        )}
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <div className="flex items-start justify-between gap-2">
                            <p className="min-w-0 break-words text-xs font-medium text-foreground">
                              {product.name}
                            </p>
                            <span className="shrink-0 text-xs font-semibold text-brand-orange">
                              {priceFormatter.format(product.price)}
                            </span>
                          </div>
                          {product.description && (
                            <p className="line-clamp-2 text-[0.7rem] text-muted-foreground">
                              {product.description}
                            </p>
                          )}
                          {!isSellable && (
                            <Badge variant="secondary" className="mt-0.5">
                              Indisponível
                            </Badge>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </section>
            </div>

            <Button
              className="w-full shrink-0 bg-brand-orange text-white hover:bg-brand-orange/90"
              onClick={() => setIsVendorProductsModalOpen(true)}
            >
              Tô Querendo
            </Button>
          </div>
        </MapDetailsPanel>
      )}

      {selectedVendor && (
        <VendorProductsModal
          vendor={selectedVendor}
          open={isVendorProductsModalOpen}
          onOpenChange={(open) => {
            setIsVendorProductsModalOpen(open)
            if (!open) setOrdersReloadKey((key) => key + 1)
          }}
        />
      )}
    </div>
  )
}
