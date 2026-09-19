import { Navigate, Outlet } from "react-router-dom"

import { useAuth } from "@/hooks/use-auth"
import { AccessDeniedPage } from "@/pages/access-denied-page"
import type { Role } from "@/lib/types"

interface ProtectedRouteProps {
  role?: Role
}

export function ProtectedRoute({ role }: ProtectedRouteProps) {
  const { user, hasRole } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (role && !hasRole(role)) {
    return <AccessDeniedPage />
  }

  return <Outlet />
}
