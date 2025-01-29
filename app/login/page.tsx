'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/context/auth-context'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { mockUsers } from '@/lib/auth/mock-users'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
    } catch (err) {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Available test accounts:</h2>
          <div className="space-y-4">
            {mockUsers.map((user) => (
              <div key={user.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-600">Email: {user.email}</div>
                <div className="text-sm text-gray-600">Role: {user.role}</div>
                {user.mcr && <div className="text-sm text-gray-600">MCR: {user.mcr}</div>}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
