'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Pencil } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface SummaryProps {
  clinicDetails: {
    clinic: string
    doctor: string
    hciCode: string
    contactNumber: string
    mcrNumber: string
  }
  helperDetails: {
    fin: string
    name: string
    visitDate: Date
  }
  examinationDetails: {
    weight: string
    height: string
    bmi: number | null
    positiveTests: string[]
    testResults?: Array<{
      name: string
      result: string
    }>
    suspiciousInjuries: boolean
    unintentionalWeightLoss: boolean
    policeReport: string | null
    remarks: string
  }
  onEdit: (section: 'clinic-doctor' | 'helper-details' | 'examination-details') => void
  onSubmit: () => void
}

export function Summary({
  clinicDetails,
  helperDetails,
  examinationDetails,
  onEdit,
  onSubmit
}: SummaryProps) {
  const [declarationChecked, setDeclarationChecked] = useState(false)

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Submit medical examination results</h1>
      
      <div className="flex items-center mb-8">
        <div className="flex items-center text-primary">
          <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mr-2">
            1
          </div>
          Submission
        </div>
        <div className="mx-2 w-10 h-0.5 bg-gray-300"></div>
        <div className="flex items-center text-primary">
          <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mr-2">
            2
          </div>
          Summary
        </div>
      </div>

      <div className="space-y-8">
        <section className="border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Clinic and doctor details</h2>
            <Button 
              variant="ghost" 
              onClick={() => onEdit('clinic-doctor')}
              className="text-orange-500 hover:text-orange-600 hover:bg-orange-50"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Healthcare Institution (HCI) code</p>
              <p>{clinicDetails.hciCode}</p>
            </div>
            <div>
              <p className="text-gray-600">Clinic contact number</p>
              <p>{clinicDetails.contactNumber}</p>
            </div>
            <div>
              <p className="text-gray-600">Medical Registration (MCR) number</p>
              <p>{clinicDetails.mcrNumber}</p>
            </div>
            <div>
              <p className="text-gray-600">Doctor's name</p>
              <p>{clinicDetails.doctor}</p>
            </div>
          </div>
        </section>

        <section className="border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Helper details</h2>
            <Button 
              variant="ghost" 
              onClick={() => onEdit('helper-details')}
              className="text-orange-500 hover:text-orange-600 hover:bg-orange-50"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">FIN</p>
              <p>{helperDetails.fin}</p>
            </div>
            <div>
              <p className="text-gray-600">Name</p>
              <p>{helperDetails.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Date helper visited clinic</p>
              <p>{format(helperDetails.visitDate, 'dd MMM yyyy')}</p>
            </div>
          </div>
        </section>

        <section className="border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Examination details</h2>
            <Button 
              variant="ghost" 
              onClick={() => onEdit('examination-details')}
              className="text-orange-500 hover:text-orange-600 hover:bg-orange-50"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Weight</p>
                <p>{examinationDetails.weight} kg</p>
              </div>
              <div>
                <p className="text-gray-600">Height</p>
                <p>{examinationDetails.height} cm</p>
              </div>
              <div>
                <p className="text-gray-600">BMI</p>
                <p>{examinationDetails.bmi}</p>
              </div>
            </div>

            {examinationDetails.testResults && examinationDetails.testResults.length > 0 ? (
              <div className="space-y-2">
                {examinationDetails.testResults.map((test) => (
                  <div key={test.name}>
                    <p className="text-gray-600">{test.name}</p>
                    <p className={cn(
                      test.result === 'Positive/Reactive' && "text-orange-500"
                    )}>
                      {test.result}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No test results available.</p>
            )}

            <div className="space-y-2">
              <div>
                <p className="text-gray-600">Signs of suspicious or unexplained injuries</p>
                <p className={cn(
                  examinationDetails.suspiciousInjuries && "text-orange-500"
                )}>
                  {examinationDetails.suspiciousInjuries ? 'Yes' : 'No'}
                </p>
              </div>

              <div>
                <p className="text-gray-600">Unintentional weight loss (if unsure, select yes)</p>
                <p className={cn(
                  examinationDetails.unintentionalWeightLoss && "text-orange-500"
                )}>
                  {examinationDetails.unintentionalWeightLoss ? 'Yes' : 'No'}
                </p>
              </div>

              {(examinationDetails.suspiciousInjuries || examinationDetails.unintentionalWeightLoss) && (
                <div>
                  <p className="text-gray-600">Has a police report been made?</p>
                  <p>{examinationDetails.policeReport === 'yes' ? 'Yes' : 'No'}</p>
                </div>
              )}

              <div>
                <p className="text-gray-600">Remarks</p>
                <p className="whitespace-pre-wrap">{examinationDetails.remarks || '-'}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border rounded-lg p-6 bg-blue-50">
          <h2 className="text-lg font-semibold mb-4">Declaration</h2>
          <p className="mb-4">Please read and acknowledge the following:</p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>I am authorised by the clinic to submit the results and make the declarations in this form on its behalf.</li>
            <li>By submitting this form, I understand that the information given will be submitted to the Controller or an authorised officer who may act on the information given by me. I further declare that the information provided by me is true to the best of my knowledge and belief.</li>
          </ul>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="declaration" 
              checked={declarationChecked}
              onCheckedChange={(checked) => setDeclarationChecked(checked as boolean)}
            />
            <Label htmlFor="declaration">I declare that all of the above is true.</Label>
          </div>
        </section>

        <Button 
          onClick={onSubmit} 
          disabled={!declarationChecked}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        >
          Submit
        </Button>
      </div>
    </div>
  )
}

