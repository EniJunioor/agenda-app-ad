"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { CoupleHeader } from "./couple-header"
import { Calendar, Clock, Settings, LogOut, Users, Sparkles, Plus, Moon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAgenda } from "@/context/agenda-context"
import { motion } from "framer-motion"

const principalItems = [
  { href: "/agenda", icon: Calendar, label: "Agenda" },
  { href: "/historico", icon: Clock, label: "Histórico" },
  { href: "/sugestoes", icon: Sparkles, label: "Sugestões" }
]

const contaItems = [
  { href: "/casal", icon: Users, label: "Nosso Perfil" },
  { href: "/configuracoes", icon: Settings, label: "Configurações" }
]

export function AppSidebar() {
  const pathname = usePathname()
  const { logout } = useAgenda()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const renderNavLink = (item: (typeof principalItems)[0] | (typeof contaItems)[0], idx: number) => {
    const Icon = item.icon
    const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
    return (
      <motion.li
        key={item.href}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: idx * 0.04 }}
      >
        <Link
          href={item.href}
          className={cn(
            "group flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors rounded-lg",
            isActive
              ? "bg-sidebar-accent text-primary"
              : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground"
          )}
        >
          <Icon className={cn("h-4.5 w-4.5 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
          <span>{item.label}</span>
        </Link>
      </motion.li>
    )
  }

  const handleToggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark"
    setTheme(next)
  }

  return (
    <aside className="hidden lg:flex w-72 flex-col border-r border-border bg-sidebar">
      <div className="p-5 border-b border-border/50">
        <CoupleHeader variant="stack" />
      </div>

      <div className="px-4 pt-4">
        <Link
          href="/agenda?novo=1"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Novo evento
        </Link>
      </div>

      <nav className="flex-1 px-2 py-5 overflow-y-auto">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 pl-4">
          Principal
        </p>
        <ul className="space-y-0.5 mb-6">
          {principalItems.map((item, idx) => renderNavLink(item, idx))}
        </ul>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 pl-4">
          Conta
        </p>
        <ul className="space-y-0.5">
          {contaItems.map((item, idx) => renderNavLink(item, idx))}
        </ul>
      </nav>

      <div className="p-4 border-t border-border/50 space-y-2">
        <button
          type="button"
          onClick={handleToggleTheme}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent/70 transition-colors"
        >
          <Moon className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-sm text-muted-foreground">Aparência</span>
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-primary hover:bg-sidebar-accent/70 transition-colors font-medium"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sair
        </button>
      </div>
    </aside>
  )
}
