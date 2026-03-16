"use client"

import { categories, Category } from "@/data/events"
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
          "inline-flex items-center h-8 px-3 rounded-full text-sm font-medium transition-all",
          selectedCategory === null
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        )}
      >
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
              "inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-sm font-medium transition-all",
              isSelected
                ? "ring-2 ring-offset-1"
                : "hover:opacity-80"
            )}
            style={{ 
              backgroundColor: category.bg, 
              color: category.text,
              ringColor: isSelected ? category.text : undefined
            }}
          >
            {Icon && <Icon className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{category.label}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
