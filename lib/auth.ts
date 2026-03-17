import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { getJwtSecret } from "@/lib/jwt-secret"
export const COOKIE_NAME = "agenda_session"
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 dias
const MAX_AGE = COOKIE_MAX_AGE

export interface JWTPayload {
  userId: string
  email: string
  coupleId: string
  exp: number
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createToken(payload: Omit<JWTPayload, "exp">): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const exp = now + MAX_AGE
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(exp)
    .setIssuedAt(now)
    .sign(getJwtSecret())
}

export function getAuthCookieOptions(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  }
}

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  })
}

export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getTokenFromCookie(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret(), {
      clockTolerance: 86400, // 24h de tolerância (relógio do servidor pode estar adiantado/atrasado)
    })
    return payload as unknown as JWTPayload
  } catch (e) {
    console.log("[auth:verifyToken] JWT inválido ou expirado:", e instanceof Error ? e.message : String(e))
    return null
  }
}

export async function getSession(): Promise<JWTPayload | null> {
  const token = await getTokenFromCookie()
  console.log("[auth:getSession] Cookie agenda_session presente?", !!token, "tamanho:", token?.length ?? 0)
  if (!token) return null
  const session = await verifyToken(token)
  console.log("[auth:getSession] verifyToken resultado:", session ? "OK" : "null")
  return session
}

/** Lê o token do header Cookie do request (útil em Route Handlers para garantir o mesmo request do fetch). */
export function getTokenFromRequest(request: Request): string | undefined {
  const cookieHeader = request.headers.get("cookie")
  if (!cookieHeader) return undefined
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`))
  return match ? decodeURIComponent(match[1].trim()) : undefined
}

/** Sessão a partir do Request (usa Cookie header diretamente). */
export async function getSessionFromRequest(request: Request): Promise<JWTPayload | null> {
  const token = getTokenFromRequest(request)
  console.log("[auth:getSessionFromRequest] Cookie no header?", !!token, "tamanho:", token?.length ?? 0)
  if (!token) return null
  const session = await verifyToken(token)
  console.log("[auth:getSessionFromRequest] verifyToken:", session ? "OK" : "null")
  return session
}
