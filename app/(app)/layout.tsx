"use client"

import { useEffect } from "react"
import { useAgenda } from "@/context/agenda-context"
import { AppSidebar } from "@/components/agenda/app-sidebar"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoggedIn, loadSession, sessionLoading } = useAgenda()
  const router = useRouter()

  useEffect(() => {
    loadSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- rodar só no mount
  }, [])

  useEffect(() => {
    if (sessionLoading) return
    if (!isLoggedIn) {
      router.replace("/")
    }
  }, [sessionLoading, isLoggedIn, router])

  if (sessionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!isLoggedIn) return null

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
