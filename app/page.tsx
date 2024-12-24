'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const [uen, setUen] = useState('')
  const [corppassId, setCorppassId] = useState('')
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
     // Here you would typically validate the credentials with a backend service
    // For this example, we'll just set a flag in localStorage
    // localStorage.setItem('isAuthenticated', 'true')
    document.cookie = 'isAuthenticated=true; path=/'
    // console.log('localStorage=', localStorage)
    router.push('/home')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Login to Medical Examination Portal</CardTitle>
          <CardDescription>Enter your UEN and Corppass ID to access the portal. (Please note that this is a mock Corppass login)</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="uen">UEN</Label>
              <Input
                id="uen"
                type="text"
                placeholder="Enter your UEN"
                value={uen}
                onChange={(e) => setUen(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="corppassId">Corppass ID</Label>
              <Input
                id="corppassId"
                type="text"
                placeholder="Enter your Corppass ID"
                value={corppassId}
                onChange={(e) => setCorppassId(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

