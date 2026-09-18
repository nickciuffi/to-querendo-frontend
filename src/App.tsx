import { Suspense, lazy } from "react"
import { Navigate, Route, Routes } from "react-router-dom"

import { AppLayout } from "@/components/layout/app-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { HomePage } from "@/pages/home-page"
import { CadastroPage } from "@/pages/cadastro-page"
import { LoginPage } from "@/pages/login-page"
import { AdminPage } from "@/pages/admin/admin-page"
import { VendedorPage } from "@/pages/vendedor/vendedor-page"

const MapPage = lazy(() => import("@/pages/map-page").then((m) => ({ default: m.MapPage })))

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<CadastroPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route
            path="mapa"
            element={
              <Suspense fallback={<div className="flex h-full items-center justify-center text-sm text-muted-foreground">Carregando mapa…</div>}>
                <MapPage />
              </Suspense>
            }
          />
          <Route path="vendedor" element={<ProtectedRoute role="ROLE_VENDEDOR" />}>
            <Route index element={<VendedorPage />} />
          </Route>
        </Route>

        <Route path="admin" element={<ProtectedRoute role="ROLE_ADMIN" />}>
          <Route index element={<AdminPage />} />
        </Route>

      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
