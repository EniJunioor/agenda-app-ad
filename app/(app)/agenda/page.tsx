"use client"

import { useState, useMemo } from "react"
import { useAgenda } from "@/context/agenda-context"
import { CalendarGrid } from "@/components/agenda/calendar-grid"
import { CategoryFilter } from "@/components/agenda/category-filter"
import { EventModal } from "@/components/agenda/event-modal"
import { EventCard } from "@/components/agenda/event-card"
import { MobileNav } from "@/components/agenda/mobile-nav"
import { CoupleHeader } from "@/components/agenda/couple-header"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Plus, Sparkles, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function AgendaPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const { events, selectedCategory, dailySuggestions } = useAgenda()
  
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
      .slice(0, 4)
  }, [events, selectedCategory])
  
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }
  
  return (
    <>
      <motion.div 
        className="p-4 lg:p-8 pb-24 lg:pb-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Mobile Header */}
        <motion.div 
          className="flex items-center justify-between mb-6 lg:hidden"
          variants={itemVariants}
        >
          <CoupleHeader />
          <ThemeToggle />
        </motion.div>
        
        {/* Desktop Header */}
        <motion.div 
          className="hidden lg:flex items-center justify-between mb-8"
          variants={itemVariants}
        >
          <div>
            <h1 className="font-serif text-3xl text-foreground">Nossa Agenda</h1>
            <p className="text-muted-foreground mt-1">
              Organizem juntos os melhores momentos
            </p>
          </div>
          
          <Button 
            onClick={handleAddClick}
            className="flex items-center gap-2 h-11 px-5 rounded-xl shadow-md shadow-primary/20"
          >
            <Plus className="h-5 w-5" />
            Novo evento
          </Button>
        </motion.div>
        
        {/* Category Filter */}
        <motion.div className="mb-6" variants={itemVariants}>
          <CategoryFilter />
        </motion.div>
        
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <CalendarGrid onDayClick={handleDayClick} />
          </motion.div>
          
          {/* Right Column */}
          <motion.div className="space-y-6" variants={itemVariants}>
            {/* Upcoming Events */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-xl text-foreground">Proximos eventos</h2>
                <Link 
                  href="/historico" 
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  Ver todos
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              
              {upcomingEvents.length === 0 ? (
                <div className="bg-card rounded-2xl p-6 text-center border border-border/50">
                  <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
                    <Plus className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    Nenhum evento proximo.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleAddClick}
                    className="rounded-lg"
                  >
                    Criar primeiro evento
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map((event, idx) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <EventCard event={event} showDate variant="compact" />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Daily Suggestion Preview */}
            {dailySuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link href="/sugestoes">
                  <div className="group relative overflow-hidden bg-gradient-to-br from-gold-light to-warm-light dark:from-gold-light dark:to-warm-light rounded-2xl p-5 border border-gold/20 hover:border-gold/40 transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gold/20 flex items-center justify-center shrink-0">
                        <Sparkles className="h-5 w-5 text-gold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground mb-1">Sugestao do dia</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {dailySuggestions[0].title}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-gold group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
      
      <MobileNav onAddClick={handleAddClick} />
      
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
      />
    </>
  )
}
