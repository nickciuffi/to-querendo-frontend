import { Outlet } from "react-router-dom"

import { BottomNav } from "@/components/layout/bottom-nav"

export function AppLayout() {
  return (
    <div className="flex h-dvh flex-col bg-background">
      <div className="min-h-0 flex-1">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  )
}
