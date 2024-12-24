import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ClipboardList, Stethoscope, FileEdit, History } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome to Medical Exam Portal</h1>
          <p className="text-xl text-muted-foreground">
            Hello, Yanchao Du. We hope you are having a great day. What would you like to do?
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* New Medical Exam Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mb-2 w-fit rounded-full bg-primary/10 p-2">
                <ClipboardList className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">New Medical Exam</CardTitle>
              <CardDescription>
                Submit a new medical examination record
              </CardDescription>
              <Button asChild className="mt-2 w-full">
                <Link href="/medical-exam/select">Start New Exam</Link>
              </Button>
            </CardHeader>
          </Card>

          {/* Clinic & Doctor Details Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mb-2 w-fit rounded-full bg-primary/10 p-2">
                <Stethoscope className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Clinic & Doctor Details</CardTitle>
              <CardDescription>
                Manage your clinic and doctor information
              </CardDescription>
              <Button asChild className="mt-2 w-full">
                <Link href="/clinic-doctor-info">Update Details</Link>
              </Button>
            </CardHeader>
          </Card>

          {/* Update Medical Records Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mb-2 w-fit rounded-full bg-primary/10 p-2">
                <FileEdit className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Update Records</CardTitle>
              <CardDescription>
                Modify existing medical examination records
              </CardDescription>
              <Button asChild className="mt-2 w-full">
                <Link href="/records/edit">Update Records</Link>
              </Button>
            </CardHeader>
          </Card>

          {/* View History Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mb-2 w-fit rounded-full bg-primary/10 p-2">
                <History className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">View History</CardTitle>
              <CardDescription>
                Access past medical examination records
              </CardDescription>
              <Button asChild className="mt-2 w-full">
                <Link href="/records/history">View History</Link>
              </Button>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  )
}

