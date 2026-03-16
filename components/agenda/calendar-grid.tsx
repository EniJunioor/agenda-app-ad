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
  
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]
  
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
  
  const goToToday = () => {
    setDirection(0)
    setCurrentDate(new Date())
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
      x: direction > 0 ? 30 : -30,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 30 : -30,
      opacity: 0
    })
  }
  
  return (
    <div className="bg-card rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm border border-border/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={goToPrevMonth}
          className="h-10 w-10 rounded-xl hover:bg-secondary"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-3">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.h2
              key={monthYear}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="font-serif text-lg lg:text-xl capitalize text-foreground"
            >
              {monthYear}
            </motion.h2>
          </AnimatePresence>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={goToToday}
            className="text-xs text-primary hover:bg-primary/10 rounded-lg"
          >
            Hoje
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={goToNextMonth}
          className="h-10 w-10 rounded-xl hover:bg-secondary"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Week days header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day, idx) => (
          <div 
            key={day} 
            className={cn(
              "text-center text-xs lg:text-sm font-medium py-2",
              idx === 0 || idx === 6 
                ? "text-primary/70" 
                : "text-muted-foreground"
            )}
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentDate.toISOString()}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25 }}
          className="grid grid-cols-7 gap-1"
        >
          {calendarDays.map(({ date, isCurrentMonth, events: dayEvents }, index) => {
            const dayIsToday = isToday(date)
            const hasEvents = dayEvents.length > 0
            
            return (
              <motion.button
                key={index}
                onClick={() => onDayClick(date)}
                className={cn(
                  "relative h-12 sm:h-14 lg:h-16 p-0.5 rounded-xl transition-all flex flex-col items-center justify-start pt-1",
                  isCurrentMonth 
                    ? "hover:bg-secondary/80 text-foreground" 
                    : "text-muted-foreground/30",
                  dayIsToday && "ring-2 ring-primary ring-offset-2 ring-offset-card",
                  hasEvents && isCurrentMonth && "bg-secondary/40"
                )}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <span className={cn(
                  "text-sm font-medium flex items-center justify-center",
                  dayIsToday && "bg-primary text-primary-foreground rounded-full w-7 h-7"
                )}>
                  {date.getDate()}
                </span>
                
                {hasEvents && isCurrentMonth && (
                  <div className="flex flex-wrap justify-center gap-0.5 mt-0.5 max-w-full px-0.5">
                    {dayEvents.slice(0, 3).map((event, idx) => {
                      const category = getCategoryById(event.category)
                      if (!category) return null
                      const Icon = iconMap[category.icon]
                      
                      return (
                        <motion.div
                          key={idx}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="h-4 w-4 lg:h-5 lg:w-5 rounded-full flex items-center justify-center shadow-sm"
                          style={{ backgroundColor: category.bg }}
                          title={event.title}
                        >
                          {Icon && <Icon className="h-2.5 w-2.5 lg:h-3 lg:w-3" style={{ color: category.text }} />}
                        </motion.div>
                      )
                    })}
                    {dayEvents.length > 3 && (
                      <span className="text-[10px] text-muted-foreground font-medium">
                        +{dayEvents.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </motion.button>
            )
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
