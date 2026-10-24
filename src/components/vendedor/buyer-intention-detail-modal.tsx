import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { INTENTION_PHOTO_FALLBACK_URL } from "@/components/vendedor/buyer-intention-card"
import { formatDateTimeBR } from "@/lib/utils"
import type { PurchaseIntention } from "@/lib/types"

export function BuyerIntentionDetailModal({
  buyerName,
  intention,
  open,
  onOpenChange,
}: {
  buyerName: string
  intention: PurchaseIntention
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{intention.baseProductName}</DialogTitle>
          <DialogDescription>Intenção de compra de {buyerName}</DialogDescription>
        </DialogHeader>

        <div className="h-40 overflow-hidden rounded-lg">
          <img
            src={intention.photoUrl || INTENTION_PHOTO_FALLBACK_URL}
            alt={intention.baseProductName}
            className="size-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Cliente
            </p>
            <p className="text-sm text-foreground">{buyerName}</p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Local
            </p>
            <p className="text-sm text-foreground">{intention.locationDescription}</p>
          </div>

          {intention.observations && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Observações
              </p>
              <p className="text-sm text-foreground">{intention.observations}</p>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Pedido em {formatDateTimeBR(intention.createdAt)}
        </p>
      </DialogContent>
    </Dialog>
  )
}
