"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useAgenda } from "@/context/agenda-context"
import { MobileNav } from "@/components/agenda/mobile-nav"
import { PageTransition, FadeIn } from "@/components/page-transition"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, LogOut, Moon, Sun, Monitor, Bell, Shield, HelpCircle, UserPlus, Mail, Check } from "lucide-react"
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
  const [inviteMsg, setInviteMsg] = useState<{ type: "success" | "error"; text: string; link?: string } | null>(null)

  useEffect(() => { setMounted(true) }, [])

  const handleSave = () => {
    const [p1, p2] = coupleName.split(" & ")
    setCouple({ ...couple, name: coupleName, partner1: p1 || "Parceiro 1", partner2: p2 || "Parceiro 2" })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogout = async () => { await logout(); router.push("/") }

  const sendInvite = async () => {
    setInviteMsg(null); setInviteLoading(true)
    try {
      const res = await fetch("/api/auth/invite-partner", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnerEmail }),
      })
      const data = await res.json()
      if (!res.ok) { setInviteMsg({ type: "error", text: data?.error ?? "Erro ao enviar convite." }); return }
      setInviteMsg({ type: "success", text: data.emailSent ? "Convite enviado!" : "Convite criado.", link: data.inviteLink })
      setPartnerEmail("")
    } catch { setInviteMsg({ type: "error", text: "Erro de conexão." }) }
    finally { setInviteLoading(false) }
  }

  const themeOptions = [
    { key: "light", label: "Claro", icon: Sun },
    { key: "dark", label: "Escuro", icon: Moon },
    { key: "system", label: "Sistema", icon: Monitor },
  ]

  const comingSoon = [
    { icon: Bell, title: "Notificações", desc: "Alertas de eventos e datas especiais" },
    { icon: Shield, title: "Privacidade", desc: "Controle de dados e visibilidade" },
    { icon: HelpCircle, title: "Ajuda e suporte", desc: "Dúvidas e central de ajuda" },
  ]

  return (
    <PageTransition>
      <div className="min-h-screen pb-20 lg:pb-0">

        {/* Header */}
        <header className="sticky top-0 z-30 glass border-b border-border/40">
          <div className="px-4 lg:px-7 h-[60px] flex items-center">
            <div>
              <h1 className="font-serif text-lg lg:text-xl text-foreground font-semibold">Configurações</h1>
              <p className="text-xs text-muted-foreground hidden lg:block">Personalize sua experiência</p>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-7 max-w-2xl mx-auto space-y-7">

          {/* PERFIL */}
          <FadeIn delay={.05}>
            <section>
              <p className="text-[10px] font-bold uppercase tracking-[.12em] text-muted-foreground mb-3">Perfil</p>
              <div className="rounded-2xl border border-border/60 bg-card overflow-hidden divide-y divide-border/50">

                {/* Nome do casal */}
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Heart className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">Nome do casal</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Como a agenda de vocês é identificada</div>
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <Input value={coupleName} onChange={e => setCoupleName(e.target.value)}
                      placeholder="Ex: João & Maria" className="h-10 text-sm bg-secondary/40 border-border/60 focus:border-primary" />
                    <Button onClick={handleSave} className="h-10 px-4 rounded-xl shrink-0 gap-2 text-sm">
                      <AnimatePresence mode="wait">
                        {saved
                          ? <motion.span key="ok" initial={{ scale: .8 }} animate={{ scale: 1 }} className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5" />Salvo!</motion.span>
                          : <motion.span key="save">Salvar</motion.span>
                        }
                      </AnimatePresence>
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-2">Formato: Nome1 & Nome2</p>
                </div>

                {/* Convidar parceiro */}
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <UserPlus className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">Convidar parceiro(a)</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Compartilhe a agenda com seu par</div>
                    </div>
                  </div>

                  {/* Current partner status */}
                  <div className="flex items-center gap-3 rounded-xl bg-secondary/40 px-3.5 py-3 mb-3">
                    <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                      {(couple.partner2 || couple.partner1 || " ").charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-foreground truncate">{couple.partner2 || "Parceiro(a)"}</div>
                      <div className="text-xs text-muted-foreground truncate">{user?.email ?? "—"}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 shrink-0">
                      Conectado
                    </span>
                  </div>

                  <div className="flex gap-2.5">
                    <Input type="email" placeholder="Email do parceiro..." value={partnerEmail}
                      onChange={e => { setPartnerEmail(e.target.value); setInviteMsg(null) }}
                      className="h-10 text-sm bg-secondary/40 border-border/60 focus:border-primary" />
                    <Button onClick={sendInvite} disabled={!partnerEmail || inviteLoading}
                      variant="outline" className="h-10 px-4 rounded-xl shrink-0 gap-2 text-sm border-primary/30 text-primary hover:bg-primary/8">
                      <Mail className="h-3.5 w-3.5" />
                      {inviteLoading ? "..." : "Enviar"}
                    </Button>
                  </div>

                  <AnimatePresence>
                    {inviteMsg && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`mt-3 text-xs rounded-xl p-3 ${inviteMsg.type === "success" ? "bg-emerald-500/8 text-emerald-600 border border-emerald-500/20" : "bg-destructive/8 text-destructive border border-destructive/20"}`}>
                        {inviteMsg.text}
                        {inviteMsg.link && <p className="mt-1.5 break-all opacity-80">Link: {inviteMsg.link}</p>}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>
          </FadeIn>

          {/* APARÊNCIA */}
          <FadeIn delay={.1}>
            <section>
              <p className="text-[10px] font-bold uppercase tracking-[.12em] text-muted-foreground mb-3">Aparência</p>
              <div className="rounded-2xl border border-border/60 bg-card p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Sun className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Tema da interface</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Escolha o visual da sua agenda</div>
                  </div>
                </div>
                {mounted ? (
                  <div className="grid grid-cols-3 gap-2.5">
                    {themeOptions.map(({ key, label, icon: Icon }) => {
                      const active = theme === key
                      return (
                        <button key={key} onClick={() => setTheme(key)}
                          className={`relative rounded-xl border p-3 text-center transition-all ${active ? "border-primary bg-primary/8 shadow-sm" : "border-border/60 hover:border-border"}`}>
                          <div className="flex justify-center mb-2">
                            <Icon className={`h-5 w-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                          </div>
                          <div className={`text-xs font-semibold ${active ? "text-primary" : "text-muted-foreground"}`}>
                            {label}
                          </div>
                          {active && (
                            <motion.div layoutId="theme-check"
                              className="absolute top-2 right-2 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                              <Check className="h-2.5 w-2.5 text-white" />
                            </motion.div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="h-20 rounded-xl shimmer" />
                )}
              </div>
            </section>
          </FadeIn>

          {/* MAIS OPÇÕES */}
          <FadeIn delay={.15}>
            <section>
              <p className="text-[10px] font-bold uppercase tracking-[.12em] text-muted-foreground mb-3">Mais opções</p>
              <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
                {comingSoon.map((item, i) => (
                  <div key={i} className={`flex items-center gap-3.5 px-5 py-4 ${i < comingSoon.length - 1 ? "border-b border-border/40" : ""}`}>
                    <div className="h-9 w-9 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-foreground">{item.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-secondary/60 text-muted-foreground shrink-0">
                      Em breve
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </FadeIn>

          {/* SAIR */}
          <FadeIn delay={.2}>
            <button onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2.5 rounded-2xl border border-destructive/20 bg-destructive/5 py-3.5 text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors">
              <LogOut className="h-4 w-4" />
              Sair da conta
            </button>
          </FadeIn>
        </main>

        <MobileNav />
      </div>
    </PageTransition>
  )
}
