import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AccordionContent } from "@/components/ui/accordion"
import { useFormContext } from "react-hook-form"
import { FormDataMDW, FormDataMW } from "@/lib/schemas"
import { useAuth } from "@/lib/context/auth-context"
import { useEffect } from "react"

interface ClinicDoctorDetailsProps {
  isSummaryActive: boolean
  handleContinue: (nextStep: string) => void
  clinics: Array<{ id: string; name: string; hciCode: string; contactNumber: string }>
  doctors: Array<{ id: string; name: string; mcrNumber: string }>
}

export function ClinicDoctorDetails({ isSummaryActive, handleContinue, clinics, doctors}: ClinicDoctorDetailsProps) {
  const { setValue, formState: { errors }, watch } = useFormContext<FormDataMW | FormDataMDW>()
  const watchedValues = watch()
  const { user } = useAuth()

  useEffect(() => {
    // Auto-select the doctor if the user is a doctor
    if (user?.role === 'doctor' && user.mcr) {
      const doctorId = doctors.find(d => d.mcrNumber === user.mcr)?.id
      if (doctorId) {
        setValue('clinicDoctor.doctor', doctorId)
      }
    }
  }, [user, doctors, setValue])

  return (
    <AccordionContent>
      <div className="space-y-4 w-full">
          <div>
          <Label className="mb-2"htmlFor="clinic">Clinic</Label>
          <Select onValueChange={(value) => setValue('clinicDoctor.clinic', value)} value={watchedValues.clinicDoctor.clinic}>
            <SelectTrigger id="clinic">
              <SelectValue placeholder="Select a clinic" />
            </SelectTrigger>
            <SelectContent>
              {clinics.map(clinic => (
                <SelectItem key={clinic.id} value={clinic.id}>{clinic.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.clinicDoctor?.clinic && <p className="text-red-500 text-sm mt-1">{errors.clinicDoctor.clinic.message}</p>}
        </div>
        <div>
          <Label className="mb-2" htmlFor="doctor">Doctor</Label>
          <Select 
            onValueChange={(value) => setValue('clinicDoctor.doctor', value)} 
            value={watchedValues.clinicDoctor.doctor}
            disabled={user?.role === 'doctor'} // Disable selection if user is a doctor
          >
            <SelectTrigger id="doctor">
              <SelectValue placeholder={user?.role === 'doctor' ? user.name : "Select a doctor"} />
            </SelectTrigger>
            <SelectContent>
              {doctors.map(doctor => (
                <SelectItem key={doctor.id} value={doctor.id}>{doctor.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.clinicDoctor?.doctor && <p className="text-red-500 text-sm mt-1">{errors.clinicDoctor.doctor.message}</p>}
        </div>
      </div>
      <Button 
        className="mt-4" 
        onClick={() => {
          if (isSummaryActive) {
            handleContinue('summary');
          } else {
            handleContinue('helper-details');
          }
        }}
      >
        {isSummaryActive ? 'Continue to Summary' : 'Continue'}
      </Button>
    </AccordionContent>
  )
}
