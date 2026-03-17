"use client"

import { useMemo, useState } from "react"
import { useAgenda } from "@/context/agenda-context"
import { getCategoryById } from "@/data/events"
import { CategoryFilter } from "@/components/agenda/category-filter"
import { MobileNav } from "@/components/agenda/mobile-nav"
import { PageTransition, FadeIn } from "@/components/page-transition"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Clock, Calendar, ArrowRight, Bell, Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Music, Film, UtensilsCrossed, Heart, Users, Plane, TreePine, Cake, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const iconMap: Record<string, LucideIcon> = { Music, Film, UtensilsCrossed, Heart, Users, Plane, TreePine, Cake }
type FilterType = "all" | "past" | "upcoming"

export default function HistoricoPage() {
  const { events, selectedCategory } = useAgenda()
  const [filter, setFilter] = useState<FilterType>("all")

  const filtered = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    return events
      .filter(e => {
        const d = new Date(e.date + "T00:00:00")
        if (filter === "past" && d >= today) return false
        if (filter === "upcoming" && d < today) return false
        if (selectedCategory && e.category !== selectedCategory) return false
        return true
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [events, selectedCategory, filter])

  const stats = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const past = events.filter(e => new Date(e.date + "T00:00:00") < today).length
    const upcoming = events.filter(e => new Date(e.date + "T00:00:00") >= today).length
    return { past, upcoming, total: events.length }
  }, [events])

  const fmtDate = (s: string) => new Date(s + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
  const fmtTime = (s: string) => s.replace(":", "h")

  const filterOptions: { key: FilterType; label: string; value: number }[] = [
    { key: "all", label: "Todos", value: stats.total },
    { key: "upcoming", label: "Próximos", value: stats.upcoming },
    { key: "past", label: "Memórias", value: stats.past },
  ]

  return (
    <PageTransition>
      <div className="min-h-screen pb-20 lg:pb-0">

        {/* Header */}
        <header className="sticky top-0 z-30 glass border-b border-border/40">
          <div className="flex items-center justify-between px-4 lg:px-7 h-[60px]">
            <div>
              <h1 className="font-serif text-lg lg:text-xl text-foreground font-semibold">Histórico</h1>
              <p className="text-xs text-muted-foreground hidden lg:block">Todos os momentos vividos juntos</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="h-9 w-9 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors">
                <Search className="h-4 w-4" />
              </button>
              <button className="h-9 w-9 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors">
                <Bell className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-7 space-y-5">

          {/* Filter stats */}
          <FadeIn delay={.1}>
            <div className="flex gap-2.5">
              {filterOptions.map(opt => (
                <motion.button key={opt.key} onClick={() => setFilter(opt.key)}
                  whileTap={{ scale: .96 }}
                  className={cn(
                    "flex-1 rounded-2xl border px-3 py-3 text-center transition-all",
                    filter === opt.key
                      ? "border-primary/40 bg-primary/8 shadow-sm"
                      : "border-border/60 bg-card hover:border-primary/20"
                  )}>
                  <div className={cn("text-xl font-bold", filter === opt.key ? "text-primary" : "text-foreground")}>
                    {opt.value}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 font-medium">{opt.label}</div>
                </motion.button>
              ))}
            </div>
          </FadeIn>

          {/* Category filter */}
          <FadeIn delay={.15}>
            <CategoryFilter />
          </FadeIn>

          {/* Timeline */}
          {filtered.length === 0 ? (
            <FadeIn delay={.2}>
              <div className="rounded-2xl border border-dashed border-border bg-card/60 py-14 text-center">
                <Calendar className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Nenhum evento encontrado</p>
              </div>
            </FadeIn>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-px"
                style={{ background: "linear-gradient(to bottom, var(--primary), var(--border), transparent)" }} />

              <div className="space-y-2.5">
                <AnimatePresence>
                  {filtered.map((event, idx) => {
                    const cat = getCategoryById(event.category)
                    if (!cat) return null
                    const Icon = iconMap[cat.icon]
                    const isPast = new Date(event.date + "T00:00:00") < new Date()

                    return (
                      <motion.div key={event.id}
                        initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: .2 + idx * .03 }}
                        layout className="relative pl-10">

                        {/* Timeline dot */}
                        <motion.div className="absolute left-[9px] top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full border-2 border-card shadow-sm"
                          style={{ background: cat.text }}
                          initial={{ scale: 0 }} animate={{ scale: 1 }}
                          transition={{ delay: .25 + idx * .03 }} />

                        <Link href={`/agenda/${event.id}`}>
                          <motion.div
                            className={cn(
                              "group flex items-center gap-3.5 rounded-2xl border border-border/60 bg-card p-3.5 transition-all cursor-pointer",
                              isPast && "opacity-75"
                            )}
                            whileHover={{ x: 2, borderColor: "var(--primary)", opacity: 1 }}
                            whileTap={{ scale: .99 }}>

                            <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                              style={{ background: cat.bg }}>
                              {Icon && <Icon className="h-4.5 w-4.5" style={{ color: cat.text }} />}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                                  style={{ background: cat.bg, color: cat.text }}>
                                  {cat.label.split(" / ")[0]}
                                </span>
                                {!isPast && (
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                                    Próximo
                                  </span>
                                )}
                              </div>
                              <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                                {event.title}
                              </h3>
                              <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                {fmtDate(event.date)} · {fmtTime(event.time)}
                                {event.location && (
                                  <><MapPin className="h-3 w-3 ml-1" /><span className="truncate">{event.location}</span></>
                                )}
                              </p>
                            </div>

                            <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                          </motion.div>
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
