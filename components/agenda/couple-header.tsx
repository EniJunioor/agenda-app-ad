"use client"

import { useAgenda } from "@/context/agenda-context"
import { Heart } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

interface CoupleHeaderProps {
  size?: "sm" | "lg"
  showLink?: boolean
}

export function CoupleHeader({ size = "sm", showLink = true }: CoupleHeaderProps) {
  const { couple } = useAgenda()
  
  const content = (
    <motion.div 
      className={`flex items-center gap-3 ${showLink ? "cursor-pointer group" : ""}`}
      whileHover={showLink ? { x: 2 } : undefined}
    >
      <div className="relative">
        {/* Avatar stack */}
        <div className="flex -space-x-2">
          <motion.div 
            className={`${size === "lg" ? "h-12 w-12" : "h-10 w-10"} rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-medium text-sm ring-2 ring-card`}
            whileHover={{ scale: 1.05, zIndex: 10 }}
          >
            {couple.partner1.charAt(0)}
          </motion.div>
          <motion.div 
            className={`${size === "lg" ? "h-12 w-12" : "h-10 w-10"} rounded-full bg-gradient-to-br from-warm to-gold flex items-center justify-center text-foreground font-medium text-sm ring-2 ring-card`}
            whileHover={{ scale: 1.05, zIndex: 10 }}
          >
            {couple.partner2.charAt(0)}
          </motion.div>
        </div>
        
        {/* Heart connector */}
        <motion.div 
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-5 w-5 rounded-full bg-card flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Heart className="h-3 w-3 text-primary fill-primary" />
        </motion.div>
      </div>
      
      <div className="min-w-0">
        <p className={`font-serif ${size === "lg" ? "text-xl" : "text-base"} text-foreground truncate group-hover:text-primary transition-colors`}>
          {couple.name}
        </p>
        <p className="text-xs text-muted-foreground">Nossa Agenda</p>
      </div>
    </motion.div>
  )
  
  if (showLink) {
    return <Link href="/casal">{content}</Link>
  }
  
  return content
}
