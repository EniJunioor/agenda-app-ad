"use client"

import { useState, useMemo } from "react"
import { useAgenda } from "@/context/agenda-context"
import { getCategoryById, Event } from "@/data/events"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface CalendarGridProps {
  onDayClick: (date: Date) => void
}

export function CalendarGrid({ onDayClick }: CalendarGridProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [direction, setDirection] = useState(0)
  const { events, selectedCategory } = useAgenda()
  
  const weekDays = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"]
  
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
  
  const monthStr = currentDate.toLocaleDateString("pt-BR", { month: "long" })
  const yearStr = currentDate.getFullYear().toString()

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
    <div className="bg-card rounded-xl lg:rounded-2xl p-5 lg:p-6 border border-border">
      {/* Header: Março (coral) + 2026 (branco) | Hoje (outline coral) */}
      <div className="flex items-center justify-between mb-5 lg:mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPrevMonth}
          className="h-9 w-9 rounded-lg hover:bg-muted text-foreground"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-3 flex-1 justify-center min-w-0">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.h2
              key={`${monthStr}-${yearStr}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="text-lg lg:text-xl font-bold capitalize flex items-baseline gap-1.5"
            >
              <span className="text-primary">{monthStr}</span>
              <span className="text-foreground">{yearStr}</span>
            </motion.h2>
          </AnimatePresence>

          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="text-xs font-medium rounded-full border-2 border-primary text-primary bg-card hover:bg-muted shrink-0 px-4 py-1.5 h-8"
          >
            Hoje
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={goToNextMonth}
          className="h-9 w-9 rounded-lg hover:bg-muted text-foreground"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Dias da semana: DOM SEG ... SÁB (SÁB em coral, resto branco) */}
      <div className="grid grid-cols-7 gap-0 mb-1">
        {weekDays.map((day, idx) => (
          <div
            key={day}
            className={cn(
              "text-center text-xs font-medium py-2",
              idx === 6 ? "text-primary" : "text-foreground"
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid de datas: número branco, dia atual com anel coral, pontos coloridos abaixo */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentDate.toISOString()}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25 }}
          className="grid grid-cols-7 gap-0.5"
        >
          {calendarDays.map(({ date, isCurrentMonth, events: dayEvents }, index) => {
            const dayIsToday = isToday(date)
            const hasEvents = dayEvents.length > 0

            return (
              <motion.button
                key={index}
                onClick={() => onDayClick(date)}
                className={cn(
                  "relative h-11 sm:h-12 lg:h-14 rounded-lg transition-colors flex flex-col items-center justify-start pt-1.5",
                  isCurrentMonth
                    ? "text-foreground hover:bg-muted"
                    : "text-muted-foreground/60"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <span
                  className={cn(
                    "inline-flex items-center justify-center w-8 h-8 text-sm font-normal rounded-full",
                    dayIsToday && "ring-2 ring-primary ring-offset-2 ring-offset-card"
                  )}
                >
                  {date.getDate()}
                </span>

                {hasEvents && isCurrentMonth && (
                  <div className="flex flex-wrap justify-center gap-1 mt-1 max-w-full">
                    {dayEvents.slice(0, 4).map((event, idx) => {
                      const category = getCategoryById(event.category)
                      if (!category) return null
                      return (
                        <span
                          key={idx}
                          className="h-1.5 w-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: category.text }}
                          title={event.title}
                        />
                      )
                    })}
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
