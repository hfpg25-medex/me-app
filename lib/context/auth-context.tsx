'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '../types/user'
import { authenticate } from '../auth/mock-users'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const COOKIE_OPTIONS = {
  expires: 1, // 1 day
  path: '/',
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for saved user in cookies on mount
    const savedUser = Cookies.get('currentUser')
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
        // Ensure auth status is set if we have a valid user
        Cookies.set('authStatus', 'true', COOKIE_OPTIONS)
      } catch (error) {
        console.error('Error parsing saved user:', error)
        handleLogout()
      }
    }
    setIsLoading(false)
  }, [])

  const handleLogout = () => {
    setUser(null)
    Cookies.remove('currentUser', { path: '/' })
    Cookies.remove('authStatus', { path: '/' })
  }

  const login = async (email: string, password: string) => {
    try {
      const authenticatedUser = await authenticate({ email, password })
      if (authenticatedUser) {
        // Set both cookies with the same options
        Cookies.set('currentUser', JSON.stringify(authenticatedUser), COOKIE_OPTIONS)
        Cookies.set('authStatus', 'true', COOKIE_OPTIONS)
        setUser(authenticatedUser)
        router.push('/medical-exam')
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      console.error('Login error:', error)
      handleLogout()
      throw error
    }
  }

  const logout = () => {
    handleLogout()
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
