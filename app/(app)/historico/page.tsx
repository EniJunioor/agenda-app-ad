"use client"

import { useMemo } from "react"
import { useAgenda } from "@/context/agenda-context"
import { getCategoryById } from "@/data/events"
import { CategoryFilter } from "@/components/agenda/category-filter"
import { MobileNav } from "@/components/agenda/mobile-nav"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Clock } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
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

export default function HistoricoPage() {
  const { events, selectedCategory } = useAgenda()
  
  const pastEvents = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return events
      .filter(event => {
        const eventDate = new Date(event.date + "T00:00:00")
        if (eventDate >= today) return false
        if (selectedCategory && event.category !== selectedCategory) return false
        return true
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [events, selectedCategory])
  
  const allEvents = useMemo(() => {
    return events
      .filter(event => {
        if (selectedCategory && event.category !== selectedCategory) return false
        return true
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [events, selectedCategory])
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00")
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })
  }
  
  const formatTime = (timeStr: string) => {
    return timeStr.replace(":", "h")
  }
  
  return (
    <>
      <div className="p-4 lg:p-8">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="font-serif text-3xl text-foreground">Histórico</h1>
          <p className="text-muted-foreground mt-1">
            Todos os momentos vividos juntos
          </p>
        </motion.div>
        
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CategoryFilter />
        </motion.div>
        
        {allEvents.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-12 text-center border border-border/50"
          >
            <p className="text-muted-foreground text-lg">
              Nenhum evento encontrado nesta categoria.
            </p>
          </motion.div>
        ) : (
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden lg:block" />
            
            <div className="space-y-4">
              {allEvents.map((event, index) => {
                const category = getCategoryById(event.category)
                if (!category) return null
                const Icon = iconMap[category.icon]
                const isPast = new Date(event.date + "T00:00:00") < new Date()
                
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative lg:pl-16"
                  >
                    <div 
                      className="absolute left-4 top-6 h-5 w-5 rounded-full border-4 border-background hidden lg:flex items-center justify-center"
                      style={{ backgroundColor: category.bg }}
                    >
                      {Icon && <Icon className="h-2.5 w-2.5" style={{ color: category.text }} />}
                    </div>
                    
                    <Link href={`/agenda/${event.id}`}>
                      <Card className={`group hover:shadow-lg transition-shadow cursor-pointer border-border/50 ${isPast ? "opacity-80" : ""}`}>
                        <CardContent className="p-4 lg:p-5">
                          <div className="flex items-start gap-4">
                            <div 
                              className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 lg:hidden"
                              style={{ backgroundColor: category.bg }}
                            >
                              {Icon && <Icon className="h-6 w-6" style={{ color: category.text }} />}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span 
                                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                                  style={{ backgroundColor: category.bg, color: category.text }}
                                >
                                  {category.label.split(" / ")[0]}
                                </span>
                                {!isPast && (
                                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                    Próximo
                                  </span>
                                )}
                              </div>
                              
                              <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                {event.title}
                              </h3>
                              
                              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  {formatDate(event.date)} às {formatTime(event.time)}
                                </span>
                                <span className="flex items-center gap-1 truncate">
                                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                                  <span className="truncate">{event.location}</span>
                                </span>
                              </div>
                              
                              {event.reactions.length > 0 && (
                                <div className="flex items-center gap-3 mt-3">
                                  {event.reactions.map((reaction, idx) => (
                                    <div 
                                      key={idx}
                                      className="flex items-center gap-1.5 bg-secondary/70 rounded-full px-2 py-1"
                                    >
                                      <span className="text-sm">{reaction.emoji}</span>
                                      <span className="text-xs text-muted-foreground">{reaction.partner}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}
      </div>
      
      <MobileNav />
    </>
  )
}
