"use client"

import { useMemo } from "react"
import { useAgenda } from "@/context/agenda-context"
import { getCategoryById } from "@/data/events"
import { MobileNav } from "@/components/agenda/mobile-nav"
import { PageTransition, FadeIn } from "@/components/page-transition"
import { Button } from "@/components/ui/button"
import { Image as ImageIcon, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

export default function MemoriasPage() {
  const { events } = useAgenda()

  const withPhoto = useMemo(() => {
    return events
      .filter(e => !!e.photoUrl)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [events])

  const fmtDate = (s: string) =>
    new Date(s + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })

  return (
    <PageTransition>
      <div className="min-h-screen pb-20 lg:pb-0">
        <header className="sticky top-0 z-30 glass border-b border-border/40">
          <div className="flex items-center justify-between px-4 lg:px-7 h-[60px]">
            <div>
              <h1 className="font-serif text-lg lg:text-xl text-foreground font-semibold">Memórias</h1>
              <p className="text-xs text-muted-foreground hidden lg:block">Um feed com os momentos que viraram foto</p>
            </div>
            <Link
              href="/historico"
              className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
            >
              Ver histórico <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </header>

        <main className="p-4 lg:p-7 max-w-6xl mx-auto">
          {withPhoto.length === 0 ? (
            <FadeIn delay={0.1}>
              <div className="rounded-3xl border border-dashed border-border bg-card/60 py-14 text-center px-6">
                <div className="h-14 w-14 rounded-2xl bg-secondary mx-auto flex items-center justify-center mb-4">
                  <ImageIcon className="h-7 w-7 text-muted-foreground" />
                </div>
                <h2 className="font-serif text-xl text-foreground font-semibold mb-2">Ainda não tem memórias com foto</h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Adicione fotos nos eventos que já aconteceram. Assim vocês criam um álbum automático dos melhores momentos.
                </p>
                <Button asChild className="mt-6 rounded-xl">
                  <Link href="/historico">Ir para o histórico</Link>
                </Button>
              </div>
            </FadeIn>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {withPhoto.map((event, idx) => {
                const cat = getCategoryById(event.category)
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + idx * 0.02 }}
                    className="rounded-3xl border border-border/60 bg-card overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <Link href={`/agenda/${event.id}`} className="block">
                      <div className="relative h-48 w-full bg-secondary">
                        <Image
                          src={event.photoUrl!}
                          alt={event.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 50vw, 33vw"
                        />
                        {cat && (
                          <div
                            className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-xl"
                            style={{ background: cat.bg, color: cat.text }}
                          >
                            {cat.emoji} {cat.label.split(" / ")[0]}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-serif text-base font-semibold text-foreground line-clamp-1">{event.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {fmtDate(event.date)}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          )}
        </main>

        <MobileNav />
      </div>
    </PageTransition>
  )
}

