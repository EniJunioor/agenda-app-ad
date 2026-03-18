import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getSession } from "@/lib/auth"

interface Params {
  params: { id: string }
}

export async function PATCH(request: Request, { params }: Params) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  const { id } = params

  try {
    const body = await request.json() as {
      title?: string
      date?: string
      time?: string
      category?: string
      location?: string
      notes?: string
      attendees?: "so_eu" | "a_dois" | "amigos"
      photoUrl?: string | null
    }

    const updated = await prisma.event.updateMany({
      where: { id, coupleId: session.coupleId },
      data: body,
    })

    if (updated.count === 0) {
      return NextResponse.json({ error: "Evento não encontrado." }, { status: 404 })
    }

    const event = await prisma.event.findUnique({ where: { id } })
    return NextResponse.json({ event })
  } catch (e) {
    console.error("Update event error:", e)
    return NextResponse.json(
      { error: "Erro ao atualizar evento. Tente novamente." },
      { status: 500 },
    )
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  const { id } = params

  try {
    const deleted = await prisma.event.deleteMany({
      where: { id, coupleId: session.coupleId },
    })

    if (deleted.count === 0) {
      return NextResponse.json({ error: "Evento não encontrado." }, { status: 404 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("Delete event error:", e)
    return NextResponse.json(
      { error: "Erro ao apagar evento. Tente novamente." },
      { status: 500 },
    )
  }
}

