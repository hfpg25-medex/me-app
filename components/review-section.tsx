"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ReviewItem {
  name: string;
  testType: string;
  additionalInfo?: string;
}

const reviews: ReviewItem[] = [
  {
    name: "Taswir Sinaga",
    testType: "Chest X-Ray",
    additionalInfo: "No anomalies",
  },
  {
    name: "Riya Kaur",
    testType: "Blood Test",
  },
  {
    name: "Prasetyo Makuta Dabukke",
    testType: "Blood Test",
  },
  {
    name: "Ayushi Kaur",
    testType: "Chest X-Ray",
  },
  {
    name: "Duong Vy",
    testType: "Chest X-Ray",
  },
];

export function ReviewSection() {
  return (
    <Card className="w-full md:w-[550px] mt-6">
      <CardHeader>
        <CardTitle>For Your Review</CardTitle>
        <CardDescription>Specialist reports and follow-ups</CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        {reviews.map((review, index) => (
          <div key={index} className="flex items-center justify-between py-1">
            <div className="space-y-0">
              <p className="font-medium text-sm leading-tight">{review.name}</p>
              <div className="text-xs text-muted-foreground space-x-1 leading-tight">
                <span>{review.testType}</span>
                {review.additionalInfo && (
                  <>
                    <span>·</span>
                    <span>{review.additionalInfo}</span>
                  </>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm">
              Review
            </Button>
          </div>
        ))}
      </CardContent>

      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          View all (12)
        </Button>
      </CardFooter>
    </Card>
  );
}
