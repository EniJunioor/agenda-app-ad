"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAgenda } from "@/context/agenda-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, Calendar, Sparkles, ArrowRight, Users, Star, Eye, EyeOff } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const features = [
  { icon: Calendar, label: "Agenda compartilhada", desc: "Planejem juntos cada momento" },
  { icon: Users,    label: "Perfil do casal",       desc: "Contem a história de vocês" },
  { icon: Star,     label: "Sugestões diárias",     desc: "Ideias para surpreender" },
  { icon: Sparkles, label: "Momentos especiais",    desc: "Memórias que duram pra sempre" },
]

const floatingItems = [
  { emoji: "🌹", x: "8%",  y: "12%", size: 28, delay: 0    },
  { emoji: "✨", x: "88%", y: "8%",  size: 22, delay: 0.6  },
  { emoji: "💌", x: "5%",  y: "65%", size: 26, delay: 1.2  },
  { emoji: "🕯️", x: "92%", y: "55%", size: 24, delay: 0.3  },
  { emoji: "🌙", x: "50%", y: "5%",  size: 20, delay: 0.9  },
  { emoji: "💐", x: "78%", y: "82%", size: 28, delay: 1.5  },
  { emoji: "⭐", x: "18%", y: "88%", size: 18, delay: 0.4  },
]

