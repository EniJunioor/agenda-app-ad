"use client"

import { useState, useEffect } from "react"
import { useAgenda } from "@/context/agenda-context"
import { categories, Event, Category } from "@/data/events"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { X, MapPin, Calendar, Clock, Users, User, UsersRound } from "lucide-react"
import { cn } from "@/lib/utils"
import { 
  Music, 
  Film, 
  UtensilsCrossed, 
  Heart, 
  Plane, 
  TreePine, 
  Cake,
  LucideIcon
} from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  Music,
  Film,
  UtensilsCrossed,
  Heart,
  Users,
  Plane,
  TreePine,
  Cake
}

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate?: Date
  editEvent?: Event
}

export function EventModal({ isOpen, onClose, selectedDate, editEvent }: EventModalProps) {
  const { addEvent, updateEvent } = useAgenda()
  const [showToast, setShowToast] = useState(false)
  const [savedCategory, setSavedCategory] = useState<Category | null>(null)
  
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    category: "",
    location: "",
    notes: "",
    attendees: "a_dois" as "so_eu" | "a_dois" | "amigos",
    remindOneDayBefore: false,
    remindTwoHoursBefore: false,
  })
  
  useEffect(() => {
    if (editEvent) {
      setFormData({
        title: editEvent.title,
        date: editEvent.date,
        time: editEvent.time,
        category: editEvent.category,
        location: editEvent.location,
        notes: editEvent.notes,
        attendees: editEvent.attendees,
        remindOneDayBefore: !!editEvent.remindOneDayBefore,
        remindTwoHoursBefore: !!editEvent.remindTwoHoursBefore,
      })
    } else if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        date: selectedDate.toISOString().split("T")[0]
      }))
    }
  }, [editEvent, selectedDate])
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const category = categories.find(c => c.id === formData.category)
    setSavedCategory(category || null)
    
    if (editEvent) {
      updateEvent(editEvent.id, formData)
    } else {
      addEvent({
        ...formData,
        reactions: []
      })
    }
    
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      onClose()
      setFormData({
        title: "",
        date: "",
        time: "",
        category: "",
        location: "",
        notes: "",
        attendees: "a_dois",
        remindOneDayBefore: false,
        remindTwoHoursBefore: false,
      })
    }, 2000)
  }
  
  const selectedCategory = categories.find(c => c.id === formData.category)
  
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  }
  
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.94 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, scale: 0.96, transition: { duration: 0.2 } }
  }
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative bg-card rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="font-serif text-xl font-semibold text-foreground">
                {editEvent ? "Editar evento" : "Novo evento"}
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title">Título do evento</Label>
                <Input
                  id="title"
                  placeholder="Ex: Cinema com a Mari"
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  className="bg-secondary/50"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Data
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                    className="bg-secondary/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Hora
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    required
                    className="bg-secondary/50"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Categoria</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {categories.map(category => {
                    const Icon = iconMap[category.icon]
                    const isSelected = formData.category === category.id
                    
                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, category: category.id }))}
                        className={cn(
                          "flex flex-col items-center gap-1 p-3 rounded-xl transition-all",
                          isSelected ? "ring-2" : "hover:opacity-80"
                        )}
                        style={{
                          backgroundColor: category.bg,
                          color: category.text,
                          borderColor: isSelected ? category.text : "transparent"
                        }}
                      >
                        {Icon && <Icon className="h-5 w-5" />}
                        <span className="text-xs font-medium text-center leading-tight">
                          {category.label.split(" / ")[0]}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Local
                </Label>
                <Input
                  id="location"
                  placeholder="Ex: Restaurante Tantra, Pinheiros"
                  value={formData.location}
                  onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="bg-secondary/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Quem vai?</Label>
                <div className="flex gap-2">
                  {[
                    { value: "so_eu", label: "Só eu", icon: User },
                    { value: "a_dois", label: "Os dois", icon: Heart },
                    { value: "amigos", label: "Com amigos", icon: UsersRound }
                  ].map(option => {
                    const Icon = option.icon
                    const isSelected = formData.attendees === option.value
                    
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ 
                          ...prev, 
                          attendees: option.value as "so_eu" | "a_dois" | "amigos" 
                        }))}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all text-sm font-medium",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notas / Descrição</Label>
                <Textarea
                  id="notes"
                  placeholder="Informações extras sobre o evento..."
                  value={formData.notes}
                  onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="bg-secondary/50 min-h-[80px]"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-sm">Lembretes</Label>
                <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 rounded border-border"
                      checked={formData.remindOneDayBefore}
                      onChange={e => setFormData(prev => ({ ...prev, remindOneDayBefore: e.target.checked }))}
                    />
                    <span>Lembrar 1 dia antes do evento</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 rounded border-border"
                      checked={formData.remindTwoHoursBefore}
                      onChange={e => setFormData(prev => ({ ...prev, remindTwoHoursBefore: e.target.checked }))}
                    />
                    <span>Lembrar 2 horas antes</span>
                  </label>
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  className="flex-1"
                  style={selectedCategory ? { 
                    backgroundColor: selectedCategory.text,
                    color: "#fff"
                  } : undefined}
                >
                  {editEvent ? "Salvar alterações" : "Salvar evento"}
                </Button>
              </div>
            </form>
          </motion.div>
          
          <AnimatePresence>
            {showToast && savedCategory && (
              <motion.div
                initial={{ opacity: 0, y: 50, x: 50 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-6 right-6 bg-card rounded-xl shadow-lg p-4 flex items-center gap-3 border border-border"
              >
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: savedCategory.bg }}
                >
                  <span className="text-xl">{savedCategory.emoji}</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {editEvent ? "Evento atualizado!" : "Evento criado!"}
                  </p>
                  <p className="text-sm text-muted-foreground">{formData.title}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  )
}
