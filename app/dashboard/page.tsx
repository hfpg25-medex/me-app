"use client";

import { ReviewSection } from "@/components/review-section";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/context/auth-context";
import { ClipboardList, FileEdit, History, Stethoscope } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-6">
        <div className="mb-4">
          <h1 className="text-4xl font-bold tracking-tight mb-2 ">
            Hello, {user?.name}!
          </h1>
          <p className="text-xl text-muted-foreground">
            What would you like to do?
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
              <Button asChild className="mt-2 w-full hover:text-white">
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
              <CardTitle className="text-xl">Clinic & Doctor</CardTitle>
              <CardDescription>
                Manage your clinic and doctor information
              </CardDescription>
              <Button asChild className="mt-2 w-full hover:text-white">
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
              <Button asChild className="mt-2 w-full hover:text-white">
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
              <Button asChild className="mt-2 w-full hover:text-white">
                <Link href="/records/history">View History</Link>
              </Button>
            </CardHeader>
          </Card>
        </div>

        <ReviewSection />
      </main>
    </div>
  );
}
