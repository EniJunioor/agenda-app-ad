import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { sendEventPhotoReminderEmail } from "@/lib/email"

export async function GET() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const yStr = yesterday.toISOString().split("T")[0]

    const events = await prisma.event.findMany({
      where: {
        date: yStr,
        photoUrl: null,
      },
      include: {
        couple: {
          include: { users: true },
        },
      },
    })

    let sentCount = 0

    for (const event of events) {
      for (const user of event.couple.users) {
        const { sent } = await sendEventPhotoReminderEmail({
          to: user.email,
          coupleName: event.couple.name,
          eventTitle: event.title,
          eventDate: event.date,
          eventId: event.id,
        })
        if (sent) sentCount++
      }
    }

    return NextResponse.json({ ok: true, checked: events.length, sent: sentCount })
  } catch (e) {
    console.error("Photo reminder error:", e)
    return NextResponse.json(
      { error: "Erro ao processar lembretes." },
      { status: 500 },
    )
  }
}

