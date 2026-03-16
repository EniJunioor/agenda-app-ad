"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { CoupleHeader } from "./couple-header"
import { CategoryLegend } from "./category-legend"
import { ThemeToggle } from "@/components/theme-toggle"
import { Calendar, Clock, Settings, LogOut, Heart, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAgenda } from "@/context/agenda-context"
import { motion } from "framer-motion"

const navItems = [
  { href: "/agenda", icon: Calendar, label: "Agenda" },
  { href: "/historico", icon: Clock, label: "Historico" },
  { href: "/casal", icon: Heart, label: "Nosso Perfil" },
  { href: "/sugestoes", icon: Sparkles, label: "Sugestoes" },
  { href: "/configuracoes", icon: Settings, label: "Configuracoes" }
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
    <aside className="hidden lg:flex w-72 border-r border-border bg-card/50 backdrop-blur-sm flex-col">
      <div className="p-6 border-b border-border/50">
        <CoupleHeader />
      </div>
      
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-1.5">
          {navItems.map((item, idx) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            
            return (
              <motion.li 
                key={item.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 transition-transform group-hover:scale-110",
                    isActive && "text-primary-foreground"
                  )} />
                  <span>{item.label}</span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeSidebarIndicator"
                      className="absolute right-3 h-2 w-2 rounded-full bg-primary-foreground"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                </Link>
              </motion.li>
            )
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-border/50">
        <CategoryLegend />
      </div>
      
      <div className="p-4 border-t border-border/50">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">Tema</span>
          <ThemeToggle />
        </div>
        
        <motion.button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive w-full"
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut className="h-5 w-5" />
          Sair da conta
        </motion.button>
      </div>
    </aside>
  )
}
