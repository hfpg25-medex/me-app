'use client'

import * as React from 'react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Trash2, Building2, Pencil } from 'lucide-react'
import { clinicAction } from '@/lib/actions'
import { clinicSchema } from '@/lib/validations/clinicDoctorSchemas'
import { useToast } from '@/hooks/use-toast'

interface Clinic {
  id: string
  name: string
  hcCode: string
  contactNumber: string
  address: string
}

interface ValidationErrors {
  [key: string]: string[]
}

export function ClinicList() {
  const [clinics, setClinics] = React.useState<Clinic[]>([])
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [validationErrors, setValidationErrors] = React.useState<Record<string, ValidationErrors>>({})
  const { toast } = useToast()

  const addClinic = () => {
    const newClinic: Clinic = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      hcCode: '',
      contactNumber: '',
      address: '',
    }
    setClinics([...clinics, newClinic])
    setEditingId(newClinic.id)
    setValidationErrors({...validationErrors, [newClinic.id]: {}})
  }

  const validateClinic = (clinic: Clinic) => {
    try {
      clinicSchema.parse(clinic)
      setValidationErrors({
        ...validationErrors,
        [clinic.id]: {}
      })
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: ValidationErrors = {}
        error.errors.forEach((err) => {
          const path = err.path[0] as string
          if (!errors[path]) {
            errors[path] = []
          }
          errors[path].push(err.message)
        })
        setValidationErrors({
          ...validationErrors,
          [clinic.id]: errors
        })
      }
      return false
    }
  }

  const handleSubmit = async (clinic: Clinic) => {
    console.log(clinic)
    if (!validateClinic(clinic)) {
      return
    }

    try {
      const validatedData = clinicSchema.parse(clinic)
      console.log(validatedData)
      
      const formData = new FormData()
      Object.entries(validatedData).forEach(([key, value]) => {
        formData.append(key, value)
      })

      const result = await clinicAction(null, formData)
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Clinic information saved successfully",
        })
        setEditingId(null)
      } else if (result.errors) {
        toast({
          title: "Error",
          description: "Please check the form for errors",
          variant: "destructive",
        })
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => `${err.path}: ${err.message}`).join('\n')
        console.log(errorMessages)
        toast({
          title: "Validation Error",
          description: errorMessages,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      }
    }
  }

  const getFieldError = (clinicId: string, fieldName: string) => {
    return validationErrors[clinicId]?.[fieldName]?.[0] || ''
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      clinics.forEach(clinic => handleSubmit(clinic))
    }} className="space-y-4 max-w-[760px] mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Building2 className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Clinic Information</h2>
        </div>
        <Button type="button" onClick={addClinic} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Clinic
        </Button>
      </div>

      {clinics.map((clinic) => (
        <Card key={clinic.id} className="relative">
          <CardContent className="pt-6">
            <div className="absolute top-4 right-4 flex items-center space-x-2">
              {editingId === clinic.id ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSubmit(clinic)}
                >
                  Save
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingId(clinic.id)}
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
                  setClinics(clinics.filter((c) => c.id !== clinic.id))
                  const newValidationErrors = { ...validationErrors }
                  delete newValidationErrors[clinic.id]
                  setValidationErrors(newValidationErrors)
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>

            <div className="grid gap-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor={`name-${clinic.id}`}>Clinic Name</Label>
                <Input
                  id={`name-${clinic.id}`}
                  value={clinic.name}
                  onChange={(e) =>
                    setClinics(
                      clinics.map((c) =>
                        c.id === clinic.id ? { ...c, name: e.target.value } : c
                      )
                    )
                  }
                  disabled={editingId !== clinic.id}
                />
                {getFieldError(clinic.id, 'name') && (
                  <p className="text-sm text-red-500">{getFieldError(clinic.id, 'name')}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`hcCode-${clinic.id}`}>HC Code</Label>
                <Input
                  id={`hcCode-${clinic.id}`}
                  value={clinic.hcCode}
                  onChange={(e) =>
                    setClinics(
                      clinics.map((c) =>
                        c.id === clinic.id ? { ...c, hcCode: e.target.value } : c
                      )
                    )
                  }
                  disabled={editingId !== clinic.id}
                />
                {getFieldError(clinic.id, 'hcCode') && (
                  <p className="text-sm text-red-500">{getFieldError(clinic.id, 'hcCode')}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`contactNumber-${clinic.id}`}>Contact Number</Label>
                <Input
                  id={`contactNumber-${clinic.id}`}
                  value={clinic.contactNumber}
                  onChange={(e) =>
                    setClinics(
                      clinics.map((c) =>
                        c.id === clinic.id ? { ...c, contactNumber: e.target.value } : c
                      )
                    )
                  }
                  disabled={editingId !== clinic.id}
                />
                {getFieldError(clinic.id, 'contactNumber') && (
                  <p className="text-sm text-red-500">{getFieldError(clinic.id, 'contactNumber')}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`address-${clinic.id}`}>Address</Label>
                <Input
                  id={`address-${clinic.id}`}
                  value={clinic.address}
                  onChange={(e) =>
                    setClinics(
                      clinics.map((c) =>
                        c.id === clinic.id ? { ...c, address: e.target.value } : c
                      )
                    )
                  }
                  disabled={editingId !== clinic.id}
                />
                {getFieldError(clinic.id, 'address') && (
                  <p className="text-sm text-red-500">{getFieldError(clinic.id, 'address')}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {/* <Button type="submit">Save Clinics</Button> */}
    </form>
  )
}
