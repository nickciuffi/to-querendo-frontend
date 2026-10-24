import { useState } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { BuyerIntentionDetailModal } from "@/components/vendedor/buyer-intention-detail-modal"
import { formatDateTimeBR } from "@/lib/utils"
import type { PurchaseIntention } from "@/lib/types"

export const INTENTION_PHOTO_FALLBACK_URL =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNEAqN475-xZZX_jzk5d8SnYTrNbOe52yzcWWnbm44Zw&s=10"

export function BuyerIntentionCard({
  buyerName,
  intention,
}: {
  buyerName: string
  intention: PurchaseIntention
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Card
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") setOpen(true)
        }}
        className="cursor-pointer gap-1.5 rounded-xl border-2 border-[#FC800C] bg-[#0F172A] py-0 ring-0 transition hover:border-[#FC800C]/70"
      >
        <div className="h-32 overflow-hidden rounded-t-lg">
          <img
            src={intention.photoUrl || INTENTION_PHOTO_FALLBACK_URL}
            alt={intention.baseProductName}
            className="size-full object-cover"
          />
        </div>

        <CardContent className="flex flex-col gap-1 px-3 pb-3">
          <p className="truncate font-heading text-sm font-semibold text-white">
            {intention.baseProductName}
          </p>
          <p className="truncate text-xs text-white/60">{buyerName}</p>
          <span className="mt-1.5 text-[0.65rem] text-white/40">
            {formatDateTimeBR(intention.createdAt)}
          </span>
        </CardContent>
      </Card>

      <BuyerIntentionDetailModal
        buyerName={buyerName}
        intention={intention}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}
