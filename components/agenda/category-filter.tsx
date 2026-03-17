"use client"

import { categories } from "@/data/events"
import { useAgenda } from "@/context/agenda-context"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { 
  Music, 
  Film, 
  UtensilsCrossed, 
  Heart, 
  Users, 
  Plane, 
  TreePine, 
  Cake,
  LucideIcon
} from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  Music,
  Film,
  UtensilsCrossed,
  Heart,
  Users,
  Plane,
  TreePine,
  Cake
}

export function CategoryFilter() {
  const { selectedCategory, setSelectedCategory } = useAgenda()
  
  return (
    <div className="flex flex-wrap gap-2">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setSelectedCategory(null)}
        className={cn(
          "inline-flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium transition-all",
          selectedCategory === null
            ? "bg-primary text-primary-foreground"
            : "bg-card border border-border text-foreground hover:bg-muted"
        )}
      >
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full shrink-0",
            selectedCategory === null ? "bg-primary-foreground" : "bg-muted-foreground"
          )}
        />
        Todos
      </motion.button>
      
      {categories.map((category) => {
        const Icon = iconMap[category.icon]
        const isSelected = selectedCategory === category.id
        
        return (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedCategory(isSelected ? null : category.id)}
            className={cn(
              "inline-flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium transition-all border",
              isSelected
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border border-border text-foreground hover:bg-muted dark:border-white/20"
            )}
          >
            {Icon && <Icon className="h-4 w-4 shrink-0" />}
            <span className="hidden sm:inline">{category.label}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
