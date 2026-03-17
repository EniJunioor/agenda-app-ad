/**
 * Segredo JWT — lido exclusivamente da variável de ambiente.
 * Em desenvolvimento local, configure JWT_SECRET no .env
 * Em produção (Vercel etc.), configure JWT_SECRET nas env vars do projeto.
 *
 * Para gerar um segredo seguro:
 *   openssl rand -base64 32
 */
export function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "[auth] JWT_SECRET não está definido. Configure a variável de ambiente JWT_SECRET."
      )
    }
    // Dev local: avisa mas não quebra
    console.warn(
      "[auth] ⚠️  JWT_SECRET não definido. Use uma string segura no .env para desenvolvimento."
    )
    return new TextEncoder().encode("dev-secret-inseguro-nao-use-em-prod")
  }

  return new TextEncoder().encode(secret)
}
