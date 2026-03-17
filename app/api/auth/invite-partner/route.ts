import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { invitePartnerSchema } from "@/lib/validations/auth"
import { sendPartnerInviteEmail } from "@/lib/email"
import { randomBytes } from "crypto"

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = invitePartnerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Email inválido.", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { partnerEmail } = parsed.data
    const couple = await prisma.couple.findUnique({
      where: { id: session.coupleId },
      include: { users: true },
    })

    if (!couple) {
      return NextResponse.json({ error: "Casal não encontrado." }, { status: 404 })
    }

    if (couple.partner2Id) {
      return NextResponse.json(
        { error: "Sua parceira já está vinculada a esta agenda." },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({ where: { email: partnerEmail } })
    if (existingUser) {
      return NextResponse.json(
        { error: "Este email já possui uma conta. Peça para a pessoa entrar na agenda pelo login." },
        { status: 400 }
      )
    }

    const token = randomBytes(32).toString("hex")
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    await prisma.partnerInvite.create({
      data: {
        email: partnerEmail,
        token,
        coupleId: couple.id,
        expiresAt,
      },
    })

    const inviter = couple.users.find((u) => u.id === session.userId)
    const { sent, link, error } = await sendPartnerInviteEmail({
      to: partnerEmail,
      inviterName: inviter?.name ?? "Seu parceiro(a)",
      coupleName: couple.name,
      token,
    })

    return NextResponse.json({
      message: sent
        ? "Convite enviado por email!"
        : "Convite criado. Use o link abaixo se o email não foi enviado.",
      inviteLink: link,
      emailSent: sent,
      ...(error && { emailError: error }),
    })
  } catch (e) {
    console.error("Invite partner error:", e)
    return NextResponse.json(
      { error: "Erro ao enviar convite. Tente novamente." },
      { status: 500 }
    )
  }
}
