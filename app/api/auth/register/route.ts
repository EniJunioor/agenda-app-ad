import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { hashPassword, createToken, getAuthCookieOptions } from "@/lib/auth"
import { registerSchema } from "@/lib/validations/auth"

function parseBody(request: Request): Promise<{ email: string; password: string; name: string; coupleName: string }> {
  const ct = request.headers.get("content-type") ?? ""
  if (ct.includes("application/x-www-form-urlencoded") || ct.includes("multipart/form-data")) {
    return request.formData().then((fd) => ({
      email: (fd.get("email") as string) ?? "",
      password: (fd.get("password") as string) ?? "",
      name: (fd.get("name") as string) ?? "",
      coupleName: (fd.get("coupleName") as string) ?? "",
    }))
  }
  return request.json()
}

export async function POST(request: Request) {
  try {
    const body = await parseBody(request)
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      const toForm = request.headers.get("content-type")?.includes("form")
      if (toForm) {
        return NextResponse.redirect(new URL("/?error=" + encodeURIComponent("Dados inválidos. Verifique os campos."), request.url), 302)
      }
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { email, password, name, coupleName } = parsed.data

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      const toForm = request.headers.get("content-type")?.includes("form")
      if (toForm) {
        return NextResponse.redirect(new URL("/?error=" + encodeURIComponent("Já existe uma conta com este email."), request.url), 302)
      }
      return NextResponse.json(
        { error: "Já existe uma conta com este email." },
        { status: 409 }
      )
    }

    const passwordHash = await hashPassword(password)
    const [partner1, partner2] = coupleName.split("&").map((s) => s.trim())
    const displayName = partner2 ? `${partner1} & ${partner2}` : coupleName

    const couple = await prisma.couple.create({
      data: { name: displayName, startDate: undefined },
    })

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: partner1 || name,
        coupleId: couple.id,
      },
    })

    await prisma.couple.update({
      where: { id: couple.id },
      data: { partner1Id: user.id },
    })

    const token = await createToken({
      userId: user.id,
      email: user.email,
      coupleId: couple.id,
    })

    const opts = getAuthCookieOptions(token)
    const redirectUrl = new URL("/agenda", request.url)
    const response = NextResponse.redirect(redirectUrl, 302)
    response.cookies.set(opts.name, opts.value, {
      httpOnly: opts.httpOnly,
      secure: opts.secure,
      sameSite: opts.sameSite,
      maxAge: opts.maxAge,
      path: opts.path,
    })

    return response
  } catch (e) {
    console.error("Register error:", e)
    return NextResponse.json(
      { error: "Erro ao criar conta. Tente novamente." },
      { status: 500 }
    )
  }
}
