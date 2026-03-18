"use client"

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react"
import { Event, Reaction } from "@/data/events"

interface CoupleInfo {
  name: string
  partner1: string
  partner2: string
  anniversary?: string
  startDate?: string
  avatar1?: string
  avatar2?: string
  bio?: string
  goals?: {
    encontrosPorMes?: number
    viagensPorAno?: number
  }
}

interface DailySuggestion {
  id: string
  title: string
  description: string
  category: string
  icon: string
  duration: string
  difficulty: "facil" | "medio" | "elaborado"
}

export interface ApiUser {
  id: string
  email: string
  name: string
  coupleId: string
  coupleName: string
  couple?: CoupleInfo
}

interface AgendaContextType {
  events: Event[]
  couple: CoupleInfo
  isLoggedIn: boolean
  user: ApiUser | null
  sessionLoading: boolean
  selectedCategory: string | null
  dailySuggestions: DailySuggestion[]
  addEvent: (event: Omit<Event, "id">) => Promise<void>
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>
  deleteEvent: (id: string) => Promise<void>
  addReaction: (eventId: string, reaction: Reaction) => void
  setCouple: (couple: CoupleInfo) => void
  setSessionFromUser: (user: ApiUser) => void
  loadSession: () => Promise<void>
  logout: () => Promise<void>
  setSelectedCategory: (category: string | null) => void
  refreshSuggestions: () => void
}

const allSuggestions: DailySuggestion[] = [
  { id: "1", title: "Noite de filmes em casa", description: "Preparem pipoca, escolham um filme que nenhum dos dois viu e curtam juntos no sofá.", category: "cinema", icon: "Film", duration: "2-3 horas", difficulty: "facil" },
  { id: "2", title: "Cozinhar juntos", description: "Escolham uma receita nova e cozinhem juntos. O processo é tão divertido quanto o resultado!", category: "jantar", icon: "UtensilsCrossed", duration: "1-2 horas", difficulty: "medio" },
  { id: "3", title: "Piquenique no parque", description: "Preparem lanches, uma toalha e aproveitem um dia ao ar livre. Simples e romântico!", category: "natureza", icon: "TreePine", duration: "2-4 horas", difficulty: "facil" },
  { id: "4", title: "Sessão de fotos juntos", description: "Vistam-se bem, escolham um lugar bonito e tirem fotos um do outro. Memórias para guardar!", category: "a_dois", icon: "Heart", duration: "1-2 horas", difficulty: "facil" },
  { id: "5", title: "Noite de jogos de tabuleiro", description: "Desliguem os celulares e divirtam-se com jogos de tabuleiro ou cartas.", category: "a_dois", icon: "Heart", duration: "2-3 horas", difficulty: "facil" },
  { id: "6", title: "Descobrir um café novo", description: "Explorem um café ou cafeteria que nunca foram. Bônus: experimentem algo diferente!", category: "jantar", icon: "UtensilsCrossed", duration: "1-2 horas", difficulty: "facil" },
  { id: "7", title: "Spa em casa", description: "Máscaras faciais, velas aromáticas e música relaxante. Uma noite de autocuidado a dois.", category: "a_dois", icon: "Heart", duration: "2-3 horas", difficulty: "medio" },
  { id: "8", title: "Playlist colaborativa", description: "Criem uma playlist juntos com músicas que marcaram o relacionamento de vocês.", category: "show", icon: "Music", duration: "30min-1 hora", difficulty: "facil" },
  { id: "9", title: "Trilha ao nascer do sol", description: "Acordem cedo e façam uma trilha para ver o nascer do sol juntos. Vale muito a pena!", category: "natureza", icon: "TreePine", duration: "3-5 horas", difficulty: "elaborado" },
  { id: "10", title: "Jantar à luz de velas", description: "Preparem um jantar especial em casa com velas e música. Romântico e íntimo.", category: "jantar", icon: "UtensilsCrossed", duration: "2-3 horas", difficulty: "medio" },
  { id: "11", title: "Visitar uma feira livre", description: "Explorem uma feira de rua, experimentem comidas e descubram produtos locais.", category: "natureza", icon: "TreePine", duration: "2-3 horas", difficulty: "facil" },
  { id: "12", title: "Aula online juntos", description: "Aprendam algo novo juntos: dança, culinária, idioma ou artesanato.", category: "a_dois", icon: "Heart", duration: "1-2 horas", difficulty: "medio" },
  { id: "13", title: "Maratona de série", description: "Escolham uma série nova e façam uma maratona com snacks e conforto.", category: "cinema", icon: "Film", duration: "4-6 horas", difficulty: "facil" },
  { id: "14", title: "Escrever cartas um para o outro", description: "Escrevam cartas de amor à moda antiga. Guardem para reler no futuro.", category: "a_dois", icon: "Heart", duration: "30min-1 hora", difficulty: "facil" },
  { id: "15", title: "Visitar um museu", description: "Explorem um museu ou exposição de arte. Discutam o que viram depois!", category: "natureza", icon: "TreePine", duration: "2-4 horas", difficulty: "facil" },
]

