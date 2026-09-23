import * as React from "react"

import { BeachCard } from "@/components/admin/beach-card"
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog"
import { CreateBeachModal } from "@/components/admin/create-beach-modal"
import { CreateProductBaseModal } from "@/components/admin/create-product-base-modal"
import { EditBeachModal } from "@/components/admin/edit-beach-modal"
import { EditProductBaseModal } from "@/components/admin/edit-product-base-modal"
import { ProductBaseCard } from "@/components/admin/product-base-card"
import { Button } from "@/components/ui/button"
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
} from "@/components/ui/tabs"
import { ApiError } from "@/services/http-client"
import { deletePraia, getPraias } from "@/services/beach-service"
import { deleteProdutoBase, getProdutosBase } from "@/services/product-service"
import type { Product, UserBeach } from "@/lib/types"

type AdminTab = "praias" | "prod-base"

export function AdminPage() {
  const [beaches, setBeaches] = React.useState<UserBeach[]>([])
  const [isLoadingBeaches, setIsLoadingBeaches] = React.useState(false)
  const [beachesError, setBeachesError] = React.useState<string | null>(null)

  const [products, setProducts] = React.useState<Product[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = React.useState(false)
  const [productsError, setProductsError] = React.useState<string | null>(null)

  const [beachToDelete, setBeachToDelete] = React.useState<UserBeach | null>(null)
  const [isDeletingBeach, setIsDeletingBeach] = React.useState(false)
  const [deleteBeachError, setDeleteBeachError] = React.useState<string | null>(null)

  const [productToDelete, setProductToDelete] = React.useState<Product | null>(null)
  const [isDeletingProduct, setIsDeletingProduct] = React.useState(false)
  const [deleteProductError, setDeleteProductError] = React.useState<string | null>(null)

  const [activeTab, setActiveTab] = React.useState<AdminTab>("praias")
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)

  const [beachToEdit, setBeachToEdit] = React.useState<UserBeach | null>(null)
  const [productToEdit, setProductToEdit] = React.useState<Product | null>(null)

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

  function closeDeleteBeachDialog(open: boolean) {
    if (isDeletingBeach) return
    if (!open) {
      setBeachToDelete(null)
      setDeleteBeachError(null)
    }
  }

  async function handleConfirmDeleteBeach() {
    if (!beachToDelete) return

    setIsDeletingBeach(true)
    setDeleteBeachError(null)
    try {
      await deletePraia(beachToDelete.id)
      setBeaches((prev) => prev.filter((beach) => beach.id !== beachToDelete.id))
      setBeachToDelete(null)
    } catch (err) {
      setDeleteBeachError(
        err instanceof ApiError ? err.message : "Não foi possível excluir a praia."
      )
    } finally {
      setIsDeletingBeach(false)
    }
  }

  function closeDeleteProductDialog(open: boolean) {
    if (isDeletingProduct) return
    if (!open) {
      setProductToDelete(null)
      setDeleteProductError(null)
    }
  }

  async function handleConfirmDeleteProduct() {
    if (!productToDelete) return

    setIsDeletingProduct(true)
    setDeleteProductError(null)
    try {
      await deleteProdutoBase(productToDelete.id)
      setProducts((prev) => prev.filter((product) => product.id !== productToDelete.id))
      setProductToDelete(null)
    } catch (err) {
      setDeleteProductError(
        err instanceof ApiError ? err.message : "Não foi possível excluir o produto."
      )
    } finally {
      setIsDeletingProduct(false)
    }
  }

  return (
    <div className="px-4 py-1 text-white lg:px-30 mt-6 flex-1">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-3xl mt-4 font-bold leading-tight mb-2">Área do Administrador</h2>
          <p className=" leading-snug text-white/55 mb-6">
            Tome cuidado com o To querendo!!
          </p>
        </div>
      </div>
       <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as AdminTab)}
        className="w-full rounded-xl bg-[#1b2335] text-white dark"
       >
      <TabsList className="w-full bg-transparent text-white">
        <TabsTrigger value="praias" className="h-[30px]">Praias</TabsTrigger>
        <TabsTrigger value="prod-base" className="h-[30px]">Produtos Base</TabsTrigger>
      </TabsList>
      <TabsContent value="praias">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Praias</CardTitle>
              <CardDescription>
                Gerencie as praias e suas informações.
              </CardDescription>
              </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
            Criar
          </Button>
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
                beaches.map((beach) => (
                  <BeachCard
                    key={beach.id}
                    beach={beach}
                    onEdit={setBeachToEdit}
                    onDelete={setBeachToDelete}
                  />
                ))}
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
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Produtos Base</CardTitle>
              <CardDescription>
                Gerencie os produtos base disponíveis.
              </CardDescription>
            </div>
             <Button onClick={() => setIsCreateModalOpen(true)}>
            Criar
          </Button>
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
                  <ProductBaseCard
                    key={product.id}
                    product={product}
                    onEdit={setProductToEdit}
                    onDelete={setProductToDelete}
                  />
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

    <ConfirmDeleteDialog
      open={beachToDelete !== null}
      onOpenChange={closeDeleteBeachDialog}
      title="Excluir praia"
      description={
        beachToDelete
          ? `Tem certeza que deseja excluir "${beachToDelete.name}"? Essa ação não pode ser desfeita.`
          : ""
      }
      isDeleting={isDeletingBeach}
      error={deleteBeachError}
      onConfirm={handleConfirmDeleteBeach}
    />

    <ConfirmDeleteDialog
      open={productToDelete !== null}
      onOpenChange={closeDeleteProductDialog}
      title="Excluir produto base"
      description={
        productToDelete
          ? `Tem certeza que deseja excluir "${productToDelete.name}"? Essa ação não pode ser desfeita.`
          : ""
      }
      isDeleting={isDeletingProduct}
      error={deleteProductError}
      onConfirm={handleConfirmDeleteProduct}
    />

    <CreateBeachModal
      open={isCreateModalOpen && activeTab === "praias"}
      onOpenChange={setIsCreateModalOpen}
      onCreated={(beach) => setBeaches((prev) => [beach, ...prev])}
    />

    <CreateProductBaseModal
      open={isCreateModalOpen && activeTab === "prod-base"}
      onOpenChange={setIsCreateModalOpen}
      onCreated={(product) => setProducts((prev) => [product, ...prev])}
    />

    <EditBeachModal
      beach={beachToEdit}
      onOpenChange={(open) => {
        if (!open) setBeachToEdit(null)
      }}
      onUpdated={(updated) =>
        setBeaches((prev) => prev.map((beach) => (beach.id === updated.id ? updated : beach)))
      }
    />

    <EditProductBaseModal
      product={productToEdit}
      onOpenChange={(open) => {
        if (!open) setProductToEdit(null)
      }}
      onUpdated={(updated) =>
        setProducts((prev) =>
          prev.map((product) => (product.id === updated.id ? updated : product))
        )
      }
    />
    </div>
  )
}
