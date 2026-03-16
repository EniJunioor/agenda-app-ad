"use client"

import { useMemo, useState } from "react"
import { useAgenda } from "@/context/agenda-context"
import { getCategoryById } from "@/data/events"
import { CategoryFilter } from "@/components/agenda/category-filter"
import { MobileNav } from "@/components/agenda/mobile-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { PageTransition, FadeIn } from "@/components/page-transition"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Clock, Calendar, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
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

type FilterType = "all" | "past" | "upcoming"

export default function HistoricoPage() {
  const { events, selectedCategory } = useAgenda()
  const [filter, setFilter] = useState<FilterType>("all")
  
  const filteredEvents = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return events
      .filter(event => {
        const eventDate = new Date(event.date + "T00:00:00")
        if (filter === "past" && eventDate >= today) return false
        if (filter === "upcoming" && eventDate < today) return false
        if (selectedCategory && event.category !== selectedCategory) return false
        return true
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [events, selectedCategory, filter])
  
  const stats = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const past = events.filter(e => new Date(e.date + "T00:00:00") < today).length
    const upcoming = events.filter(e => new Date(e.date + "T00:00:00") >= today).length
    return { past, upcoming, total: events.length }
  }, [events])
  
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
    <PageTransition>
      <div className="min-h-screen pb-24 lg:pb-8">
        {/* Header */}
        <header className="sticky top-0 z-30 glass border-b border-border/40">
          <div className="flex items-center justify-between p-4 lg:px-8">
            <div>
              <h1 className="font-serif text-xl lg:text-2xl text-foreground">Historico</h1>
              <p className="text-xs text-muted-foreground hidden lg:block">
                Todos os momentos vividos juntos
              </p>
            </div>
            <ThemeToggle />
          </div>
        </header>
        
        <main className="p-4 lg:p-8 space-y-5">
          {/* Stats */}
          <FadeIn delay={0.1}>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: "all", value: stats.total, label: "total" },
                { key: "past", value: stats.past, label: "memorias" },
                { key: "upcoming", value: stats.upcoming, label: "planejados" }
              ].map((stat) => (
                <motion.button
                  key={stat.key}
                  onClick={() => setFilter(stat.key as FilterType)}
                  className={`p-3 rounded-xl border transition-all text-center ${
                    filter === stat.key 
                      ? "bg-primary/10 border-primary/30" 
                      : "bg-card border-border/50 hover:border-primary/20"
                  }`}
                  whileTap={{ scale: 0.97 }}
                >
                  <p className={`text-lg font-bold ${filter === stat.key ? "text-primary" : "text-foreground"}`}>
                    {stat.value}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                </motion.button>
              ))}
            </div>
          </FadeIn>
          
          {/* Category Filter */}
          <FadeIn delay={0.15}>
            <CategoryFilter />
          </FadeIn>
          
          {/* Timeline */}
          {filteredEvents.length === 0 ? (
            <FadeIn delay={0.2}>
              <div className="bg-card rounded-2xl p-8 text-center border border-border/50">
                <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm">
                  Nenhum evento encontrado
                </p>
              </div>
            </FadeIn>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-border to-transparent" />
              
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredEvents.map((event, index) => {
                    const category = getCategoryById(event.category)
                    if (!category) return null
                    const Icon = iconMap[category.icon]
                    const isPast = new Date(event.date + "T00:00:00") < new Date()
                    
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.04 }}
                        layout
                        className="relative pl-10"
                      >
                        {/* Timeline dot */}
                        <motion.div 
                          className="absolute left-2 top-4 h-4 w-4 rounded-full border-2 border-card"
                          style={{ backgroundColor: category.text }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.25 + index * 0.04 }}
                        />
                        
                        <Link href={`/agenda/${event.id}`}>
                          <Card className={`group overflow-hidden hover:shadow-md transition-all cursor-pointer border-border/50 hover:border-primary/30 ${isPast ? "opacity-85" : ""}`}>
                            <CardContent className="p-3">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
                                  style={{ backgroundColor: category.bg }}
                                >
                                  {Icon && <Icon className="h-4 w-4" style={{ color: category.text }} />}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span 
                                      className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                                      style={{ backgroundColor: category.bg, color: category.text }}
                                    >
                                      {category.label.split(" / ")[0]}
                                    </span>
                                    {!isPast && (
                                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                                        Proximo
                                      </span>
                                    )}
                                  </div>
                                  
                                  <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                    {event.title}
                                  </h3>
                                  
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {formatDate(event.date)} - {formatTime(event.time)}
                                  </p>
                                </div>
                                
                                <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </div>
          )}
        </main>
        
        <MobileNav />
      </div>
    </PageTransition>
  )
}
