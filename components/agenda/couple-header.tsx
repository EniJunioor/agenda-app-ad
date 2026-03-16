"use client"

import { useAgenda } from "@/context/agenda-context"
import { Heart } from "lucide-react"
import { motion } from "framer-motion"

export function CoupleHeader() {
  const { couple } = useAgenda()
  
  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase()
  }
  
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        <motion.div 
          className="relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        >
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-serif text-lg font-semibold">
            {getInitials(couple.partner1)}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-card animate-pulse" />
        </motion.div>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <Heart className="h-5 w-5 text-primary fill-primary" />
        </motion.div>
        
        <motion.div 
          className="relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <div className="h-12 w-12 rounded-full bg-accent/30 flex items-center justify-center text-accent-foreground font-serif text-lg font-semibold">
            {getInitials(couple.partner2)}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-card animate-pulse" />
        </motion.div>
      </div>
      
      <motion.h2 
        className="font-serif text-xl text-foreground text-balance text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {couple.name}
      </motion.h2>
    </div>
  )
}
