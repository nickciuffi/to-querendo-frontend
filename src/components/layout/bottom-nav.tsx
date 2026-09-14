import { Home, MapPin, ShoppingBag, UserRound } from "lucide-react"
import { NavLink } from "react-router-dom"

import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { to: "/", label: "Início", icon: Home, end: true },
  { to: "/mapa", label: "Mapa", icon: MapPin, end: false },
  { to: "#", label: "Pedidos", icon: ShoppingBag, disabled: true },
  { to: "#", label: "Perfil", icon: UserRound, disabled: true },
] as const

export function BottomNav() {
  return (
    <nav
      className="shrink-0 border-t border-white/10 bg-[#1b2335] backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          if ("disabled" in item) {
            return (
              <li key={item.label} className="flex-1">
                <div className="flex flex-col items-center gap-0.5 px-2 py-2.5 text-white/40">
                  <Icon className="size-5" />
                  <span className="text-[0.65rem] font-medium">{item.label}</span>
                  <span className="text-[0.55rem] leading-none text-white/30">em breve</span>
                </div>
              </li>
            )
          }
          return (
            <li key={item.label} className="flex-1">
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center gap-0.5 px-2 py-2.5 text-white/60 transition-colors",
                    isActive && "text-brand-orange"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn("size-5", isActive && "fill-brand-orange/15")} />
                    <span className="text-[0.65rem] font-medium">{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
