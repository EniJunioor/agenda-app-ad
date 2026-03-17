"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useAgenda } from "@/context/agenda-context"
import { MobileNav } from "@/components/agenda/mobile-nav"
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
  Check,
  UserPlus,
  Mail,
  Search
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function ConfiguracoesPage() {
  const { couple, setCouple, logout, user } = useAgenda()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [coupleName, setCoupleName] = useState(couple.name)
  const [saved, setSaved] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [partnerEmail, setPartnerEmail] = useState("")
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteMessage, setInviteMessage] = useState<{ type: "success" | "error"; text: string; link?: string } | null>(null)
  
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
  
  const handleLogout = async () => {
    await logout()
    router.push("/")
  }
  
  return (
    <PageTransition>
      <div className="min-h-screen pb-12 lg:pb-4">
        <main className="p-4 lg:p-6 max-w-3xl mx-auto space-y-6">
          {/* PERFIL */}
          <div className="space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Perfil</p>

              <FadeIn delay={0.05}>
              <Card className="border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden">
                <CardHeader className="px-5 py-3.5 border-b border-border/40">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Heart className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold">Nome do casal</CardTitle>
                      <p className="text-xs text-muted-foreground">Como a agenda de vocês é identificada</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <Input
                      value={coupleName}
                      onChange={e => setCoupleName(e.target.value)}
                      placeholder="Ex: Junior e Beatriz"
                      className="bg-secondary/30 h-10 text-sm"
                    />
                    <Button onClick={handleSave} className="h-10 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
                      <AnimatePresence mode="wait">
                        {saved ? (
                          <motion.span key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                            <Check className="h-4 w-4" />
                            Salvar
                          </motion.span>
                        ) : (
                          <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                            <Check className="h-4 w-4 opacity-0" />
                            Salvar
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1.5">
                    Use o formato: Nome1 & Nome2 ou Nome1 e Nome2
                  </p>
                </CardContent>
              </Card>
            </FadeIn>

              <FadeIn delay={0.08}>
              <Card className="border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden">
                <CardHeader className="px-5 py-3.5 border-b border-border/40">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <UserPlus className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold">Parceira(o)</CardTitle>
                      <p className="text-xs text-muted-foreground">Convide seu par para compartilhar a agenda</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-5 py-3.5 space-y-2.5">
                  <div className="flex items-center justify-between rounded-xl border border-border/40 bg-secondary/20 px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                        {(couple.partner2 || couple.partner1 || " ").charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{couple.partner2 || "Beatriz"}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email ?? "—"}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600">
                      Conectada
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Input
                      type="email"
                      placeholder="Convidar outro email..."
                      value={partnerEmail}
                      onChange={e => { setPartnerEmail(e.target.value); setInviteMessage(null) }}
                      className="bg-secondary/30 h-10 text-sm"
                    />
                    <Button
                      className="h-10 px-4 rounded-xl bg-primary/15 text-primary hover:bg-primary/20"
                      disabled={!partnerEmail || inviteLoading}
                      onClick={async () => {
                        setInviteMessage(null)
                        setInviteLoading(true)
                        try {
                          const res = await fetch("/api/auth/invite-partner", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ partnerEmail }),
                          })
                          const data = await res.json()
                          if (!res.ok) {
                            setInviteMessage({ type: "error", text: data?.error ?? "Erro ao enviar convite." })
                            return
                          }
                          setInviteMessage({
                            type: "success",
                            text: data.emailSent ? "Convite enviado por email!" : "Convite criado.",
                            link: data.inviteLink,
                          })
                          setPartnerEmail("")
                        } catch {
                          setInviteMessage({ type: "error", text: "Erro de conexão." })
                        } finally {
                          setInviteLoading(false)
                        }
                      }}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      {inviteLoading ? "Enviando" : "Enviar"}
                    </Button>
                  </div>

                  {inviteMessage && (
                    <div className={`text-xs rounded-xl p-3 ${inviteMessage.type === "success" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                      {inviteMessage.text}
                      {inviteMessage.link && <p className="mt-2 break-all">Link: {inviteMessage.link}</p>}
                    </div>
                  )}
                </CardContent>
              </Card>
            </FadeIn>
          </div>

          {/* APARÊNCIA */}
          <div className="space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Aparência</p>
            <FadeIn delay={0.12}>
              <Card className="border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden">
                <CardHeader className="px-5 py-3.5 border-b border-border/40">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Sun className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold">Tema</CardTitle>
                      <p className="text-xs text-muted-foreground">Escolha o visual da sua agenda</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-5 py-3.5">
                  {mounted ? (
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { key: "light", label: "Claro", preview: "bg-white" },
                        { key: "dark", label: "Escuro", preview: "bg-[#1a1a1a]" },
                        { key: "system", label: "Automático", preview: "bg-gradient-to-br from-white to-[#1a1a1a]" },
                      ].map((opt) => {
                        const active = theme === opt.key
                        return (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() => setTheme(opt.key)}
                            className={`rounded-xl border p-3 text-center transition-colors ${
                              active ? "border-primary bg-primary/5" : "border-border/40 hover:bg-secondary/20"
                            }`}
                          >
                            <div className={`mx-auto h-10 w-16 rounded-lg ${opt.preview} border border-border/40 relative overflow-hidden`}>
                              <span className="absolute bottom-2 right-2 h-2 w-2 rounded-full bg-primary" />
                            </div>
                            <p className={`mt-2 text-xs font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>{opt.label}</p>
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Carregando…</p>
                  )}
                </CardContent>
              </Card>
            </FadeIn>
          </div>

          {/* MAIS OPÇÕES */}
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Mais opções</p>
            <FadeIn delay={0.16}>
              <Card className="border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-0">
                  {[
                    { icon: Bell, title: "Notificações", desc: "Alertas de eventos e datas especiais" },
                    { icon: Shield, title: "Privacidade", desc: "Controle de dados e visibilidade" },
                    { icon: HelpCircle, title: "Ajuda e suporte", desc: "Dúvidas e central de ajuda" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 px-5 py-3.5 border-b border-border/30 last:border-0">
                      <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <item.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <span className="text-[11px] px-3 py-1 rounded-full bg-secondary/40 text-muted-foreground">Em breve</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </main>
        
        <MobileNav />
      </div>
    </PageTransition>
  )
}
