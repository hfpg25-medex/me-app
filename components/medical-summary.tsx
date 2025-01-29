import { Avatar } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { SectionHeader } from "@/components/ui/section-header"
import { StatusBadge } from "@/components/ui/status-badge"

export function MedicalSummary() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
        {/* Personal Details Section */}
        <Card className="p-6">
          <SectionHeader title="Personal details" onEdit={() => {}} />
          <div className="grid gap-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-500">FIN</div>
                <div>G1234567X</div>
              </div>
              <div>
                <div className="text-gray-500">Name</div>
                <div>Prasetyo Makuta Dabukke</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-500">Date of visit</div>
                <div>27 Jan 2025</div>
              </div>
              <div>
                <div className="text-gray-500">Medical type</div>
                <div>6-month foreign domestic worker (MOM)</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Lab Tests Section */}
        <Card className="p-6">
          <StatusBadge status="pending">Pending</StatusBadge>
          <h2 className="text-lg font-semibold mt-4 mb-6">Lab tests & specialists</h2>
          <RadioGroup defaultValue="x-ray" className="space-y-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="x-ray" id="x-ray" />
              <label htmlFor="x-ray">X-Ray</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="blood" id="blood" />
              <label htmlFor="blood">Blood Test</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cardio" id="cardio" />
              <label htmlFor="cardio">Cardiologist — Heartcare Specialists</label>
            </div>
          </RadioGroup>
        </Card>

        {/* Medical Examination Section */}
        <Card className="p-6">
          <SectionHeader title="Medical examination" onEdit={() => {}} />
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-500">Height</div>
                <div>45.2 kg</div>
              </div>
              <div>
                <div className="text-gray-500">Weight</div>
                <div>165 cm</div>
              </div>
            </div>
            <div>
              <div className="text-gray-500">BMI</div>
              <div>16.2</div>
            </div>
            <div>
              <div className="text-gray-500">Pregnancy</div>
              <div>Negative / Non-reactive</div>
            </div>
            <div>
              <div className="text-gray-500">Syphilis test</div>
              <div className="text-red-600">Positive / Reactive</div>
            </div>
            <div>
              <div className="text-gray-500">Chest X-ray to screen for TB</div>
              <div>Negative / Non-reactive</div>
            </div>
            <div>
              <div className="text-gray-500">HIV</div>
              <div>Negative / Non-reactive</div>
            </div>
            <div>
              <div className="text-gray-500">Signs of suspicious or unexplained injuries</div>
              <div className="text-red-600">Yes</div>
            </div>
            <div>
              <div className="text-gray-500">Unintentional weight loss</div>
              <div>No</div>
            </div>
            <div>
              <div className="text-gray-500">Has a police report been made?</div>
              <div>No</div>
            </div>
            <div>
              <div className="text-gray-500">Remarks</div>
              <div className="text-red-600">
                Migrant worker reported verbally that there has been violent behaviours exhibited by the Employer.
              </div>
            </div>
          </div>
        </Card>

        {/* Clinic Details Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Clinic & doctor details</h2>
            <button className="text-sm text-gray-500 hover:text-gray-700">Edit</button>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-gray-500 text-sm">Doctor's name</div>
              <div className="flex items-center gap-2">
                <span>Mary Ang</span>
                <Avatar className="h-8 w-8">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-6o2Fmiw1CBSbM9j75q8g9l9r0tb6Xu.png"
                    alt="Doctor"
                  />
                </Avatar>
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Medical Registration (MCR) no.</div>
              <div>M11111A</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Medical Institution (HCI) code</div>
              <div>2M12345</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Clinic contact number</div>
              <div>+65 6999 1234</div>
            </div>
            <div className="space-y-2 pt-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-gray-300" />
                <div className="flex-1">
                  <div>X-Ray results submitted</div>
                  <div className="text-gray-500">2025-01-28 10:52am</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-gray-300" />
                <div className="flex-1">
                  <div>Clinical exam completed</div>
                  <div className="text-gray-500">2025-01-27 5:23pm</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-gray-300" />
                <div className="flex-1">
                  <div>Clinical exam created</div>
                  <div className="text-gray-500">2025-01-27 5:11pm</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Lab Tests Table */}
        <Card className="p-6 md:col-span-2">
          <SectionHeader title="Lab tests & specialist referrals" onEdit={() => {}} />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-2">Date submitted</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Results</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-2">2025-01-25 10:52</td>
                  <td>X-Ray</td>
                  <td>
                    <StatusBadge status="normal">Normal</StatusBadge>
                  </td>
                </tr>
                <tr>
                  <td className="py-2">2025-01-25 10:52</td>
                  <td>Blood Test</td>
                  <td>
                    <StatusBadge status="pending">Pending</StatusBadge>
                  </td>
                </tr>
                <tr>
                  <td className="py-2">2025-01-25 10:52</td>
                  <td>Cardiologist - Hearcare Specialists</td>
                  <td>
                    <StatusBadge status="pending">Pending</StatusBadge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}

