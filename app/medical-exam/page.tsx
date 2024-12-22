import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function MedicalExamPage() {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>New Medical Examination</CardTitle>
          <CardDescription>
            Submit a new medical examination record
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Medical examination form coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

