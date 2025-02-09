"use client";

import RecordsTable from "@/components/records/records-table";
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
      <div className="container mx-auto px-3 w-full pt-8 pb-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Hello, {user?.name}!
          </h1>
          <p className="text-xl text-muted-foreground">
            What would you like to do?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 xl:gap-8">
          <Card className="w-full h-[248px] rounded-xl border border-border transition-shadow hover:shadow-lg">
            <CardHeader className="h-full flex flex-col justify-between">
              <div className="flex flex-col gap-3">
                <div className="w-fit rounded-full bg-primary/10 p-2">
                  <ClipboardList className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-inter text-[20px] font-semibold leading-[28px] tracking-[-0.005em] text-left underline-offset-[from-font] decoration-skip-ink-none text-[#09090B]">
                  New Medical Exam
                </CardTitle>
                <CardDescription className="font-inter text-[14px] font-normal leading-[20px] text-left underline-offset-[from-font] decoration-skip-ink-none text-[#71717A]">
                  Submit a new medical examination record
                </CardDescription>
              </div>
              <div className="flex justify-start">
                <Button
                  asChild
                  className="h-[36px] px-4 py-2 gap-2 shadow-[0px_1px_2px_0px_#0000000D] hover:text-white"
                >
                  <Link href="/medical-exam/select">Start New Exam</Link>
                </Button>
              </div>
            </CardHeader>
          </Card>

          <Card className="w-full h-[248px] rounded-xl border border-border transition-shadow hover:shadow-lg">
            <CardHeader className="h-full flex flex-col justify-between">
              <div className="flex flex-col gap-3">
                <div className="w-fit rounded-full bg-primary/10 p-2">
                  <Stethoscope className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-inter text-[20px] font-semibold leading-[28px] tracking-[-0.005em] text-left underline-offset-[from-font] decoration-skip-ink-none text-[#09090B]">
                  Clinic & Doctor
                </CardTitle>
                <CardDescription className="font-inter text-[14px] font-normal leading-[20px] text-left underline-offset-[from-font] decoration-skip-ink-none text-[#71717A]">
                  Manage your clinic and doctor information
                </CardDescription>
              </div>
              <div className="flex justify-start">
                <Button
                  asChild
                  className="h-[36px] px-4 py-2 gap-2 shadow-[0px_1px_2px_0px_#0000000D] hover:text-white"
                >
                  <Link href="/clinic-doctor-info">Update Details</Link>
                </Button>
              </div>
            </CardHeader>
          </Card>

          <Card className="w-full h-[248px] rounded-xl border border-border transition-shadow hover:shadow-lg">
            <CardHeader className="h-full flex flex-col justify-between">
              <div className="flex flex-col gap-3">
                <div className="w-fit rounded-full bg-primary/10 p-2">
                  <FileEdit className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-inter text-[20px] font-semibold leading-[28px] tracking-[-0.005em] text-left underline-offset-[from-font] decoration-skip-ink-none text-[#09090B]">
                  Update Drafts
                </CardTitle>
                <CardDescription className="font-inter text-[14px] font-normal leading-[20px] text-left underline-offset-[from-font] decoration-skip-ink-none text-[#71717A]">
                  Modify medical examination drafts and submit record
                </CardDescription>
              </div>
              <div className="flex justify-start">
                <Button
                  asChild
                  className="h-[36px] px-4 py-2 gap-2 shadow-[0px_1px_2px_0px_#0000000D] hover:text-white"
                >
                  <Link href="/records/edit">Update Drafts</Link>
                </Button>
              </div>
            </CardHeader>
          </Card>

          <Card className="w-full h-[248px] rounded-xl border border-border transition-shadow hover:shadow-lg">
            <CardHeader className="h-full flex flex-col justify-between">
              <div className="flex flex-col gap-3">
                <div className="w-fit rounded-full bg-primary/10 p-2">
                  <History className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-inter text-[20px] font-semibold leading-[28px] tracking-[-0.005em] text-left underline-offset-[from-font] decoration-skip-ink-none text-[#09090B]">
                  View History
                </CardTitle>
                <CardDescription className="font-inter text-[14px] font-normal leading-[20px] text-left underline-offset-[from-font] decoration-skip-ink-none text-[#71717A]">
                  Access past medical examination records
                </CardDescription>
              </div>
              <div className="flex justify-start">
                <Button
                  asChild
                  className="h-[36px] px-4 py-2 gap-2 shadow-[0px_1px_2px_0px_#0000000D] hover:text-white"
                >
                  <Link href="/records/history">View History</Link>
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-8">
          <RecordsTable title="Examination Records" excludeDrafts={false} />
        </div>
      </div>
    </div>
  );
}
