'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function ProfilePageClient({ error }: { error?: string }) {
  const router = useRouter()
  
  useEffect(() => {
    if (error) {
      toast.error(error)
      // Redirect to home after showing error
      setTimeout(() => {
        router.push('/')
      }, 2000)
    }
  }, [error, router])

  return null
}
