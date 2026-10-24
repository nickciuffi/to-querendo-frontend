import { Link } from "react-router-dom"
import { ShieldAlert } from "lucide-react"

import { Button } from "@/components/ui/button"

export function AccessDeniedPage() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-6 bg-linear-to-b from-brand-blue/15 via-background to-brand-yellow/10 px-6 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-brand-orange text-white shadow-lg shadow-brand-orange/30">
        <ShieldAlert className="size-8" />
      </div>
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Acesso negado</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Você não tem permissão para acessar esta página.
        </p>
      </div>
      <Button
        render={<Link to="/" />}
        size="lg"
        className="bg-brand-orange text-white hover:bg-brand-orange/90"
      >
        Voltar para a home
      </Button>
    </div>
  )
}
