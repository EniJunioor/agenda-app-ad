"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAgenda } from "@/context/agenda-context"
import { AppSidebar } from "@/components/agenda/app-sidebar"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoggedIn, login } = useAgenda()
  const router = useRouter()
  
  useEffect(() => {
    // Auto-login for demo purposes
    if (!isLoggedIn) {
      login("João & Maria")
    }
  }, [isLoggedIn, login])
  
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 pb-20 lg:pb-0">
        {children}
      </main>
    </div>
  )
}
