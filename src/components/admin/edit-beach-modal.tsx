import { useEffect, useId, useState } from "react"

import { ImageFileInput } from "@/components/image-file-input"
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
import { isLatitudeValid, isLongitudeValid, parseCoordinate } from "@/lib/coordinates"
import { useImageUpload } from "@/hooks/use-image-upload"
import { ImageUploadError } from "@/services/arquivo-service"
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
  const photoId = useId()
  const latitudeId = useId()
  const longitudeId = useId()

  const [name, setName] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const photo = useImageUpload("praias")
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [nameError, setNameError] = useState(false)
  const [cityError, setCityError] = useState(false)
  const [stateError, setStateError] = useState(false)
  const [latitudeError, setLatitudeError] = useState(false)
  const [longitudeError, setLongitudeError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const resetPhoto = photo.reset
  useEffect(() => {
    if (beach) {
      setName(beach.name)
      setCity(beach.city)
      setState(beach.state)
      resetPhoto()
      setLatitude(beach.latitude != null ? String(beach.latitude) : "")
      setLongitude(beach.longitude != null ? String(beach.longitude) : "")
      setNameError(false)
      setCityError(false)
      setStateError(false)
      setLatitudeError(false)
      setLongitudeError(false)
      setSubmitError(null)
    }
  }, [beach, resetPhoto])

  async function handleConfirm() {
    if (!beach) return

    const trimmedName = name.trim()
    const trimmedCity = city.trim()
    const trimmedState = state.trim()

    const hasNameError = !trimmedName
    const hasCityError = !trimmedCity
    const hasStateError = trimmedState.length !== 2
    const parsedLatitude = parseCoordinate(latitude)
    const parsedLongitude = parseCoordinate(longitude)

    setNameError(hasNameError)
    setCityError(hasCityError)
    setStateError(hasStateError)
    setLatitudeError(!isLatitudeValid(parsedLatitude))
    setLongitudeError(!isLongitudeValid(parsedLongitude))

    // A API exige latitude e longitude no PUT, mesmo quando só o nome muda.
    if (
      hasNameError ||
      hasCityError ||
      hasStateError ||
      !isLatitudeValid(parsedLatitude) ||
      !isLongitudeValid(parsedLongitude)
    ) {
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    try {
      // Upload antes de salvar: se falhar, o endpoint de criação/edição não é chamado.
      const urlFoto = await photo.upload()
      const updated = await updatePraia(beach.id, {
        nome: trimmedName,
        cidade: trimmedCity,
        estado: trimmedState.toUpperCase(),
        latitude: parsedLatitude,
        longitude: parsedLongitude,
        urlFoto,
      })
      onUpdated(updated)
      onOpenChange(false)
    } catch (err) {
      setSubmitError(
        err instanceof ApiError || err instanceof ImageUploadError ? err.message : "Não foi possível salvar a praia."
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
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={latitudeId}>Latitude: *</Label>
            <Input
              id={latitudeId}
              value={latitude}
              onChange={(event) => {
                setLatitude(event.target.value)
                if (latitudeError) setLatitudeError(false)
              }}
              placeholder="Ex: -8,1189"
              inputMode="decimal"
              aria-invalid={latitudeError}
            />
            {latitudeError && (
              <span className="text-xs text-destructive">Informe uma latitude entre -90 e 90.</span>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={longitudeId}>Longitude: *</Label>
            <Input
              id={longitudeId}
              value={longitude}
              onChange={(event) => {
                setLongitude(event.target.value)
                if (longitudeError) setLongitudeError(false)
              }}
              placeholder="Ex: -34,8998"
              inputMode="decimal"
              aria-invalid={longitudeError}
            />
            {longitudeError && (
              <span className="text-xs text-destructive">Informe uma longitude entre -180 e 180.</span>
            )}
          </div>
        </div>
        {beach && (beach.latitude == null || beach.longitude == null) ? (
          <p className="-mt-2 text-xs text-amber-600">
            Esta praia ainda não tem coordenadas. Preencha o centro da praia para conseguir salvar:
            sem elas, a praia não aparece para os usuários.
          </p>
        ) : (
          <p className="-mt-2 text-xs text-muted-foreground">
            Use o centro da praia. A distância até os usuários é calculada a partir desse ponto.
          </p>
        )}
        <ImageFileInput
          id={photoId}
          label="Foto: (opcional)"
          file={photo.file}
          onFileChange={photo.setFile}
          disabled={isSubmitting}
        />
        {submitError && (
          <span className="text-xs text-destructive">{submitError}</span>
        )}

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />} disabled={isSubmitting}>
            Cancelar
          </DialogClose>
          <Button onClick={handleConfirm} disabled={isSubmitting}>
            {photo.isUploading ? "Enviando imagem..." : isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
