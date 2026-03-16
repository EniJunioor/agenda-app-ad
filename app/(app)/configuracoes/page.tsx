"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useAgenda } from "@/context/agenda-context"
import { MobileNav } from "@/components/agenda/mobile-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { PageTransition, FadeIn } from "@/components/page-transition"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Heart, 
  LogOut, 
  Save, 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  HelpCircle,
  ArrowRight,
  Check
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function ConfiguracoesPage() {
  const { couple, setCouple, logout } = useAgenda()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [coupleName, setCoupleName] = useState(couple.name)
  const [saved, setSaved] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const handleSave = () => {
    const [partner1, partner2] = coupleName.split(" & ")
    setCouple({
      ...couple,
      name: coupleName,
      partner1: partner1 || "Parceiro 1",
      partner2: partner2 || "Parceiro 2"
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }
  
  const handleLogout = () => {
    logout()
    router.push("/")
  }
  
  return (
    <PageTransition>
      <div className="min-h-screen pb-24 lg:pb-8">
        {/* Header */}
        <header className="sticky top-0 z-30 glass border-b border-border/40">
          <div className="flex items-center justify-between p-4 lg:px-8">
            <h1 className="font-serif text-xl text-foreground">Configuracoes</h1>
            <ThemeToggle />
          </div>
        </header>
        
        <main className="p-4 lg:p-8 max-w-2xl space-y-4">
          {/* Couple Info */}
          <FadeIn delay={0.1}>
            <Card className="border-border/50">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Heart className="h-3.5 w-3.5 text-primary" />
                  </div>
                  Nome do casal
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-3">
                <Input
                  value={coupleName}
                  onChange={e => setCoupleName(e.target.value)}
                  placeholder="Ex: Joao & Maria"
                  className="bg-secondary/30 h-9 text-sm"
                />
                <Button onClick={handleSave} size="sm" className="gap-1.5">
                  <AnimatePresence mode="wait">
                    {saved ? (
                      <motion.span
                        key="saved"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-1.5"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Salvo
                      </motion.span>
                    ) : (
                      <motion.span
                        key="save"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-1.5"
                      >
                        <Save className="h-3.5 w-3.5" />
                        Salvar
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </CardContent>
            </Card>
          </FadeIn>
          
          {/* Appearance */}
          <FadeIn delay={0.15}>
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Tema</p>
                    <p className="text-xs text-muted-foreground">
                      {mounted ? (theme === "dark" ? "Modo escuro" : "Modo claro") : "Carregando..."}
                    </p>
                  </div>
                  {mounted && (
                    <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg">
                      <button
                        onClick={() => setTheme("light")}
                        className={`p-2 rounded-md transition-colors ${
                          theme === "light" ? "bg-card shadow-sm" : "hover:bg-card/50"
                        }`}
                      >
                        <Sun className={`h-4 w-4 ${theme === "light" ? "text-gold" : "text-muted-foreground"}`} />
                      </button>
                      <button
                        onClick={() => setTheme("dark")}
                        className={`p-2 rounded-md transition-colors ${
                          theme === "dark" ? "bg-card shadow-sm" : "hover:bg-card/50"
                        }`}
                      >
                        <Moon className={`h-4 w-4 ${theme === "dark" ? "text-primary" : "text-muted-foreground"}`} />
                      </button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
          
          {/* Other Settings */}
          <FadeIn delay={0.2}>
            <Card className="border-border/50">
              <CardContent className="p-0">
                {[
                  { icon: Bell, label: "Notificacoes", disabled: true },
                  { icon: Shield, label: "Privacidade", disabled: true },
                  { icon: HelpCircle, label: "Ajuda", disabled: true },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    disabled={item.disabled}
                    className="w-full flex items-center gap-3 p-3.5 hover:bg-secondary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-b border-border/30 last:border-0"
                  >
                    <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="flex-1 text-left text-sm font-medium text-foreground">{item.label}</span>
                    {item.disabled && (
                      <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground">
                        Em breve
                      </span>
                    )}
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </CardContent>
            </Card>
          </FadeIn>
          
          {/* Logout */}
          <FadeIn delay={0.25}>
            <Button 
              variant="ghost" 
              className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 w-full justify-start text-sm"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Sair da conta
            </Button>
          </FadeIn>
          
          {/* Footer */}
          <FadeIn delay={0.3}>
            <div className="text-center pt-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 mb-2"
              >
                <Heart className="h-4 w-4 text-primary fill-primary" />
              </motion.div>
              <p className="text-xs text-muted-foreground">
                Nossa Agenda v2.0
              </p>
            </div>
          </FadeIn>
        </main>
        
        <MobileNav />
      </div>
    </PageTransition>
  )
}
