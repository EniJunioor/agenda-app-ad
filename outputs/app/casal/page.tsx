"use client"

import { useState, useMemo } from "react"
import { useAgenda } from "@/context/agenda-context"
import { MobileNav } from "@/components/agenda/mobile-nav"
import { PageTransition, FadeIn } from "@/components/page-transition"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCategoryById } from "@/data/events"
import { Heart, Calendar, Star, Edit2, Check, X, Sparkles, Clock, Trophy } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function CasalPage() {
  const { couple, setCouple, events } = useAgenda()
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(couple.name)
  const [editDate, setEditDate] = useState(couple.startDate || "")

  const handleSave = () => {
    const [p1, p2] = editName.split(" & ")
    setCouple({ ...couple, name: editName, partner1: p1 || couple.partner1, partner2: p2 || couple.partner2, startDate: editDate })
    setEditing(false)
  }

  const stats = useMemo(() => {
    const today = new Date()
    const past = events.filter(e => new Date(e.date) < today).length
    const upcoming = events.filter(e => new Date(e.date) >= today).length
    const reactions = events.reduce((acc, e) => acc + e.reactions.length, 0)
    let daysTogether = 0
    if (couple.startDate) {
      daysTogether = Math.ceil(Math.abs(today.getTime() - new Date(couple.startDate).getTime()) / 86400000)
    }
    const catCount: Record<string, number> = {}
    events.forEach(e => { catCount[e.category] = (catCount[e.category] || 0) + 1 })
    const topCat = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0]
    return { past, upcoming, reactions, daysTogether, topCat }
  }, [events, couple.startDate])

  const milestones = [
    { days: 100, label: "100 dias juntos" },
    { days: 365, label: "1 ano de amor" },
    { days: 730, label: "2 anos de história" },
  ]

  return (
    <PageTransition>
      <div className="min-h-screen pb-20 lg:pb-0">

        {/* Header */}
        <header className="sticky top-0 z-30 glass border-b border-border/40">
          <div className="flex items-center justify-between px-4 lg:px-7 h-[60px]">
            <div>
              <h1 className="font-serif text-lg lg:text-xl text-foreground font-semibold">Nosso Perfil</h1>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setEditing(!editing)}
              className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary">
              {editing ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
            </Button>
          </div>
        </header>

        <main className="p-4 lg:p-7 max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-5">

            {/* Left col */}
            <div className="space-y-4">

              {/* Profile card */}
              <FadeIn delay={.1}>
                <div className="rounded-3xl border border-border/60 bg-card overflow-hidden">
                  {/* Banner */}
                  <div className="h-24 relative"
                    style={{ background: "linear-gradient(135deg, var(--love-light) 0%, var(--warm-light) 100%)" }}>
                    <div className="absolute inset-0 opacity-20"
                      style={{ backgroundImage: "radial-gradient(circle at 30% 50%, var(--primary) 0%, transparent 50%), radial-gradient(circle at 70% 50%, var(--warm) 0%, transparent 50%)" }} />
                  </div>

                  <div className="px-5 pb-5 -mt-8">
                    {/* Avatars */}
                    <div className="flex justify-center mb-4">
                      <div className="flex -space-x-4">
                        {[{ name: couple.partner1, from: "var(--primary)", to: "var(--warm)" },
                          { name: couple.partner2, from: "var(--warm)", to: "var(--gold)" }
                        ].map((p, i) => (
                          <motion.div key={i} whileHover={{ scale: 1.08, zIndex: 10 }}
                            className="h-16 w-16 rounded-2xl flex items-center justify-center text-xl font-serif font-bold text-white ring-4 ring-card shadow-md"
                            style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }}>
                            {(p.name || "?").charAt(0)}
                          </motion.div>
                        ))}
                        <motion.div animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 2.5, repeat: Infinity }}
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-7 w-7 rounded-xl bg-card flex items-center justify-center shadow-sm border border-border/50">
                          <Heart className="h-3.5 w-3.5 text-primary fill-primary" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Name / edit */}
                    <AnimatePresence mode="wait">
                      {editing ? (
                        <motion.div key="edit"
                          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-3 max-w-xs mx-auto">
                          <div className="space-y-1.5">
                            <Label className="text-xs">Nome do casal</Label>
                            <Input value={editName} onChange={e => setEditName(e.target.value)}
                              placeholder="João & Maria" className="text-center text-sm h-9" />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs">Juntos desde</Label>
                            <Input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} className="text-sm h-9" />
                          </div>
                          <Button onClick={handleSave} size="sm" className="w-full">
                            <Check className="h-3.5 w-3.5 mr-1.5" /> Salvar
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div key="display" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                          <h2 className="font-serif text-xl text-foreground font-semibold mb-1">{couple.name || "Nosso Casal"}</h2>
                          {couple.startDate && (
                            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                              <Calendar className="h-3 w-3" />
                              Juntos desde {new Date(couple.startDate + "T00:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </FadeIn>

              {/* Stats grid */}
              <FadeIn delay={.15}>
                <div className="grid grid-cols-2 gap-3">
                  {stats.daysTogether > 0 && (
                    <motion.div whileHover={{ y: -2 }}
                      className="rounded-2xl border border-primary/20 bg-love-light/60 p-4">
                      <Heart className="h-4 w-4 text-primary mb-2" />
                      <div className="text-2xl font-bold text-foreground">{stats.daysTogether}</div>
                      <div className="text-[10px] text-muted-foreground font-medium">dias juntos</div>
                    </motion.div>
                  )}
                  {[
                    { icon: Star, val: stats.past, label: "memórias", color: "text-gold" },
                    { icon: Clock, val: stats.upcoming, label: "planejados", color: "text-warm" },
                    { icon: Sparkles, val: stats.reactions, label: "reações", color: "text-primary" },
                  ].map((s, i) => (
                    <motion.div key={i} whileHover={{ y: -2 }}
                      className="rounded-2xl border border-border/60 bg-card p-4">
                      <s.icon className={`h-4 w-4 ${s.color} mb-2`} />
                      <div className="text-2xl font-bold text-foreground">{s.val}</div>
                      <div className="text-[10px] text-muted-foreground font-medium">{s.label}</div>
                    </motion.div>
                  ))}
                </div>
              </FadeIn>

              {/* Top category */}
              {stats.topCat && (
                <FadeIn delay={.2}>
                  <div className="rounded-2xl border border-border/60 bg-card p-4">
                    <p className="text-xs text-muted-foreground font-medium mb-2.5">Categoria favorita</p>
                    {(() => {
                      const cat = getCategoryById(stats.topCat[0])
                      if (!cat) return null
                      return (
                        <div className="flex items-center gap-3">
                          <span className="h-9 w-9 rounded-xl flex items-center justify-center text-lg" style={{ background: cat.bg }}>
                            {cat.emoji}
                          </span>
                          <div>
                            <div className="font-semibold text-sm text-foreground">{cat.label}</div>
                            <div className="text-xs text-muted-foreground">{stats.topCat[1]} eventos</div>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </FadeIn>
              )}
            </div>

            {/* Right col: Milestones */}
            <FadeIn delay={.25}>
              <div>
                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-gold" />
                  Marcos do relacionamento
                </h3>
                <div className="space-y-2.5">
                  {milestones.map((m, idx) => {
                    const achieved = stats.daysTogether >= m.days
                    const progress = Math.min((stats.daysTogether / m.days) * 100, 100)
                    return (
                      <motion.div key={idx}
                        initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: .35 + idx * .06 }}
                        className={`rounded-2xl border p-4 transition-all ${achieved ? "border-primary/25 bg-love-light/50" : "border-border/60 bg-card"}`}>
                        <div className="flex items-center gap-3">
                          <div className={`h-9 w-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${achieved ? "bg-primary text-white" : "bg-secondary text-muted-foreground"}`}>
                            {achieved ? <Check className="h-4 w-4" /> : `${Math.round(progress)}%`}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-semibold ${achieved ? "text-foreground" : "text-muted-foreground"}`}>
                              {m.label}
                            </p>
                            {!achieved && (
                              <>
                                <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
                                  <motion.div className="h-full bg-primary/50 rounded-full"
                                    initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                                    transition={{ duration: .9, delay: .5 + idx * .1, ease: "easeOut" }} />
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-1">
                                  {m.days - stats.daysTogether} dias restantes
                                </p>
                              </>
                            )}
                            {achieved && (
                              <p className="text-[10px] text-primary mt-0.5 font-medium">Conquistado! 🎉</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </FadeIn>
          </div>
        </main>

        <MobileNav />
      </div>
    </PageTransition>
  )
}
