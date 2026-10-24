import { useEffect, useId, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ApiError } from "@/services/http-client"
import { updatePraia } from "@/services/beach-service"
import type { UserBeach } from "@/lib/types"

export function EditBeachModal({
  beach,
  onOpenChange,
  onUpdated,
}: {
  beach: UserBeach | null
  onOpenChange: (open: boolean) => void
  onUpdated: (beach: UserBeach) => void
}) {
  const nameId = useId()
  const cityId = useId()
  const stateId = useId()
  const photoUrlId = useId()

  const [name, setName] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [photoUrl, setPhotoUrl] = useState("")
  const [nameError, setNameError] = useState(false)
  const [cityError, setCityError] = useState(false)
  const [stateError, setStateError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (beach) {
      setName(beach.name)
      setCity(beach.city)
      setState(beach.state)
      setPhotoUrl("")
      setNameError(false)
      setCityError(false)
      setStateError(false)
      setSubmitError(null)
    }
  }, [beach])

  async function handleConfirm() {
    if (!beach) return

    const trimmedName = name.trim()
    const trimmedCity = city.trim()
    const trimmedState = state.trim()

    const hasNameError = !trimmedName
    const hasCityError = !trimmedCity
    const hasStateError = trimmedState.length !== 2

    setNameError(hasNameError)
    setCityError(hasCityError)
    setStateError(hasStateError)

    if (hasNameError || hasCityError || hasStateError) return

    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const updated = await updatePraia(beach.id, {
        nome: trimmedName,
        cidade: trimmedCity,
        estado: trimmedState.toUpperCase(),
        urlFoto: photoUrl.trim() || undefined,
      })
      onUpdated(updated)
      onOpenChange(false)
    } catch (err) {
      setSubmitError(
        err instanceof ApiError ? err.message : "Não foi possível salvar a praia."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={beach !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar praia</DialogTitle>
          <DialogDescription>
            Atualize as informações da praia.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={nameId}>Nome: *</Label>
          <Input
            id={nameId}
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              if (nameError) setNameError(false)
            }}
            placeholder="Ex: Praia do Forte"
            aria-invalid={nameError}
          />
          {nameError && (
            <span className="text-xs text-destructive">Nome é obrigatório.</span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={cityId}>Cidade: *</Label>
          <Input
            id={cityId}
            value={city}
            onChange={(event) => {
              setCity(event.target.value)
              if (cityError) setCityError(false)
            }}
            placeholder="Ex: Mata de São João"
            aria-invalid={cityError}
          />
          {cityError && (
            <span className="text-xs text-destructive">Cidade é obrigatória.</span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={stateId}>Estado (UF): *</Label>
          <Input
            id={stateId}
            value={state}
            onChange={(event) => {
              setState(event.target.value.toUpperCase())
              if (stateError) setStateError(false)
            }}
            placeholder="Ex: BA"
            maxLength={2}
            className="w-20 uppercase"
            aria-invalid={stateError}
          />
          {stateError && (
            <span className="text-xs text-destructive">Informe a sigla do estado (2 letras).</span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={photoUrlId}>URL da foto: (opcional)</Label>
          <Input
            id={photoUrlId}
            value={photoUrl}
            onChange={(event) => setPhotoUrl(event.target.value)}
            placeholder="https://..."
          />
        </div>
        {submitError && (
          <span className="text-xs text-destructive">{submitError}</span>
        )}

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />} disabled={isSubmitting}>
            Cancelar
          </DialogClose>
          <Button onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
