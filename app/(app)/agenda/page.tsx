"use client"

import { useState, useMemo } from "react"
import { useAgenda } from "@/context/agenda-context"
import { CalendarGrid } from "@/components/agenda/calendar-grid"
import { CategoryFilter } from "@/components/agenda/category-filter"
import { EventModal } from "@/components/agenda/event-modal"
import { EventCard } from "@/components/agenda/event-card"
import { MobileNav } from "@/components/agenda/mobile-nav"
import { CoupleHeader } from "@/components/agenda/couple-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { motion } from "framer-motion"

export default function AgendaPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const { events, selectedCategory, couple } = useAgenda()
  
  const handleDayClick = (date: Date) => {
    setSelectedDate(date)
    setIsModalOpen(true)
  }
  
  const handleAddClick = () => {
    setSelectedDate(undefined)
    setIsModalOpen(true)
  }
  
  const upcomingEvents = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return events
      .filter(event => {
        const eventDate = new Date(event.date + "T00:00:00")
        if (eventDate < today) return false
        if (selectedCategory && event.category !== selectedCategory) return false
        return true
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5)
  }, [events, selectedCategory])
  
  return (
    <>
      <div className="p-4 lg:p-8">
        <motion.div 
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="lg:hidden">
            <CoupleHeader />
          </div>
          <div className="hidden lg:block">
            <h1 className="font-serif text-3xl text-foreground">Nossa Agenda</h1>
            <p className="text-muted-foreground mt-1">
              Organizem juntos os melhores momentos
            </p>
          </div>
          
          <Button 
            onClick={handleAddClick}
            className="hidden lg:flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Novo evento
          </Button>
        </motion.div>
        
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CategoryFilter />
        </motion.div>
        
        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CalendarGrid onDayClick={handleDayClick} />
          </motion.div>
          
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-serif text-xl text-foreground">Próximos eventos</h2>
            
            {upcomingEvents.length === 0 ? (
              <div className="bg-card rounded-2xl p-8 text-center border border-border/50">
                <p className="text-muted-foreground">
                  Nenhum evento próximo.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={handleAddClick}
                >
                  Criar primeiro evento
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map(event => (
                  <EventCard key={event.id} event={event} showDate />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
      
      <MobileNav onAddClick={handleAddClick} />
      
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
      />
    </>
  )
}
