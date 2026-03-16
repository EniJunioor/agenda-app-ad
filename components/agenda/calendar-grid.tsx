"use client"

import { useState, useMemo } from "react"
import { useAgenda } from "@/context/agenda-context"
import { getCategoryById, Event } from "@/data/events"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
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

interface CalendarGridProps {
  onDayClick: (date: Date) => void
}

export function CalendarGrid({ onDayClick }: CalendarGridProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [direction, setDirection] = useState(0)
  const { events, selectedCategory } = useAgenda()
  
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
  
  const filteredEvents = useMemo(() => {
    if (!selectedCategory) return events
    return events.filter(event => event.category === selectedCategory)
  }, [events, selectedCategory])
  
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days: { date: Date; isCurrentMonth: boolean; events: Event[] }[] = []
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      
      const dateStr = date.toISOString().split("T")[0]
      const dayEvents = filteredEvents.filter(event => event.date === dateStr)
      
      days.push({
        date,
        isCurrentMonth: date.getMonth() === month,
        events: dayEvents
      })
    }
    
    return days
  }, [currentDate, filteredEvents])
  
  const goToPrevMonth = () => {
    setDirection(-1)
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }
  
  const goToNextMonth = () => {
    setDirection(1)
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }
  
  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }
  
  const monthYear = currentDate.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric"
  })
  
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 40 : -40,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 40 : -40,
      opacity: 0
    })
  }
  
  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/50">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="icon" onClick={goToPrevMonth}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <AnimatePresence mode="wait" custom={direction}>
          <motion.h2
            key={monthYear}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="font-serif text-xl capitalize text-foreground"
          >
            {monthYear}
          </motion.h2>
        </AnimatePresence>
        
        <Button variant="ghost" size="icon" onClick={goToNextMonth}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div 
            key={day} 
            className="text-center text-sm font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>
      
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentDate.toISOString()}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="grid grid-cols-7 gap-1"
        >
          {calendarDays.map(({ date, isCurrentMonth, events: dayEvents }, index) => (
            <motion.button
              key={index}
              onClick={() => onDayClick(date)}
              className={cn(
                "relative h-16 sm:h-20 p-1 rounded-lg transition-colors flex flex-col items-center",
                isCurrentMonth 
                  ? "bg-secondary/50 hover:bg-secondary text-foreground" 
                  : "text-muted-foreground/40",
                isToday(date) && "ring-2 ring-primary"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className={cn(
                "text-sm font-medium",
                isToday(date) && "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center"
              )}>
                {date.getDate()}
              </span>
              
              {dayEvents.length > 0 && (
                <div className="flex flex-wrap justify-center gap-0.5 mt-1">
                  {dayEvents.slice(0, 3).map((event, idx) => {
                    const category = getCategoryById(event.category)
                    if (!category) return null
                    const Icon = iconMap[category.icon]
                    
                    return (
                      <div
                        key={idx}
                        className="h-5 w-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: category.bg }}
                        title={event.title}
                      >
                        {Icon && <Icon className="h-3 w-3" style={{ color: category.text }} />}
                      </div>
                    )
                  })}
                  {dayEvents.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{dayEvents.length - 3}
                    </span>
                  )}
                </div>
              )}
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
