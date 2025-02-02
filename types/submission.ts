export interface SubmissionResponse {
  success: boolean
  message: string
  submissionId?: string
}

export interface Submission {
  id: string
  type: 'FMW' | 'MDW' | 'FME' | 'PR'
  data: any // Replace with your form data type
  createdAt: string
  status: 'pending' | 'completed'
}
