import * as React from "react"
import { MapPin } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Mensagem de estado do mapa (carregando, erro, lista vazia, "toque em um ponto") que flutua sobre
 * ele enquanto nenhum vendedor/comprador está selecionado e o painel de detalhes está fechado.
 */
export function MapStatusPill({
  title,
  description,
  tone = "default",
  className,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  tone?: "default" | "error"
  className?: string
}) {
  return (
    <div
      role="status"
      className={cn(
        "absolute z-10 flex items-start gap-2 rounded-xl border border-border bg-background/95 px-3 py-2 shadow-md backdrop-blur",
        className
      )}
    >
      <MapPin className="mt-0.5 size-4 shrink-0 text-brand-blue" />
      <div className="min-w-0">
        <p className={cn("text-xs font-medium", tone === "error" ? "text-destructive" : "text-foreground")}>
          {title}
        </p>
        {description && <p className="text-[0.7rem] text-muted-foreground">{description}</p>}
      </div>
    </div>
  )
}
