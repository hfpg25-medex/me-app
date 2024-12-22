import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ClipboardList } from 'lucide-react'

export default function SelectExamPage() {
  const examTypes = [
    {
      title: "Six-monthly Medical Exam for Migrant Domestic Workers (MOM)",
      description: "Required medical examination for migrant domestic workers",
      href: "/medical-exam/mdw"
    },
    {
      title: "Six-monthly Medical Exam for Female Migrant Workers (MOM)",
      description: "Required medical examination for female migrant workers",
      href: "/medical-exam/fmw"
    },
    {
      title: "Medical Exam for Aged Drivers (SPF)",
      description: "Medical examination for elderly drivers",
      href: "/medical-exam/aged-drivers"
    }
  ]

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Select Medical Examination Type</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {examTypes.map((exam, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mb-2 w-fit rounded-full bg-primary/10 p-2">
                <ClipboardList className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">{exam.title}</CardTitle>
              <CardDescription>{exam.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href={exam.href}>Start Exam</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

