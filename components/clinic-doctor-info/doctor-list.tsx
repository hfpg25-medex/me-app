'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Trash2, Stethoscope, Pencil, Loader2 } from 'lucide-react'
import { updateDoctor, getDoctorList } from '@/lib/actions/doctor'
import { doctorSchema } from '@/lib/validations/clinicDoctorSchemas'
import { useToast } from '@/hooks/use-toast'
import { z } from 'zod'

interface Doctor {
  id: string
  name: string
  mcr: string
}

interface ValidationErrors {
  [key: string]: string[]
}

export function DoctorList() {
  const [doctors, setDoctors] = React.useState<Doctor[]>([])
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [validationErrors, setValidationErrors] = React.useState<Record<string, ValidationErrors>>({})
  const { toast } = useToast()
  const [isLoading, setIsLoading] = React.useState<string | null>(null)

  React.useEffect(() => {
    const loadDoctors = async () => {
      const result = await getDoctorList()
      console.log("result", result)
      if (result.success && result.data) {
        setDoctors(result.data)
      } else {
        setDoctors([])  
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to load doctors"
        })
      }
    }
    loadDoctors()
  }, [toast])

  const addDoctor = () => {
    const newDoctor: Doctor = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      mcr: '',
    }
    setDoctors([...doctors, newDoctor])
    setEditingId(newDoctor.id)
    setValidationErrors({...validationErrors, [newDoctor.id]: {}})
  }

  // const validateDoctor = (doctor: Doctor) => {
  //   try {
  //     doctorSchema.parse(doctor)
  //     setValidationErrors({
  //       ...validationErrors,
  //       [doctor.id]: {}
  //     })
  //     return true
  //   } catch (error) {
  //     if (error instanceof z.ZodError) {
  //       const errors: ValidationErrors = {}
  //       error.errors.forEach((err) => {
  //         const path = err.path[0] as string
  //         if (!errors[path]) {
  //           errors[path] = []
  //         }
  //         errors[path].push(err.message)
  //       })
  //       setValidationErrors({
  //         ...validationErrors,
  //         [doctor.id]: errors
  //       })
  //     }
  //   }
  // }

  // const removeDoctor = (id: string) => {
  //   setDoctors(doctors.filter(doctor => doctor.id !== id))
  //   if (editingId === id) {
  //     setEditingId(null)
  //   }
  // }

  // const updateDoctor = (id: string, field: keyof Doctor, value: string) => {
  //   setDoctors(
  //     doctors.map(doctor =>
  //       doctor.id === id ? { ...doctor, [field]: value } : doctor
  //     )
  //   )
  // }

  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault()
  //   let isValid = true
  //   for (const doctor of doctors) {
  //     if (!validateDoctor(doctor)) {
  //       isValid = false
  //     }
  //   }
  //   if (!isValid) return
  //   setIsLoading('submit')
  //   for (const doctor of doctors) {
  //     const formData = new FormData()
  //     Object.entries(doctor).forEach(([key, value]) => {
  //       if (key !== 'id') {
  //         formData.append(key, value)
  //       }
  //     })
  //     await updateDoctor(doctor.id, formData)
  //   }
  //   setIsLoading(null)
  //   setEditingId(null)
  // }
  const handleSubmit = async (doctor: Doctor) => {
    try {
      // Clear previous validation errors for this doctor
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[doctor.id]
        return newErrors
      })

      // Validate before sending to server
      try {
        doctorSchema.parse({
          name: doctor.name,
          mcr: doctor.mcr,
        })
      } catch (e) {
        if (e instanceof z.ZodError) {
          const errors = e.errors.reduce((acc: { [key: string]: string[] }, curr) => {
            const field = curr.path[0] as string
            if (!acc[field]) acc[field] = []
            acc[field].push(curr.message)
            return acc
          }, {})
          setValidationErrors(prev => ({
            ...prev,
            [doctor.id]: errors
          }))
          toast({
            variant: "destructive",
            title: "Validation Error",
            description: "Please check the form for errors"
          })
          return
        }
      }

      setIsLoading(doctor.id)
      const result = await updateDoctor(doctor.id, {
        name: doctor.name,
        mcr: doctor.mcr,
      })

      if (result.success) {
        setEditingId(null)
        toast({
          title: "Success",
          description: "Doctor information updated successfully."
        })
        setDoctors(prevDoctors =>
          prevDoctors.map(d =>
            d.id === doctor.id ? { ...d, ...result.data } : d
          )
        )
      } else {
        // Handle server-side validation errors
        if (result.validationErrors) {
          setValidationErrors(prev => ({
            ...prev,
            [doctor.id]: result.validationErrors as unknown as ValidationErrors
          }))
        }
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error
        })
      }
    } catch (error) {
      console.error('Error updating clinic:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred"
      })
    } finally {
      setIsLoading(null)
    }
  }

  const getFieldError = (doctorId: string, field: string) => {
    if (!validationErrors[doctorId]) return null
    const errors = validationErrors[doctorId][field]
    return errors ? errors[0] : null
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      doctors.forEach(doctor => handleSubmit(doctor))
    }} className="space-y-4 max-w-[760px] mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Stethoscope className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Doctor Information</h2>
        </div>
        <Button type="button" onClick={addDoctor} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Doctor
        </Button>
      </div>

      {doctors.map((doctor) => (
        <Card key={doctor.id} className="relative">
          <CardContent className="pt-6">
            <div className="absolute top-4 right-4 flex items-center space-x-2">
              {editingId === doctor.id ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSubmit(doctor)}
                  disabled={isLoading === doctor.id}
                >
                  {isLoading === doctor.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Save"
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingId(doctor.id)}
                  className="text-blue-600"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setDoctors(doctors.filter((d) => d.id !== doctor.id))
                  const newValidationErrors = { ...validationErrors }
                  delete newValidationErrors[doctor.id]
                  setValidationErrors(newValidationErrors)
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>

            <div className="grid gap-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor={`name-${doctor.id}`}>Doctor Name</Label>
                <Input
                  id={`name-${doctor.id}`}
                  value={doctor.name}
                  onChange={(e) =>
                    setDoctors(
                      doctors.map((d) =>
                        d.id === doctor.id ? { ...d, name: e.target.value } : d
                      )
                    )
                  }
                  disabled={editingId !== doctor.id}
                />
                {getFieldError(doctor.id, 'name') && (
                  <p className="text-sm text-red-500">{getFieldError(doctor.id, 'name')}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`mcr-${doctor.id}`}>MCR Number</Label>
                <Input
                  id={`mcr-${doctor.id}`}
                  value={doctor.mcr}
                  onChange={(e) =>
                    setDoctors(
                      doctors.map((d) =>
                        d.id === doctor.id ? { ...d, mcr: e.target.value } : d
                      )
                    )
                  }
                  disabled={editingId !== doctor.id}
                />
                {getFieldError(doctor.id, 'mcr') && (
                  <p className="text-sm text-red-500">{getFieldError(doctor.id, 'mcr')}</p>
                )}
              </div>

              {/* <div className="grid gap-2">
                <Label htmlFor={`name-${doctor.id}`}>Name</Label>
                <Input
                  id={`name-${doctor.id}`}
                  value={doctor.name}
                  onChange={(e) =>
                    setDoctors(
                      doctors.map((c) =>
                        c.id === doctor.id ? { ...c, name: e.target.value } : c
                      )
                    )
                  }
                  disabled={editingId !== doctor.id}
                />
                {getFieldError(doctor.id, 'name') && (
                  <p className="text-sm text-red-500">{getFieldError(doctor.id, 'name')}</p>
                )}
              </div> */}
            </div>
          </CardContent>
        </Card>
      ))}
      {/* <Button type="submit">Save Clinics</Button> */}
    </form>
  )
}

