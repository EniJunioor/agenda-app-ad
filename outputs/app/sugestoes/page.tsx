"use client"

import { useState } from "react"
import { useAgenda } from "@/context/agenda-context"
import { MobileNav } from "@/components/agenda/mobile-nav"
import { PageTransition, FadeIn } from "@/components/page-transition"
import { EventModal } from "@/components/agenda/event-modal"
import { Button } from "@/components/ui/button"
import { getCategoryById } from "@/data/events"
import { Sparkles, RefreshCw, Clock, Plus, ArrowRight, Heart, Lightbulb } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Music, Film, UtensilsCrossed, TreePine, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const iconMap: Record<string, LucideIcon> = { Music, Film, UtensilsCrossed, Heart, TreePine }

const difficultyConfig = {
  facil: { label: "Fácil", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  medio: { label: "Médio", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  elaborado: { label: "Elaborado", className: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
}

export default function SugestoesPage() {
  const { dailySuggestions, refreshSuggestions } = useAgenda()
  const [refreshing, setRefreshing] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [liked, setLiked] = useState<Set<string>>(new Set())

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => { refreshSuggestions(); setRefreshing(false) }, 600)
  }

  const toggleLike = (id: string) => {
    setLiked(prev => {
      const s = new Set(prev)
      s.has(id) ? s.delete(id) : s.add(id)
      return s
    })
  }

  return (
    <PageTransition>
      <div className="min-h-screen pb-20 lg:pb-0">

        {/* Header */}
        <header className="sticky top-0 z-30 glass border-b border-border/40">
          <div className="flex items-center justify-between px-4 lg:px-7 h-[60px]">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-gold/15 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-gold" />
              </div>
              <div>
                <h1 className="font-serif text-lg lg:text-xl text-foreground font-semibold leading-none">Sugestões</h1>
                <p className="text-[10px] text-muted-foreground mt-0.5">Ideias para vocês dois</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={refreshing}
              className="gap-2 text-xs rounded-xl h-8">
              <RefreshCw className={cn("h-3.5 w-3.5", refreshing && "animate-spin")} />
              <span className="hidden sm:inline">Novas ideias</span>
            </Button>
          </div>
        </header>

        <main className="p-4 lg:p-7 max-w-2xl mx-auto space-y-4">

          {/* Intro */}
          <FadeIn delay={.1}>
            <p className="text-sm text-muted-foreground">
              Ideias selecionadas especialmente para vocês aproveitarem hoje. ✨
            </p>
          </FadeIn>

          {/* Cards */}
          <AnimatePresence mode="wait">
            <div className="space-y-3">
              {dailySuggestions.map((s, idx) => {
                const cat = getCategoryById(s.category)
                const Icon = iconMap[s.icon] || Sparkles
                const diff = difficultyConfig[s.difficulty]
                const isLiked = liked.has(s.id)

                return (
                  <motion.div key={s.id}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: .15 + idx * .08 }}>
                    <motion.div
                      className="group rounded-2xl border border-border/60 bg-card p-4 transition-all"
                      whileHover={{ borderColor: "var(--primary)", boxShadow: "0 4px 20px rgba(217,107,90,.08)" }}
                      whileTap={{ scale: .995 }}>
                      <div className="flex items-start gap-3.5">
                        <motion.div
                          className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0"
                          style={{ background: cat?.bg || "#F5E8E3" }}
                          whileHover={{ scale: 1.05 }}>
                          <Icon className="h-5.5 w-5.5" style={{ color: cat?.text || "var(--primary)" }} />
                        </motion.div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md", diff.className)}>
                              {diff.label}
                            </span>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />{s.duration}
                            </span>
                          </div>

                          <h3 className="font-semibold text-sm text-foreground mb-1">{s.title}</h3>
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{s.description}</p>

                          <button onClick={() => setModalOpen(true)}
                            className="inline-flex items-center gap-1.5 mt-2.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                            <Plus className="h-3.5 w-3.5" />
                            Adicionar à agenda
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>

                        <motion.button onClick={() => toggleLike(s.id)}
                          className={cn(
                            "p-2 rounded-xl transition-colors shrink-0",
                            isLiked ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-primary hover:bg-secondary"
                          )}
                          whileTap={{ scale: .8 }}>
                          <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                )
              })}
            </div>
          </AnimatePresence>

          {/* Tip */}
          <FadeIn delay={.4}>
            <div className="rounded-2xl border border-border/50 bg-secondary/40 p-4 flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Lightbulb className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground mb-0.5">Dica do dia</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  As pequenas coisas feitas com carinho fortalecem qualquer relacionamento. Não é preciso esperar uma data especial! 💕
                </p>
              </div>
            </div>
          </FadeIn>
        </main>

        <MobileNav />
      </div>

      <EventModal isOpen={modalOpen} onClose={() => setModalOpen(false)} selectedDate={new Date()} />
    </PageTransition>
  )
}
