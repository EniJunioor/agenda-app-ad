import type { Metadata, Viewport } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AgendaProvider } from '@/context/agenda-context'
import './globals.css'

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500"]
})

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "600"],
  style: ["normal", "italic"]
})

export const metadata: Metadata = {
  title: 'Nossa Agenda - Agenda Compartilhada para Casais',
  description: 'Uma agenda compartilhada especial para você e seu amor organizarem todos os momentos juntos.',
}

export const viewport: Viewport = {
  themeColor: '#E07A7A',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${dmSans.variable} ${playfair.variable} font-sans antialiased`}>
        <AgendaProvider>
          {children}
        </AgendaProvider>
        <Analytics />
      </body>
    </html>
  )
}
