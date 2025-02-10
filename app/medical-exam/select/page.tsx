"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function SelectExamPage() {
  const [filter, setFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const examTypes = [
    {
      title: "Migrant Domestic Workers",
      description: "6-monthly medical exam - MOM",
      href: "/medical-exam/mdw",
      agency: "MOM",
      icon: "/fdw.svg",
    },
    {
      title: "Migrant Workers",
      description: "Full medical exam - MOM",
      href: "/medical-exam/fme",
      agency: "MOM",
      icon: "/mw.svg",
    },
    {
      title: "Female Migrant Workers",
      description: "6-monthly medical exam - MOM",
      href: "/medical-exam/fmw",
      agency: "MOM",
      icon: "/fmw.svg",
    },
    {
      title: "Drivers aged 65 and above",
      description: "Medical exam for drivers aged 65 and above - SPF",
      href: "/medical-exam/aged-drivers",
      agency: "SPF",
      icon: "/aged-driver.svg",
    },
    {
      title: "Vocational Drivers",
      description: "Medical exam for vocational driving licenses - LTA",
      href: "/medical-exam/vocational-drivers",
      agency: "LTA",
      icon: "/vocational-driver.svg",
    },
    {
      title: "PR Applications",
      description: "Medical exam for permanant residency applications - ICA",
      href: "/medical-exam/pr",
      agency: "ICA",
      icon: "/pr.svg",
    },
  ].filter(
    (exam) =>
      (filter === "" || exam.agency === filter) &&
      (searchTerm === "" ||
        exam.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 w-full pt-4 sm:pt-6 md:pt-8 lg:pt-10 pb-8 sm:pb-12 md:pb-16 lg:pb-20">
        <h1 className="text-4xl font-bold tracking-tight mb-6">
          Select Medical Examination
        </h1>
        <div className="flex flex-col sm:flex-row sm:justify-between mb-8 gap-2">
          <div className="flex flex-col sm:flex-row sm:ml-auto items-stretch sm:items-center gap-2">
            <input
              type="text"
              placeholder="Search by title"
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded p-2 w-full sm:w-64 h-10"
            />
            <select
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded p-2 w-full sm:w-24 h-10"
              defaultValue=""
            >
              <option value="">All</option>
              <option value="MOM">MOM</option>
              <option value="SPF">SPF</option>
              <option value="LTA">LTA</option>
              <option value="ICA">ICA</option>
            </select>
            {/* <Button onClick={() => setFilter("")} className="w-full sm:w-auto">
              Clear Filter
            </Button> */}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 xl:gap-8">
          {examTypes.map((exam, index) => (
            <Card
              key={index}
              className="w-full h-[356px] rounded-xl border border-border transition-shadow hover:shadow-lg"
            >
              <CardHeader className="h-full flex flex-col justify-between">
                <div className="w-[148px] h-[148px]">
                  <Image
                    src={exam.icon}
                    alt={exam.title}
                    width={148}
                    height={148}
                    className="w-full h-auto"
                  />
                </div>
                <CardTitle className="font-inter text-[20px] font-semibold leading-[28px] tracking-[-0.005em] text-left underline-offset-[from-font] decoration-skip-ink-none text-[#09090B]">
                  {exam.title}
                </CardTitle>
                <CardDescription className="font-inter text-[14px] font-normal leading-[20px] text-left underline-offset-[from-font] decoration-skip-ink-none text-[#71717A]">
                  {exam.description}
                </CardDescription>
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
      </div>
    </div>
  );
}
