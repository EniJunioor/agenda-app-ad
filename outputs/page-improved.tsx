"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAgenda } from "@/context/agenda-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { Heart, Calendar, Sparkles, ArrowRight, Users, Star, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const features = [
  { icon: Calendar, text: "Calendário compartilhado", desc: "Sincronizado em tempo real" },
  { icon: Users, text: "Perfil do casal", desc: "Marcos e estatísticas juntos" },
  { icon: Star, text: "Sugestões diárias", desc: "Ideias personalizadas" },
  { icon: Sparkles, text: "Memórias especiais", desc: "Guarde cada momento" }
]

const testimonials = [
  { couple: "Ana & Pedro", text: "A melhor forma de planejar nossas aventuras juntos!", emoji: "💑" },
  { couple: "Luisa & Marcos", text: "Nunca mais esquecemos nenhuma data especial.", emoji: "🥰" },
  { couple: "Carla & Thiago", text: "As sugestões diárias são incríveis e criativas!", emoji: "✨" },
]

export default function LoginPage() {
  const [coupleName, setCoupleName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const { setSessionFromUser, isLoggedIn } = useAgenda()
  const router = useRouter()
  const searchParams = useSearchParams()
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const err = searchParams.get("error")
    if (err) setError(decodeURIComponent(err))
  }, [searchParams])

  useEffect(() => {
    if (isLoggedIn) router.push("/agenda")
  }, [isLoggedIn, router])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(p => (p + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const form = formRef.current
    if (!form) return
    if (!email.trim() || !password.trim()) { setError("Preencha email e senha."); return }
    if (!isLogin && !coupleName.trim()) { setError("Preencha o nome do casal."); return }
    setLoading(true)
    const url = isLogin ? "/api/auth/login" : "/api/auth/register"
    form.action = url
    form.method = "POST"
    form.submit()
  }

  if (isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Heart className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground">Entrando...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden">

      {/* ── LEFT PANEL ── */}
      <motion.div
        className="relative flex-1 flex flex-col justify-between p-8 lg:p-14 overflow-hidden"
        style={{ background: "linear-gradient(150deg, #FFF0EB 0%, #FFF7F2 40%, #FFE7DF 100%)" }}
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-[-60px] right-[-80px] w-[320px] h-[320px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, #E17B6C40, transparent)" }} />
        <div className="absolute bottom-[-40px] left-[-60px] w-[240px] h-[240px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #F4B7A260, transparent)" }} />

        {/* Floating hearts */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ left: `${10 + i * 20}%`, top: `${15 + (i % 3) * 28}%` }}
              animate={{ y: [0, -18, 0], opacity: [0.08, 0.2, 0.08], scale: [1, 1.12, 1] }}
              transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.7, ease: "easeInOut" }}
            >
              <Heart style={{ width: 20 + i * 10, height: 20 + i * 10, color: "#E17B6C" }} />
            </motion.div>
          ))}
        </div>

        {/* Header */}
        <div className="relative flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
              <Heart className="h-5 w-5 text-white fill-white" />
            </div>
            <div>
              <div className="font-serif text-base text-foreground font-semibold leading-tight">Nossa Agenda</div>
              <div className="text-[10px] text-primary font-semibold uppercase tracking-widest">Para casais</div>
            </div>
          </motion.div>
          <ThemeToggle />
        </div>

        {/* Hero */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-primary/20 rounded-full px-3 py-1.5 mb-5 text-xs font-semibold text-primary shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Mais de 1.000 casais já usam
            </div>

            <h1 className="font-serif text-3xl lg:text-[2.8rem] text-foreground mb-4 leading-[1.15]">
              Momentos juntos<br />
              merecem ser{" "}
              <span className="text-primary italic relative">
                lembrados
                <motion.svg
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 120 8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  <motion.path
                    d="M2 6 Q60 2 118 6"
                    stroke="#E17B6C"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                  />
                </motion.svg>
              </span>
            </h1>

            <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-md">
              Organize os planos do casal, guarde memórias especiais e nunca mais esqueça uma data importante.
            </p>
          </motion.div>

          {/* Feature grid */}
          <motion.div
            className="hidden lg:grid grid-cols-2 gap-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3 bg-white/60 backdrop-blur-sm border border-white/80 rounded-xl p-3 shadow-sm"
                whileHover={{ y: -2, shadow: "0 8px 24px rgba(225,123,108,.15)" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <f.icon className="h-4.5 w-4.5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground leading-tight">{f.text}</div>
                  <div className="text-[11px] text-muted-foreground">{f.desc}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Testimonial */}
          <div className="hidden lg:block">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white/70 backdrop-blur-sm border border-white/80 rounded-2xl p-4 shadow-sm"
              >
                <div className="text-2xl mb-2">{testimonials[activeTestimonial].emoji}</div>
                <p className="text-sm text-foreground italic mb-1.5">
                  "{testimonials[activeTestimonial].text}"
                </p>
                <div className="text-xs font-semibold text-primary">
                  — {testimonials[activeTestimonial].couple}
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="flex gap-1.5 mt-3">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className="h-1.5 rounded-full transition-all"
                  style={{ width: i === activeTestimonial ? 20 : 6, background: i === activeTestimonial ? "#E17B6C" : "#F0D9D2" }}
                />
              ))}
            </div>
          </div>
        </div>

        <div />
      </motion.div>

      {/* ── RIGHT PANEL ── */}
      <motion.div
        className="flex-1 flex items-center justify-center p-6 lg:p-14 bg-card"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="w-full max-w-md">
          {/* Tab switcher */}
          <div className="flex bg-secondary rounded-xl p-1 mb-8">
            <button
              onClick={() => { setIsLogin(false); setError("") }}
              className="flex-1 text-sm font-medium py-2 rounded-lg transition-all"
              style={{
                background: !isLogin ? "white" : "transparent",
                color: !isLogin ? "#2B1E1E" : "#7A6161",
                boxShadow: !isLogin ? "0 1px 4px rgba(0,0,0,.1)" : "none"
              }}
            >
              Criar agenda
            </button>
            <button
              onClick={() => { setIsLogin(true); setError("") }}
              className="flex-1 text-sm font-medium py-2 rounded-lg transition-all"
              style={{
                background: isLogin ? "white" : "transparent",
                color: isLogin ? "#2B1E1E" : "#7A6161",
                boxShadow: isLogin ? "0 1px 4px rgba(0,0,0,.1)" : "none"
              }}
            >
              Já tenho conta
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "register"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6">
                <h2 className="font-serif text-2xl text-foreground mb-1.5">
                  {isLogin ? "Bem-vindo(a) de volta!" : "Comece sua jornada"}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {isLogin
                    ? "Entre para acessar sua agenda compartilhada."
                    : "Crie a agenda do casal em menos de 1 minuto."}
                </p>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-destructive bg-destructive/8 border border-destructive/20 rounded-xl p-3"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-1.5"
                  >
                    <Label className="text-sm font-medium text-foreground">
                      Nome do casal <span className="text-primary">*</span>
                    </Label>
                    <Input
                      name="coupleName"
                      placeholder="Ex: João & Maria"
                      value={coupleName}
                      onChange={e => setCoupleName(e.target.value)}
                      required={!isLogin}
                      className="h-11 bg-secondary/40 border-border/60 focus:border-primary"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Use o formato: Nome1 & Nome2
                    </p>
                  </motion.div>
                )}

                {!isLogin && (
                  <input type="hidden" name="name" value={coupleName.split("&")[0]?.trim() || email} readOnly />
                )}

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">
                    Email <span className="text-primary">*</span>
                  </Label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="casal@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="h-11 bg-secondary/40 border-border/60 focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">
                    Senha <span className="text-primary">*</span>
                  </Label>
                  <Input
                    name="password"
                    type="password"
                    placeholder={isLogin ? "Sua senha" : "Mínimo 6 caracteres"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="h-11 bg-secondary/40 border-border/60 focus:border-primary"
                  />
                </div>

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 text-sm font-semibold gap-2 group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {loading ? (
                        <>
                          <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Aguarde...
                        </>
                      ) : (
                        <>
                          <Heart className="h-4 w-4 fill-current" />
                          {isLogin ? "Entrar na agenda" : "Criar nossa agenda"}
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                  </Button>
                </motion.div>
              </form>

              {!isLogin && (
                <div className="mt-5 space-y-2">
                  {["Calendário compartilhado em tempo real", "Convide seu parceiro(a) por email", "Sugestões de programas diárias"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="h-4 w-4 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                        <Check className="h-2.5 w-2.5 text-primary" />
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
