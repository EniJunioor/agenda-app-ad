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
  photoUrl?: string
  remindOneDayBefore?: boolean
  remindTwoHoursBefore?: boolean
  remindedOneDay?: boolean
  remindedTwoHours?: boolean
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

export function getCategoryById(id: string): Category | undefined {
  return categories.find(cat => cat.id === id)
}
