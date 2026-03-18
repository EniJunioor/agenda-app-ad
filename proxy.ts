import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Auth é feita só no layout (app) + /api/auth/me.
 * Matcher aponta para um path que ninguém acessa, então o middleware
 * não roda em /agenda e não gera 307.
 */
export function middleware(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ["/__middleware-skip"],
}
