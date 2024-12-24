'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from 'next/navigation'


export default function LoginForm() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [uen, setUen] = useState('')
  const [corppassId, setCorppassId] = useState('')
  const { toast } = useToast()

  const router = useRouter()


  const handleSingpassLogin = () => {
    setUen('')
    setCorppassId('')
    setIsModalOpen(true)
  }

  const handleMockLogin = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Mock login with:', { uen, corppassId })
    toast({
      title: "Mock Login Attempt",
      description: `UEN: ${uen}, Corppass ID: ${corppassId}`,
    })
    document.cookie = 'isAuthenticated=true; path=/'
    router.push('/home')
  }

  return (
    <div className="space-y-4">
      <Button 
        onClick={handleSingpassLogin} 
        className="w-full bg-red-600 hover:bg-red-700 text-white"
      >
        Login with Singpass
      </Button>
      <p className="text-center text-sm text-gray-600">
        Use your Singpass account to securely access the Medical Examination Portal.
      </p>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mock Corppass Login</DialogTitle>
            <DialogDescription>
              This is a mock login. In a real application, you would be redirected to the Singpass login page.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleMockLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="uen">UEN (Unique Entity Number)</Label>
              <Input
                id="uen"
                value={uen}
                onChange={(e) => setUen(e.target.value)}
                placeholder="Enter your UEN"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="corppassId">Corppass ID</Label>
              <Input
                id="corppassId"
                value={corppassId}
                onChange={(e) => setCorppassId(e.target.value)}
                placeholder="Enter your Corppass ID"
                required
              />
            </div>
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

