"use client"

import { useState, useMemo, useRef } from "react"
import { useAgenda } from "@/context/agenda-context"
import { MobileNav } from "@/components/agenda/mobile-nav"
import { PageTransition, FadeIn } from "@/components/page-transition"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getCategoryById } from "@/data/events"
import {
  Heart, Calendar, Star, Edit2, Check, X, Sparkles,
  Clock, Trophy, Camera, MapPin, MessageSquareHeart,
  TrendingUp, Flame, Gift
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

function AvatarUpload({
  label, name, avatar, gradient, onChange
}: {
  label: string
  name: string
  avatar?: string
  gradient: string
  onChange: (base64: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative group">
        {avatar ? (
          <div className="h-20 w-20 rounded-2xl overflow-hidden ring-4 ring-card shadow-lg">
            <Image src={avatar} alt={name} width={80} height={80} className="h-full w-full object-cover" />
          </div>
        ) : (
          <div
            className="h-20 w-20 rounded-2xl flex items-center justify-center text-3xl font-serif font-bold text-white ring-4 ring-card shadow-lg"
            style={{ background: gradient }}
          >
            {(name || "?").charAt(0).toUpperCase()}
          </div>
        )}

        {/* Overlay de upload */}
        <button
          onClick={() => inputRef.current?.click()}
          className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        >
          <Camera className="h-5 w-5 text-white" />
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
      </div>

      <button
        onClick={() => inputRef.current?.click()}
        className="text-[11px] text-primary hover:underline font-medium"
      >
        {avatar ? "Trocar foto" : "Adicionar foto"}
      </button>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  )
}

export default function CasalPage() {
  const { couple, setCouple, events } = useAgenda()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({ ...couple })

  const openEdit = () => { setDraft({ ...couple }); setEditing(true) }
  const cancelEdit = () => setEditing(false)
  const saveEdit = () => { setCouple(draft); setEditing(false) }

  const stats = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const past = events.filter(e => new Date(e.date + "T00:00:00") < today).length
    const upcoming = events.filter(e => new Date(e.date + "T00:00:00") >= today).length
    const reactions = events.reduce((acc, e) => acc + e.reactions.length, 0)
    const totalEvents = events.length

    let daysTogether = 0
    if (couple.startDate) {
      daysTogether = Math.ceil(
        Math.abs(today.getTime() - new Date(couple.startDate + "T00:00:00").getTime()) / 86400000
      )
    }

    // Categoria mais usada
    const catCount: Record<string, number> = {}
    events.forEach(e => { catCount[e.category] = (catCount[e.category] || 0) + 1 })
    const topCat = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0]

    // Mês com mais eventos
    const monthCount: Record<string, number> = {}
    events.forEach(e => {
      const m = e.date.slice(0, 7)
      monthCount[m] = (monthCount[m] || 0) + 1
    })
    const topMonth = Object.entries(monthCount).sort((a, b) => b[1] - a[1])[0]

    // Próximo aniversário / data especial
    let daysToAnniversary: number | null = null
    if (couple.startDate) {
      const now = new Date()
      const start = new Date(couple.startDate + "T00:00:00")
      const next = new Date(now.getFullYear(), start.getMonth(), start.getDate())
      if (next < now) next.setFullYear(now.getFullYear() + 1)
      daysToAnniversary = Math.ceil((next.getTime() - now.getTime()) / 86400000)
    }

    return { past, upcoming, reactions, totalEvents, daysTogether, topCat, topMonth, daysToAnniversary }
  }, [events, couple.startDate])

  const milestones = [
    { days: 30,  label: "1 mês juntos",     emoji: "🌱" },
    { days: 100, label: "100 dias juntos",   emoji: "💫" },
    { days: 180, label: "6 meses juntos",    emoji: "🌸" },
    { days: 365, label: "1 ano de amor",     emoji: "🎂" },
    { days: 730, label: "2 anos de história",emoji: "🏆" },
    { days: 1095,label: "3 anos juntos",     emoji: "💎" },
  ]

  const nextMilestone = milestones.find(m => stats.daysTogether < m.days)

  return (
    <PageTransition>
      <div className="min-h-screen pb-24 lg:pb-8">

        {/* Header */}
        <header className="sticky top-0 z-30 glass border-b border-border/40">
          <div className="flex items-center justify-between px-4 lg:px-7 h-[60px]">
            <h1 className="font-serif text-lg lg:text-xl text-foreground font-semibold">Nosso Perfil</h1>
            <Button
              variant="ghost" size="icon"
              onClick={editing ? cancelEdit : openEdit}
              className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              {editing ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
            </Button>
          </div>
        </header>

        <main className="p-4 lg:p-7 max-w-5xl mx-auto space-y-5">

          {/* ── MODO EDIÇÃO ── */}
          <AnimatePresence>
            {editing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-3xl border border-primary/30 bg-card p-5 space-y-5">
                  <h2 className="font-serif text-base font-semibold text-foreground">Editar perfil do casal</h2>

                  {/* Fotos */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-3">Fotos dos parceiros</p>
                    <div className="flex justify-around gap-4">
                      <AvatarUpload
                        label={draft.partner1 || "Parceiro 1"}
                        name={draft.partner1}
                        avatar={draft.avatar1}
                        gradient="linear-gradient(135deg, #D96B5A, #E8967F)"
                        onChange={base64 => setDraft(d => ({ ...d, avatar1: base64 }))}
                      />
                      <div className="flex items-center">
                        <Heart className="h-5 w-5 text-primary/40" />
                      </div>
                      <AvatarUpload
                        label={draft.partner2 || "Parceiro 2"}
                        name={draft.partner2}
                        avatar={draft.avatar2}
                        gradient="linear-gradient(135deg, #E8967F, #D4975A)"
                        onChange={base64 => setDraft(d => ({ ...d, avatar2: base64 }))}
                      />
                    </div>
                  </div>

                  {/* Campos de texto */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Nome do casal</Label>
                      <Input
                        value={draft.name}
                        onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                        placeholder="João & Maria"
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Juntos desde</Label>
                      <Input
                        type="date"
                        value={draft.startDate || ""}
                        onChange={e => setDraft(d => ({ ...d, startDate: e.target.value }))}
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Nome — Parceiro 1</Label>
                      <Input
                        value={draft.partner1}
                        onChange={e => setDraft(d => ({ ...d, partner1: e.target.value }))}
                        placeholder="João"
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Nome — Parceiro 2</Label>
                      <Input
                        value={draft.partner2}
                        onChange={e => setDraft(d => ({ ...d, partner2: e.target.value }))}
                        placeholder="Maria"
                        className="h-9 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Frase do casal (aparece na sidebar)</Label>
                    <Textarea
                      value={draft.bio || ""}
                      onChange={e => setDraft(d => ({ ...d, bio: e.target.value }))}
                      placeholder="Ex: Juntos escrevemos nossa história ❤️"
                      className="text-sm resize-none min-h-[60px]"
                      maxLength={80}
                    />
                    <p className="text-[10px] text-muted-foreground">{(draft.bio || "").length}/80 caracteres</p>
                  </div>

                  <div className="flex gap-2.5 pt-1">
                    <Button variant="outline" onClick={cancelEdit} className="flex-1 rounded-xl">Cancelar</Button>
                    <Button onClick={saveEdit} className="flex-1 rounded-xl gap-1.5">
                      <Check className="h-3.5 w-3.5" /> Salvar perfil
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── LAYOUT PRINCIPAL ── */}
          <div className="grid lg:grid-cols-2 gap-5 items-start">

            {/* ── Coluna esquerda ── */}
            <div className="space-y-4">

              {/* Card hero do casal */}
              <FadeIn delay={0.1}>
                <div className="rounded-3xl border border-border/60 bg-card overflow-hidden">
                  {/* Banner */}
                  <div className="h-24 w-full relative"
                    style={{ background: "linear-gradient(135deg, var(--love-light) 0%, var(--warm-light) 100%)" }}>
                    <div className="absolute inset-0"
                      style={{ backgroundImage: "radial-gradient(circle at 30% 50%, rgba(217,107,90,.3) 0%, transparent 60%), radial-gradient(circle at 70% 50%, rgba(232,150,127,.25) 0%, transparent 60%)" }} />
                  </div>

                  <div className="px-5 pb-5">
                    {/* Avatares sobre o banner */}
                    <div className="flex justify-center -mt-10 mb-4">
                      <div className="relative flex -space-x-4">
                        {/* Avatar 1 */}
                        {couple.avatar1 ? (
                          <div className="h-[76px] w-[76px] rounded-2xl overflow-hidden ring-4 ring-card shadow-xl">
                            <Image src={couple.avatar1} alt={couple.partner1} width={76} height={76} className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <div className="h-[76px] w-[76px] rounded-2xl flex items-center justify-center text-2xl font-serif font-bold text-white ring-4 ring-card shadow-xl"
                            style={{ background: "linear-gradient(135deg, #D96B5A, #E8967F)" }}>
                            {(couple.partner1 || "?").charAt(0).toUpperCase()}
                          </div>
                        )}

                        {/* Coração central */}
                        <motion.div
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-7 w-7 rounded-xl bg-card flex items-center justify-center shadow-md border border-border/50 z-10"
                        >
                          <Heart className="h-3.5 w-3.5 text-primary fill-primary" />
                        </motion.div>

                        {/* Avatar 2 */}
                        {couple.avatar2 ? (
                          <div className="h-[76px] w-[76px] rounded-2xl overflow-hidden ring-4 ring-card shadow-xl">
                            <Image src={couple.avatar2} alt={couple.partner2} width={76} height={76} className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <div className="h-[76px] w-[76px] rounded-2xl flex items-center justify-center text-2xl font-serif font-bold text-white ring-4 ring-card shadow-xl"
                            style={{ background: "linear-gradient(135deg, #E8967F, #D4975A)" }}>
                            {(couple.partner2 || "?").charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="text-center">
                      <h2 className="font-serif text-xl text-foreground font-semibold">{couple.name || "Nosso Casal"}</h2>
                      {couple.bio && (
                        <p className="text-xs text-muted-foreground mt-1 italic">"{couple.bio}"</p>
                      )}
                      {couple.startDate ? (
                        <p className="text-xs text-muted-foreground mt-1.5 flex items-center justify-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          Juntos desde{" "}
                          {new Date(couple.startDate + "T00:00:00").toLocaleDateString("pt-BR", {
                            day: "numeric", month: "long", year: "numeric",
                          })}
                        </p>
                      ) : (
                        <button onClick={openEdit} className="text-xs text-primary hover:underline mt-1.5">
                          + Adicionar data de início
                        </button>
                      )}
                    </div>

                    {/* Nomes dos parceiros */}
                    <div className="flex justify-between mt-4 pt-4 border-t border-border/50">
                      <div className="text-center">
                        <p className="text-xs font-semibold text-foreground">{couple.partner1 || "Parceiro 1"}</p>
                        <p className="text-[10px] text-muted-foreground">💝</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-semibold text-foreground">{couple.partner2 || "Parceiro 2"}</p>
                        <p className="text-[10px] text-muted-foreground">💝</p>
                      </div>
                    </div>

                    {!couple.avatar1 && !couple.avatar2 && (
                      <button onClick={openEdit}
                        className="mt-3 w-full flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors py-2 rounded-xl hover:bg-secondary">
                        <Camera className="h-3.5 w-3.5" />
                        Adicionar fotos do casal
                      </button>
                    )}
                  </div>
                </div>
              </FadeIn>

              {/* Stats 3 colunas */}
              <FadeIn delay={0.15}>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Star,     value: stats.past,      label: "memórias",   color: "text-gold"    },
                    { icon: Clock,    value: stats.upcoming,  label: "planejados", color: "text-warm"    },
                    { icon: Sparkles, value: stats.reactions, label: "reações",    color: "text-primary" },
                  ].map((s, i) => (
                    <motion.div key={i} whileHover={{ y: -2 }}
                      className="rounded-2xl border border-border/60 bg-card p-4">
                      <s.icon className={`h-4 w-4 ${s.color} mb-2`} />
                      <div className="text-2xl font-bold text-foreground">{s.value}</div>
                      <div className="text-[11px] text-muted-foreground font-medium">{s.label}</div>
                    </motion.div>
                  ))}
                </div>
              </FadeIn>

              {/* Dias juntos + próximo aniversário */}
              {stats.daysTogether > 0 && (
                <FadeIn delay={0.2}>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.div whileHover={{ y: -2 }}
                      className="rounded-2xl border border-primary/20 bg-love-light/50 dark:bg-love-light/10 p-4">
                      <Flame className="h-4 w-4 text-primary mb-2" />
                      <div className="text-2xl font-bold text-foreground">{stats.daysTogether}</div>
                      <div className="text-[11px] text-muted-foreground font-medium">dias juntos</div>
                    </motion.div>

                    {stats.daysToAnniversary !== null && (
                      <motion.div whileHover={{ y: -2 }}
                        className="rounded-2xl border border-gold/20 bg-gold-light/50 dark:bg-gold-light/10 p-4">
                        <Gift className="h-4 w-4 text-gold mb-2" />
                        <div className="text-2xl font-bold text-foreground">{stats.daysToAnniversary}</div>
                        <div className="text-[11px] text-muted-foreground font-medium">dias p/ aniversário</div>
                      </motion.div>
                    )}
                  </div>
                </FadeIn>
              )}

              {/* Próximo marco */}
              {nextMilestone && (
                <FadeIn delay={0.25}>
                  <div className="rounded-2xl border border-border/60 bg-card p-4">
                    <p className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5" />
                      Próximo marco
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{nextMilestone.emoji}</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">{nextMilestone.label}</p>
                        <div className="mt-1.5 h-1.5 rounded-full bg-secondary overflow-hidden">
                          <motion.div
                            className="h-full bg-primary rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((stats.daysTogether / nextMilestone.days) * 100, 100)}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {nextMilestone.days - stats.daysTogether} dias restantes
                        </p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              )}

              {/* Categoria favorita */}
              {stats.topCat && (
                <FadeIn delay={0.3}>
                  <div className="rounded-2xl border border-border/60 bg-card p-4">
                    <p className="text-xs text-muted-foreground font-medium mb-2.5 flex items-center gap-1.5">
                      <MessageSquareHeart className="h-3.5 w-3.5" />
                      Categoria favorita
                    </p>
                    {(() => {
                      const cat = getCategoryById(stats.topCat[0])
                      if (!cat) return null
                      return (
                        <div className="flex items-center gap-3">
                          <span className="h-9 w-9 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background: cat.bg }}>
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

            {/* ── Coluna direita ── */}
            <div className="space-y-4">

              {/* Todos os marcos */}
              <FadeIn delay={0.2}>
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
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + idx * 0.06 }}
                          className={`rounded-2xl border p-3.5 ${achieved ? "border-primary/25 bg-love-light/40 dark:bg-love-light/10" : "border-border/60 bg-card"}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 text-lg ${achieved ? "" : "bg-secondary"}`}>
                              {achieved ? m.emoji : <span className="text-[11px] font-bold text-muted-foreground">{Math.round(progress)}%</span>}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-semibold ${achieved ? "text-foreground" : "text-muted-foreground"}`}>
                                {m.label}
                              </p>
                              {!achieved && (
                                <div className="mt-1.5 h-1 rounded-full bg-secondary overflow-hidden">
                                  <motion.div
                                    className="h-full bg-primary/50 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.9, delay: 0.5 + idx * 0.08 }}
                                  />
                                </div>
                              )}
                            </div>
                            {achieved && (
                              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                                ✓ Conquistado
                              </span>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </FadeIn>

              {/* Link p/ eventos */}
              {stats.totalEvents > 0 && (
                <FadeIn delay={0.4}>
                  <Link href="/historico">
                    <motion.div
                      whileHover={{ y: -2, borderColor: "var(--primary)" }}
                      className="rounded-2xl border border-border/60 bg-card p-4 flex items-center gap-3 cursor-pointer transition-all group"
                    >
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <MapPin className="h-4.5 w-4.5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">Ver todos os eventos</p>
                        <p className="text-xs text-muted-foreground">{stats.totalEvents} momentos registrados</p>
                      </div>
                      <span className="text-muted-foreground group-hover:text-primary transition-colors text-sm">→</span>
                    </motion.div>
                  </Link>
                </FadeIn>
              )}
            </div>
          </div>
        </main>

        <MobileNav />
      </div>
    </PageTransition>
  )
}