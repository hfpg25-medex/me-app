import { Check } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface SubmissionDetailsProps {
  finNumber: string;
  helperName: string;
  referenceNumber: string;
  submissionDateTime: string;
}

export function AcknowledgementPage({
  finNumber,
  helperName,
  referenceNumber,
}: SubmissionDetailsProps) {
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []); // Empty dependency array means this runs once on mount

  const submissionDateTime = new Date()
    .toLocaleString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
    .replace(",", "")
    .replace(" ", " ");

  return (
    <div className="container mx-auto grid gap-6 md:grid-cols-[2fr,1fr] px-3 w-full pt-4 pb-16">
      <div className="my-6">
        <div className="mb-4 p-4 border rounded-md shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mr-2">
              <Check className="h-3.5 w-3.5 text-white" />
            </div>
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

          {/* <div className="flex items-center pl-6">
          <Download className="h-4 w-4 text-blue-600 mr-1" />
          <Link
            href="/download-pdf"
            className="text-blue-600 no-underline flex items-center gap-2"
          >
            Download acknowledgement and summary
          </Link>
          <span className="text-gray-500">(PDF, ~100KB)</span>
        </div> */}

          {/* <p className="text-gray-600">
            If you need a record of this submission, download the PDF now. You will
            no longer have access to this submission after you leave this page.
          </p> */}
          {/* </div> */}
          {/* </div> */}
        </div>
        <div className="border rounded-md shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold pl-6 mb-4 mt-4">
            What do you want to do next?
          </h2>
          <ul className="space-y-2 list-disc !ml-4 pl-4 pb-4">
            {/* <li>
            <button
              onClick={() => router.push(window.location.pathname)}
              className="text-blue-600 no-underline bg-transparent border-0 p-0 cursor-pointer"
            >
              Start a new submission (same medical exam type)
            </button>
          </li> */}
            <li>
              <Link
                href="/medical-exam/select"
                className="text-blue-600 no-underline"
              >
                Start a new submission
              </Link>
            </li>
            <li>
              <Link
                href="/records/history"
                className="text-blue-600 no-underline"
              >
                View submission history
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
