"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, Clock, Settings, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/agenda", icon: Calendar, label: "Agenda" },
  { href: "/historico", icon: Clock, label: "Histórico" },
  { href: "/configuracoes", icon: Settings, label: "Ajustes" }
]

interface MobileNavProps {
  onAddClick?: () => void
}

export function MobileNav({ onAddClick }: MobileNavProps) {
  const pathname = usePathname()
  
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.slice(0, 2).map(item => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
        
        {onAddClick && (
          <button
            onClick={onAddClick}
            className="flex flex-col items-center gap-1 p-2"
          >
            <div className="h-12 w-12 -mt-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
              <Plus className="h-6 w-6" />
            </div>
          </button>
        )}
        
        {navItems.slice(2).map(item => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
