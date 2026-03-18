"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useAgenda } from "@/context/agenda-context"

function AceitarConviteInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const { setSessionFromUser } = useAgenda()

  const [step, setStep] = useState<"loading" | "form" | "error">("loading")
  const [email, setEmail] = useState("")
  const [coupleName, setCoupleName] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      setStep("error")
      setError("Link de convite inválido.")
      return
    }
    fetch(`/api/auth/accept-invite?token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error || !data.valid) {
          setStep("error")
          setError(data.error ?? "Convite inválido ou expirado.")
          return
        }
        setEmail(data.email ?? "")
        setCoupleName(data.coupleName ?? "")
        setStep("form")
      })
      .catch(() => {
        setStep("error")
        setError("Erro ao validar convite.")
      })
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/accept-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, name }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error ?? "Não foi possível aceitar o convite.")
        return
      }
      const user = data.user
      setSessionFromUser({
        ...user,
        couple: {
          name: user.coupleName,
          partner1: "",
          partner2: user.name,
          startDate: undefined,
        },
      })
      window.location.href = "/agenda"
      return
    } catch {
      setError("Erro de conexão. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  if (step === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-4 text-muted-foreground">Validando convite...</p>
      </div>
    )
  }

  if (step === "error") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="font-serif text-xl text-foreground mb-2">Convite inválido</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button variant="outline" onClick={() => router.push("/")}>
            Ir para o início
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <motion.div
        className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-love-light via-background to-warm-light dark:from-love-light dark:via-background dark:to-warm-light"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-md text-center">
          <div className="inline-flex h-20 w-20 rounded-3xl bg-card shadow-xl items-center justify-center mb-6">
            <Heart className="h-10 w-10 text-primary fill-primary" />
          </div>
          <h1 className="font-serif text-2xl text-foreground mb-2">Você foi convidado(a)!</h1>
          <p className="text-muted-foreground">
            <strong>{coupleName}</strong> te convidou para acessar a agenda do casal. Crie sua senha
            para entrar.
          </p>
        </div>
      </motion.div>

      <motion.div
        className="flex-1 flex items-center justify-center p-6 lg:p-16 bg-card"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="w-full max-w-md">
          <h2 className="font-serif text-2xl text-foreground mb-2">Criar minha conta</h2>
          <p className="text-muted-foreground mb-6">
            Defina sua senha e seu nome para acessar a agenda.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">{error}</p>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="h-12 bg-secondary/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Seu nome</Label>
              <Input
                id="name"
                placeholder="Como quer ser chamado(a)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-12 bg-secondary/30 border-border/50 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-12 bg-secondary/30 border-border/50 focus:border-primary"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-12 gap-2">
              {loading ? "Aguarde..." : "Entrar na agenda"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default function AceitarConvitePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <AceitarConviteInner />
    </Suspense>
  )
}