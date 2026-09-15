const STEPS = [
    {
    number: 1,
    title: "Escolha o que deseja",
    description:
    "Encontre o que você quer e faça seu pedido diretamente pelo app, de forma rápida e fácil.",
    },

    {
    number: 2,
    title: "Vendedores são alertados",
    description:
    "Os vendedores próximos recebem seu pedido em tempo real e podem atender à sua solicitação.",
    },

    {
    number: 3,
    title: "Receba na areia",
    description:
    "O vendedor vai até você na praia e entrega seu pedido fresquinho, sem você precisar sair do lugar.",
    },

] as const

export function InstructionsSection() {
  return (
    <section className="border-t border-white/10 bg-[#1b2335] px-4 py-8 my-6 lg:px-30">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {STEPS.map((step) => (
          <div key={step.number} className="flex flex-col gap-2">
            <span className="flex size-7 items-center justify-center rounded-full border border-brand-blue/40 bg-brand-blue/15 text-xs font-semibold text-brand-blue">
              {step.number}
            </span>
            <p className="font-heading text-sm font-semibold text-white">{step.title}</p>
            <p className="text-xs text-white/60">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
