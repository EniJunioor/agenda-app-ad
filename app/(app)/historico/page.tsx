"use client"

import { useMemo, useState } from "react"
import { useAgenda } from "@/context/agenda-context"
import { getCategoryById } from "@/data/events"
import { CategoryFilter } from "@/components/agenda/category-filter"
import { MobileNav } from "@/components/agenda/mobile-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Calendar, Filter, ChevronRight } from "lucide-react"
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
  
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  }
  
  return (
    <>
      <motion.div 
        className="p-4 lg:p-8 pb-24 lg:pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2 lg:hidden">
          <h1 className="font-serif text-2xl text-foreground">Historico</h1>
          <ThemeToggle />
        </div>
        
        <motion.p 
          className="text-muted-foreground mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Todos os momentos vividos juntos
        </motion.p>
        
        {/* Stats */}
        <motion.div 
          className="grid grid-cols-3 gap-3 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <button
            onClick={() => setFilter("all")}
            className={`p-3 rounded-xl border transition-all text-center ${
              filter === "all" 
                ? "bg-primary/10 border-primary/30 text-primary" 
                : "bg-card border-border/50 hover:border-primary/20"
            }`}
          >
            <p className="text-xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">total</p>
          </button>
          <button
            onClick={() => setFilter("past")}
            className={`p-3 rounded-xl border transition-all text-center ${
              filter === "past" 
                ? "bg-primary/10 border-primary/30 text-primary" 
                : "bg-card border-border/50 hover:border-primary/20"
            }`}
          >
            <p className="text-xl font-bold">{stats.past}</p>
            <p className="text-xs text-muted-foreground">memorias</p>
          </button>
          <button
            onClick={() => setFilter("upcoming")}
            className={`p-3 rounded-xl border transition-all text-center ${
              filter === "upcoming" 
                ? "bg-primary/10 border-primary/30 text-primary" 
                : "bg-card border-border/50 hover:border-primary/20"
            }`}
          >
            <p className="text-xl font-bold">{stats.upcoming}</p>
            <p className="text-xs text-muted-foreground">planejados</p>
          </button>
        </motion.div>
        
        {/* Category Filter */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <CategoryFilter />
        </motion.div>
        
        {/* Timeline */}
        {filteredEvents.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-8 text-center border border-border/50"
          >
            <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              Nenhum evento encontrado.
            </p>
          </motion.div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 lg:left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-border to-border" />
            
            <motion.div 
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              <AnimatePresence>
                {filteredEvents.map((event, index) => {
                  const category = getCategoryById(event.category)
                  if (!category) return null
                  const Icon = iconMap[category.icon]
                  const isPast = new Date(event.date + "T00:00:00") < new Date()
                  
                  return (
                    <motion.div
                      key={event.id}
                      variants={itemVariants}
                      layout
                      className="relative pl-12 lg:pl-14"
                    >
                      {/* Timeline dot */}
                      <motion.div 
                        className="absolute left-3 lg:left-4 top-4 h-5 w-5 rounded-full border-[3px] border-card flex items-center justify-center shadow-sm"
                        style={{ backgroundColor: category.bg }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        {Icon && <Icon className="h-2.5 w-2.5" style={{ color: category.text }} />}
                      </motion.div>
                      
                      <Link href={`/agenda/${event.id}`}>
                        <Card className={`group overflow-hidden hover:shadow-md transition-all cursor-pointer border-border/50 hover:border-primary/30 ${isPast ? "opacity-90" : ""}`}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              {/* Mobile icon */}
                              <div 
                                className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 lg:hidden"
                                style={{ backgroundColor: category.bg }}
                              >
                                {Icon && <Icon className="h-5 w-5" style={{ color: category.text }} />}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                {/* Tags */}
                                <div className="flex items-center flex-wrap gap-2 mb-1.5">
                                  <span 
                                    className="text-xs font-medium px-2 py-0.5 rounded-md"
                                    style={{ backgroundColor: category.bg, color: category.text }}
                                  >
                                    {category.label.split(" / ")[0]}
                                  </span>
                                  {!isPast && (
                                    <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                                      Proximo
                                    </span>
                                  )}
                                </div>
                                
                                {/* Title */}
                                <h3 className="font-serif text-base lg:text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                  {event.title}
                                </h3>
                                
                                {/* Info */}
                                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    {formatDate(event.date)}
                                  </span>
                                  <span className="text-border">|</span>
                                  <span>{formatTime(event.time)}</span>
                                </div>
                                
                                {/* Reactions */}
                                {event.reactions.length > 0 && (
                                  <div className="flex items-center gap-1.5 mt-2">
                                    {event.reactions.map((reaction, idx) => (
                                      <span 
                                        key={idx}
                                        className="text-sm bg-secondary/70 px-1.5 py-0.5 rounded-md"
                                        title={`${reaction.partner}: ${reaction.comment}`}
                                      >
                                        {reaction.emoji}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              
                              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </motion.div>
      
      <MobileNav />
    </>
  )
}
