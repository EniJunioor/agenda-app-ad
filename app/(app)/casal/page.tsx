"use client"

import { useState, useMemo } from "react"
import { useAgenda } from "@/context/agenda-context"
import { MobileNav } from "@/components/agenda/mobile-nav"
import { PageTransition, FadeIn } from "@/components/page-transition"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { getCategoryById } from "@/data/events"
import { 
  Heart, 
  Calendar, 
  Star, 
  Edit2, 
  Check, 
  X,
  Sparkles,
  Clock,
  Bell,
  Search
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function CasalPage() {
  const { couple, setCouple, events } = useAgenda()
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(couple.name)
  const [editStartDate, setEditStartDate] = useState(couple.startDate || "")
  
  const handleSave = () => {
    const [partner1, partner2] = editName.split(" & ")
    setCouple({
      ...couple,
      name: editName,
      partner1: partner1 || couple.partner1,
      partner2: partner2 || couple.partner2,
      startDate: editStartDate
    })
    setIsEditing(false)
  }
  
  const stats = useMemo(() => {
    const today = new Date()
    const pastEvents = events.filter(e => new Date(e.date) < today).length
    const upcomingEvents = events.filter(e => new Date(e.date) >= today).length
    const totalReactions = events.reduce((acc, e) => acc + e.reactions.length, 0)
    
    let daysTogether = 0
    if (couple.startDate) {
      const start = new Date(couple.startDate)
      const diffTime = Math.abs(today.getTime() - start.getTime())
      daysTogether = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }
    
    const categoryCount: Record<string, number> = {}
    events.forEach(e => {
      categoryCount[e.category] = (categoryCount[e.category] || 0) + 1
    })
    const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]
    
    return { pastEvents, upcomingEvents, totalReactions, daysTogether, topCategory }
  }, [events, couple.startDate])
  
  return (
    <PageTransition>
      <div className="min-h-screen pb-16 lg:pb-6">
        {/* Header */}
        <header className="sticky top-0 z-30 glass border-b border-border/40">
          <div className="flex items-center justify-between p-4 lg:px-8">
            <div>
              <h1 className="font-serif text-xl lg:text-2xl text-foreground">Nosso Perfil</h1>
              <p className="text-sm text-muted-foreground hidden lg:block">O perfil do nosso casal</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Notificações">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Pesquisar">
                <Search className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </header>
        
        <main className="p-4 lg:p-6 max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-4 lg:gap-5">
            <div className="space-y-4">
          {/* Profile Card */}
          <FadeIn delay={0.1}>
            <Card className="overflow-hidden border-border/50">
              <div className="h-24 bg-linear-to-br from-primary/20 via-accent/15 to-warm/20" />
              
              <CardContent className="relative pt-0 -mt-9 pb-4 px-5">
                {/* Avatars */}
                <div className="flex justify-center mb-3">
                  <div className="relative flex -space-x-3">
                    <motion.div 
                      className="h-14 w-14 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-serif text-lg ring-3 ring-card"
                      whileHover={{ scale: 1.05, zIndex: 10 }}
                    >
                      {couple.partner1.charAt(0)}
                    </motion.div>
                    <motion.div 
                      className="h-14 w-14 rounded-full bg-linear-to-br from-warm to-gold flex items-center justify-center text-foreground font-serif text-lg ring-3 ring-card"
                      whileHover={{ scale: 1.05, zIndex: 10 }}
                    >
                      {couple.partner2.charAt(0)}
                    </motion.div>
                    
                    <motion.div 
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-6 w-6 rounded-full bg-card flex items-center justify-center shadow-sm"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Heart className="h-3 w-3 text-primary fill-primary" />
                    </motion.div>
                  </div>
                </div>
                
                {/* Name / Edit Form */}
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div
                      key="edit"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 max-w-xs mx-auto"
                    >
                      <div className="space-y-1.5">
                        <Label htmlFor="coupleName" className="text-xs">Nome do casal</Label>
                        <Input
                          id="coupleName"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          placeholder="Joao & Maria"
                          className="text-center text-sm h-9"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="startDate" className="text-xs">Data que comecaram</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={editStartDate}
                          onChange={e => setEditStartDate(e.target.value)}
                          className="text-sm h-9"
                        />
                      </div>
                      <Button onClick={handleSave} size="sm" className="w-full">
                        <Check className="h-3.5 w-3.5 mr-1.5" />
                        Salvar
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="display"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center"
                    >
                      <h2 className="font-serif text-lg lg:text-xl text-foreground mb-1">
                        {couple.name}
                      </h2>
                      {couple.startDate && (
                        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          Juntos desde {new Date(couple.startDate + "T00:00:00").toLocaleDateString("pt-BR", { 
                            day: "numeric", 
                            month: "long", 
                            year: "numeric" 
                          })}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </FadeIn>
          
          {/* Stats Grid */}
          <FadeIn delay={0.15}>
            <div className="grid grid-cols-2 gap-3">
              {stats.daysTogether > 0 && (
                <motion.div
                  whileHover={{ y: -2 }}
                  className="bg-linear-to-br from-love-light to-card rounded-xl p-3.5 border border-primary/15"
                >
                  <Heart className="h-4 w-4 text-primary mb-2" />
                  <p className="text-xl font-bold text-foreground">{stats.daysTogether}</p>
                  <p className="text-[10px] text-muted-foreground">dias juntos</p>
                </motion.div>
              )}
              
              <motion.div
                whileHover={{ y: -2 }}
                className="bg-linear-to-br from-gold-light to-card rounded-xl p-3.5 border border-gold/15"
              >
                <Star className="h-4 w-4 text-gold mb-2" />
                <p className="text-xl font-bold text-foreground">{stats.pastEvents}</p>
                <p className="text-[10px] text-muted-foreground">memorias</p>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -2 }}
                className="bg-linear-to-br from-warm-light to-card rounded-xl p-3.5 border border-warm/15"
              >
                <Clock className="h-4 w-4 text-warm mb-2" />
                <p className="text-xl font-bold text-foreground">{stats.upcomingEvents}</p>
                <p className="text-[10px] text-muted-foreground">planejados</p>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -2 }}
                className="bg-card rounded-xl p-3.5 border border-border/50"
              >
                <Sparkles className="h-4 w-4 text-accent mb-2" />
                <p className="text-xl font-bold text-foreground">{stats.totalReactions}</p>
                <p className="text-[10px] text-muted-foreground">reacoes</p>
              </motion.div>
            </div>
          </FadeIn>
          
          {/* Favorite Category */}
          {stats.topCategory && (
            <FadeIn delay={0.2}>
              <Card className="border-border/50">
                <CardContent className="p-3.5">
                  <p className="text-xs text-muted-foreground mb-2">Categoria favorita</p>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const cat = getCategoryById(stats.topCategory[0])
                      if (!cat) return null
                      return (
                        <>
                          <span 
                            className="h-7 w-7 rounded-lg flex items-center justify-center text-sm"
                            style={{ backgroundColor: cat.bg }}
                          >
                            {cat.emoji}
                          </span>
                          <span className="font-medium text-foreground text-sm">{cat.label}</span>
                          <span className="text-xs text-muted-foreground">
                            ({stats.topCategory[1]} eventos)
                          </span>
                        </>
                      )
                    })()}
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          )}
            </div>
          
          {/* Milestones */}
          <FadeIn delay={0.25}>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-foreground">Marcos</h3>
              <div className="space-y-2">
                {[
                  { days: 100, label: "100 dias juntos" },
                  { days: 365, label: "1 ano de amor" },
                  { days: 730, label: "2 anos de historia" },
                ].map((milestone, idx) => {
                  const achieved = stats.daysTogether >= milestone.days
                  const progress = Math.min((stats.daysTogether / milestone.days) * 100, 100)
                  
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                      className={`p-3 rounded-xl border ${
                        achieved 
                          ? "bg-love-light/50 border-primary/20" 
                          : "bg-card border-border/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium ${
                          achieved ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                        }`}>
                          {achieved ? <Check className="h-4 w-4" /> : `${Math.round(progress)}%`}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm ${achieved ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                            {milestone.label}
                          </p>
                          {!achieved && (
                            <div className="mt-1.5 h-1 bg-secondary rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-primary/40 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.8, delay: 0.4 + idx * 0.1 }}
                              />
                            </div>
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
          </div>
        </main>
        
        <MobileNav />
      </div>
    </PageTransition>
  )
}
