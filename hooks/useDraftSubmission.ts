import { useState, useCallback } from 'react'

interface DraftSubmission {
  id: string
  userId: string
  examType: string
  formData: any
  status: string
  createdAt: string
  updatedAt: string
}

interface UseDraftSubmissionProps {
  userId: string
  examType: string
}

export function useDraftSubmission({ userId, examType }: UseDraftSubmissionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const saveDraft = useCallback(async (formData: any) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/drafts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          examType,
          formData,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save draft')
      }

      const data = await response.json()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save draft')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [userId, examType])

  const loadDraft = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(
        `/api/drafts?userId=${encodeURIComponent(userId)}&examType=${encodeURIComponent(examType)}`
      )

      if (!response.ok) {
        throw new Error('Failed to load draft')
      }

      const data: DraftSubmission | null = await response.json()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load draft')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [userId, examType])

  return {
    saveDraft,
    loadDraft,
    isLoading,
    error,
  }
}
