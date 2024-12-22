import { ClinicList } from '@/components/clinic-list'
import { DoctorList } from '@/components/doctor-list'

export default function Page() {
  return (
    <div className="min-h-svh p-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Manage Details</h1>
          <p className="text-muted-foreground mt-2">
            Update your clinic and doctor information
          </p>
        </div>

        <div className="space-y-8">
          <ClinicList />
          <DoctorList />
        </div>
      </div>
    </div>
  )
}

