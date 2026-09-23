import { Outlet } from "react-router-dom"

import { BottomNav } from "@/components/layout/bottom-nav"
import { Header } from "../header"

export function AppLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-[#0F172A]">
        <Header />
        <main className="flex flex-1 flex-col">
          <Outlet />
        </main>
        <BottomNav />
    </div>
  )
}
