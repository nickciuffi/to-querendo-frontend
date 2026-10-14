import { CalendarClock, MapPin, Package } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import type { PurchaseIntention } from "@/lib/types"

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
})

function formatCreatedAt(createdAt: string) {
  const date = new Date(createdAt)
  return Number.isNaN(date.getTime()) ? createdAt : dateFormatter.format(date)
}

export function PurchaseIntentionCard({
  intention,
  baseProductPhotoUrl,
}: {
  intention: PurchaseIntention
  baseProductPhotoUrl: string | null
}) {
  return (
    <Card className="gap-1.5 rounded-xl border-2 border-white/10 bg-[#0F172A] ring-0 py-0">
      <div className="relative flex h-24 flex-col items-center justify-center gap-1 overflow-hidden rounded-t-lg bg-gradient-to-b from-[#FC800C]/25 to-[#FC800C]/5">
        {baseProductPhotoUrl ? (
          <img
            src={baseProductPhotoUrl}
            alt={intention.baseProductName}
            className="size-full object-cover"
          />
        ) : (
          <>
            <Package className="size-7 text-white/40" />
            <span className="max-w-full truncate px-3 text-xs font-medium text-white/60">
              {intention.baseProductName}
            </span>
          </>
        )}
      </div>
      <CardContent className="flex flex-1 flex-col gap-1.5 px-3 pb-3">
        <p className="text-[0.65rem] font-medium uppercase tracking-wide text-white/40">
          {intention.baseProductName}
        </p>
        <p className="flex items-start gap-1 text-sm text-white">
          <MapPin className="mt-0.5 size-3.5 shrink-0 text-white/40" />
          <span className="line-clamp-2">{intention.locationDescription}</span>
        </p>
        {intention.observations && (
          <p className="line-clamp-2 text-xs text-white/60">{intention.observations}</p>
        )}
        <span className="mt-auto flex items-center gap-1 text-[0.65rem] text-white/40">
          <CalendarClock className="size-3" />
          Pedido em {formatCreatedAt(intention.createdAt)}
        </span>
      </CardContent>
    </Card>
  )
}
