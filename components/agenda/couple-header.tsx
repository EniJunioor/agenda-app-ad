"use client"

import { useAgenda } from "@/context/agenda-context"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

interface CoupleHeaderProps {
  size?: "sm" | "lg"
  showLink?: boolean
  variant?: "stack" | "single"
}

export function CoupleHeader({ size = "sm", showLink = true, variant = "single" }: CoupleHeaderProps) {
  const { couple } = useAgenda()

  const avatarSize = size === "lg" ? "h-12 w-12" : "h-10 w-10"
  const textSize = size === "lg" ? "text-base" : "text-sm"

  function Avatar({ name, avatar, gradient }: { name: string; avatar?: string; gradient: string }) {
    if (avatar) {
      return (
        <div className={`${avatarSize} rounded-full overflow-hidden ring-2 ring-card shrink-0`}>
          <Image
            src={avatar}
            alt={name}
            width={48}
            height={48}
            className="h-full w-full object-cover"
          />
        </div>
      )
    }
    return (
      <div
        className={`${avatarSize} rounded-full flex items-center justify-center text-white font-semibold text-sm ring-2 ring-card shrink-0`}
        style={{ background: gradient }}
      >
        {(name || "?").charAt(0).toUpperCase()}
      </div>
    )
  }

  const content = (
    <motion.div
      className={`flex items-center gap-3 ${showLink ? "cursor-pointer group" : ""}`}
      whileHover={showLink ? { x: 2 } : undefined}
    >
      {variant === "single" ? (
        /* Avatar combinado — mostra avatar1 por padrão */
        couple.avatar1 ? (
          <div className={`${avatarSize} rounded-full overflow-hidden shrink-0`}>
            <Image
              src={couple.avatar1}
              alt={couple.partner1 || "Casal"}
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div
            className={`${avatarSize} rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm bg-primary shrink-0`}
          >
            {((couple.partner1 || " ").charAt(0) + (couple.partner2 || " ").charAt(0)).trim() || "?"}
          </div>
        )
      ) : (
        /* Dois avatares sobrepostos */
        <div className="flex -space-x-2.5 shrink-0">
          <Avatar
            name={couple.partner1}
            avatar={couple.avatar1}
            gradient="linear-gradient(135deg, #D96B5A, #E8967F)"
          />
          <Avatar
            name={couple.partner2}
            avatar={couple.avatar2}
            gradient="linear-gradient(135deg, #E8967F, #D4975A)"
          />
        </div>
      )}

      <div className="min-w-0">
        <p className={`font-semibold ${textSize} text-foreground truncate group-hover:text-primary transition-colors leading-tight`}>
          {couple.name || "Nosso Casal"}
        </p>
        {couple.bio ? (
          <p className="text-[11px] text-muted-foreground truncate mt-0.5 italic">
            {couple.bio}
          </p>
        ) : (
          <p className="text-[11px] text-muted-foreground mt-0.5">Nossa Agenda</p>
        )}
      </div>
    </motion.div>
  )

  if (showLink) return <Link href="/casal">{content}</Link>
  return content
}