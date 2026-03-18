import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { sendEventUpcomingReminderEmail } from "@/lib/email"

export async function GET() {
  try {
    const now = new Date()
    const nowMs = now.getTime()

    // 1 dia antes: eventos de amanhã, com reminder ativo e ainda não lembrados
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tStr = tomorrow.toISOString().split("T")[0]

    const oneDayEvents = await prisma.event.findMany({
      where: {
        date: tStr,
        remindOneDayBefore: true,
        remindedOneDay: false,
      },
      include: {
        couple: {
          include: { users: true },
        },
      },
    })

    // 2 horas antes: eventos hoje que ocorrerão em ~2h
    const todayStr = now.toISOString().split("T")[0]
    const todayEvents = await prisma.event.findMany({
      where: {
        date: todayStr,
        remindTwoHoursBefore: true,
        remindedTwoHours: false,
      },
      include: {
        couple: {
          include: { users: true },
        },
      },
    })

    const inTwoHoursMin = nowMs + 2 * 60 * 60 * 1000 - 15 * 60 * 1000
    const inTwoHoursMax = nowMs + 2 * 60 * 60 * 1000 + 15 * 60 * 1000

    const twoHoursEvents = todayEvents.filter(ev => {
      const [h, m] = ev.time.split(":").map(Number)
      const evDate = new Date(ev.date + "T00:00:00")
      evDate.setHours(h ?? 0, m ?? 0, 0, 0)
      const ts = evDate.getTime()
      return ts >= inTwoHoursMin && ts <= inTwoHoursMax
    })

    let sentOneDay = 0
    let sentTwoHours = 0

    for (const ev of oneDayEvents) {
      for (const user of ev.couple.users) {
        const { sent } = await sendEventUpcomingReminderEmail({
          to: user.email,
          coupleName: ev.couple.name,
          eventTitle: ev.title,
          eventDate: ev.date,
          eventTime: ev.time,
          when: "one-day",
        })
        if (sent) sentOneDay++
      }
      await prisma.event.update({
        where: { id: ev.id },
        data: { remindedOneDay: true },
      })
    }

    for (const ev of twoHoursEvents) {
      for (const user of ev.couple.users) {
        const { sent } = await sendEventUpcomingReminderEmail({
          to: user.email,
          coupleName: ev.couple.name,
          eventTitle: ev.title,
          eventDate: ev.date,
          eventTime: ev.time,
          when: "two-hours",
        })
        if (sent) sentTwoHours++
      }
      await prisma.event.update({
        where: { id: ev.id },
        data: { remindedTwoHours: true },
      })
    }

    return NextResponse.json({
      ok: true,
      oneDayChecked: oneDayEvents.length,
      twoHoursChecked: todayEvents.length,
      oneDaySent: sentOneDay,
      twoHoursSent: sentTwoHours,
    })
  } catch (e) {
    console.error("Upcoming reminders error:", e)
    return NextResponse.json(
      { error: "Erro ao processar lembretes de eventos futuros." },
      { status: 500 },
    )
  }
}

