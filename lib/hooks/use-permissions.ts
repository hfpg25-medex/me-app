import { useUser } from '../context/user-context'

export function usePermissions() {
  const { permissions } = useUser()
  
  return {
    ...permissions,
    // Helper function to check if user can edit a specific section
    canEditSection: (section: 'clinic-doctor' | 'helper-details' | 'medical-history' | 'clinical-examination' | 'tests') => {
      switch (section) {
        case 'clinic-doctor':
          return permissions.canEditClinicDetails
        case 'helper-details':
          return permissions.canEditPersonalDetails
        case 'medical-history':
          return permissions.canEditMedicalHistory
        case 'clinical-examination':
          return permissions.canEditClinicalExamination
        case 'tests':
          return permissions.canEditTests
        default:
          return false
      }
    }
  }
}
