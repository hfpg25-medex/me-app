export type UserRole = 'nurse' | 'doctor'

export interface User {
  id: string
  name: string
  role: UserRole
  uen: string
  corpPassId: string
  email?: string
  mcr?: string // Only for doctors
}

export interface UserPermissions {
  canEditPersonalDetails: boolean
  canEditClinicDetails: boolean
  canEditMedicalHistory: boolean
  canEditClinicalExamination: boolean
  canEditTests: boolean
  canSubmitReport: boolean
  canViewAllReports: boolean
}

// Define role-based permissions
export const rolePermissions: Record<UserRole, UserPermissions> = {
  nurse: {
    canEditPersonalDetails: true,
    canEditClinicDetails: true,
    canEditMedicalHistory: true,
    canEditClinicalExamination: true,
    canEditTests: false,
    canSubmitReport: false,
    canViewAllReports: false,
  },
  doctor: {
    canEditPersonalDetails: true,
    canEditClinicDetails: true,
    canEditMedicalHistory: true,
    canEditClinicalExamination: true,
    canEditTests: true,
    canSubmitReport: true,
    canViewAllReports: true,
  },
}
