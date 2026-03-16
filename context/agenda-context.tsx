"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { Event, mockEvents, Reaction } from "@/data/events"

interface CoupleInfo {
  name: string
  partner1: string
  partner2: string
  anniversary?: string
  startDate?: string
  avatar1?: string
  avatar2?: string
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

interface AgendaContextType {
  events: Event[]
  couple: CoupleInfo
  isLoggedIn: boolean
  selectedCategory: string | null
  dailySuggestions: DailySuggestion[]
  addEvent: (event: Omit<Event, "id">) => void
  updateEvent: (id: string, event: Partial<Event>) => void
  deleteEvent: (id: string) => void
  addReaction: (eventId: string, reaction: Reaction) => void
  setCouple: (couple: CoupleInfo) => void
  login: (coupleName: string) => void
  logout: () => void
  setSelectedCategory: (category: string | null) => void
  refreshSuggestions: () => void
}

const allSuggestions: DailySuggestion[] = [
  {
    id: "1",
    title: "Noite de filmes em casa",
    description: "Preparem pipoca, escolham um filme que nenhum dos dois viu e curtam juntos no sofa.",
    category: "cinema",
    icon: "Film",
    duration: "2-3 horas",
    difficulty: "facil"
  },
  {
    id: "2",
    title: "Cozinhar juntos",
    description: "Escolham uma receita nova e cozinhem juntos. O processo e tao divertido quanto o resultado!",
    category: "jantar",
    icon: "UtensilsCrossed",
    duration: "1-2 horas",
    difficulty: "medio"
  },
  {
    id: "3",
    title: "Piquenique no parque",
    description: "Preparem lanches, uma toalha e aproveitem um dia ao ar livre. Simples e romantico!",
    category: "natureza",
    icon: "TreePine",
    duration: "2-4 horas",
    difficulty: "facil"
  },
  {
    id: "4",
    title: "Sessao de fotos juntos",
    description: "Vistam-se bem, escolham um lugar bonito e tirem fotos um do outro. Memorias para guardar!",
    category: "a_dois",
    icon: "Heart",
    duration: "1-2 horas",
    difficulty: "facil"
  },
  {
    id: "5",
    title: "Noite de jogos de tabuleiro",
    description: "Desliguem os celulares e divirtam-se com jogos de tabuleiro ou cartas.",
    category: "a_dois",
    icon: "Heart",
    duration: "2-3 horas",
    difficulty: "facil"
  },
  {
    id: "6",
    title: "Descobrir um cafe novo",
    description: "Explorem um cafe ou cafeteria que nunca foram. Bonus: experimentem algo diferente!",
    category: "jantar",
    icon: "UtensilsCrossed",
    duration: "1-2 horas",
    difficulty: "facil"
  },
  {
    id: "7",
    title: "Spa em casa",
    description: "Mascaras faciais, velas aromaticas e musica relaxante. Uma noite de autocuidado a dois.",
    category: "a_dois",
    icon: "Heart",
    duration: "2-3 horas",
    difficulty: "medio"
  },
  {
    id: "8",
    title: "Playlist colaborativa",
    description: "Criem uma playlist juntos com musicas que marcaram o relacionamento de voces.",
    category: "show",
    icon: "Music",
    duration: "30min-1 hora",
    difficulty: "facil"
  },
  {
    id: "9",
    title: "Trilha ao nascer do sol",
    description: "Acordem cedo e facam uma trilha para ver o nascer do sol juntos. Vale muito a pena!",
    category: "natureza",
    icon: "TreePine",
    duration: "3-5 horas",
    difficulty: "elaborado"
  },
  {
    id: "10",
    title: "Jantar a luz de velas",
    description: "Preparem um jantar especial em casa com velas e musica. Romantico e intimo.",
    category: "jantar",
    icon: "UtensilsCrossed",
    duration: "2-3 horas",
    difficulty: "medio"
  },
  {
    id: "11",
    title: "Visitar uma feira livre",
    description: "Explorem uma feira de rua, experimentem comidas e descubram produtos locais.",
    category: "natureza",
    icon: "TreePine",
    duration: "2-3 horas",
    difficulty: "facil"
  },
  {
    id: "12",
    title: "Aula online juntos",
    description: "Aprendam algo novo juntos: danca, culinaria, idioma ou artesanato.",
    category: "a_dois",
    icon: "Heart",
    duration: "1-2 horas",
    difficulty: "medio"
  },
  {
    id: "13",
    title: "Maratona de serie",
    description: "Escolham uma serie nova e facam uma maratona com snacks e conforto.",
    category: "cinema",
    icon: "Film",
    duration: "4-6 horas",
    difficulty: "facil"
  },
  {
    id: "14",
    title: "Escrever cartas um para o outro",
    description: "Escrevam cartas de amor a moda antiga. Guardem para reler no futuro.",
    category: "a_dois",
    icon: "Heart",
    duration: "30min-1 hora",
    difficulty: "facil"
  },
  {
    id: "15",
    title: "Visitar um museu",
    description: "Explorem um museu ou exposicao de arte. Discutam o que viram depois!",
    category: "natureza",
    icon: "TreePine",
    duration: "2-4 horas",
    difficulty: "facil"
  }
]

function getRandomSuggestions(count: number): DailySuggestion[] {
  const shuffled = [...allSuggestions].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

const AgendaContext = createContext<AgendaContextType | undefined>(undefined)

export function AgendaProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(mockEvents)
  const [couple, setCouple] = useState<CoupleInfo>({
    name: "Joao & Maria",
    partner1: "Joao",
    partner2: "Maria",
    startDate: "2023-06-15"
  })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [dailySuggestions, setDailySuggestions] = useState<DailySuggestion[]>([])

  useEffect(() => {
    setDailySuggestions(getRandomSuggestions(3))
  }, [])

  const refreshSuggestions = () => {
    setDailySuggestions(getRandomSuggestions(3))
  }

  const addEvent = (event: Omit<Event, "id">) => {
    const newEvent: Event = {
      ...event,
      id: Date.now().toString()
    }
    setEvents(prev => [...prev, newEvent])
  }

  const updateEvent = (id: string, updates: Partial<Event>) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === id ? { ...event, ...updates } : event
      )
    )
  }

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id))
  }

  const addReaction = (eventId: string, reaction: Reaction) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === eventId
          ? { ...event, reactions: [...event.reactions, reaction] }
          : event
      )
    )
  }

  const login = (coupleName: string) => {
    const [partner1, partner2] = coupleName.split(" & ")
    setCouple(prev => ({
      ...prev,
      name: coupleName,
      partner1: partner1 || "Parceiro 1",
      partner2: partner2 || "Parceiro 2"
    }))
    setIsLoggedIn(true)
  }

  const logout = () => {
    setIsLoggedIn(false)
  }

  return (
    <AgendaContext.Provider
      value={{
        events,
        couple,
        isLoggedIn,
        selectedCategory,
        dailySuggestions,
        addEvent,
        updateEvent,
        deleteEvent,
        addReaction,
        setCouple,
        login,
        logout,
        setSelectedCategory,
        refreshSuggestions
      }}
    >
      {children}
    </AgendaContext.Provider>
  )
}

export function useAgenda() {
  const context = useContext(AgendaContext)
  if (context === undefined) {
    throw new Error("useAgenda must be used within an AgendaProvider")
  }
  return context
}
