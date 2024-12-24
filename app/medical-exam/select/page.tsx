import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ClipboardList } from 'lucide-react'

export default function SelectExamPage() {
  const examTypes = [
    {
      title: "Six-monthly Medical Exam for Migrant Domestic Workers",
      description: "MOM",
      href: "/medical-exam/mdw"
    },
    {
      title: "Medical Exam for Work Permit Application",
      description: "MOM",
      href: "/medical-exam/wp"
    },
    {
      title: "Six-monthly Medical Exam for Female Migrant Workers",
      description: "MOM",
      href: "/medical-exam/fmw"
    },
    {
      title: "Medical Exam for Aged Drivers 65 Years Old and Above",
      description: "SPF",
      href: "/medical-exam/aged-drivers"
    },
    {
      title: "Medical Exam for Vocational Driving Licenses",
      description: "LTA",
      href: "/medical-exam/vocational-drivers"
    },
    {
      title: "Medical Exam for Permanant Residency Application",
      description: "ICA",
      href: "/medical-exam/pr"
    }
  ]

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Select Medical Examination</h1>
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
                <Link href={exam.href}>Start Submission</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

