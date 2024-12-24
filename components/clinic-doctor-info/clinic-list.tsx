'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Trash2, Building2, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import { clinicAction } from '@/lib/actions'

interface Clinic {
  id: string
  name: string
  hcCode: string
  contactNumber: string
  address: string
}

export function ClinicList() {
  const [clinics, setClinics] = React.useState<Clinic[]>([])
  const [editingId, setEditingId] = React.useState<string | null>(null)

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
  }

  const removeClinic = (id: string) => {
    setClinics(clinics.filter(clinic => clinic.id !== id))
    if (editingId === id) {
      setEditingId(null)
    }
  }

  const updateClinic = (id: string, field: keyof Clinic, value: string) => {
    setClinics(
      clinics.map(clinic =>
        clinic.id === id ? { ...clinic, [field]: value } : clinic
      )
    )
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    for (const clinic of clinics) {
      const formData = new FormData()
      Object.entries(clinic).forEach(([key, value]) => {
        if (key !== 'id') {
          formData.append(key, value)
        }
      })
      await clinicAction(null, formData)
    }
    setEditingId(null)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Building2 className="h-5 w-5" />
          <h3 className="text-lg font-medium">Clinics</h3>
        </div>
        <Button type="button" onClick={addClinic} variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Clinic
        </Button>
      </div>
      
      {clinics.length === 0 ? (
        <p className="text-sm text-muted-foreground">No clinics added yet. Click the button above to add a clinic.</p>
      ) : (
        <div className="space-y-4">
          {clinics.map((clinic) => (
            <Card key={clinic.id} className="w-2/3">
              <CardContent className="pt-6">
                {editingId === clinic.id ? (
                  <div className="relative grid gap-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0"
                      onClick={() => removeClinic(clinic.id)}
                    >
                      <Trash2 className="h-4 w-4 mb-6" />
                    </Button>
                    
                    <div className="grid gap-2">
                      <Label htmlFor={`clinic-name-${clinic.id}`}>Clinic Name</Label>
                      <Input
                        id={`clinic-name-${clinic.id}`}
                        value={clinic.name}
                        onChange={(e) => updateClinic(clinic.id, 'name', e.target.value)}
                        placeholder="Enter clinic name"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor={`hc-code-${clinic.id}`}>
                        Healthcare Institution (HC) code
                      </Label>
                      <Input
                        id={`hc-code-${clinic.id}`}
                        value={clinic.hcCode}
                        onChange={(e) => updateClinic(clinic.id, 'hcCode', e.target.value)}
                        placeholder="1234567"
                        maxLength={7}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor={`contact-${clinic.id}`}>Contact Number</Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                          +65
                        </span>
                        <Input
                          id={`contact-${clinic.id}`}
                          value={clinic.contactNumber}
                          onChange={(e) => updateClinic(clinic.id, 'contactNumber', e.target.value)}
                          placeholder="91234567"
                          maxLength={8}
                          className="rounded-l-none"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor={`address-${clinic.id}`}>Address</Label>
                      <Input
                        id={`address-${clinic.id}`}
                        value={clinic.address}
                        onChange={(e) => updateClinic(clinic.id, 'address', e.target.value)}
                        placeholder="Enter clinic address"
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
                      onClick={() => setEditingId(clinic.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <h4 className="font-semibold">{clinic.name}</h4>
                    <div className="text-sm text-muted-foreground mb-2">HC Code: {clinic.hcCode}</div>
                    <div className="text-sm text-muted-foreground mb-2">Contact: +65 {clinic.contactNumber}</div>
                    <div className="text-sm text-muted-foreground mb-2">{clinic.address}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Button type="submit">Save Clinics</Button>
    </form>
  )
}

