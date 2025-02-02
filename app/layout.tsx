'use client'

import './globals.css'
import { DefaultFooter } from '@/components/sgds/Footer'
import '@govtechsg/sgds-masthead/dist/sgds-masthead/sgds-masthead.css';
import {SgdsMasthead} from "@govtechsg/sgds-masthead-react"
import { UserProvider } from '@/lib/context/user-context'
import { AuthProvider, useAuth } from '@/lib/context/auth-context'
import { Geist } from 'next/font/google'
import { NavBar } from '@/components/ui/navbar'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

const inter = Inter({ subsets: ['latin'] })

function MainLayout({ children }: { children: React.ReactNode }) {
  const { user} = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <SgdsMasthead placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
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
      <body className={`${geist.variable} font-sans antialiased ${inter.className}`}>
        <AuthProvider>
          <MainLayout>
            {children}
          </MainLayout>
          <DefaultFooter />
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  )
}
