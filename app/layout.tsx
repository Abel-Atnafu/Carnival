import type { Metadata, Viewport } from 'next'
import { Inter, Cormorant_Garamond } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
})

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant'
})

export const metadata: Metadata = {
  title: 'Lebawi Carnival 2026 | Get Your Tickets',
  description: 'Join Lebawi International Academy for an evening of celebration, community, and unforgettable memories at Carnival 2026.',
  keywords: ['Lebawi', 'Carnival', 'Tickets', 'Event', '2026', 'Ethiopia'],
  openGraph: {
    title: 'Lebawi Carnival 2026',
    description: 'An evening of celebration, community, and unforgettable memories',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0A0712',
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
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${cormorant.variable} font-sans antialiased bg-[#0A0712] min-h-screen`}>
        {children}
        <Toaster 
          position="top-center" 
          richColors 
          toastOptions={{
            style: {
              background: '#1A1528',
              border: '1px solid #2A2240',
              color: '#E8E4F0',
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}
