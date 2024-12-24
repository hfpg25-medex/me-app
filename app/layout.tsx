'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import '@/app/globals.css'
// import '@govtechsg/sgds/css/sgds.css'
import '@govtechsg/sgds-masthead/dist/sgds-masthead/sgds-masthead.css';
import {SgdsMasthead} from "@govtechsg/sgds-masthead-react"

import { Geist } from 'next/font/google'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Home, LogOut } from 'lucide-react'
import { DefaultFooter } from '@/components/sgds/Footer'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setIsAuthenticated(document.cookie === 'isAuthenticated=true');
  }, []);

  useEffect(() => {
    const authStatus = document.cookie === 'isAuthenticated=true'
    setIsAuthenticated(authStatus)

    if (!authStatus && pathname !== '/') {
      console.log('authStatus=', authStatus)
      router.push('/')
    }
  }, [pathname, router])

  const handleLogout = () => {
    document.cookie = 'isAuthenticated=false; path=/'
    setIsAuthenticated(false)
    router.push('/')
  }

  return (
    <html lang="en">
      <head>
      <link
          href="https://cdn.jsdelivr.net/npm/@govtechsg/sgds@2.3.6/css/sgds.css"
          rel="stylesheet"
          type="text/css"
        />
      </head>

      <body className={`${geist.variable} font-sans antialiased`}>
      <SgdsMasthead
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      /> 
        <div className="flex min-h-screen flex-col">
        {isAuthenticated && 
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
            </header>}
          {children}
        </div>
        <DefaultFooter />
      </body>
    </html>
  )
}

