import * as React from "react"
import { XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

/**
 * Painel de detalhes abaixo do mapa (vendedor ou comprador selecionado). O conteúdo fica centralizado
 * com largura máxima, e o botão de fechar fica no canto superior direito dele — fora da área que rola,
 * então continua visível mesmo com muito conteúdo. Quem usa deve deixar livre esse canto (~44 px).
 */
export function MapDetailsPanel({
  onClose,
  closeLabel,
  children,
}: {
  onClose: () => void
  /** Texto para leitores de tela, ex.: "Fechar detalhes do vendedor". */
  closeLabel: string
  children: React.ReactNode
}) {
  return (
    <div className="relative border-t border-border bg-card">
      {/* Altura limitada para o painel não espremer o mapa: 65% da tela no celular (onde os blocos
          ficam empilhados e precisam de mais espaço) e 50% a partir de sm. É uma coluna flex para o
          conteúdo poder encolher e escolher o que rola (ex.: só a lista de produtos); se nada
          encolher, o painel inteiro rola. */}
      <div className="flex max-h-[65dvh] flex-col overflow-y-auto px-4 py-3 sm:max-h-[50dvh]">
        <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-auto flex-col">{children}</div>
      </div>
      {/* Mesma largura do conteúdo, para o X ficar no canto superior direito dele. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 px-4 pt-2">
        <div className="mx-auto flex w-full max-w-3xl justify-end">
          <Button
            variant="ghost"
            size="icon-lg"
            onClick={onClose}
            className="pointer-events-auto -mr-1 rounded-full bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <XIcon className="size-5" />
            <span className="sr-only">{closeLabel}</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
