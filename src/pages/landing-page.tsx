import { Link } from "react-router-dom"
import { MapPin, ShoppingBag, Waves } from "lucide-react"

import { Button } from "@/components/ui/button"

const features = [
  {
    icon: MapPin,
    title: "Sem sair do seu lugar",
    description: "Descreva onde você está na areia e o vendedor vai até você.",
  },
  {
    icon: ShoppingBag,
    title: "Peça o que quiser",
    description: "Água de coco, petiscos e muito mais, direto dos vendedores da praia.",
  },
  {
    icon: Waves,
    title: "Feito pra praia",
    description: "Encontre vendedores perto de você e acompanhe seus pedidos em tempo real.",
  },
]

export function LandingPage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#0F172A] text-white">
      <img
        src="/landing-hero.png"
        alt="Vendedor ambulante Tô Querendo em um carrinho na praia"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/80 to-[#0F172A]/20" />

      <div className="relative z-10 mx-100 flex min-h-dvh w-full max-w-md flex-col justify-end gap-10 px-6 pt-20 pb-10">
        <div className="flex flex-col gap-3 text-center">
          <h1 className="font-heading text-4xl font-bold leading-tight">Tô Querendo</h1>
          <p className="text-base text-white/80">
            Peça bebidas, petiscos e produtos para os vendedores da praia sem sair da sua cadeira.
            Diga onde você está e eles levam até você.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-orange/20 text-brand-orange">
                <feature.icon className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">{feature.title}</p>
                <p className="text-xs text-white/60">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <Button
          render={<Link to="/login" />}
          size="lg"
          className="h-12 w-full bg-brand-orange text-base font-semibold text-white hover:bg-brand-orange/90"
        >
          Entrar
        </Button>
      </div>
    </div>
  )
}
