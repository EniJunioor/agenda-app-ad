import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const FROM = process.env.EMAIL_FROM || "Nossa Agenda <onboarding@resend.dev>"
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

export async function sendPartnerInviteEmail(params: {
  to: string
  inviterName: string
  coupleName: string
  token: string
}): Promise<{ sent: boolean; link?: string; error?: string }> {
  const link = `${APP_URL}/aceitar-convite?token=${params.token}`

  if (!resend) {
    return { sent: false, link }
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: params.to,
      subject: `${params.inviterName} te convidou para a agenda do casal`,
      html: `
        <p>Olá!</p>
        <p><strong>${params.inviterName}</strong> criou a agenda do casal <strong>${params.coupleName}</strong> e te convidou para fazer parte.</p>
        <p>Clique no link abaixo para criar sua senha e acessar a agenda:</p>
        <p><a href="${link}" style="color: #e11d48;">Aceitar convite e criar minha conta</a></p>
        <p>Ou copie e cole no navegador:</p>
        <p style="word-break: break-all;">${link}</p>
        <p>Este link expira em 7 dias.</p>
        <p>— Nossa Agenda</p>
      `,
    })
    if (error) return { sent: false, link, error: error.message }
    return { sent: true, link }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro ao enviar email"
    return { sent: false, link, error: message }
  }
}

export async function sendEventPhotoReminderEmail(params: {
  to: string
  coupleName: string
  eventTitle: string
  eventDate: string
  eventId: string
}): Promise<{ sent: boolean; error?: string }> {
  if (!resend) {
    return { sent: false }
  }

  const url = `${APP_URL}/historico`
  const dateFormatted = new Date(params.eventDate + "T00:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: params.to,
      subject: `Guardem uma foto de "${params.eventTitle}"`,
      html: `
        <p>Olá!</p>
        <p>Ontem vocês tiveram o evento <strong>${params.eventTitle}</strong> na agenda do casal <strong>${params.coupleName}</strong> (${dateFormatted}).</p>
        <p>Que tal guardar uma foto desse momento na sua agenda?</p>
        <p><a href="${url}" style="color: #e11d48;">Abrir histórico e adicionar foto</a></p>
        <p>— Nossa Agenda</p>
      `,
    })
    if (error) return { sent: false, error: error.message }
    return { sent: true }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro ao enviar email"
    return { sent: false, error: message }
  }
}

export async function sendEventUpcomingReminderEmail(params: {
  to: string
  coupleName: string
  eventTitle: string
  eventDate: string
  eventTime: string
  when: "one-day" | "two-hours"
}): Promise<{ sent: boolean; error?: string }> {
  if (!resend) {
    return { sent: false }
  }

  const url = `${APP_URL}/agenda`
  const dateFormatted = new Date(params.eventDate + "T00:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  const subject =
    params.when === "one-day"
      ? `Amanhã tem "${params.eventTitle}" na agenda de vocês`
      : `Daqui a pouco tem "${params.eventTitle}" na agenda de vocês`

  const intro =
    params.when === "one-day"
      ? `Amanhã (${dateFormatted}), vocês têm um momento marcado: <strong>${params.eventTitle}</strong> às <strong>${params.eventTime}</strong>.`
      : `Em breve hoje (${dateFormatted}), vocês têm um momento marcado: <strong>${params.eventTitle}</strong> às <strong>${params.eventTime}</strong>.`

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: params.to,
      subject,
      html: `
        <p>Olá!</p>
        <p>${intro}</p>
        <p>Que tal já combinarem os detalhes e garantir que nada atrapalhe esse momento?</p>
        <p><a href="${url}" style="color: #e11d48;">Abrir agenda</a></p>
        <p>— Nossa Agenda</p>
      `,
    })
    if (error) return { sent: false, error: error.message }
    return { sent: true }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro ao enviar email"
    return { sent: false, error: message }
  }
}
