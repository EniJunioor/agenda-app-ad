"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useAgenda } from "@/context/agenda-context"
import { MobileNav } from "@/components/agenda/mobile-nav"
import { ThemeToggle } from "@/components/theme-toggle"
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
  ChevronRight,
  Check,
  Sparkles
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function ConfiguracoesPage() {
  const { couple, setCouple, logout } = useAgenda()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [coupleName, setCoupleName] = useState(couple.name)
  const [saved, setSaved] = useState(false)
  
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
        className="p-4 lg:p-8 pb-24 lg:pb-8 max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-2 lg:hidden"
          variants={itemVariants}
        >
          <h1 className="font-serif text-2xl text-foreground">Configuracoes</h1>
          <ThemeToggle />
        </motion.div>
        
        <motion.p 
          className="text-muted-foreground mb-6"
          variants={itemVariants}
        >
          Personalize sua agenda do casal
        </motion.p>
        
        <div className="space-y-4">
          {/* Couple Info */}
          <motion.div variants={itemVariants}>
            <Card className="border-border/50 overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-serif text-lg">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Heart className="h-4 w-4 text-primary" />
                  </div>
                  Informacoes do casal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="coupleName">Nome do casal</Label>
                  <Input
                    id="coupleName"
                    value={coupleName}
                    onChange={e => setCoupleName(e.target.value)}
                    placeholder="Ex: Joao & Maria"
                    className="bg-secondary/30"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use o formato: Nome1 & Nome2
                  </p>
                </div>
                
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Button onClick={handleSave} className="gap-2 w-full sm:w-auto">
                    <AnimatePresence mode="wait">
                      {saved ? (
                        <motion.span
                          key="saved"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center gap-2"
                        >
                          <Check className="h-4 w-4" />
                          Salvo!
                        </motion.span>
                      ) : (
                        <motion.span
                          key="save"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center gap-2"
                        >
                          <Save className="h-4 w-4" />
                          Salvar alteracoes
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Appearance */}
          <motion.div variants={itemVariants}>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-serif text-lg">
                  <div className="h-8 w-8 rounded-lg bg-gold/10 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-gold" />
                  </div>
                  Aparencia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Tema</p>
                    <p className="text-sm text-muted-foreground">
                      {theme === "dark" ? "Modo escuro ativado" : "Modo claro ativado"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 p-1 bg-secondary rounded-lg">
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
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Other Settings */}
          <motion.div variants={itemVariants}>
            <Card className="border-border/50">
              <CardContent className="p-0">
                {[
                  { icon: Bell, label: "Notificacoes", description: "Lembretes de eventos", disabled: true },
                  { icon: Shield, label: "Privacidade", description: "Dados e seguranca", disabled: true },
                  { icon: HelpCircle, label: "Ajuda", description: "Suporte e FAQ", disabled: true },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    disabled={item.disabled}
                    className="w-full flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-b border-border/50 last:border-0"
                  >
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <item.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    {item.disabled && (
                      <span className="text-xs bg-secondary px-2 py-0.5 rounded text-muted-foreground">
                        Em breve
                      </span>
                    )}
                  </button>
                ))}
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Logout */}
          <motion.div variants={itemVariants}>
            <Card className="border-border/50">
              <CardContent className="p-4">
                <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    variant="ghost" 
                    className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 w-full justify-start"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Sair da conta
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Footer */}
          <motion.div variants={itemVariants}>
            <Card className="border-border/50 bg-gradient-to-br from-love-light to-card dark:from-love-light dark:to-card">
              <CardContent className="p-6 text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/20 mb-3"
                >
                  <Heart className="h-5 w-5 text-primary fill-primary" />
                </motion.div>
                <p className="font-serif text-foreground">Nossa Agenda</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Versao 2.0 - Feito com amor para casais apaixonados
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
      
      <MobileNav />
    </>
  )
}
