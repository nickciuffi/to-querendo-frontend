import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Miniatura que abre a imagem em tamanho grande. O modal fecha pelo botão no canto superior
 * direito da imagem, pela tecla Esc ou com um clique fora da imagem; o fundo fica com blur.
 */
export function ImageLightbox({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  /** Classes da miniatura (tamanho, proporção etc.). */
  className?: string
}) {
  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger
        className={cn(
          "block cursor-zoom-in overflow-hidden rounded-lg bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          className
        )}
        aria-label={`Ampliar imagem: ${alt}`}
      >
        <img src={src} alt={alt} className="size-full object-cover" />
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        {/* O popup envolve só a imagem: qualquer clique fora dela cai no fundo e fecha o modal. */}
        <DialogPrimitive.Popup
          aria-label={alt}
          className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 outline-none transition duration-150 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0"
        >
          <img
            src={src}
            alt={alt}
            className="block max-h-[85dvh] w-auto max-w-[92vw] rounded-xl object-contain shadow-2xl"
          />
          <DialogPrimitive.Close
            className="absolute top-2 right-2 flex size-9 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80 focus-visible:ring-3 focus-visible:ring-white/60 focus-visible:outline-none"
          >
            <XIcon className="size-5" />
            <span className="sr-only">Fechar imagem</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
