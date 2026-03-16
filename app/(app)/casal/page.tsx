"use client"

import { useState, useMemo } from "react"
import { useAgenda } from "@/context/agenda-context"
import { MobileNav } from "@/components/agenda/mobile-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { getCategoryById, categories } from "@/data/events"
import { 
  Heart, 
  Calendar, 
  MapPin, 
  Star, 
  Edit2, 
  Check, 
  X,
  Sparkles,
  TrendingUp,
  Clock
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
    
    // Calculate days together
    let daysTogether = 0
    if (couple.startDate) {
      const start = new Date(couple.startDate)
      const diffTime = Math.abs(today.getTime() - start.getTime())
      daysTogether = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }
    
    // Most used category
    const categoryCount: Record<string, number> = {}
    events.forEach(e => {
      categoryCount[e.category] = (categoryCount[e.category] || 0) + 1
    })
    const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]
    
    return { pastEvents, upcomingEvents, totalReactions, daysTogether, topCategory }
  }, [events, couple.startDate])
  
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }
  
  return (
    <>
      <motion.div 
        className="p-4 lg:p-8 pb-24 lg:pb-8 max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8 lg:hidden"
          variants={itemVariants}
        >
          <h1 className="font-serif text-2xl text-foreground">Nosso Perfil</h1>
          <ThemeToggle />
        </motion.div>
        
        {/* Profile Card */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-border/50 mb-6">
            {/* Banner */}
            <div className="relative h-32 lg:h-40 bg-gradient-to-br from-primary/30 via-accent/20 to-warm/30">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M10%203.5c.5-2%203-2.5%204-.5s0%203-4%205.5C6%206%204.5%204%205.5%203s3.5-1.5%204.5.5z%22%20fill%3D%22%23E0707020%22%2F%3E%3C%2Fsvg%3E')] opacity-50" />
              
              {/* Edit button */}
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-4 right-4 rounded-lg shadow-md"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
              </Button>
            </div>
            
            {/* Content */}
            <CardContent className="relative pt-0 -mt-12 pb-6">
              {/* Avatar */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="flex -space-x-4">
                    <motion.div 
                      className="h-20 w-20 lg:h-24 lg:w-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-serif text-2xl lg:text-3xl ring-4 ring-card shadow-lg"
                      whileHover={{ scale: 1.05, zIndex: 10 }}
                    >
                      {couple.partner1.charAt(0)}
                    </motion.div>
                    <motion.div 
                      className="h-20 w-20 lg:h-24 lg:w-24 rounded-full bg-gradient-to-br from-warm to-gold flex items-center justify-center text-foreground font-serif text-2xl lg:text-3xl ring-4 ring-card shadow-lg"
                      whileHover={{ scale: 1.05, zIndex: 10 }}
                    >
                      {couple.partner2.charAt(0)}
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-card flex items-center justify-center shadow-md"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Heart className="h-4 w-4 text-primary fill-primary" />
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
                    className="space-y-4 max-w-xs mx-auto"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="coupleName">Nome do casal</Label>
                      <Input
                        id="coupleName"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        placeholder="Joao & Maria"
                        className="text-center"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Data que comecaram a namorar</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={editStartDate}
                        onChange={e => setEditStartDate(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleSave} className="w-full">
                      <Check className="h-4 w-4 mr-2" />
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
                    <h2 className="font-serif text-2xl lg:text-3xl text-foreground mb-2">
                      {couple.name}
                    </h2>
                    {couple.startDate && (
                      <p className="text-muted-foreground flex items-center justify-center gap-2">
                        <Calendar className="h-4 w-4" />
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
        </motion.div>
        
        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          variants={itemVariants}
        >
          {stats.daysTogether > 0 && (
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-gradient-to-br from-love-light to-card rounded-2xl p-4 border border-primary/20"
            >
              <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center mb-3">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.daysTogether}</p>
              <p className="text-sm text-muted-foreground">dias juntos</p>
            </motion.div>
          )}
          
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-gradient-to-br from-gold-light to-card rounded-2xl p-4 border border-gold/20"
          >
            <div className="h-10 w-10 rounded-xl bg-gold/20 flex items-center justify-center mb-3">
              <Star className="h-5 w-5 text-gold" />
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.pastEvents}</p>
            <p className="text-sm text-muted-foreground">memorias</p>
          </motion.div>
          
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-gradient-to-br from-warm-light to-card rounded-2xl p-4 border border-warm/20"
          >
            <div className="h-10 w-10 rounded-xl bg-warm/20 flex items-center justify-center mb-3">
              <Clock className="h-5 w-5 text-warm" />
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.upcomingEvents}</p>
            <p className="text-sm text-muted-foreground">planejados</p>
          </motion.div>
          
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-gradient-to-br from-secondary to-card rounded-2xl p-4 border border-border/50"
          >
            <div className="h-10 w-10 rounded-xl bg-accent/20 flex items-center justify-center mb-3">
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.totalReactions}</p>
            <p className="text-sm text-muted-foreground">reacoes</p>
          </motion.div>
        </motion.div>
        
        {/* Favorite Category */}
        {stats.topCategory && (
          <motion.div variants={itemVariants}>
            <Card className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Categoria favorita</p>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const cat = getCategoryById(stats.topCategory[0])
                        if (!cat) return null
                        return (
                          <>
                            <span 
                              className="h-6 w-6 rounded-md flex items-center justify-center text-sm"
                              style={{ backgroundColor: cat.bg }}
                            >
                              {cat.emoji}
                            </span>
                            <span className="font-medium text-foreground">{cat.label}</span>
                            <span className="text-sm text-muted-foreground">
                              ({stats.topCategory[1]} eventos)
                            </span>
                          </>
                        )
                      })()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {/* Milestones Section */}
        <motion.div variants={itemVariants} className="mt-6">
          <h3 className="font-serif text-xl text-foreground mb-4">Marcos do relacionamento</h3>
          <div className="grid gap-3">
            {[
              { days: 100, label: "100 dias juntos", icon: "star" },
              { days: 365, label: "1 ano de amor", icon: "heart" },
              { days: 730, label: "2 anos de historia", icon: "sparkles" },
              { days: 1095, label: "3 anos de parceria", icon: "trophy" },
            ].map((milestone, idx) => {
              const achieved = stats.daysTogether >= milestone.days
              const progress = Math.min((stats.daysTogether / milestone.days) * 100, 100)
              
              return (
                <motion.div
                  key={idx}
                  className={`relative p-4 rounded-xl border ${
                    achieved 
                      ? "bg-love-light border-primary/30" 
                      : "bg-card border-border/50"
                  }`}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      achieved ? "bg-primary text-primary-foreground" : "bg-secondary"
                    }`}>
                      {achieved ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-medium text-muted-foreground">
                          {Math.round(progress)}%
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${achieved ? "text-foreground" : "text-muted-foreground"}`}>
                        {milestone.label}
                      </p>
                      {!achieved && (
                        <div className="mt-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary/50 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, delay: idx * 0.1 }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </motion.div>
      
      <MobileNav />
    </>
  )
}
