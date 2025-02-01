import Link from "next/link"
import { Download, CheckCircle2 as CheckCircle } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from "react";

interface SubmissionDetailsProps {
  finNumber: string
  helperName: string
  referenceNumber: string
  submissionDateTime: string
}

export function AcknowledgementPage({finNumber, helperName}: SubmissionDetailsProps){

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []); // Empty dependency array means this runs once on mount
  
  const submissionDateTime = new Date().toLocaleString('en-GB', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric', 
    hour: 'numeric', 
    minute: 'numeric', 
    hour12: true 
}).replace(',', '').replace(' ', ' ')

function generateReferenceNumber(): string {
  return uuidv4(); // Generates a new UUID
}

const referenceNumber = generateReferenceNumber();

  return (
      <div className="mx-auto p-6 max-w-[760px]">
        <Card className="mb-4 shadow-md hover:shadow-lg transition-shadow">
        <CardContent>
          <div className="flex items-center mb-2 mt-6">
            <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
            <div className="text-xl font-semibold align-middle">
              Medical examination results submitted successfully
            </div>
          </div>

          <div className="p-4 rounded-md text-sm">
            <dl className="grid grid-cols-[200px_1fr] gap-y-1">
              <dt className="text-gray-600">FIN of person</dt>
              <dd>{finNumber}</dd>
              
              <dt className="text-gray-600">Name of person</dt>
              <dd>{helperName}</dd>
              
              <dt className="text-gray-600">Reference number</dt>
              <dd>{referenceNumber}</dd>
              
              <dt className="text-gray-600">Date and time submitted</dt>
              <dd>{submissionDateTime}</dd>
            </dl>
          </div>

          <div className="flex items-center gap-2 mb-2 pl-6">
          <Download className="h-4 w-4 text-blue-600 mr-1" />
            <Link
              href="/download-pdf"
              className="text-blue-600 no-underline hover:underline flex items-center gap-2"
            >
              Download acknowledgement and summary (PDF, ~100KB)
            </Link>
          </div>

          {/* <p className="text-gray-600">
            If you need a record of this submission, download the PDF now. You will
            no longer have access to this submission after you leave this page.
          </p> */}
        {/* </div> */}
        {/* </div> */}
        </CardContent>
        </Card>
        <Card className="mb-4 shadow-md hover:shadow-lg transition-shadow ">
        <CardContent>
          <h2 className="text-xl font-semibold mb-4 mt-4">
            What do you want to do next?
          </h2>
          <ul className="space-y-2 list-disc">
            <li>
              <Link
                href="/new-submission/same"
                className="text-blue-600 no-underline hover:underline"
              >
                Start a new submission (same clinic and doctor details)
              </Link>
            </li>
            <li>
              <Link
                href="/new-submission/different"
                className="text-blue-600 no-underline hover:underline"
              >
                Start a new submission (different clinic and/or doctor details)
              </Link>
            </li>
            <li>
              <Link
                href="/medical-exam/select"
                className="text-blue-600 no-underline hover:underline"
              >
                Start a new submission (different medical exam type)
              </Link>
            </li>
            <li>
              <Link
                href="/submission-history"
                className="text-blue-600 no-underline hover:underline"
              >
                View submission history
              </Link>
            </li>
          </ul>
        </CardContent>
        </Card>
      </div>
  )
}
