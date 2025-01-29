'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginForm() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center space-y-6">
      <Button
        variant="outline"
        size="lg"
        className="w-full bg-red-600 hover:bg-red-700 text-white"
        onClick={() => router.push('/login')}
      >
        <span>Login with Singpass</span>
      </Button>
      <p className="text-center text-sm text-gray-600">
        Use your Singpass account to securely access the Medical Examination Portal.
      </p>
    </div>
  )
}
