"use client"

import { Event, getCategoryById } from "@/data/events"
import { CategoryBadge, CategoryIcon } from "./category-badge"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, MapPin, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface EventCardProps {
  event: Event
  showDate?: boolean
}

export function EventCard({ event, showDate = false }: EventCardProps) {
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
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Link href={`/agenda/${event.id}`}>
        <Card className="group relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-border/50">
          <div 
            className="absolute left-0 top-0 bottom-0 w-1.5"
            style={{ backgroundColor: category.text }}
          />
          <CardContent className="p-4 pl-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <CategoryIcon category={category} className="h-4 w-4 shrink-0" />
                  <CategoryBadge category={category} size="sm" />
                </div>
                
                <h3 className="font-serif text-lg font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                  {showDate && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDate(event.date)}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {formatTime(event.time)}
                  </span>
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </span>
                </div>
                
                {event.reactions.length > 0 && (
                  <div className="flex items-center gap-2 mt-3">
                    {event.reactions.map((reaction, idx) => (
                      <span 
                        key={idx}
                        className="text-lg"
                        title={`${reaction.partner}: ${reaction.comment}`}
                      >
                        {reaction.emoji}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <motion.button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setIsLiked(!isLiked)
                }}
                whileTap={{ scale: 0.8 }}
                animate={isLiked ? { 
                  scale: [1, 1.4, 0.9, 1.1, 1]
                } : {}}
                transition={{ duration: 0.5 }}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  isLiked ? "text-primary" : "text-muted-foreground hover:text-primary"
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
