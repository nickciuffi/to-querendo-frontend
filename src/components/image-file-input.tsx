import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IMAGE_ACCEPT, validateImageFile } from "@/lib/image-file"
import { cn } from "@/lib/utils"

/**
 * Campo de imagem dos formulários: escolhe o arquivo, valida (JPEG/PNG/WEBP, até 5 MB) e
 * mostra a pré-visualização. O envio fica a cargo do formulário (ver `useImageUpload`).
 */
export function ImageFileInput({
  id,
  label,
  file,
  onFileChange,
  currentImageUrl,
  error,
  disabled,
  onRemoveCurrent,
  labelClassName,
  inputClassName,
}: {
  id: string
  label: string
  file: File | null
  onFileChange: (file: File | null) => void
  /** Imagem já salva, só para pré-visualização enquanto nenhum arquivo novo é escolhido. */
  currentImageUrl?: string | null
  error?: string | null
  disabled?: boolean
  /** Mostra "Remover foto" para a imagem já salva (só onde a tela permite apagar a foto). */
  onRemoveCurrent?: () => void
  labelClassName?: string
  inputClassName?: string
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [validationError, setValidationError] = React.useState<string | null>(null)

  // A URL temporária é derivada do arquivo; o efeito só a libera quando o arquivo muda.
  const previewUrl = React.useMemo(() => (file ? URL.createObjectURL(file) : null), [file])
  React.useEffect(() => {
    if (!previewUrl) return
    return () => URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  // Quando o formulário zera o arquivo (ex.: resetForm), o input nativo também é limpo.
  React.useEffect(() => {
    if (!file && inputRef.current) inputRef.current.value = ""
  }, [file])

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null
    if (!selected) {
      setValidationError(null)
      onFileChange(null)
      return
    }

    const message = validateImageFile(selected)
    if (message) {
      setValidationError(message)
      onFileChange(null)
      event.target.value = ""
      return
    }

    setValidationError(null)
    onFileChange(selected)
  }

  function clearSelection() {
    setValidationError(null)
    onFileChange(null)
  }

  const shownError = validationError ?? error ?? null
  const shownImage = previewUrl ?? currentImageUrl ?? null

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className={labelClassName}>
        {label}
      </Label>
      <Input
        id={id}
        ref={inputRef}
        type="file"
        accept={IMAGE_ACCEPT}
        onChange={handleChange}
        disabled={disabled}
        aria-invalid={Boolean(shownError)}
        className={cn("cursor-pointer", inputClassName)}
      />
      {shownImage && (
        <div className="flex items-center gap-2">
          <img src={shownImage} alt="Pré-visualização" className="size-16 rounded-lg object-cover" />
          {file ? (
            <Button type="button" variant="ghost" size="sm" onClick={clearSelection} disabled={disabled}>
              Remover
            </Button>
          ) : (
            onRemoveCurrent && (
              <Button type="button" variant="ghost" size="sm" onClick={onRemoveCurrent} disabled={disabled}>
                Remover foto
              </Button>
            )
          )}
        </div>
      )}
      {shownError && <span className="text-xs text-destructive">{shownError}</span>}
      <span className="text-xs text-muted-foreground">JPEG, PNG ou WEBP, até 5 MB.</span>
    </div>
  )
}
