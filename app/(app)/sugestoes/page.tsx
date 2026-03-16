"use client"

import { useState } from "react"
import { useAgenda } from "@/context/agenda-context"
import { MobileNav } from "@/components/agenda/mobile-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { EventModal } from "@/components/agenda/event-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getCategoryById } from "@/data/events"
import { 
  Sparkles, 
  RefreshCw, 
  Clock, 
  Star,
  Plus,
  ChevronRight,
  Heart,
  Zap
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Music, 
  Film, 
  UtensilsCrossed, 
  TreePine, 
  LucideIcon
} from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  Music,
  Film,
  UtensilsCrossed,
  Heart,
  TreePine
}

const difficultyConfig = {
  facil: { label: "Facil", color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/30" },
  medio: { label: "Medio", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30" },
  elaborado: { label: "Elaborado", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/30" }
}

export default function SugestoesPage() {
  const { dailySuggestions, refreshSuggestions, addEvent } = useAgenda()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState<{
    title: string
    category: string
  } | null>(null)
  const [likedSuggestions, setLikedSuggestions] = useState<Set<string>>(new Set())
  
  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      refreshSuggestions()
      setIsRefreshing(false)
    }, 600)
  }
  
  const handleAddToAgenda = (suggestion: { title: string; category: string }) => {
    setSelectedSuggestion(suggestion)
    setIsModalOpen(true)
  }
  
  const toggleLike = (id: string) => {
    setLikedSuggestions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }
  
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  }
  
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    },
    exit: { 
      opacity: 0, 
      y: -30, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  }
  
  return (
    <>
      <motion.div 
        className="p-4 lg:p-8 pb-24 lg:pb-8 max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2 lg:hidden">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-gold to-warm flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h1 className="font-serif text-2xl text-foreground">Sugestoes</h1>
          </div>
          <ThemeToggle />
        </div>
        
        {/* Subtitle */}
        <motion.p 
          className="text-muted-foreground mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Ideias especiais para voces aproveitarem juntos hoje
        </motion.p>
        
        {/* Refresh Button */}
        <motion.div 
          className="flex justify-end mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2 rounded-lg"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Novas sugestoes
          </Button>
        </motion.div>
        
        {/* Suggestions Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={dailySuggestions.map(s => s.id).join("-")}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {dailySuggestions.map((suggestion, idx) => {
              const category = getCategoryById(suggestion.category)
              const Icon = iconMap[suggestion.icon] || Sparkles
              const difficulty = difficultyConfig[suggestion.difficulty]
              const isLiked = likedSuggestions.has(suggestion.id)
              
              return (
                <motion.div
                  key={suggestion.id}
                  variants={cardVariants}
                  layout
                >
                  <Card className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all hover:shadow-lg">
                    <CardContent className="p-0">
                      <div className="flex">
                        {/* Left accent */}
                        <div 
                          className="w-1.5 shrink-0"
                          style={{ backgroundColor: category?.text || "#E07070" }}
                        />
                        
                        <div className="flex-1 p-5">
                          {/* Header */}
                          <div className="flex items-start gap-4 mb-3">
                            <motion.div
                              className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                              style={{ backgroundColor: category?.bg || "#FEF2F0" }}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                              <Icon 
                                className="h-6 w-6" 
                                style={{ color: category?.text || "#E07070" }}
                              />
                            </motion.div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${difficulty.bg} ${difficulty.color}`}>
                                  {difficulty.label}
                                </span>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {suggestion.duration}
                                </span>
                              </div>
                              <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                                {suggestion.title}
                              </h3>
                            </div>
                            
                            {/* Like button */}
                            <motion.button
                              onClick={() => toggleLike(suggestion.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                isLiked 
                                  ? "bg-primary/10 text-primary" 
                                  : "text-muted-foreground hover:text-primary hover:bg-secondary"
                              }`}
                              whileTap={{ scale: 0.85 }}
                              animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
                            >
                              <Heart className={`h-5 w-5 ${isLiked ? "fill-primary" : ""}`} />
                            </motion.button>
                          </div>
                          
                          {/* Description */}
                          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                            {suggestion.description}
                          </p>
                          
                          {/* Action */}
                          <motion.div
                            whileHover={{ x: 4 }}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-2 text-primary hover:text-primary hover:bg-primary/10 -ml-2"
                              onClick={() => handleAddToAgenda({ 
                                title: suggestion.title, 
                                category: suggestion.category 
                              })}
                            >
                              <Plus className="h-4 w-4" />
                              Adicionar a agenda
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>
        
        {/* Tips Section */}
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-gradient-to-br from-secondary to-card rounded-2xl p-5 border border-border/50">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">Dica do dia</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Nao precisa ser algo grande! As pequenas coisas feitas com carinho 
                  sao as que mais fortalecem o relacionamento. Um cafe juntos, uma 
                  caminhada no parque ou ate assistir um filme abracinhos ja conta!
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Quick Stats */}
        <motion.div 
          className="mt-6 grid grid-cols-3 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-center p-4 bg-card rounded-xl border border-border/50">
            <Star className="h-5 w-5 text-gold mx-auto mb-2" />
            <p className="text-lg font-bold text-foreground">{likedSuggestions.size}</p>
            <p className="text-xs text-muted-foreground">curtidas</p>
          </div>
          <div className="text-center p-4 bg-card rounded-xl border border-border/50">
            <Sparkles className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-lg font-bold text-foreground">15</p>
            <p className="text-xs text-muted-foreground">sugestoes</p>
          </div>
          <div className="text-center p-4 bg-card rounded-xl border border-border/50">
            <RefreshCw className="h-5 w-5 text-warm mx-auto mb-2" />
            <p className="text-lg font-bold text-foreground">3</p>
            <p className="text-xs text-muted-foreground">por dia</p>
          </div>
        </motion.div>
      </motion.div>
      
      <MobileNav />
      
      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedSuggestion(null)
        }}
        selectedDate={new Date()}
      />
    </>
  )
}
