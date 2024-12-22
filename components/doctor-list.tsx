'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Trash2, Stethoscope, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import { doctorAction } from '@/lib/actions'

interface Doctor {
  id: string
  name: string
  mcr: string
}

export function DoctorList() {
  const [doctors, setDoctors] = React.useState<Doctor[]>([])
  const [editingId, setEditingId] = React.useState<string | null>(null)

  const addDoctor = () => {
    const newDoctor: Doctor = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      mcr: '',
    }
    setDoctors([...doctors, newDoctor])
    setEditingId(newDoctor.id)
  }

  const removeDoctor = (id: string) => {
    setDoctors(doctors.filter(doctor => doctor.id !== id))
    if (editingId === id) {
      setEditingId(null)
    }
  }

  const updateDoctor = (id: string, field: keyof Doctor, value: string) => {
    setDoctors(
      doctors.map(doctor =>
        doctor.id === id ? { ...doctor, [field]: value } : doctor
      )
    )
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    for (const doctor of doctors) {
      const formData = new FormData()
      Object.entries(doctor).forEach(([key, value]) => {
        if (key !== 'id') {
          formData.append(key, value)
        }
      })
      await doctorAction(null, formData)
    }
    setEditingId(null)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Stethoscope className="h-5 w-5" />
          <h3 className="text-lg font-medium">Doctors</h3>
        </div>
        <Button type="button" onClick={addDoctor} variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Doctor
        </Button>
      </div>
      
      {doctors.length === 0 ? (
        <p className="text-sm text-muted-foreground">No doctors added yet. Click the button above to add a doctor.</p>
      ) : (
        <div className="space-y-4">
          {doctors.map((doctor) => (
            <Card key={doctor.id}>
              <CardContent className="pt-6">
                {editingId === doctor.id ? (
                  <div className="relative grid gap-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0"
                      onClick={() => removeDoctor(doctor.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    
                    <div className="grid gap-2">
                      <Label htmlFor={`doctor-name-${doctor.id}`}>Doctor Name</Label>
                      <Input
                        id={`doctor-name-${doctor.id}`}
                        value={doctor.name}
                        onChange={(e) => updateDoctor(doctor.id, 'name', e.target.value)}
                        placeholder="Enter doctor name"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor={`mcr-${doctor.id}`}>MCR Number</Label>
                      <Input
                        id={`mcr-${doctor.id}`}
                        value={doctor.mcr}
                        onChange={(e) => updateDoctor(doctor.id, 'mcr', e.target.value)}
                        placeholder="M12345A"
                        maxLength={7}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0"
                      onClick={() => setEditingId(doctor.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <h4 className="font-semibold">{doctor.name}</h4>
                    <p className="text-sm text-muted-foreground">MCR: {doctor.mcr}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Button type="submit">Save Doctors</Button>
    </form>
  )
}

