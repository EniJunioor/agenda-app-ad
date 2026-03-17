"use client"

import { useAgenda } from "@/context/agenda-context"
import { motion } from "framer-motion"
import Link from "next/link"

interface CoupleHeaderProps {
  size?: "sm" | "lg"
  showLink?: boolean
  variant?: "stack" | "single"
}

export function CoupleHeader({ size = "sm", showLink = true, variant = "single" }: CoupleHeaderProps) {
  const { couple } = useAgenda()
  const initials = variant === "single"
    ? `${(couple.partner1 || " ").charAt(0)}${(couple.partner2 || " ").charAt(0)}`.trim() || "?"
    : null

  const content = (
    <motion.div
      className={`flex items-center gap-3 ${showLink ? "cursor-pointer group" : ""}`}
      whileHover={showLink ? { x: 2 } : undefined}
    >
      {variant === "single" ? (
        <div
          className={`${size === "lg" ? "h-12 w-12" : "h-10 w-10"} rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm shrink-0`}
        >
          {initials}
        </div>
      ) : (
        <div className="flex -space-x-3">
          <div
            className={`${size === "lg" ? "h-12 w-12" : "h-10 w-10"} rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium text-sm ring-2 ring-card`}
          >
            {(couple.partner1 || " ").charAt(0)}
          </div>
          <div
            className={`${size === "lg" ? "h-12 w-12" : "h-10 w-10"} rounded-full bg-primary/80 flex items-center justify-center text-primary-foreground font-medium text-sm ring-2 ring-card`}
          >
            {(couple.partner2 || " ").charAt(0)}
          </div>
        </div>
      )}
      <div className="min-w-0">
        <p className={`font-semibold ${size === "lg" ? "text-xl" : "text-base"} text-foreground truncate group-hover:text-primary transition-colors`}>
          {couple.name || "Casal"}
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
