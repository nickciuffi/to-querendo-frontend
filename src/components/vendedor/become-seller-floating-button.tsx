import { Store } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { FloatingButton } from "@/components/floating-button"
import { useAuth } from "@/hooks/use-auth"

export function BecomeSellerFloatingButton() {
  const { user, hasRole } = useAuth()
  const navigate = useNavigate()

  if (!user || hasRole("ROLE_VENDEDOR")) return null

  return (
    <FloatingButton onClick={() => navigate("/usuario")}>
      <Store className="size-5" />
      Virar vendedor
    </FloatingButton>
  )
}
