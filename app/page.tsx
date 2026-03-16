"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAgenda } from "@/context/agenda-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { Heart, Calendar, Sparkles, ArrowRight, Users, Star } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  { icon: Calendar, text: "Calendario compartilhado" },
  { icon: Users, text: "Perfil do casal" },
  { icon: Star, text: "Sugestoes diarias" },
  { icon: Sparkles, text: "Momentos especiais" }
]

export default function LoginPage() {
  const [coupleName, setCoupleName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(false)
  const { login, isLoggedIn } = useAgenda()
  const router = useRouter()
  
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/agenda")
    }
  }, [isLoggedIn, router])
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(coupleName)
  }
  
  if (isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Heart className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground">Entrando...</p>
        </motion.div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left panel - Branding */}
      <motion.div 
        className="relative flex-1 flex flex-col items-center justify-center p-8 lg:p-16 bg-gradient-to-br from-love-light via-background to-warm-light dark:from-love-light dark:via-background dark:to-warm-light overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Floating hearts background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            >
              <Heart 
                className="text-primary/20 dark:text-primary/10" 
                style={{ width: 24 + i * 8, height: 24 + i * 8 }}
              />
            </motion.div>
          ))}
        </div>
        
        <div className="absolute top-6 right-6 lg:top-8 lg:right-8">
          <ThemeToggle />
        </div>
        
        <div className="relative max-w-md text-center lg:text-left">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15,
              delay: 0.2 
            }}
            className="inline-flex items-center justify-center h-20 w-20 lg:h-24 lg:w-24 rounded-3xl bg-card shadow-xl shadow-primary/10 mb-8"
          >
            <Heart className="h-10 w-10 lg:h-12 lg:w-12 text-primary fill-primary" />
          </motion.div>
          
          <motion.h1 
            className="font-serif text-3xl lg:text-5xl text-foreground mb-4 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Momentos juntos merecem ser{" "}
            <span className="text-primary italic">lembrados</span>
          </motion.h1>
          
          <motion.p 
            className="text-muted-foreground text-lg leading-relaxed mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Organize os planos do casal, guarde memorias especiais e nunca mais 
            esqueca uma data importante.
          </motion.p>
          
          <motion.div 
            className="hidden lg:grid grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-xl bg-card/60 backdrop-blur-sm"
                whileHover={{ scale: 1.02, x: 4 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
      
      {/* Right panel - Form */}
      <motion.div 
        className="flex-1 flex items-center justify-center p-6 lg:p-16 bg-card"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="mb-8">
              <h2 className="font-serif text-2xl lg:text-3xl text-foreground mb-2">
                {isLogin ? "Bem-vindos de volta!" : "Criar nossa agenda"}
              </h2>
              <p className="text-muted-foreground">
                {isLogin 
                  ? "Entre para acessar sua agenda compartilhada." 
                  : "Comece a organizar os melhores momentos juntos."}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="coupleName" className="text-foreground font-medium">
                  Nome do casal
                </Label>
                <Input
                  id="coupleName"
                  placeholder="Ex: Joao & Maria"
                  value={coupleName}
                  onChange={e => setCoupleName(e.target.value)}
                  required
                  className="h-12 bg-secondary/30 border-border/50 focus:border-primary transition-colors"
                />
                <p className="text-xs text-muted-foreground">
                  Use o formato: Nome1 & Nome2
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="casal@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="h-12 bg-secondary/30 border-border/50 focus:border-primary transition-colors"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha secreta"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="h-12 bg-secondary/30 border-border/50 focus:border-primary transition-colors"
                />
              </div>
              
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-medium gap-2 group"
                >
                  {isLogin ? "Entrar" : "Criar nossa agenda"}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </form>
            
            <div className="mt-8 pt-6 border-t border-border/50">
              <p className="text-center text-sm text-muted-foreground">
                {isLogin ? (
                  <>
                    Nao tem uma conta?{" "}
                    <button 
                      onClick={() => setIsLogin(false)}
                      className="text-primary hover:underline font-medium"
                    >
                      Criar agenda
                    </button>
                  </>
                ) : (
                  <>
                    Ja tem uma conta?{" "}
                    <button 
                      onClick={() => setIsLogin(true)}
                      className="text-primary hover:underline font-medium"
                    >
                      Entrar
                    </button>
                  </>
                )}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