//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-2">
//           <Stethoscope className="h-5 w-5" />
//           <h3 className="text-lg font-medium">Doctors</h3>
//         </div>
//         <Button type="button" onClick={addDoctor} variant="outline" size="sm">
//           <Plus className="mr-2 h-4 w-4" />
//           Add Doctor
//         </Button>
//       </div>
      
//       {doctors.length === 0 ? (
//         <p className="text-sm text-muted-foreground">No doctors added yet. Click the button above to add a doctor.</p>
//       ) : (
//         <div className="space-y-4">
//           {doctors.map((doctor) => (
//             <Card key={doctor.id} className="w-2/3">
//               <CardContent className="pt-6">
//                 {editingId === doctor.id ? (
//                   <div className="relative grid gap-4">
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="icon"
//                       className="absolute right-0 top-0"
//                       onClick={() => removeDoctor(doctor.id)}
//                     >
//                       <Trash2 className="h-4 w-4 mb-6" />
//                     </Button>
                    
//                     <div className="grid gap-2">
//                       <Label htmlFor={`doctor-name-${doctor.id}`}>Doctor Name</Label>
//                       <Input
//                         id={`doctor-name-${doctor.id}`}
//                         value={doctor.name}
//                         onChange={(e) => updateDoctor(doctor.id, 'name', e.target.value)}
//                         placeholder="Enter doctor name"
//                       />
//                       {validationErrors[doctor.id]?.name?.map((error, index) => (
//                         <div key={index} className="text-sm text-red-600">{error}</div>
//                       ))}
//                     </div>

//                     <div className="grid gap-2">
//                       <Label htmlFor={`mcr-${doctor.id}`}>MCR Number</Label>
//                       <Input
//                         id={`mcr-${doctor.id}`}
//                         value={doctor.mcr}
//                         onChange={(e) => updateDoctor(doctor.id, 'mcr', e.target.value)}
//                         placeholder="M12345A"
//                         maxLength={7}
//                       />
//                       {validationErrors[doctor.id]?.mcr?.map((error, index) => (
//                         <div key={index} className="text-sm text-red-600">{error}</div>
//                       ))}
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="relative">
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="icon"
//                       className="absolute right-0 top-0"
//                       onClick={() => setEditingId(doctor.id)}
//                     >
//                       <Pencil className="h-4 w-4" />
//                     </Button>
//                     <h4 className="font-semibold">{doctor.name}</h4>
//                     <div className="text-sm text-muted-foreground mb-2">MCR: {doctor.mcr}</div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//       {/* <Button type="submit" loading={isLoading === 'submit'}>Save Doctors</Button> */}
//     </form>
//   )
// }
