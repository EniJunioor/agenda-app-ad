"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { Event, mockEvents, Reaction } from "@/data/events"

interface CoupleInfo {
  name: string
  partner1: string
  partner2: string
}

interface AgendaContextType {
  events: Event[]
  couple: CoupleInfo
  isLoggedIn: boolean
  selectedCategory: string | null
  addEvent: (event: Omit<Event, "id">) => void
  updateEvent: (id: string, event: Partial<Event>) => void
  deleteEvent: (id: string) => void
  addReaction: (eventId: string, reaction: Reaction) => void
  setCouple: (couple: CoupleInfo) => void
  login: (coupleName: string) => void
  logout: () => void
  setSelectedCategory: (category: string | null) => void
}

const AgendaContext = createContext<AgendaContextType | undefined>(undefined)

export function AgendaProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(mockEvents)
  const [couple, setCouple] = useState<CoupleInfo>({
    name: "João & Maria",
    partner1: "João",
    partner2: "Maria"
  })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

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
    setCouple({
      name: coupleName,
      partner1: partner1 || "Parceiro 1",
      partner2: partner2 || "Parceiro 2"
    })
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
        addEvent,
        updateEvent,
        deleteEvent,
        addReaction,
        setCouple,
        login,
        logout,
        setSelectedCategory
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
