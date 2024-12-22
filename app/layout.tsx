'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import '@/app/globals.css'
import { Geist } from 'next/font/google'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Home, LogOut } from 'lucide-react'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // const authStatus = localStorage.getItem('isAuthenticated')
    // setIsAuthenticated(authStatus === 'true')
    console.log('document.cookie=', document.cookie)
    const authStatus = document.cookie === 'isAuthenticated=true'
    setIsAuthenticated(authStatus)

    if (authStatus !== true && pathname !== '/') {
      console.log('authStatus=', authStatus)
      router.push('/')
    }
  }, [pathname, router])

  const handleLogout = () => {
    // localStorage.removeItem('isAuthenticated')
    document.cookie = 'isAuthenticated=false; path=/'
    setIsAuthenticated(false)
    router.push('/')
  }

  return (
    <html lang="en">
      <body className={`${geist.variable} font-sans antialiased`}>
        <div className="flex min-h-screen flex-col">
          {isAuthenticated && (
            <header className="border-b">
              <div className="container flex h-14 items-center px-4 justify-between">
                <Button variant="ghost" size="sm" asChild className="mr-6">
                  <Link href="/home">
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </header>
          )}
          {children}
        </div>
      </body>
    </html>
  )
}

