import { MapPin, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { UserBeach } from "@/lib/types"

export function BeachCard({
  beach,
  onEdit,
  onDelete,
}: {
  beach: UserBeach
  onEdit: (beach: UserBeach) => void
  onDelete: (beach: UserBeach) => void
}) {
  return (
    <Card className="gap-2 rounded-xl border-2 border-white/10 bg-[#0F172A] ring-0">
      <CardContent className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#FC800C]/15 text-[#FC800C]">
          <MapPin className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-heading text-sm font-semibold text-white">
            {beach.name}
          </p>
          <p className="truncate text-xs text-white/60">
            {beach.city}, {beach.state}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-white/60 hover:bg-white/10 hover:text-white"
            onClick={() => onEdit(beach)}
          >
            <Pencil />
            <span className="sr-only">Editar praia</span>
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-white/60 hover:bg-destructive/20 hover:text-destructive"
            onClick={() => onDelete(beach)}
          >
            <Trash2 />
            <span className="sr-only">Excluir praia</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
