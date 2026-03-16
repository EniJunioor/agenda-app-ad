"use client"

import { Event, getCategoryById } from "@/data/events"
import { CategoryBadge, CategoryIcon } from "./category-badge"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, MapPin, Clock, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface EventCardProps {
  event: Event
  showDate?: boolean
  variant?: "default" | "compact"
}

export function EventCard({ event, showDate = false, variant = "default" }: EventCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const category = getCategoryById(event.category)
  
  if (!category) return null
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00")
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short"
    })
  }
  
  const formatTime = (timeStr: string) => {
    return timeStr.replace(":", "h")
  }
  
  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link href={`/agenda/${event.id}`}>
          <div className="group flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: category.bg }}
            >
              <CategoryIcon category={category} className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                {event.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(event.date)} as {formatTime(event.time)}
              </p>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Link href={`/agenda/${event.id}`}>
        <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/30">
          {/* Colored accent bar */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-1 transition-all group-hover:w-1.5"
            style={{ backgroundColor: category.text }}
          />
          
          {/* Subtle gradient overlay on hover */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{ 
              background: `linear-gradient(135deg, ${category.bg}20 0%, transparent 50%)` 
            }}
          />
          
          <CardContent className="relative p-4 pl-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Category badge */}
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: category.bg }}
                  >
                    <CategoryIcon category={category} className="h-4 w-4" />
                  </div>
                  <CategoryBadge category={category} size="sm" />
                </div>
                
                {/* Title */}
                <h3 className="font-serif text-lg font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                
                {/* Info row */}
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                  {showDate && (
                    <span className="flex items-center gap-1.5 bg-secondary/50 px-2 py-0.5 rounded-md">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      {formatDate(event.date)}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {formatTime(event.time)}
                  </span>
                  <span className="flex items-center gap-1.5 truncate">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </span>
                </div>
                
                {/* Reactions */}
                {event.reactions.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-3">
                    {event.reactions.map((reaction, idx) => (
                      <motion.span 
                        key={idx}
                        className="text-base bg-secondary/50 px-1.5 py-0.5 rounded-md cursor-default"
                        title={`${reaction.partner}: ${reaction.comment}`}
                        whileHover={{ scale: 1.2, y: -2 }}
                      >
                        {reaction.emoji}
                      </motion.span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Like button */}
              <motion.button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setIsLiked(!isLiked)
                }}
                whileTap={{ scale: 0.75 }}
                animate={isLiked ? { 
                  scale: [1, 1.3, 0.9, 1.1, 1]
                } : {}}
                transition={{ duration: 0.4 }}
                className={cn(
                  "p-2.5 rounded-xl transition-colors",
                  isLiked 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-primary hover:bg-secondary"
                )}
              >
                <Heart className={cn("h-5 w-5", isLiked && "fill-primary")} />
              </motion.button>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
