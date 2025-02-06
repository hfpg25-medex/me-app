import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function VocationalDriversExamPage() {
  return (
    <div className="container mx-auto px-3 py-6">
      <Card>
        <CardHeader>
          <CardTitle>Medical Exam for Vocational Drivers (LTA)</CardTitle>
          <CardDescription>
            Medical examination for vocational drivers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Medical examination form for Vocational Drivers coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
