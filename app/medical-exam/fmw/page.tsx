import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function FMWExamPage() {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Six-monthly Medical Exam for Female Migrant Workers (MOM)</CardTitle>
          <CardDescription>
            Required medical examination for female migrant workers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Medical examination form for Female Migrant Workers coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

