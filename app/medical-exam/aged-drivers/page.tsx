import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AgedDriversExamPage() {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Medical Exam for Aged Drivers (SPF)</CardTitle>
          <CardDescription>
            Medical examination for elderly drivers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Medical examination form for Aged Drivers coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

