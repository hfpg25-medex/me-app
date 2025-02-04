"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SelectExamPage() {
  const [filter, setFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const examTypes = [
    {
      title: "Six-monthly Medical Exam for Migrant Domestic Workers",
      description: "MOM",
      href: "/medical-exam/mdw",
    },
    {
      title: "Full Medical Exam for Foreign Workers",
      description: "MOM",
      href: "/medical-exam/fme",
    },
    {
      title: "Six-monthly Medical Exam for Female Migrant Workers",
      description: "MOM",
      href: "/medical-exam/fmw",
    },
    {
      title: "Medical Exam for Aged Drivers 65 Years Old and Above",
      description: "SPF",
      href: "/medical-exam/aged-drivers",
    },
    {
      title: "Medical Exam for Vocational Driving Licenses",
      description: "LTA",
      href: "/medical-exam/vocational-drivers",
    },
    {
      title: "Medical Exam for Permanant Residency Application",
      description: "ICA",
      href: "/medical-exam/pr",
    },
  ].filter(
    (exam) =>
      (filter === "" || exam.description === filter) &&
      (searchTerm === "" ||
        exam.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-[1376px] mx-auto px-8 sm:px-12 md:px-16 lg:px-8 w-full pt-4 sm:pt-6 md:pt-8 lg:pt-10 pb-8 sm:pb-12 md:pb-16 lg:pb-20">
        <h1 className="text-4xl font-bold tracking-tight mb-6">
          Select Medical Examination
        </h1>
        <div className="flex justify-between mb-8">
          <div className="ml-auto flex items-center gap-2">
            <input
              type="text"
              placeholder="Search by title"
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded p-2 w-64 h-10"
            />
            <select
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded p-2 w-24 h-10"
              defaultValue=""
            >
              <option value="">All</option>
              <option value="MOM">MOM</option>
              <option value="SPF">SPF</option>
              <option value="LTA">LTA</option>
              <option value="ICA">ICA</option>
            </select>
            <Button onClick={() => setFilter("")}>Clear Filter</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 xl:gap-8">
          {examTypes.map((exam, index) => (
            <Card
              key={index}
              className="w-full h-[356px] rounded-xl border border-border transition-shadow hover:shadow-lg"
            >
              <CardHeader className="h-full flex flex-col justify-between">
                <div className="flex flex-col gap-3">
                  <div className="w-fit rounded-full bg-primary/10 p-2">
                    <ClipboardList className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-inter text-[20px] font-semibold leading-[28px] tracking-[-0.005em] text-left underline-offset-[from-font] decoration-skip-ink-none text-[#09090B]">
                    {exam.title}
                  </CardTitle>
                  <CardDescription className="font-inter text-[14px] font-normal leading-[20px] text-left underline-offset-[from-font] decoration-skip-ink-none text-[#71717A]">
                    {exam.description}
                  </CardDescription>
                </div>
                <div className="flex justify-start">
                  <Button
                    asChild
                    className="h-[36px] px-4 py-2 gap-2 shadow-[0px_1px_2px_0px_#0000000D] hover:text-white"
                  >
                    <Link href={exam.href}>Start Submission</Link>
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
