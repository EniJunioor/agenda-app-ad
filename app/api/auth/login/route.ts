import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyPassword, createToken, getAuthCookieOptions } from "@/lib/auth"
import { loginSchema } from "@/lib/validations/auth"

function parseBody(request: Request): Promise<{ email: string; password: string }> {
  const ct = request.headers.get("content-type") ?? ""
  if (ct.includes("application/x-www-form-urlencoded") || ct.includes("multipart/form-data")) {
    return request.formData().then((fd) => ({
      email: (fd.get("email") as string) ?? "",
      password: (fd.get("password") as string) ?? "",
    }))
  }
  return request.json()
}

export async function POST(request: Request) {
  try {
    const body = await parseBody(request)
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      const toForm = request.headers.get("content-type")?.includes("form")
      if (toForm) {
        return NextResponse.redirect(new URL("/?error=" + encodeURIComponent("Email ou senha inválidos."), request.url), 302)
      }
      return NextResponse.json(
        { error: "Email ou senha inválidos.", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { email, password } = parsed.data

    const user = await prisma.user.findUnique({
      where: { email },
      include: { couple: true },
    })

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      const toForm = request.headers.get("content-type")?.includes("form")
      if (toForm) {
        return NextResponse.redirect(new URL("/?error=" + encodeURIComponent("Email ou senha incorretos."), request.url), 302)
      }
      return NextResponse.json(
        { error: "Email ou senha incorretos." },
        { status: 401 }
      )
    }

    const token = await createToken({
      userId: user.id,
      email: user.email,
      coupleId: user.coupleId,
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

    console.log("[auth:login] OK – redirect 302 para /agenda, cookie agenda_session definido (tamanho token:", token.length, ")")
    return response
  } catch (e) {
    console.error("Login error:", e)
    return NextResponse.json(
      { error: "Erro ao entrar. Tente novamente." },
      { status: 500 }
    )
  }
}