export function LoginPageInner() {
  const [coupleName, setCoupleName] = useState("")
  const [email, setEmail]           = useState("")
  const [password, setPassword]     = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLogin, setIsLogin]       = useState(true)
  const [error, setError]           = useState("")
  const [loading, setLoading]       = useState(false)
  const { setSessionFromUser, isLoggedIn } = useAgenda()
  const router       = useRouter()
  const searchParams = useSearchParams()
  const formRef      = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const err = searchParams.get("error")
    if (err) setError(decodeURIComponent(err))
  }, [searchParams])

  useEffect(() => {
    if (isLoggedIn) router.push("/agenda")
  }, [isLoggedIn, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const form = formRef.current
    if (!form) return
    if (!email.trim() || !password.trim()) { setError("Preencha email e senha."); return }
    if (!isLogin && !coupleName.trim())     { setError("Preencha o nome do casal."); return }
    setLoading(true)
    form.action = isLogin ? "/api/auth/login" : "/api/auth/register"
    form.method = "POST"
    form.submit()
  }

  if (isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>
            <Heart className="h-10 w-10 text-primary fill-primary mx-auto mb-4" />
          </motion.div>
          <p className="text-muted-foreground font-medium">Entrando...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden">

      {/* ══════════════════════════════════
          PAINEL ESQUERDO — hero
      ══════════════════════════════════ */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-10 lg:p-16 overflow-hidden"
        style={{ background: "linear-gradient(145deg, #fce8e4 0%, #fdf3ef 40%, #fef6f0 70%, #fde8e0 100%)" }}
      >

        {/* Blob de fundo */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-40"
            style={{ background: "radial-gradient(circle, #f4a89a 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-30"
            style={{ background: "radial-gradient(circle, #f9c5b8 0%, transparent 70%)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #e8867a 0%, transparent 65%)" }} />
        </div>

        {/* Emojis flutuantes */}
        {floatingItems.map((item, i) => (
          <motion.div key={i}
            className="absolute select-none pointer-events-none"
            style={{ left: item.x, top: item.y, fontSize: item.size }}
            animate={{ y: [0, -14, 0], rotate: [-4, 4, -4], opacity: [0.45, 0.75, 0.45] }}
            transition={{ duration: 5 + i * 0.7, repeat: Infinity, delay: item.delay, ease: "easeInOut" }}
          >
            {item.emoji}
          </motion.div>
        ))}

        {/* Conteúdo */}
        <div className="relative z-10 max-w-lg w-full">

          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.1 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3">
              <div className="h-14 w-14 rounded-2xl shadow-lg shadow-rose-200 flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #D96B5A, #c85746)" }}>
                <Heart className="h-7 w-7 text-white fill-white" />
              </div>
              <div>
                <p className="font-serif text-xl font-bold text-stone-700 leading-none">Nossa Agenda</p>
                <p className="text-xs text-stone-400 mt-0.5 tracking-wide">para casais</p>
              </div>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="mb-10"
          >
            <h1 className="font-serif text-4xl lg:text-5xl text-stone-800 leading-[1.15] mb-4">
              Momentos juntos{" "}
              <br />
              merecem ser{" "}
              <span className="italic" style={{ color: "#C85746" }}>guardados.</span>
            </h1>
            <p className="text-stone-500 text-base leading-relaxed max-w-sm">
              Organize planos, guarde memórias e nunca mais esqueça uma data importante — tudo num só lugar.
            </p>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="grid grid-cols-2 gap-3"
          >
            {features.map((f, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                whileHover={{ scale: 1.03, y: -2 }}
                className="flex items-center gap-3 p-3.5 rounded-2xl backdrop-blur-sm border border-white/70 shadow-sm"
                style={{ background: "rgba(255,255,255,0.55)" }}
              >
                <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg, #fce8e4, #f9d0c8)" }}>
                  <f.icon className="h-4 w-4" style={{ color: "#C85746" }} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-stone-700 leading-tight">{f.label}</p>
                  <p className="text-[10px] text-stone-400 leading-tight mt-0.5">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Depoimento */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.85 }}
            className="mt-8 flex items-center gap-3"
          >
            <div className="flex -space-x-2">
              {["#D96B5A","#E8967F","#C85746"].map((c,i) => (
                <div key={i} className="h-7 w-7 rounded-full border-2 border-white/80"
                  style={{ background: `linear-gradient(135deg, ${c}, ${c}aa)` }} />
              ))}
            </div>
            <p className="text-xs text-stone-400">
              <span className="text-stone-600 font-semibold">+1.200 casais</span> já usam Nossa Agenda
            </p>
          </motion.div>
        </div>
      </div>

      {/* ══════════════════════════════════
          PAINEL DIREITO — formulário
      ══════════════════════════════════ */}
      <motion.div
        className="flex-1 flex items-center justify-center p-6 lg:p-16 bg-white dark:bg-card"
        initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <div className="w-full max-w-md">

          {/* Cabeçalho do form */}
          <motion.div
            key={isLogin ? "login-h" : "register-h"}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="font-serif text-2xl lg:text-3xl text-foreground font-bold mb-1.5">
              {isLogin ? "Bem-vindos de volta 💕" : "Criar nossa agenda"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {isLogin
                ? "Entre para acessar sua agenda compartilhada."
                : "Comece a organizar os melhores momentos juntos."}
            </p>
          </motion.div>

          {/* Tabs login / cadastro */}
          <div className="flex bg-secondary/60 rounded-2xl p-1 mb-7 gap-1">
            {[{ label: "Entrar", val: true }, { label: "Criar conta", val: false }].map(t => (
              <button key={String(t.val)}
                onClick={() => { setIsLogin(t.val); setError("") }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 relative"
                style={{
                  background: isLogin === t.val ? "white" : "transparent",
                  color: isLogin === t.val ? "#C85746" : "var(--muted-foreground)",
                  boxShadow: isLogin === t.val ? "0 1px 6px rgba(0,0,0,.08)" : "none",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form ref={formRef} onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              <motion.div key={isLogin ? "l" : "r"}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Erro */}
                {error && (
                  <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                    className="text-sm text-destructive bg-destructive/8 border border-destructive/20 rounded-xl px-4 py-3">
                    {error}
                  </motion.div>
                )}

                {/* Nome do casal (só no cadastro) */}
                {!isLogin && (
                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold text-foreground">Nome do casal</Label>
                    <Input
                      name="coupleName"
                      placeholder="João & Maria"
                      value={coupleName}
                      onChange={e => setCoupleName(e.target.value)}
                      required={!isLogin}
                      className="h-12 rounded-xl bg-secondary/40 border-border/40 focus:border-rose-300 focus:ring-rose-100 text-sm"
                    />
                    <p className="text-[11px] text-muted-foreground">Use o formato: Nome1 & Nome2</p>
                  </div>
                )}

                {!isLogin && (
                  <input type="hidden" name="name" value={coupleName.split("&")[0]?.trim() || email} readOnly />
                )}

                {/* Email */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-foreground">Email</Label>
                  <Input
                    name="email" type="email"
                    placeholder="casal@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="h-12 rounded-xl bg-secondary/40 border-border/40 focus:border-rose-300 text-sm"
                  />
                </div>

                {/* Senha */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-foreground">Senha</Label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Sua senha secreta"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      className="h-12 rounded-xl bg-secondary/40 border-border/40 focus:border-rose-300 text-sm pr-11"
                    />
                    <button type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="pt-1">
                  <button type="submit" disabled={loading}
                    className="w-full h-12 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-60 group"
                    style={{ background: loading ? "#c4897d" : "linear-gradient(135deg, #D96B5A 0%, #C85746 100%)" }}
                  >
                    {loading
                      ? <><span className="animate-spin mr-1">⏳</span> Aguarde...</>
                      : <>
                          {isLogin ? "Entrar na agenda" : "Criar nossa agenda"}
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    }
                  </button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </form>

          {/* Rodapé do form */}
          <div className="mt-7 pt-6 border-t border-border/40 text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? (
                <>Não tem uma conta?{" "}
                  <button onClick={() => { setIsLogin(false); setError("") }}
                    className="font-semibold hover:underline transition-colors"
                    style={{ color: "#C85746" }}>
                    Criar agenda
                  </button>
                </>
              ) : (
                <>Já tem uma conta?{" "}
                  <button onClick={() => { setIsLogin(true); setError("") }}
                    className="font-semibold hover:underline transition-colors"
                    style={{ color: "#C85746" }}>
                    Entrar
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}