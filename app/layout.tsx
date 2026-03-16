import type { Metadata, Viewport } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AgendaProvider } from '@/context/agenda-context'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700"]
})

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"]
})

export const metadata: Metadata = {
  title: 'Nossa Agenda - Agenda Compartilhada para Casais',
  description: 'Uma agenda compartilhada especial para voce e seu amor organizarem todos os momentos juntos.',
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFBF8" },
    { media: "(prefers-color-scheme: dark)", color: "#0F0D0D" }
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${playfair.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <AgendaProvider>
            {children}
          </AgendaProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
