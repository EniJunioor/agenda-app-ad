export interface Category {
  id: string
  label: string
  icon: string
  color: string
  bg: string
  text: string
  emoji: string
}

export interface Reaction {
  partner: string
  emoji: string
  comment: string
}

export interface Event {
  id: string
  title: string
  date: string
  time: string
  category: string
  location: string
  notes: string
  attendees: "so_eu" | "a_dois" | "amigos"
  reactions: Reaction[]
}

export const categories: Category[] = [
  {
    id: "show",
    label: "Show / Concerto",
    icon: "Music",
    color: "amber",
    bg: "#FEF3C7",
    text: "#92400E",
    emoji: "🎵"
  },
  {
    id: "cinema",
    label: "Cinema",
    icon: "Film",
    color: "pink",
    bg: "#FCE7F3",
    text: "#9D174D",
    emoji: "🎬"
  },
  {
    id: "jantar",
    label: "Jantar / Sair para comer",
    icon: "UtensilsCrossed",
    color: "purple",
    bg: "#EDE9FE",
    text: "#5B21B6",
    emoji: "🍽️"
  },
  {
    id: "a_dois",
    label: "Algo a dois",
    icon: "Heart",
    color: "rose",
    bg: "#FFE4E6",
    text: "#9F1239",
    emoji: "💑"
  },
  {
    id: "amigos",
    label: "Sair com amigos",
    icon: "Users",
    color: "blue",
    bg: "#DBEAFE",
    text: "#1E40AF",
    emoji: "👥"
  },
  {
    id: "viagem",
    label: "Viagem",
    icon: "Plane",
    color: "teal",
    bg: "#CCFBF1",
    text: "#115E59",
    emoji: "✈️"
  },
  {
    id: "natureza",
    label: "Natureza / Passeio",
    icon: "TreePine",
    color: "green",
    bg: "#DCFCE7",
    text: "#14532D",
    emoji: "🌿"
  },
  {
    id: "aniversario",
    label: "Aniversário / Data especial",
    icon: "Cake",
    color: "orange",
    bg: "#FFF7ED",
    text: "#9A3412",
    emoji: "🎉"
  }
]

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Show do Coldplay",
    date: "2025-03-22",
    time: "20:00",
    category: "show",
    location: "Allianz Parque, São Paulo",
    notes: "Comprar as camisetas antes!",
    attendees: "a_dois",
    reactions: [
      { partner: "João", emoji: "🥹", comment: "Mal posso esperar!" },
      { partner: "Maria", emoji: "💜", comment: "O melhor presente do ano" }
    ]
  },
  {
    id: "2",
    title: "Cinema — Duna 3",
    date: "2025-03-15",
    time: "19:30",
    category: "cinema",
    location: "CineMarks Paulista",
    notes: "Chegar 20min antes para pegar pipoca",
    attendees: "a_dois",
    reactions: [
      { partner: "João", emoji: "🎬", comment: "Série incrível" }
    ]
  },
  {
    id: "3",
    title: "Jantar aniversário da Mari",
    date: "2025-03-28",
    time: "20:30",
    category: "aniversario",
    location: "Restaurante Tantra",
    notes: "Reserva feita para 2 pessoas. Surpresa!",
    attendees: "a_dois",
    reactions: []
  },
  {
    id: "4",
    title: "Churrasco na casa do Pedro",
    date: "2025-03-30",
    time: "13:00",
    category: "amigos",
    location: "Casa do Pedro — Moema",
    notes: "Levar uma sobremesa",
    attendees: "amigos",
    reactions: [
      { partner: "Maria", emoji: "🥩", comment: "Adoroooo churras" }
    ]
  },
  {
    id: "5",
    title: "Trilha na Serra da Cantareira",
    date: "2025-04-05",
    time: "08:00",
    category: "natureza",
    location: "Parque Estadual — Tremembé",
    notes: "Levar protetor solar, água e lanche",
    attendees: "a_dois",
    reactions: []
  },
  {
    id: "6",
    title: "Viagem para Floripa",
    date: "2025-04-18",
    time: "06:00",
    category: "viagem",
    location: "Florianópolis — SC",
    notes: "Passagens compradas. Hotel: Pousada das Dunas",
    attendees: "a_dois",
    reactions: [
      { partner: "João", emoji: "🏖️", comment: "Merecido demais!" },
      { partner: "Maria", emoji: "🌊", comment: "Já quero chegar!" }
    ]
  }
]

export function getCategoryById(id: string): Category | undefined {
  return categories.find(cat => cat.id === id)
}

export function getEventById(id: string): Event | undefined {
  return mockEvents.find(event => event.id === id)
}

export function getEventsByDate(date: string): Event[] {
  return mockEvents.filter(event => event.date === date)
}

export function getEventsByCategory(categoryId: string): Event[] {
  return mockEvents.filter(event => event.category === categoryId)
}
