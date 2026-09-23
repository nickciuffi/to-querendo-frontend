import * as React from "react"
import { CheckCircle2 } from "lucide-react"

import { BeachSelect } from "@/components/beach-select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { ApiError } from "@/services/http-client"
import { getCurrentUser, updateCurrentUser, type UpdateCurrentUserPayload } from "@/services/auth-service"

function onlyDigits(value: string) {
  return value.replace(/\D/g, "")
}

function formatCpf(value: string) {
  const digits = onlyDigits(value).slice(0, 11)
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
}

function formatPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11)
  if (digits.length <= 2) return digits.replace(/(\d{1,2})/, "($1")
  if (digits.length <= 6) return digits.replace(/(\d{2})(\d+)/, "($1) $2")
  if (digits.length <= 10) return digits.replace(/(\d{2})(\d{4})(\d+)/, "($1) $2-$3")
  return digits.replace(/(\d{2})(\d{5})(\d+)/, "($1) $2-$3")
}

const inputClassName =
  "h-10 border-white/15 bg-white/5 text-white placeholder:text-white/35 focus-visible:border-[#FC800C] focus-visible:ring-[#FC800C]/30 disabled:bg-white/5"

export function UsuarioPage() {
  const { hasRole, user, updateUser } = useAuth()

  const nameId = React.useId()
  const phoneId = React.useId()
  const cpfId = React.useId()
  const photoUrlId = React.useId()
  const beachId = React.useId()

  const [name, setName] = React.useState(user?.name ?? "")
  const [phone, setPhone] = React.useState(formatPhone(user?.phone ?? ""))
  const [cpf, setCpf] = React.useState(formatCpf(user?.cpf ?? ""))
  const [photoUrl, setPhotoUrl] = React.useState(user?.photoUrl ?? "")
  const [idPraia, setIdPraia] = React.useState<number | null>(user?.beach?.id ?? null)

  const [nameError, setNameError] = React.useState(false)
  const [cpfError, setCpfError] = React.useState(false)
  const [phoneError, setPhoneError] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [saved, setSaved] = React.useState(false)

  if (!user) return null

  const initial = (name.trim()[0] ?? user.name.trim()[0] ?? "?").toUpperCase()

  const isDirty =
    name.trim() !== user.name ||
    onlyDigits(phone) !== (user.phone ?? "") ||
    onlyDigits(cpf) !== (user.cpf ?? "") ||
    photoUrl.trim() !== (user.photoUrl ?? "") ||
    idPraia !== (user.beach?.id ?? null)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!user) return

    const trimmedName = name.trim()
    const phoneDigits = onlyDigits(phone)
    const cpfDigits = onlyDigits(cpf)

    const hasNameError = !trimmedName
    const hasPhoneError = phoneDigits.length > 0 && phoneDigits.length < 10
    const hasCpfError = cpfDigits.length > 0 && cpfDigits.length !== 11

    setNameError(hasNameError)
    setPhoneError(hasPhoneError)
    setCpfError(hasCpfError)

    if (hasNameError || hasPhoneError || hasCpfError) return

    // A API ignora campos ausentes, então só enviamos o que foi preenchido.
    const payload: UpdateCurrentUserPayload = { nome: trimmedName }
    if (phoneDigits) payload.telefone = phoneDigits
    if (cpfDigits) payload.cpf = cpfDigits
    if (photoUrl.trim()) payload.urlFoto = photoUrl.trim()
    if (idPraia) payload.idPraia = idPraia

    setIsSubmitting(true)
    setSubmitError(null)
    setSaved(false)
    try {
      await updateCurrentUser(payload)
      const refreshedUser = await getCurrentUser()
      updateUser(refreshedUser)
      setSaved(true)
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Não foi possível salvar seus dados.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-between px-4 lg:px-30 lg:flex-row lg:gap-20">
    <div className="pb-8 flex-1 lg:max-w-[70%] mx-auto text-white w-full">
      <div className="mx-auto mt-6 w-full">
        <h2 className="text-3xl font-bold leading-tight">Meus dados</h2>
        <p className="leading-snug text-white/55">Atualize suas informações pessoais e sua praia atual.</p>

        <div className="mt-6 flex items-center gap-4 rounded-xl border border-white/10 bg-[#1b2335] p-4">
          <Avatar className="size-16">
            {photoUrl.trim() && <AvatarImage src={photoUrl.trim()} alt={name} />}
            <AvatarFallback className="bg-[#FC800C]/15 text-xl text-[#FC800C]">{initial}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-semibold">{name.trim() || user.name}</p>
            <p className="truncate text-sm text-white/55">{user.email}</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-4 flex flex-col gap-5 rounded-xl border border-white/10 bg-[#1b2335] p-4"
          noValidate
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={nameId} className="text-white/80">Nome *</Label>
            <Input
              id={nameId}
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                if (nameError) setNameError(false)
                setSaved(false)
              }}
              placeholder="Seu nome completo"
              autoComplete="name"
              aria-invalid={nameError}
              className={inputClassName}
            />
            {nameError && <span className="text-xs text-destructive">Nome é obrigatório.</span>}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={phoneId} className="text-white/80">Telefone</Label>
              <Input
                id={phoneId}
                value={phone}
                onChange={(event) => {
                  setPhone(formatPhone(event.target.value))
                  if (phoneError) setPhoneError(false)
                  setSaved(false)
                }}
                placeholder="(11) 99999-9999"
                inputMode="tel"
                autoComplete="tel"
                aria-invalid={phoneError}
                className={inputClassName}
              />
              {phoneError && <span className="text-xs text-destructive">Telefone incompleto.</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor={cpfId} className="text-white/80">CPF</Label>
              <Input
                id={cpfId}
                value={cpf}
                onChange={(event) => {
                  setCpf(formatCpf(event.target.value))
                  if (cpfError) setCpfError(false)
                  setSaved(false)
                }}
                placeholder="000.000.000-00"
                inputMode="numeric"
                aria-invalid={cpfError}
                className={inputClassName}
              />
              {cpfError && <span className="text-xs text-destructive">O CPF deve ter 11 dígitos.</span>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor={photoUrlId} className="text-white/80">URL da foto</Label>
            <Input
              id={photoUrlId}
              value={photoUrl}
              onChange={(event) => {
                setPhotoUrl(event.target.value)
                setSaved(false)
              }}
              placeholder="https://..."
              inputMode="url"
              className={inputClassName}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor={beachId} className="text-white/80">Praia atual</Label>
            <BeachSelect
              id={beachId}
              value={idPraia}
              onValueChange={(id) => {
                setIdPraia(id)
                setSaved(false)
              }}
              className="h-10 w-full justify-start"
            />
          </div>

          {submitError && <p className="text-sm text-destructive">{submitError}</p>}
          {saved && (
            <p className="flex items-center gap-1.5 text-sm text-emerald-400">
              <CheckCircle2 className="size-4" />
              Dados atualizados com sucesso.
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="h-10 w-full bg-[#FC800C] text-white hover:bg-[#FC800C]/90"
          >
            {isSubmitting ? "Salvando..." : "Salvar alterações"}
          </Button>
        </form>
      </div>
    </div>
   
    </div>
  )
}
