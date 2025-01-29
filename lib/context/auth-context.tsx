'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { authenticate } from '@/lib/auth/mock-users'
import { User } from '@/lib/types/user'

interface AuthContextType {
  user: User | null
  login: (uen: string, corpPassId: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const authStatus = Cookies.get('authStatus') === 'true'
    const storedUser = Cookies.get('user')
    if (authStatus && storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (uen: string, corpPassId: string) => {
    try {
      const authenticatedUser = await authenticate({ uen, corpPassId })
      if (authenticatedUser) {
        Cookies.set('user', JSON.stringify(authenticatedUser))
        Cookies.set('authStatus', 'true')
        setUser(authenticatedUser)
        router.push('/home')
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    Cookies.remove('user')
    Cookies.remove('authStatus')
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
