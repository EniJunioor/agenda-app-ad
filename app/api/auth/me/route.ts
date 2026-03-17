import { NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? ""
  console.log("[auth:me] GET – Cookie header presente?", !!cookieHeader, "length:", cookieHeader.length, "contém agenda_session?", cookieHeader.includes("agenda_session"))

  const session = await getSessionFromRequest(request)
  console.log("[auth:me] getSessionFromRequest() retornou:", session ? `userId=${session.userId}` : "null")

  if (!session) {
    console.log("[auth:me] Sem sessão – retornando user: null")
    return NextResponse.json({ user: null }, { status: 200 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { couple: true },
  })

  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 })
  }

  const partner1 = user.couple.partner1Id
    ? await prisma.user.findUnique({ where: { id: user.couple.partner1Id } })
    : null
  const partner2 = user.couple.partner2Id
    ? await prisma.user.findUnique({ where: { id: user.couple.partner2Id } })
    : null

  const coupleInfo = {
    name: user.couple.name,
    partner1: partner1?.name ?? "",
    partner2: partner2?.name ?? "",
    startDate: user.couple.startDate ?? undefined,
  }

  console.log("[auth:me] Sessão OK – retornando user:", user.email)
  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      coupleId: user.couple.id,
      coupleName: user.couple.name,
      couple: coupleInfo,
    },
  })
}
