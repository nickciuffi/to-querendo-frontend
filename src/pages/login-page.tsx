import * as React from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { Waves } from "lucide-react"

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
import { useAuth } from "@/hooks/use-auth"
import { BEACHES } from "@/lib/mock-data"

const BEACH_SELECT_ITEMS = BEACHES.map((beach) => ({
  value: beach.id,
  label: `${beach.name} · ${beach.city}`,
}))

export function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [beachId, setBeachId] = React.useState<string>("")
  const [error, setError] = React.useState<string | null>(null)

  if (user) {
    return <Navigate to="/" replace />
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (!name.trim() || !email.trim() || !password.trim() || !beachId) {
      setError("Preencha seu nome, e-mail, senha e escolha uma praia para continuar.")
      return
    }

    setError(null)
    login({ name: name.trim(), email: email.trim(), role: "cliente", beachId })
    navigate("/", { replace: true })
  }

  return (
    <div className="flex h-dvh flex-col justify-between overflow-y-auto bg-linear-to-b from-brand-blue/15 via-background to-brand-yellow/10 px-6 py-10">
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-brand-orange text-white shadow-lg shadow-brand-orange/30">
            <Waves className="size-8" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-semibold text-foreground">Tô Querendo</h1>
            <p className="text-sm text-muted-foreground">
              Peça o que quiser sem sair da sua cadeira, direto na praia.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              placeholder="Como podemos te chamar?"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="voce@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="beach">Em qual praia você está?</Label>
            <Select
              items={BEACH_SELECT_ITEMS}
              value={beachId}
              onValueChange={(value) => setBeachId(value ?? "")}
            >
              <SelectTrigger id="beach" className="w-full">
                <SelectValue placeholder="Escolha sua praia" />
              </SelectTrigger>
              <SelectContent>
                {BEACHES.map((beach) => (
                  <SelectItem key={beach.id} value={beach.id}>
                    {beach.name} · {beach.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            type="submit"
            size="lg"
            className="mt-2 bg-brand-orange text-white hover:bg-brand-orange/90"
          >
            Entrar
          </Button>
        </form>
      </div>

      <p className="mx-auto text-center text-xs text-muted-foreground">
        Ao continuar, você concorda com nossos termos de uso.
      </p>
    </div>
  )
}
