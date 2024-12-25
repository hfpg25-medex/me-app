'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { useRef, useState } from 'react'
import { Stethoscope, Menu } from 'lucide-react'

export default function Header() {
  const loginRef = useRef<HTMLDivElement>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scrollToLogin = () => {
    if (loginRef.current) {
      loginRef.current.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)  // Close the mobile menu when scrolling to login
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Stethoscope className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">MEPortal</span>
          </Link>
          
          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:block">
            <ul className="flex items-center space-x-6">
              <li><Link href="#" className="text-gray-600 hover:text-blue-600">Home</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-blue-600">About</Link></li>
              <li><Button variant="outline" onClick={scrollToLogin} className="h-auto py-1">Login</Button></li>
            </ul>
          </nav>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <ul className="flex flex-col space-y-4">
              <li><Link href="#" className="block text-gray-600 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
              <li><Link href="#" className="block text-gray-600 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>About</Link></li>
              <li><Button variant="outline" onClick={scrollToLogin} className="w-full">Login</Button></li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}

