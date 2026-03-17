/**
 * Segredo único para JWT - usado pelo middleware (Edge) e pelas API routes (Node).
 * O middleware (Edge) às vezes não enxerga process.env.JWT_SECRET do .env;
 * o fallback abaixo deve ser o MESMO valor do seu .env para dev local.
 * Em produção, defina JWT_SECRET nas variáveis de ambiente do servidor.
 */
const FALLBACK = "SNDUIENQEQEQ#@3#SDKMWKO@O"

export function getJwtSecret(): Uint8Array {
  const raw = process.env.JWT_SECRET ?? FALLBACK
  return new TextEncoder().encode(raw)
}
