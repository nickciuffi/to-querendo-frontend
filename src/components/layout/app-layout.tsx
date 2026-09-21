import { Outlet } from "react-router-dom"

import { BottomNav } from "@/components/layout/bottom-nav"
import { Header } from "../header"

export function AppLayout() {
  return (
    <div className="min-h-screen flex h-full flex-col justify-between overflow-y-auto bg-[#0F172A]">
        <Header />
        <Outlet />
        <BottomNav />
    </div>
  )
}
