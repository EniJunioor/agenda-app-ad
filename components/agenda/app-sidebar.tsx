"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CoupleHeader } from "./couple-header"
import { CategoryLegend } from "./category-legend"
import { Calendar, Clock, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAgenda } from "@/context/agenda-context"
import { useRouter } from "next/navigation"

const navItems = [
  { href: "/agenda", icon: Calendar, label: "Agenda" },
  { href: "/historico", icon: Clock, label: "Histórico" },
  { href: "/configuracoes", icon: Settings, label: "Ajustes" }
]

export function AppSidebar() {
  const pathname = usePathname()
  const { logout } = useAgenda()
  const router = useRouter()
  
  const handleLogout = () => {
    logout()
    router.push("/")
  }
  
  return (
    <aside className="hidden lg:flex w-64 border-r border-border bg-card flex-col">
      <div className="p-6">
        <CoupleHeader />
      </div>
      
      <nav className="flex-1 px-4">
        <ul className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      
      <div className="p-6 border-t border-border">
        <CategoryLegend />
      </div>
      
      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-muted-foreground hover:bg-secondary hover:text-foreground w-full"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </button>
      </div>
    </aside>
  )
}
