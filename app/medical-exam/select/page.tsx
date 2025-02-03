"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Select Medical Examination</h1>
      <div className="flex justify-between mb-4">
        <div className="ml-auto flex items-center">
          <input
            type="text"
            placeholder="Search by title"
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded p-2 mr-2 w-64 h-10"
          />
          <select
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded p-2 mr-2 w-24 h-10"
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {examTypes.map((exam, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mb-2 w-fit rounded-full bg-primary/10 p-2">
                <ClipboardList className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">{exam.title}</CardTitle>
              <CardDescription>{exam.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full hover:text-white">
                <Link href={exam.href}>Start Submission</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
