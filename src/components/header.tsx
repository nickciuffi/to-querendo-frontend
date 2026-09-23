import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function Header() {

    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const firstName = user?.name.split(" ")[0] ?? "visitante"
    const initial = (user?.name.trim()[0] ?? "?").toUpperCase()

    function handleLogout() {
        logout()
        navigate("/login", { replace: true })
    }

    return <div className="sticky top-0 z-10 backdrop-blur">
            <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 lg:px-30 py-4 bg-[#1b2335]">
              <div className="min-w-0">
                <p className="text-xs text-white/70">Olá, {firstName} 👋</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
                  <Avatar className="cursor-pointer">
                    <AvatarFallback className="bg-brand-orange/15 text-brand-orange">
                      {initial}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>
                      <p className="truncate font-medium text-foreground">{user?.name}</p>
                      <p className="truncate text-xs font-normal text-muted-foreground">{user?.email}</p>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                    <LogOut />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </header>
          </div>
}