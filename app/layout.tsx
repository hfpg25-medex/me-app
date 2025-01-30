'use client'

import './globals.css'
// import DefaultFooter from '@/components/default-footer'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import '@govtechsg/sgds-masthead/dist/sgds-masthead/sgds-masthead.css';
import {SgdsMasthead} from "@govtechsg/sgds-masthead-react"
import { UserProvider } from '@/lib/context/user-context'
import { AuthProvider, useAuth } from '@/lib/context/auth-context'
import { Geist } from 'next/font/google'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Home, LogOut } from 'lucide-react'
import { NavBar } from '@/components/ui/navbar'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    document.cookie = 'isAuthenticated=false; path=/'
    logout()
    router.push('/')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SgdsMasthead />
      {user && <NavBar userName={user.name} userUen={user.uen} />}
      <UserProvider initialUser={user}>
        <main>{children}</main>
      </UserProvider>
    </div>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link
          href="https://cdn.jsdelivr.net/npm/@govtechsg/sgds@2.3.6/css/sgds.css"
          rel="stylesheet"
          type="text/css"
        />
      </head>
      <body className={`${geist.variable} font-sans antialiased`}>
        <AuthProvider>
          <MainLayout>
            {children}
          </MainLayout>
          {/* <DefaultFooter /> */}
        </AuthProvider>
      </body>
    </html>
  )
}
