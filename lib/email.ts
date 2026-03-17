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
