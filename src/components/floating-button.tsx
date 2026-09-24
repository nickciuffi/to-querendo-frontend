import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Botão flutuante fixo no canto inferior direito da tela, acima da barra de navegação.
 * Aceita as mesmas props do `Button` (onClick, disabled, children com ícone etc.).
 */
export function FloatingButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      className={cn(
        "fixed right-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-40 h-12 gap-2 rounded-full bg-[#FC800C] px-5 text-sm font-semibold text-white shadow-[0_6px_20px_-4px_rgba(252,128,12,0.5)] hover:bg-[#FC800C]/90 hover:shadow-[0_8px_20px_-4px_rgba(252,128,12,0.60)] lg:right-30",
        className
      )}
      {...props}
    />
  )
}
