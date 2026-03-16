"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, Clock, Heart, Settings, Plus, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const navItems = [
  { href: "/agenda", icon: Calendar, label: "Agenda" },
  { href: "/historico", icon: Clock, label: "Historico" },
  { href: "/sugestoes", icon: Sparkles, label: "Ideias" },
  { href: "/casal", icon: Heart, label: "Nos" },
  { href: "/configuracoes", icon: Settings, label: "Config" }
]

interface MobileNavProps {
  onAddClick?: () => void
}

export function MobileNav({ onAddClick }: MobileNavProps) {
  const pathname = usePathname()
  
  return (
    <motion.nav 
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="relative glass border-t border-border/40 safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-1.5">
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center gap-0.5 py-1.5 px-3"
              >
                <motion.div
                  className={cn(
                    "p-2 rounded-xl transition-colors duration-200",
                    isActive ? "bg-primary/15" : "hover:bg-secondary/80"
                  )}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Icon className={cn(
                    "h-5 w-5 transition-colors duration-200",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )} />
                </motion.div>
                <span className={cn(
                  "text-[10px] font-medium transition-colors duration-200",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="mobileNavIndicator"
                    className="absolute -bottom-0.5 h-0.5 w-8 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </motion.nav>
  )
}
