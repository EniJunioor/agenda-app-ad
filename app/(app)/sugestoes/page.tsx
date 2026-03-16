"use client"

import { useState } from "react"
import { useAgenda } from "@/context/agenda-context"
import { MobileNav } from "@/components/agenda/mobile-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { PageTransition, FadeIn } from "@/components/page-transition"
import { EventModal } from "@/components/agenda/event-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getCategoryById } from "@/data/events"
import { 
  Sparkles, 
  RefreshCw, 
  Clock, 
  Plus,
  ArrowRight,
  Heart,
  Lightbulb
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
  facil: { label: "Facil", color: "text-green-600 dark:text-green-400", bg: "bg-green-500/10" },
  medio: { label: "Medio", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
  elaborado: { label: "Elaborado", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/10" }
}

export default function SugestoesPage() {
  const { dailySuggestions, refreshSuggestions } = useAgenda()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [likedSuggestions, setLikedSuggestions] = useState<Set<string>>(new Set())
  
  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      refreshSuggestions()
      setIsRefreshing(false)
    }, 500)
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
  
  return (
    <PageTransition>
      <div className="min-h-screen pb-24 lg:pb-8">
        {/* Header */}
        <header className="sticky top-0 z-30 glass border-b border-border/40">
          <div className="flex items-center justify-between p-4 lg:px-8">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gold/15 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-gold" />
              </div>
              <div>
                <h1 className="font-serif text-xl text-foreground">Sugestoes</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="gap-1.5 text-xs"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Novas</span>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>
        
        <main className="p-4 lg:p-8 max-w-3xl mx-auto space-y-4">
          <FadeIn delay={0.1}>
            <p className="text-sm text-muted-foreground">
              Ideias especiais para voces hoje
            </p>
          </FadeIn>
          
          {/* Suggestions Cards */}
          <AnimatePresence mode="wait">
            <div className="space-y-3">
              {dailySuggestions.map((suggestion, idx) => {
                const category = getCategoryById(suggestion.category)
                const Icon = iconMap[suggestion.icon] || Sparkles
                const difficulty = difficultyConfig[suggestion.difficulty]
                const isLiked = likedSuggestions.has(suggestion.id)
                
                return (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + idx * 0.08 }}
                  >
                    <Card className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <motion.div
                            className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: category?.bg || "#FEF2F0" }}
                            whileHover={{ scale: 1.05 }}
                          >
                            <Icon 
                              className="h-5 w-5" 
                              style={{ color: category?.text || "#E07070" }}
                            />
                          </motion.div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${difficulty.bg} ${difficulty.color}`}>
                                {difficulty.label}
                              </span>
                              <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                                <Clock className="h-2.5 w-2.5" />
                                {suggestion.duration}
                              </span>
                            </div>
                            
                            <h3 className="font-medium text-foreground text-sm mb-1">
                              {suggestion.title}
                            </h3>
                            
                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                              {suggestion.description}
                            </p>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1 text-xs text-primary hover:text-primary hover:bg-primary/10 -ml-2 mt-2 h-7"
                              onClick={() => setIsModalOpen(true)}
                            >
                              <Plus className="h-3 w-3" />
                              Adicionar
                              <ArrowRight className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <motion.button
                            onClick={() => toggleLike(suggestion.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              isLiked 
                                ? "bg-primary/10 text-primary" 
                                : "text-muted-foreground hover:text-primary hover:bg-secondary"
                            }`}
                            whileTap={{ scale: 0.85 }}
                          >
                            <Heart className={`h-4 w-4 ${isLiked ? "fill-primary" : ""}`} />
                          </motion.button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </AnimatePresence>
          
          {/* Tip */}
          <FadeIn delay={0.4}>
            <div className="bg-secondary/50 rounded-xl p-4 border border-border/30">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Lightbulb className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground mb-0.5">Dica</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    As pequenas coisas feitas com carinho fortalecem o relacionamento!
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </main>
        
        <MobileNav />
      </div>
      
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={new Date()}
      />
    </PageTransition>
  )
}
