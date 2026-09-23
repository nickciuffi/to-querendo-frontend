import * as React from "react"

import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog"
import { EditSellerProductModal } from "@/components/vendedor/edit-seller-product-modal"
import { SellerProductCard } from "@/components/vendedor/seller-product-card"
import { ApiError } from "@/services/http-client"
import { deleteProdutoEspecifico, getMeusProdutos } from "@/services/seller-product-service"
import type { SellerProduct } from "@/lib/types"

/**
 * `reloadKey`: ao mudar (ex.: depois de adicionar um produto), a lista é consultada
 * novamente sem voltar para o estado de carregamento.
 */
export function SellerProductList({ reloadKey = 0 }: { reloadKey?: number }) {
  const [products, setProducts] = React.useState<SellerProduct[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [productToEdit, setProductToEdit] = React.useState<SellerProduct | null>(null)
  const [productToDelete, setProductToDelete] = React.useState<SellerProduct | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [deleteError, setDeleteError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false

    getMeusProdutos()
      .then((result) => {
        if (!cancelled) {
          setProducts(result)
          setError(null)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Não foi possível carregar seus produtos.")
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [reloadKey])

  function handleUpdated(updated: SellerProduct) {
    setProducts((current) => current.map((item) => (item.id === updated.id ? updated : item)))
  }

  function closeDeleteDialog(open: boolean) {
    if (isDeleting) return
    if (!open) {
      setProductToDelete(null)
      setDeleteError(null)
    }
  }

  async function handleConfirmDelete() {
    if (!productToDelete) return

    setIsDeleting(true)
    setDeleteError(null)
    try {
      await deleteProdutoEspecifico(productToDelete.id)
      setProducts((current) => current.filter((item) => item.id !== productToDelete.id))
      setProductToDelete(null)
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "Não foi possível excluir o produto.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {isLoading && (
          <p className="col-span-full py-6 text-center text-sm text-white/60">Carregando produtos...</p>
        )}
        {!isLoading && error && (
          <p className="col-span-full py-6 text-center text-sm text-destructive">{error}</p>
        )}
        {!isLoading &&
          !error &&
          products.map((product) => (
            <SellerProductCard
              key={product.id}
              product={product}
              onEdit={setProductToEdit}
              onDelete={setProductToDelete}
            />
          ))}
        {!isLoading && !error && products.length === 0 && (
          <p className="col-span-full py-6 text-center text-sm text-white/60">
            Você ainda não tem nenhum produto cadastrado.
          </p>
        )}
      </div>

      <EditSellerProductModal
        key={productToEdit?.id ?? "none"}
        product={productToEdit}
        onOpenChange={(open) => {
          if (!open) setProductToEdit(null)
        }}
        onUpdated={handleUpdated}
      />

      <ConfirmDeleteDialog
        open={productToDelete !== null}
        onOpenChange={closeDeleteDialog}
        title="Excluir produto"
        description={
          productToDelete
            ? `Tem certeza que deseja excluir "${productToDelete.name}"? Essa ação não pode ser desfeita.`
            : ""
        }
        isDeleting={isDeleting}
        error={deleteError}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}
