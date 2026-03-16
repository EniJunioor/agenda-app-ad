"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAgenda } from "@/context/agenda-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, Calendar, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function LoginPage() {
  const [coupleName, setCoupleName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(false)
  const { login, isLoggedIn } = useAgenda()
  const router = useRouter()
  
  if (isLoggedIn) {
    router.push("/agenda")
    return null
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(coupleName)
    router.push("/agenda")
  }
  
  return (
    <div className="min-h-screen flex">
      <motion.div 
        className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary items-center justify-center p-12"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-md text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-card shadow-lg mb-8"
          >
            <Heart className="h-12 w-12 text-primary fill-primary" />
          </motion.div>
          
          <motion.h1 
            className="font-serif text-4xl text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Momentos juntos merecem ser lembrados
          </motion.h1>
          
          <motion.p 
            className="text-muted-foreground text-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Organize os planos do casal, guarde memórias especiais e nunca mais 
            esqueça uma data importante.
          </motion.p>
          
          <motion.div 
            className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Calendário compartilhado
            </span>
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              Categorias especiais
            </span>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div 
        className="flex-1 flex items-center justify-center p-8"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
              <Heart className="h-8 w-8 text-primary fill-primary" />
            </div>
            <h1 className="font-serif text-2xl text-foreground">Nossa Agenda</h1>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-serif text-3xl text-foreground mb-2">
              {isLogin ? "Bem-vindos de volta!" : "Criar nossa agenda"}
            </h2>
            <p className="text-muted-foreground mb-8">
              {isLogin 
                ? "Entre para acessar sua agenda compartilhada." 
                : "Comece a organizar os melhores momentos juntos."}
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="coupleName">Nome do casal</Label>
                <Input
                  id="coupleName"
                  placeholder="Ex: João & Maria"
                  value={coupleName}
                  onChange={e => setCoupleName(e.target.value)}
                  required
                  className="bg-secondary/50 h-12"
                />
                <p className="text-xs text-muted-foreground">
                  Use o formato: Nome1 & Nome2
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="casal@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="bg-secondary/50 h-12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha secreta"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="bg-secondary/50 h-12"
                />
              </div>
              
              <Button type="submit" className="w-full h-12 text-base">
                {isLogin ? "Entrar" : "Criar nossa agenda"}
              </Button>
            </form>
            
            <p className="text-center mt-6 text-sm text-muted-foreground">
              {isLogin ? (
                <>
                  Não tem uma conta?{" "}
                  <button 
                    onClick={() => setIsLogin(false)}
                    className="text-primary hover:underline font-medium"
                  >
                    Criar agenda
                  </button>
                </>
              ) : (
                <>
                  Já tem uma conta?{" "}
                  <button 
                    onClick={() => setIsLogin(true)}
                    className="text-primary hover:underline font-medium"
                  >
                    Entrar
                  </button>
                </>
              )}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
