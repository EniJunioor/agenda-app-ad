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
import { PageTransition, FadeIn } from "@/components/page-transition"
import { Button } from "@/components/ui/button"
import { Plus, Sparkles, ArrowRight } from "lucide-react"
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
  
  return (
    <PageTransition>
      <div className="min-h-screen pb-24 lg:pb-8">
        {/* Header */}
        <header className="sticky top-0 z-30 glass border-b border-border/40">
          <div className="flex items-center justify-between p-4 lg:px-8">
            {/* Mobile */}
            <div className="lg:hidden flex items-center gap-3">
              <CoupleHeader />
            </div>
            
            {/* Desktop */}
            <div className="hidden lg:block">
              <h1 className="font-serif text-2xl text-foreground">Nossa Agenda</h1>
              <p className="text-sm text-muted-foreground">
                Organizem juntos os melhores momentos
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button 
                onClick={handleAddClick}
                size="sm"
                className="hidden lg:flex items-center gap-2 rounded-xl shadow-sm"
              >
                <Plus className="h-4 w-4" />
                Novo evento
              </Button>
            </div>
          </div>
        </header>
        
        <main className="p-4 lg:p-8 space-y-6">
          {/* Category Filter */}
          <FadeIn delay={0.1}>
            <CategoryFilter />
          </FadeIn>
          
          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <FadeIn delay={0.15} className="lg:col-span-2">
              <CalendarGrid onDayClick={handleDayClick} />
            </FadeIn>
            
            {/* Right Column */}
            <div className="space-y-5">
              {/* Upcoming Events */}
              <FadeIn delay={0.2}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-medium text-foreground">Proximos eventos</h2>
                    <Link 
                      href="/historico" 
                      className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                    >
                      Ver todos
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                  
                  {upcomingEvents.length === 0 ? (
                    <div className="bg-card rounded-2xl p-5 text-center border border-border/50">
                      <p className="text-sm text-muted-foreground mb-3">
                        Nenhum evento proximo
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleAddClick}
                        className="rounded-xl text-xs"
                      >
                        Criar evento
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {upcomingEvents.map((event, idx) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.25 + idx * 0.05 }}
                        >
                          <EventCard event={event} showDate variant="compact" />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </FadeIn>
              
              {/* Daily Suggestion Preview */}
              {dailySuggestions.length > 0 && (
                <FadeIn delay={0.3}>
                  <Link href="/sugestoes">
                    <motion.div 
                      className="group relative overflow-hidden bg-gradient-to-br from-gold/10 to-warm/10 dark:from-gold/5 dark:to-warm/5 rounded-2xl p-4 border border-gold/20 hover:border-gold/40 transition-all duration-300"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-xl bg-gold/15 flex items-center justify-center shrink-0">
                          <Sparkles className="h-4 w-4 text-gold" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground mb-0.5">Sugestao do dia</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {dailySuggestions[0].title}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-gold group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </motion.div>
                  </Link>
                </FadeIn>
              )}
            </div>
          </div>
        </main>
        
        {/* Mobile FAB */}
        <motion.button
          onClick={handleAddClick}
          className="lg:hidden fixed bottom-20 right-4 z-30 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
        >
          <Plus className="h-6 w-6" />
        </motion.button>
        
        <MobileNav />
      </div>
      
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
      />
    </PageTransition>
  )
}