function getRandomSuggestions(count: number): DailySuggestion[] {
  return [...allSuggestions].sort(() => 0.5 - Math.random()).slice(0, count)
}

const AgendaContext = createContext<AgendaContextType | undefined>(undefined)

export function AgendaProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([])
  const [couple, setCoupleState] = useState<CoupleInfo>({ name: "", partner1: "", partner2: "" })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<ApiUser | null>(null)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [dailySuggestions, setDailySuggestions] = useState<DailySuggestion[]>([])

  useEffect(() => {
    setDailySuggestions(getRandomSuggestions(3))
  }, [])

  const setCouple = (newCouple: CoupleInfo) => {
    setCoupleState(newCouple)
  }

  const refreshSuggestions = () => setDailySuggestions(getRandomSuggestions(3))

  const addEvent = async (event: Omit<Event, "id">) => {
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      })
      if (!res.ok) return
      const data = await res.json()
      if (data?.event) {
        setEvents(prev => [...prev, data.event])
      }
    } catch {
      // erro silencioso por enquanto
    }
  }

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e))
    try {
      await fetch(`/api/events/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
    } catch {
      // mantém estado otimista
    }
  }

  const deleteEvent = async (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id))
    try {
      await fetch(`/api/events/${id}`, { method: "DELETE" })
    } catch {
      // mantém remoção local
    }
  }

  const addReaction = (eventId: string, reaction: Reaction) => {
    setEvents(prev => prev.map(e =>
      e.id === eventId ? { ...e, reactions: [...e.reactions, reaction] } : e
    ))
  }

  const setSessionFromUser = (u: ApiUser) => {
    setUser(u)
    const c = u.couple ?? { name: u.coupleName, partner1: "", partner2: "" }
    const merged: CoupleInfo = {
      name: c.name,
      partner1: c.partner1 || "",
      partner2: c.partner2 || "",
      startDate: c.startDate,
      avatar1: c.avatar1,
      avatar2: c.avatar2,
      bio: c.bio,
    }
    setCoupleState(merged)
    setIsLoggedIn(true)
  }

  const loadSession = useCallback(async () => {
    setSessionLoading(true)
    const doFetch = () =>
      fetch("/api/auth/me", {
        credentials: "include",
        cache: "no-store",
        headers: { Accept: "application/json" },
      })
    try {
      let res = await doFetch()
      let data = await res.json()
      if (data?.user) {
        setSessionFromUser(data.user)
        try {
          const evRes = await fetch("/api/events", { credentials: "include" })
          if (evRes.ok) {
            const evData = await evRes.json()
            if (evData?.events) setEvents(evData.events)
          }
        } catch {
          // ignora erro de eventos
        }
        setSessionLoading(false)
        return
      }
      await new Promise(r => setTimeout(r, 300))
      res = await doFetch()
      data = await res.json()
      if (data?.user) {
        setSessionFromUser(data.user)
        try {
          const evRes = await fetch("/api/events", { credentials: "include" })
          if (evRes.ok) {
            const evData = await evRes.json()
            if (evData?.events) setEvents(evData.events)
          }
        } catch {
          // ignora erro de eventos
        }
      } else {
        setIsLoggedIn(false); setUser(null)
      }
    } catch {
      setIsLoggedIn(false); setUser(null)
    } finally {
      setSessionLoading(false)
    }
  }, [])

  const logout = async () => {
    try { await fetch("/api/auth/logout", { method: "POST", credentials: "include" }) } catch {}
    setIsLoggedIn(false)
    setUser(null)
    setCoupleState({ name: "", partner1: "", partner2: "" })
  }

  return (
    <AgendaContext.Provider value={{
      events, couple, isLoggedIn, user, sessionLoading, selectedCategory, dailySuggestions,
      addEvent, updateEvent, deleteEvent, addReaction,
      setCouple, setSessionFromUser, loadSession, logout,
      setSelectedCategory, refreshSuggestions,
    }}>
      {children}
    </AgendaContext.Provider>
  )
}

export function useAgenda() {
  const context = useContext(AgendaContext)
  if (!context) throw new Error("useAgenda must be used within AgendaProvider")
  return context
}