"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, Clock, Heart, Settings, Plus, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const navItems = [
  { href: "/agenda", icon: Calendar, label: "Agenda" },
  { href: "/historico", icon: Clock, label: "Historico" },
  { href: "/casal", icon: Heart, label: "Nos" },
  { href: "/configuracoes", icon: Settings, label: "Config" }
]

interface MobileNavProps {
  onAddClick?: () => void
}

export function MobileNav({ onAddClick }: MobileNavProps) {
  const pathname = usePathname()
  
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
      {/* Gradient blur background */}
      <div className="absolute inset-0 bg-gradient-to-t from-card via-card to-transparent" />
      
      <div className="relative glass border-t border-border/30">
        <div className="flex items-center justify-around py-2 px-2 max-w-md mx-auto">
          {navItems.slice(0, 2).map(item => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center gap-0.5 p-2 min-w-[60px]"
              >
                <motion.div
                  className={cn(
                    "p-2 rounded-xl transition-colors",
                    isActive ? "bg-primary/10" : ""
                  )}
                  whileTap={{ scale: 0.92 }}
                >
                  <Icon className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )} />
                </motion.div>
                <span className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-0.5 h-1 w-6 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </Link>
            )
          })}
          
          {/* Central Add Button */}
          {onAddClick && (
            <div className="relative -mt-6">
              <motion.button
                onClick={onAddClick}
                className="relative flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-primary/30 rounded-full blur-lg scale-150" />
                
                <div className="relative h-14 w-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
                  <Plus className="h-6 w-6 text-primary-foreground" />
                </div>
                
                {/* Sparkle animation */}
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <Sparkles className="h-4 w-4 text-gold" />
                </motion.div>
              </motion.button>
            </div>
          )}
          
          {navItems.slice(2).map(item => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center gap-0.5 p-2 min-w-[60px]"
              >
                <motion.div
                  className={cn(
                    "p-2 rounded-xl transition-colors",
                    isActive ? "bg-primary/10" : ""
                  )}
                  whileTap={{ scale: 0.92 }}
                >
                  <Icon className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )} />
                </motion.div>
                <span className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-0.5 h-1 w-6 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </Link>
            )
          })}
        </div>
      </div>
      
      {/* Safe area padding for notched devices */}
      <div className="h-safe-area-inset-bottom bg-card" />
    </nav>
  )
}
