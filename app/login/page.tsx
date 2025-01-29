'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from '@/lib/context/auth-context'
import { mockUsers } from '@/lib/auth/mock-users'
import Image from 'next/image'

export default function LoginPage() {
  const [uen, setUen] = useState('')
  const [corppassId, setCorppassId] = useState('')
  const { toast } = useToast()
  const { login } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(uen, corppassId)
      toast({
        title: "Login Successful",
        description: "Welcome to the Medical Examination Portal",
      })
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid UEN or CorpPass ID",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in with Singpass
          </h2>
        </div>

        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-medium mb-2">Test Accounts:</h3>
          {mockUsers.map((user) => (
            <div key={user.id} className="text-sm mb-2">
              <div>{user.name} ({user.role})</div>
              <div className="text-gray-600">UEN: {user.uen}</div>
              <div className="text-gray-600">CorpPass ID: {user.corpPassId}</div>
            </div>
          ))}
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <Label htmlFor="uen">UEN (Unique Entity Number)</Label>
              <Input
                id="uen"
                name="uen"
                type="text"
                required
                value={uen}
                onChange={(e) => setUen(e.target.value)}
                placeholder="Enter your UEN"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="corppassId">CorpPass ID</Label>
              <Input
                id="corppassId"
                name="corppassId"
                type="text"
                required
                value={corppassId}
                onChange={(e) => setCorppassId(e.target.value)}
                placeholder="Enter your CorpPass ID"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}