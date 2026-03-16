"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { useAgenda } from "@/context/agenda-context"
import { getCategoryById, Reaction } from "@/data/events"
import { CategoryBadge } from "@/components/agenda/category-badge"
import { EventModal } from "@/components/agenda/event-modal"
import { MobileNav } from "@/components/agenda/mobile-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Calendar,
  Edit, 
  Trash2, 
  Share2,
  Heart,
  User,
  Users,
  Send,
  Music, 
  Film, 
  UtensilsCrossed, 
  Plane, 
  TreePine, 
  Cake,
  LucideIcon
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { cn } from "@/lib/utils"

const iconMap: Record<string, LucideIcon> = {
  Music,
  Film,
  UtensilsCrossed,
  Heart,
  Users,
  Plane,
  TreePine,
  Cake
}

const reactionEmojis = ["❤️", "🥹", "🎉", "🔥", "💜", "🥰", "😍", "🤩"]

export default function EventDetailPage({ 
  params 
}: { 
  params: Promise<{ eventId: string }> 
}) {
  const { eventId } = use(params)
  const router = useRouter()
  const { events, deleteEvent, addReaction, couple } = useAgenda()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [selectedEmoji, setSelectedEmoji] = useState("")
  const [comment, setComment] = useState("")
  const [showToast, setShowToast] = useState(false)
  
  const event = events.find(e => e.id === eventId)
  
  if (!event) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Evento não encontrado</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/agenda">Voltar para agenda</Link>
        </Button>
      </div>
    )
  }
  
  const category = getCategoryById(event.category)
  if (!category) return null
  
  const Icon = iconMap[category.icon]
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00")
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric"
    })
  }
  
  const formatTime = (timeStr: string) => {
    return timeStr.replace(":", "h")
  }
  
  const handleDelete = () => {
    deleteEvent(event.id)
    router.push("/agenda")
  }
  
  const handleShare = () => {
    const text = `${category.emoji} ${event.title} • ${new Date(event.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })} às ${formatTime(event.time)} • ${event.location} ${category.emoji}`
    
    if (navigator.share) {
      navigator.share({ text })
    } else {
      navigator.clipboard.writeText(text)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }
  }
  
  const handleAddReaction = () => {
    if (!selectedEmoji) return
    
    const reaction: Reaction = {
      partner: couple.partner1,
      emoji: selectedEmoji,
      comment: comment
    }
    
    addReaction(event.id, reaction)
    setSelectedEmoji("")
    setComment("")
  }
  
  const attendeesLabel = {
    so_eu: "Só eu",
    a_dois: "Os dois",
    amigos: "Com amigos"
  }
  
  return (
    <>
      <div className="p-4 lg:p-8 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button variant="ghost" size="sm" asChild>
            <Link href="/agenda" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="overflow-hidden border-border/50">
            <div 
              className="h-32 flex items-center justify-center"
              style={{ backgroundColor: category.bg }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="h-20 w-20 rounded-full bg-card flex items-center justify-center shadow-lg"
              >
                {Icon && <Icon className="h-10 w-10" style={{ color: category.text }} />}
              </motion.div>
            </div>
            
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <CategoryBadge category={category} size="md" className="mb-3" />
                  <h1 className="font-serif text-2xl lg:text-3xl text-foreground text-balance">
                    {event.title}
                  </h1>
                </div>
                
                <motion.button
                  onClick={() => setIsLiked(!isLiked)}
                  whileTap={{ scale: 0.8 }}
                  animate={isLiked ? { 
                    scale: [1, 1.4, 0.9, 1.1, 1]
                  } : {}}
                  transition={{ duration: 0.5 }}
                  className={cn(
                    "p-3 rounded-full transition-colors",
                    isLiked ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground hover:text-primary"
                  )}
                >
                  <Heart className={cn("h-6 w-6", isLiked && "fill-primary")} />
                </motion.button>
              </div>
              
              <div className="grid gap-4 mb-6">
                <div className="flex items-center gap-3 text-foreground">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span className="capitalize">{formatDate(event.date)}</span>
                </div>
                
                <div className="flex items-center gap-3 text-foreground">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>{formatTime(event.time)}</span>
                </div>
                
                <div className="flex items-center gap-3 text-foreground">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span>{event.location}</span>
                </div>
                
                <div className="flex items-center gap-3 text-foreground">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span>{attendeesLabel[event.attendees]}</span>
                </div>
              </div>
              
              {event.notes && (
                <div className="bg-secondary/50 rounded-xl p-4 mb-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Notas</h3>
                  <p className="text-foreground">{event.notes}</p>
                </div>
              )}
              
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
                
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                  Compartilhar
                </Button>
                
                <Button 
                  variant="outline" 
                  className="gap-2 text-destructive hover:text-destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <Card className="border-border/50">
            <CardContent className="p-6">
              <h2 className="font-serif text-xl text-foreground mb-4">Reações</h2>
              
              {event.reactions.length > 0 && (
                <div className="space-y-3 mb-6">
                  {event.reactions.map((reaction, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3 bg-secondary/50 rounded-xl p-3"
                    >
                      <span className="text-2xl">{reaction.emoji}</span>
                      <div>
                        <p className="font-medium text-foreground">{reaction.partner}</p>
                        {reaction.comment && (
                          <p className="text-sm text-muted-foreground">{reaction.comment}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Adicionar reação:</p>
                
                <div className="flex flex-wrap gap-2">
                  {reactionEmojis.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => setSelectedEmoji(emoji)}
                      className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center text-xl transition-all",
                        selectedEmoji === emoji 
                          ? "bg-primary/20 ring-2 ring-primary scale-110" 
                          : "bg-secondary hover:bg-secondary/80"
                      )}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Adicione um comentário..."
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    className="bg-secondary/50"
                  />
                  <Button 
                    onClick={handleAddReaction}
                    disabled={!selectedEmoji}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <MobileNav />
      
      <EventModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editEvent={event}
      />
      
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
              onClick={() => setShowDeleteConfirm(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative bg-card rounded-2xl shadow-xl p-6 w-full max-w-sm"
            >
              <h3 className="font-serif text-xl text-foreground mb-2">Excluir evento?</h3>
              <p className="text-muted-foreground mb-6">
                Tem certeza que deseja excluir "{event.title}"? Esta ação não pode ser desfeita.
              </p>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1"
                  onClick={handleDelete}
                >
                  Excluir
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 lg:bottom-6 right-6 bg-card rounded-xl shadow-lg p-4 border border-border z-50"
          >
            <p className="text-foreground">Link copiado!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
