import * as React from "react"
import { CheckCircle2, Plus } from "lucide-react"

import { BeachSelect } from "@/components/beach-select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BecomeSellerCard } from "@/components/vendedor/become-seller-card"
import { CreateSellerProductModal } from "@/components/vendedor/create-seller-product-modal"
import { SellerProductList } from "@/components/vendedor/seller-product-list"
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
  const onlineId = React.useId()
  const sellerDescriptionId = React.useId()

  const [name, setName] = React.useState(user?.name ?? "")
  const [phone, setPhone] = React.useState(formatPhone(user?.phone ?? ""))
  const [cpf, setCpf] = React.useState(formatCpf(user?.cpf ?? ""))
  const [photoUrl, setPhotoUrl] = React.useState(user?.photoUrl ?? "")
  const [idPraia, setIdPraia] = React.useState<number | null>(user?.beach?.id ?? null)
  const [online, setOnline] = React.useState(user?.online ?? false)
  const [sellerDescription, setSellerDescription] = React.useState(user?.description ?? "")

  const [nameError, setNameError] = React.useState(false)
  const [cpfError, setCpfError] = React.useState(false)
  const [phoneError, setPhoneError] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [saved, setSaved] = React.useState(false)

  const [isCreateProductOpen, setIsCreateProductOpen] = React.useState(false)
  const [productsReloadKey, setProductsReloadKey] = React.useState(0)

  if (!user) return null

  const isSeller = hasRole("ROLE_VENDEDOR")

  const isDirty =
    (isSeller &&
      (online !== (user.online ?? false) ||
        sellerDescription.trim() !== (user.description ?? ""))) ||
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
    if (isSeller) {
      payload.online = online
      // Enviamos mesmo vazia, para o vendedor conseguir apagar a descrição.
      payload.descricao = sellerDescription.trim()
    }

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
    <div className="flex flex-1 flex-col items-start justify-between px-4 lg:px-30 lg:flex-row lg:gap-20">
    <div className="pb-8 flex-1 lg:max-w-[70%] mx-auto text-white w-full">
      <div className="mx-auto mt-6 w-full">
        <h2 className="text-3xl font-bold leading-tight">Meus dados</h2>
        <p className="leading-snug text-white/55">Atualize suas informações pessoais e sua praia atual.</p>

        <form
          onSubmit={handleSubmit}
          className="mt-4 flex flex-col gap-4 rounded-xl border border-white/10 bg-[#1b2335] p-4"
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

          {isSeller && (
            <div className="flex flex-col gap-4 border-t border-white/10 pt-2">
              <p className="text-sm font-semibold text-white">Dados de vendedor</p>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor={onlineId} className="text-white/80">Está online</Label>
                <Select
                  value={online ? "true" : "false"}
                  onValueChange={(value) => {
                    setOnline(value === "true")
                    setSaved(false)
                  }}
                >
                  <SelectTrigger
                    id={onlineId}
                    className="h-10 w-full border-white/15 bg-white/5 text-white hover:bg-white/10 sm:w-48"
                  >
                    <SelectValue>
                      {(value: string | null) => (
                        <span className="flex items-center gap-2">
                          <span
                            className={`size-2 rounded-full ${value === "true" ? "bg-emerald-400" : "bg-white/40"}`}
                          />
                          {value === "true" ? "Sim" : "Não"}
                        </span>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Sim</SelectItem>
                    <SelectItem value="false">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor={sellerDescriptionId} className="text-white/80">
                  Descrição do seu negócio
                </Label>
                <Input
                  id={sellerDescriptionId}
                  value={sellerDescription}
                  onChange={(event) => {
                    setSellerDescription(event.target.value)
                    setSaved(false)
                  }}
                  maxLength={500}
                  placeholder="Ex: Bebidas geladinhas e petiscos na areia"
                  className={inputClassName}
                />
              </div>
            </div>
          )}

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
     { 
    hasRole("ROLE_VENDEDOR") &&  (
        <div className="pb-8 flex-1 text-white w-full">
          <div className="mx-auto mt-6 w-full">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-3xl font-bold leading-tight">Meus Produtos</h2>
              <Button
                onClick={() => setIsCreateProductOpen(true)}
                className="bg-[#FC800C] text-white hover:bg-[#FC800C]/90"
              >
                <Plus />
                Adicionar
              </Button>
            </div>
            <p className="leading-snug text-white/55">Gerencie os seus produtos e serviços.</p>
            <div className="mt-6 rounded-xl border border-white/10 bg-[#1b2335] p-4">
              <SellerProductList reloadKey={productsReloadKey} />
            </div>
            <CreateSellerProductModal
              open={isCreateProductOpen}
              onOpenChange={setIsCreateProductOpen}
              onCreated={() => setProductsReloadKey((key) => key + 1)}
            />

          </div>
        </div>
      )
    }
    {!hasRole("ROLE_VENDEDOR") && (
      <div className="pb-8 flex-1 text-white w-full">
        <div className="mx-auto mt-6 w-full">
          <h2 className="text-3xl font-bold leading-tight">Seja um vendedor</h2>
          <p className="leading-snug text-white/55">Comece a vender seus produtos na praia.</p>
          <div className="mt-4">
            <BecomeSellerCard />
          </div>
        </div>
      </div>
    )}

    </div>
  )
}
