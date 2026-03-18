import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  const events = await prisma.event.findMany({
    where: { coupleId: session.coupleId },
    orderBy: { date: "asc" },
  })

  return NextResponse.json({ events })
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  try {
    const body = await request.json() as {
      title: string
      date: string
      time: string
      category: string
      location: string
      notes: string
      attendees: "so_eu" | "a_dois" | "amigos"
      photoUrl?: string
      remindOneDayBefore?: boolean
      remindTwoHoursBefore?: boolean
    }

    if (!body.title || !body.date || !body.time || !body.category) {
      return NextResponse.json({ error: "Dados do evento incompletos." }, { status: 400 })
    }

    const created = await prisma.event.create({
      data: {
        coupleId: session.coupleId,
        title: body.title,
        date: body.date,
        time: body.time,
        category: body.category,
        location: body.location ?? "",
        notes: body.notes ?? "",
        attendees: body.attendees ?? "a_dois",
        photoUrl: body.photoUrl,
        remindOneDayBefore: !!body.remindOneDayBefore,
        remindTwoHoursBefore: !!body.remindTwoHoursBefore,
      },
    })

    return NextResponse.json({ event: created }, { status: 201 })
  } catch (e) {
    console.error("Create event error:", e)
    return NextResponse.json(
      { error: "Erro ao criar evento. Tente novamente." },
      { status: 500 },
    )
  }
}

