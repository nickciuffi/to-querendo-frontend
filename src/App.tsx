import { Suspense, lazy } from "react"
import { Navigate, Route, Routes } from "react-router-dom"

import { AppLayout } from "@/components/layout/app-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { HomePage } from "@/pages/home-page"
import { CadastroPage } from "@/pages/cadastro-page"
import { LoginPage } from "@/pages/login-page"
import { AdminPage } from "@/pages/admin/admin-page"
import { UsuarioPage } from "@/pages/usuario-page"
import { PedidosPage } from "@/pages/pedidos-page"
import { LandingPage } from "@/pages/landing-page"

import { useAuth } from "@/hooks/use-auth"

const MapPage = lazy(() => import("@/pages/map-page").then((m) => ({ default: m.MapPage })))
const VendorsMapPage = lazy(() =>
  import("@/pages/vendors-map-page").then((m) => ({ default: m.VendorsMapPage }))
)

/** Vendedores veem o mapa de banhistas; os demais usuários veem o mapa de vendedores. */
function MapRoute() {
  const { hasRole } = useAuth()
  return hasRole("ROLE_VENDEDOR") ? <VendorsMapPage /> : <MapPage />
}

function App() {
  return (
    <Routes>
      <Route path="/hello" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<CadastroPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route
            path="mapa"
            element={
              <Suspense fallback={<div className="flex h-full items-center justify-center text-sm text-muted-foreground">Carregando mapa…</div>}>
                <MapRoute />
              </Suspense>
            }
          />
          <Route path="usuario" element={<UsuarioPage />} />
          <Route path="pedidos" element={<PedidosPage />} />

          <Route path="admin" element={<ProtectedRoute role="ROLE_ADMIN" />}>
            <Route index element={<AdminPage />} />
          </Route>
        </Route>

      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
