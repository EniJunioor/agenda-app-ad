"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { useAgenda } from "@/context/agenda-context"
import { getCategoryById, type Reaction } from "@/data/events"
import { EventModal } from "@/components/agenda/event-modal"
import { MobileNav } from "@/components/agenda/mobile-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft, MapPin, Clock, Calendar, Edit, Trash2, Share2, Heart,
  User, Send, Music, Film, UtensilsCrossed, Users, Plane, TreePine, Cake, type LucideIcon
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { cn } from "@/lib/utils"

const iconMap: Record<string, LucideIcon> = { Music, Film, UtensilsCrossed, Heart, Users, Plane, TreePine, Cake }
const reactionEmojis = ["❤️", "🥹", "🎉", "🔥", "💜", "🥰", "😍", "🤩"]
const attendeesLabel = { so_eu: "Só eu", a_dois: "Os dois 💑", amigos: "Com amigos" }

export default function EventDetailPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = use(params)
  const router = useRouter()
  const { events, deleteEvent, addReaction, couple } = useAgenda()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [liked, setLiked] = useState(false)
  const [emoji, setEmoji] = useState("")
  const [comment, setComment] = useState("")
  const [toast, setToast] = useState(false)

  const event = events.find(e => e.id === eventId)
  if (!event) return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <div className="text-4xl mb-4">💔</div>
        <p className="text-muted-foreground mb-4">Evento não encontrado</p>
        <Button variant="outline" asChild className="rounded-xl">
          <Link href="/agenda">Voltar para agenda</Link>
        </Button>
      </div>
    </div>
  )

  const cat = getCategoryById(event.category)
  if (!cat) return null
  const Icon = iconMap[cat.icon]

  const fmtDate = (s: string) => new Date(s + "T00:00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })
  const fmtTime = (s: string) => s.replace(":", "h")

  const handleDelete = () => { deleteEvent(event.id); router.push("/agenda") }

  const handleShare = () => {
    const text = `${cat.emoji} ${event.title} • ${new Date(event.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })} às ${fmtTime(event.time)}`
    navigator.share ? navigator.share({ text }) : navigator.clipboard.writeText(text).then(() => { setToast(true); setTimeout(() => setToast(false), 2500) })
  }

  const handleReaction = () => {
    if (!emoji) return
    addReaction(event.id, { partner: couple.partner1, emoji, comment })
    setEmoji(""); setComment("")
  }

  return (
    <>
      <div className="min-h-screen pb-24 lg:pb-8">
        <div className="max-w-2xl mx-auto p-4 lg:p-7">

          {/* Back */}
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
            <Button variant="ghost" size="sm" asChild className="rounded-xl gap-2 text-muted-foreground hover:text-foreground -ml-2">
              <Link href="/agenda"><ArrowLeft className="h-4 w-4" />Voltar</Link>
            </Button>
          </motion.div>

          {/* Main card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }}>
            <div className="rounded-3xl border border-border/60 bg-card overflow-hidden shadow-sm">

              {/* Banner */}
              <div className="h-36 relative flex items-center justify-center" style={{ background: cat.bg }}>
                <motion.div
                  className="h-20 w-20 rounded-2xl bg-card flex items-center justify-center shadow-lg"
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ delay: .2, type: "spring", stiffness: 200 }}>
                  {Icon && <Icon className="h-10 w-10" style={{ color: cat.text }} />}
                </motion.div>

                {/* Like btn */}
                <motion.button onClick={() => setLiked(!liked)}
                  className={cn("absolute top-4 right-4 h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
                    liked ? "bg-white/90 text-primary" : "bg-white/60 text-muted-foreground hover:bg-white/80")}
                  whileTap={{ scale: .8 }}
                  animate={liked ? { scale: [1, 1.3, .95, 1.1, 1] } : {}}>
                  <Heart className={cn("h-5 w-5", liked && "fill-primary")} />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Category + title */}
                <div className="mb-5">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-lg mb-2"
                    style={{ background: cat.bg, color: cat.text }}>
                    {cat.emoji} {cat.label}
                  </span>
                  <h1 className="font-serif text-2xl text-foreground font-semibold leading-tight">{event.title}</h1>
                </div>

                {/* Info */}
                <div className="space-y-3 mb-6">
                  {[
                    { icon: Calendar, text: fmtDate(event.date), cap: true },
                    { icon: Clock, text: fmtTime(event.time) },
                    { icon: MapPin, text: event.location || "Local não definido" },
                    { icon: User, text: attendeesLabel[event.attendees] },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-foreground">
                      <div className="h-8 w-8 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                        <row.icon className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <span className={row.cap ? "capitalize" : ""}>{row.text}</span>
                    </div>
                  ))}
                </div>

                {/* Notes */}
                {event.notes && (
                  <div className="rounded-2xl bg-secondary/50 p-4 mb-6">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Notas</p>
                    <p className="text-sm text-foreground leading-relaxed">{event.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditOpen(true)} className="rounded-xl gap-2 text-xs h-9">
                    <Edit className="h-3.5 w-3.5" />Editar
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare} className="rounded-xl gap-2 text-xs h-9">
                    <Share2 className="h-3.5 w-3.5" />Compartilhar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(true)}
                    className="rounded-xl gap-2 text-xs h-9 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5">
                    <Trash2 className="h-3.5 w-3.5" />Excluir
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Reactions */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 }}
            className="mt-4 rounded-3xl border border-border/60 bg-card p-5">
            <h2 className="font-serif text-lg text-foreground font-semibold mb-4">Reações</h2>

            {event.reactions.length > 0 && (
              <div className="space-y-2.5 mb-5">
                {event.reactions.map((r, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * .06 }}
                    className="flex items-start gap-3 bg-secondary/50 rounded-2xl p-3">
                    <span className="text-xl shrink-0">{r.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{r.partner}</p>
                      {r.comment && <p className="text-xs text-muted-foreground mt-0.5">{r.comment}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="space-y-3">
              <p className="text-xs text-muted-foreground font-medium">Adicionar sua reação:</p>
              <div className="flex flex-wrap gap-2">
                {reactionEmojis.map(e => (
                  <motion.button key={e} onClick={() => setEmoji(e)}
                    whileTap={{ scale: .8 }}
                    className={cn("h-10 w-10 rounded-xl text-lg flex items-center justify-center transition-all",
                      emoji === e ? "bg-primary/15 ring-2 ring-primary scale-110" : "bg-secondary hover:bg-secondary/80")}>
                    {e}
                  </motion.button>
                ))}
              </div>
              <div className="flex gap-2.5">
                <Input placeholder="Comentário opcional..." value={comment}
                  onChange={e => setComment(e.target.value)}
                  className="h-10 text-sm bg-secondary/40 border-border/60 focus:border-primary" />
                <Button onClick={handleReaction} disabled={!emoji} size="icon" className="h-10 w-10 rounded-xl shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <MobileNav />
      <EventModal isOpen={editOpen} onClose={() => setEditOpen(false)} editEvent={event} />

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-foreground/25 backdrop-blur-sm"
              onClick={() => setDeleteConfirm(false)} />
            <motion.div initial={{ opacity: 0, scale: .94, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: .96 }}
              className="relative bg-card rounded-3xl shadow-xl p-6 w-full max-w-sm">
              <h3 className="font-serif text-lg text-foreground font-semibold mb-2">Excluir evento?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Tem certeza que deseja excluir <strong>"{event.title}"</strong>? Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-2.5">
                <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setDeleteConfirm(false)}>Cancelar</Button>
                <Button variant="destructive" className="flex-1 rounded-xl" onClick={handleDelete}>Excluir</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 lg:bottom-6 right-4 bg-card rounded-2xl shadow-lg px-4 py-3 border border-border text-sm font-medium text-foreground z-50">
            ✅ Link copiado!
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
