"use client"

import { Category } from "@/data/events"
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
import { cn } from "@/lib/utils"

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

interface CategoryBadgeProps {
  category: Category
  size?: "sm" | "md" | "lg"
  showEmoji?: boolean
  className?: string
}

export function CategoryBadge({ 
  category, 
  size = "md", 
  showEmoji = false,
  className 
}: CategoryBadgeProps) {
  const Icon = iconMap[category.icon]
  
  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 px-3 text-sm gap-2",
    lg: "h-10 px-4 text-base gap-2"
  }
  
  if (size === "sm") {
    return (
      <div
        className={cn(
          "inline-flex items-center justify-center rounded-full",
          sizeClasses[size],
          className
        )}
        style={{ backgroundColor: category.bg, color: category.text }}
      >
        {Icon && <Icon className="h-3.5 w-3.5" />}
      </div>
    )
  }
  
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: category.bg, color: category.text }}
    >
      {showEmoji ? (
        <span>{category.emoji}</span>
      ) : (
        Icon && <Icon className={size === "lg" ? "h-5 w-5" : "h-4 w-4"} />
      )}
      <span>{category.label}</span>
    </div>
  )
}

export function CategoryIcon({ 
  category, 
  className 
}: { 
  category: Category
  className?: string 
}) {
  const Icon = iconMap[category.icon]
  
  return Icon ? (
    <Icon 
      className={cn("h-4 w-4", className)} 
      style={{ color: category.text }}
    />
  ) : null
}
