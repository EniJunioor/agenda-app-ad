import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function PATCH(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  try {
    const body = await request.json() as {
      name?: string
      partner1?: string
      partner2?: string
      startDate?: string
      avatar1?: string
      avatar2?: string
      bio?: string
      goals?: {
        encontrosPorMes?: number
        viagensPorAno?: number
      }
    }

    const couple = await prisma.couple.update({
      where: { id: session.coupleId },
      data: {
        name: body.name,
        startDate: body.startDate,
        avatar1: body.avatar1,
        avatar2: body.avatar2,
        bio: body.bio,
        goalsJson: body.goals ? JSON.stringify(body.goals) : undefined,
      },
    })

    let goals: { encontrosPorMes?: number; viagensPorAno?: number } | undefined = undefined
    try {
      goals = couple.goalsJson ? JSON.parse(couple.goalsJson) : undefined
    } catch {}

    return NextResponse.json({
      couple: {
        name: couple.name,
        partner1: body.partner1 ?? "",
        partner2: body.partner2 ?? "",
        startDate: couple.startDate ?? undefined,
        avatar1: couple.avatar1 ?? undefined,
        avatar2: couple.avatar2 ?? undefined,
        bio: couple.bio ?? undefined,
        goals,
      },
    })
  } catch (e) {
    console.error("Update couple error:", e)
    return NextResponse.json(
      { error: "Erro ao salvar perfil. Tente novamente." },
      { status: 500 },
    )
  }
}

