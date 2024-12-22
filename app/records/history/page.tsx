import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HistoryPage() {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Medical Examination History</CardTitle>
          <CardDescription>
            View and manage past medical examination records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Medical examination history coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

