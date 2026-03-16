"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAgenda } from "@/context/agenda-context"
import { MobileNav } from "@/components/agenda/mobile-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, LogOut, Save } from "lucide-react"
import { motion } from "framer-motion"

export default function ConfiguracoesPage() {
  const { couple, setCouple, logout } = useAgenda()
  const router = useRouter()
  const [coupleName, setCoupleName] = useState(couple.name)
  const [saved, setSaved] = useState(false)
  
  const handleSave = () => {
    const [partner1, partner2] = coupleName.split(" & ")
    setCouple({
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
    <>
      <div className="p-4 lg:p-8 max-w-2xl">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="font-serif text-3xl text-foreground">Configurações</h1>
          <p className="text-muted-foreground mt-1">
            Personalize sua agenda do casal
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <Heart className="h-5 w-5 text-primary" />
                Informações do casal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="coupleName">Nome do casal</Label>
                <Input
                  id="coupleName"
                  value={coupleName}
                  onChange={e => setCoupleName(e.target.value)}
                  placeholder="Ex: João & Maria"
                  className="bg-secondary/50"
                />
                <p className="text-xs text-muted-foreground">
                  Use o formato: Nome1 & Nome2
                </p>
              </div>
              
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                {saved ? "Salvo!" : "Salvar alterações"}
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-serif">Conta</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="gap-2 text-destructive hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Sair da conta
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-border/50 bg-secondary/30">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Nossa Agenda v1.0
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Feito com amor para casais apaixonados
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <MobileNav />
    </>
  )
}
