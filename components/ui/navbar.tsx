"use client"

import Link from "next/link"
import { useState } from "react"
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useAuth } from '@/lib/context/auth-context'

interface NavBarProps {
  userName: string
  userUen: string
}

export function NavBar({ userName, userUen }: NavBarProps) {
  const { logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="bg-primary text-primary-foreground py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <nav className="flex items-center space-x-4">
          <Link href="/" className="text-white font-semibold no-underline hover:text-gray-400 transition-colors">
            Home
          </Link>
          <Link href="/medical-exams" className="text-white font-semibold no-underline hover:text-gray-400 transition-colors">
            Medical Exams
          </Link>
        </nav>
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 text-white hover:text-gray-400 transition-colors hover:bg-transparent">
              <User className="h-5 w-5" />
              <span className="hidden md:inline">{userName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-muted-foreground">UEN: {userUen}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => logout()} 
              className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
