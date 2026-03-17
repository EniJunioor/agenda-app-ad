"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useAgenda } from "@/context/agenda-context"
import { CalendarGrid } from "@/components/agenda/calendar-grid"
import { CategoryFilter } from "@/components/agenda/category-filter"
import { EventModal } from "@/components/agenda/event-modal"
import { EventCard } from "@/components/agenda/event-card"
import { MobileNav } from "@/components/agenda/mobile-nav"
import { CoupleHeader } from "@/components/agenda/couple-header"
import { PageTransition, FadeIn } from "@/components/page-transition"
import { Button } from "@/components/ui/button"
import { Plus, ArrowRight, Bell, Search, Film } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { categories } from "@/data/events"

function AgendaPageContent() {
  const searchParams = useSearchParams()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const { events, selectedCategory, dailySuggestions } = useAgenda()

  useEffect(() => {
    if (searchParams.get("novo") === "1") {
      setSelectedDate(undefined)
      setIsModalOpen(true)
      window.history.replaceState({}, "", "/agenda")
    }
  }, [searchParams])

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
              <h1 className="text-2xl font-bold text-foreground">Nossa Agenda</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Organizem juntos os melhores momentos
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-full bg-muted hover:bg-muted/80"
                aria-label="Notificações"
              >
                <Bell className="h-5 w-5 text-foreground" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-black dark:bg-white" aria-hidden />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-muted hover:bg-muted/80"
                aria-label="Pesquisar"
              >
                <Search className="h-5 w-5 text-foreground" />
              </Button>
              <Button
                onClick={handleAddClick}
                size="sm"
                className="lg:hidden flex items-center gap-2 rounded-xl"
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
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Próximos eventos
                    </h2>
                    <Link
                      href="/historico"
                      className="text-xs font-medium text-primary underline underline-offset-2 hover:text-primary/90 flex items-center gap-1"
                    >
                      Ver todos
                    </Link>
                  </div>

                  {upcomingEvents.length === 0 ? (
                    <div className="bg-card rounded-xl p-5 text-center border border-dashed border-border">
                      <p className="text-sm text-muted-foreground mb-4">
                        Nenhum evento próximo
                      </p>
                      <Button
                        size="sm"
                        onClick={handleAddClick}
                        className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
                      >
                        <Plus className="h-4 w-4" />
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
                      className="group relative overflow-hidden bg-card rounded-xl p-4 border border-border hover:border-primary/30 transition-all duration-300"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                          <Film className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground mb-1">
                            Para hoje à noite
                          </p>
                          <p className="text-base font-bold text-foreground line-clamp-1">
                            {dailySuggestions[0].title}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                      </div>
                    </motion.div>
                  </Link>
                </FadeIn>
              )}

              {/* Legenda */}
              <FadeIn delay={0.35}>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Legenda
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {["a_dois", "natureza", "show", "aniversario"].map((id) => {
                      const cat = categories.find((c) => c.id === id)
                      if (!cat) return null
                      return (
                        <div
                          key={cat.id}
                          className="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: cat.text }}
                          />
                          <span>{cat.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </FadeIn>
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

export default function AgendaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>}>
      <AgendaPageContent />
    </Suspense>
  )
}
