import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EditRecordsPage() {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Update Medical Records</CardTitle>
          <CardDescription>
            Modify existing medical examination records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Medical records update form coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
