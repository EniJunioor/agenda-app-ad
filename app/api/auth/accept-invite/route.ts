import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { hashPassword, createToken, getAuthCookieOptions } from "@/lib/auth"
import { acceptInviteSchema } from "@/lib/validations/auth"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")
  if (!token) {
    return NextResponse.json({ error: "Token ausente." }, { status: 400 })
  }

  const invite = await prisma.partnerInvite.findUnique({
    where: { token },
    include: { couple: true },
  })

  if (!invite || invite.usedAt) {
    return NextResponse.json({ error: "Convite inválido ou já utilizado." }, { status: 400 })
  }
  if (new Date() > invite.expiresAt) {
    return NextResponse.json({ error: "Este convite expirou." }, { status: 400 })
  }

  return NextResponse.json({
    email: invite.email,
    coupleName: invite.couple.name,
    valid: true,
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = acceptInviteSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos.", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { token, password, name } = parsed.data

    const invite = await prisma.partnerInvite.findUnique({
      where: { token },
      include: { couple: true },
    })

    if (!invite || invite.usedAt) {
      return NextResponse.json({ error: "Convite inválido ou já utilizado." }, { status: 400 })
    }
    if (new Date() > invite.expiresAt) {
      return NextResponse.json({ error: "Este convite expirou." }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email: invite.email } })
    if (existingUser) {
      return NextResponse.json(
        { error: "Já existe uma conta com este email." },
        { status: 409 }
      )
    }

    const passwordHash = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        email: invite.email,
        passwordHash,
        name,
        coupleId: invite.coupleId,
      },
    })

    await prisma.couple.update({
      where: { id: invite.coupleId },
      data: { partner2Id: user.id },
    })

    await prisma.partnerInvite.update({
      where: { id: invite.id },
      data: { usedAt: new Date() },
    })

    const jwt = await createToken({
      userId: user.id,
      email: user.email,
      coupleId: invite.coupleId,
    })

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        coupleId: invite.couple.id,
        coupleName: invite.couple.name,
      },
    })

    const opts = getAuthCookieOptions(jwt)
    response.cookies.set(opts.name, opts.value, {
      httpOnly: opts.httpOnly,
      secure: opts.secure,
      sameSite: opts.sameSite,
      maxAge: opts.maxAge,
      path: opts.path,
    })

    return response
  } catch (e) {
    console.error("Accept invite error:", e)
    return NextResponse.json(
      { error: "Erro ao aceitar convite. Tente novamente." },
      { status: 500 }
    )
  }
}
