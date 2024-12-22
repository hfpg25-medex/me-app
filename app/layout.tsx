import '@/app/globals.css'
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Home } from 'lucide-react'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

export const metadata: Metadata = {
  title: 'Medical Portal',
  description: 'Medical examination and clinic management system',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} font-sans antialiased`}>
        <div className="flex min-h-screen flex-col">
          <header className="border-b">
            <div className="container flex h-14 items-center px-4">
              <Button variant="ghost" size="sm" asChild className="mr-6">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Link>
              </Button>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}

