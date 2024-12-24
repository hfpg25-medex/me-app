'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { useRef, useEffect } from 'react'
import { Stethoscope } from 'lucide-react'

export default function Header() {
  const loginRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loginElement = document.getElementById('login-section')
    if (loginElement) {
      loginRef.current = loginElement
    }
  }, [])

  const scrollToLogin = () => {
    if (loginRef.current) {
      loginRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 no-underline">
            <Stethoscope className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">MEPortal</span>
          </Link>
          <nav>
            <ul className="flex items-center space-x-6">
              <li><Link href="#" className="text-gray-600 hover:text-blue-600 no-underline">Home</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-blue-600 no-underline">About</Link></li>
              <li><Button variant="outline" onClick={scrollToLogin} className="h-auto py-1">Login</Button></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

