"use client"

import { useEffect } from "react"
import { useAgenda } from "@/context/agenda-context"
import { AppSidebar } from "@/components/agenda/app-sidebar"
import { motion } from "framer-motion"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoggedIn, login } = useAgenda()
  
  useEffect(() => {
    // Auto-login for demo purposes
    if (!isLoggedIn) {
      login("Joao & Maria")
    }
  }, [isLoggedIn, login])
  
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <motion.main 
        className="flex-1 min-w-0 overflow-x-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
    </div>
  )
}
