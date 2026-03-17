/** @type {import('next').NextConfig} */
const nextConfig = {
  // REMOVIDO: ignoreBuildErrors — queremos detectar erros TypeScript no build
  images: {
    unoptimized: true,
  },
  // Garante que o Prisma funcione corretamente no build da Vercel
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
}

export default nextConfig
