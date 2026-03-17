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
import { Plus, Bell, Search, Film, ArrowRight, Calendar, TrendingUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { categories } from "@/data/events"

function AgendaContent() {
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

  const upcomingEvents = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    return events
      .filter(e => {
        if (new Date(e.date + "T00:00:00") < today) return false
        if (selectedCategory && e.category !== selectedCategory) return false
        return true
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 4)
  }, [events, selectedCategory])

  const stats = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    return {
      upcoming: events.filter(e => new Date(e.date + "T00:00:00") >= today).length,
      past: events.filter(e => new Date(e.date + "T00:00:00") < today).length,
    }
  }, [events])

  return (
    <PageTransition>
      <div className="min-h-screen pb-20 lg:pb-0">

        {/* Header */}
        <header className="sticky top-0 z-30 glass border-b border-border/40">
          <div className="flex items-center justify-between px-4 lg:px-7 h-[60px]">
            <div className="lg:hidden">
              <CoupleHeader />
            </div>
            <div className="hidden lg:block">
              <h1 className="font-serif text-xl text-foreground font-semibold">Nossa Agenda</h1>
              <p className="text-xs text-muted-foreground">Organizem os melhores momentos juntos</p>
            </div>
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="icon"
                className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon"
                className="relative h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
              </Button>
              <Button onClick={() => { setSelectedDate(undefined); setIsModalOpen(true) }} size="sm"
                className="lg:hidden h-8 gap-1.5 rounded-xl text-xs font-semibold px-3">
                <Plus className="h-3.5 w-3.5" />
                Novo
              </Button>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-7 space-y-5">

          {/* Stats row (mobile) */}
          <FadeIn delay={.05}>
            <div className="grid grid-cols-2 gap-3 lg:hidden">
              {[
                { label: "Próximos", value: stats.upcoming, icon: Calendar, color: "text-primary" },
                { label: "Memórias", value: stats.past, icon: TrendingUp, color: "text-gold" },
              ].map(s => (
                <div key={s.label} className="rounded-2xl border border-border/60 bg-card px-4 py-3 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    <s.icon className={`h-4 w-4 ${s.color}`} />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-foreground">{s.value}</div>
                    <div className="text-[11px] text-muted-foreground">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Category Filter */}
          <FadeIn delay={.1}>
            <CategoryFilter />
          </FadeIn>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-5">

            {/* Calendar — spans 2 cols */}
            <FadeIn delay={.15} className="lg:col-span-2">
              <CalendarGrid onDayClick={(d) => { setSelectedDate(d); setIsModalOpen(true) }} />
            </FadeIn>

            {/* Right column */}
            <div className="space-y-4">

              {/* Upcoming events */}
              <FadeIn delay={.2}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Próximos eventos</h2>
                    <Link href="/historico"
                      className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                      Ver todos <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>

                  {upcomingEvents.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border bg-card/60 py-8 text-center">
                      <Calendar className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2.5" />
                      <p className="text-sm text-muted-foreground mb-4">Nenhum evento próximo</p>
                      <Button size="sm" onClick={() => { setSelectedDate(undefined); setIsModalOpen(true) }}
                        className="rounded-xl h-8 text-xs gap-1.5">
                        <Plus className="h-3.5 w-3.5" />
                        Criar evento
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {upcomingEvents.map((event, idx) => (
                        <motion.div key={event.id}
                          initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: .3 + idx * .05 }}>
                          <EventCard event={event} showDate variant="compact" />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </FadeIn>

              {/* Daily suggestion preview */}
              {dailySuggestions.length > 0 && (
                <FadeIn delay={.3}>
                  <Link href="/sugestoes">
                    <motion.div
                      className="group rounded-2xl border border-border/60 bg-card p-4 hover:border-primary/30 transition-all cursor-pointer"
                      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(217,107,90,.12)" }}
                      whileTap={{ scale: .99 }}>
                      <div className="flex items-start gap-3.5">
                        <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Film className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">Para hoje</p>
                          <p className="text-sm font-semibold text-foreground truncate">
                            {dailySuggestions[0].title}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                            {dailySuggestions[0].description}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                      </div>
                    </motion.div>
                  </Link>
                </FadeIn>
              )}

              {/* Legend */}
              <FadeIn delay={.35}>
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2.5">Legenda</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                    {["a_dois", "natureza", "show", "aniversario"].map(id => {
                      const cat = categories.find(c => c.id === id)
                      if (!cat) return null
                      return (
                        <div key={cat.id} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span className="h-2 w-2 rounded-full shrink-0" style={{ background: cat.text }} />
                          {cat.label.split(" / ")[0]}
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
        <motion.button onClick={() => { setSelectedDate(undefined); setIsModalOpen(true) }}
          className="lg:hidden fixed bottom-[72px] right-4 z-30 h-14 w-14 rounded-2xl bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center"
          whileHover={{ scale: 1.05 }} whileTap={{ scale: .92 }}
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: .4, type: "spring", stiffness: 300 }}>
          <Plus className="h-6 w-6" />
        </motion.button>

        <MobileNav />
      </div>

      <EventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedDate={selectedDate} />
    </PageTransition>
  )
}

export default function AgendaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <AgendaContent />
    </Suspense>
  )
}
