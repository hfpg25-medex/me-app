import Link from "next/link"
import Image from "next/image"
import { CheckCircle2 } from 'lucide-react'

interface SubmissionDetailsProps {
  finNumber: string
  helperName: string
  referenceNumber: string
  submissionDateTime: string
}

export function AcknowledgementPage({finNumber, helperName, referenceNumber, submissionDateTime}: SubmissionDetailsProps){
  const submissionDetails: SubmissionDetailsProps = {
    finNumber: "G1234567A",
    helperName: "JUNAID** SULAIM**",
    referenceNumber: "6ME2108120001",
    submissionDateTime: "25 May 2021, 09:23am"
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f4]">
      {/* Header */}
      {/* <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src="/placeholder.svg"
                alt="A Singapore Government Website"
                width={20}
                height={20}
                className="h-5 w-5"
              />
              <span className="text-sm">A Singapore Government Website</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">Anthony Tan Ah Ming</span>
              <span className="text-sm text-gray-500">200104877H</span>
              <Link
                href="/logout"
                className="text-[#0072a3] hover:underline text-sm"
              >
                Log out
              </Link>
            </div>
          </div>
          <div className="mt-4">
            <Image
              src="/placeholder.svg"
              alt="Ministry of Manpower"
              width={150}
              height={50}
              className="h-12"
            />
          </div>
        </div>
      </header> */}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-2xl font-semibold mb-8">
          Submit medical examination results
        </h1>

        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 className="h-6 w-6 text-[#45bf00]" />
            <h2 className="text-xl font-semibold">
              Medical examination results submitted successfully
            </h2>
          </div>

          <div className="bg-[#f4faff] p-6 rounded-md mb-6">
            <dl className="grid grid-cols-[200px_1fr] gap-y-4">
              <dt className="text-gray-600">FIN of helper</dt>
              <dd>{submissionDetails.finNumber}</dd>
              
              <dt className="text-gray-600">Name of helper</dt>
              <dd>{submissionDetails.helperName}</dd>
              
              <dt className="text-gray-600">Reference number</dt>
              <dd>{submissionDetails.referenceNumber}</dd>
              
              <dt className="text-gray-600">Date and time submitted</dt>
              <dd>{submissionDetails.submissionDateTime}</dd>
            </dl>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Link
              href="/download-pdf"
              className="text-[#0072a3] hover:underline flex items-center gap-2"
            >
              Download acknowledgement and summary (PDF, ~100KB)
            </Link>
          </div>

          <p className="text-gray-600">
            If you need a record of this submission, download the PDF now. You will
            no longer have access to this submission after you leave this page.
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            What do you want to do next?
          </h2>
          <ul className="space-y-2">
            <li>
              <Link
                href="/new-submission/same"
                className="text-[#0072a3] hover:underline"
              >
                Start a new submission (same clinic and doctor details)
              </Link>
            </li>
            <li>
              <Link
                href="/new-submission/different"
                className="text-[#0072a3] hover:underline"
              >
                Start a new submission (different clinic and/or doctor details)
              </Link>
            </li>
            <li>
              <Link
                href="/submission-history"
                className="text-[#0072a3] hover:underline"
              >
                View submission history
              </Link>
            </li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      {/* <footer className="bg-[#1a1919] text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              <Link href="/report" className="hover:underline">
                Report vulnerability
              </Link>
              <Link href="/terms" className="hover:underline">
                Terms of use
              </Link>
              <Link href="/privacy" className="hover:underline">
                Privacy policy
              </Link>
              <Link href="/contact" className="hover:underline">
                Contact us
              </Link>
            </div>
            <div className="text-sm">
              Copyright © 2019 Government of Singapore.
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  )
}
