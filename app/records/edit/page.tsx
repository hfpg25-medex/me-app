"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Types
type Record = {
  id: string;
  foreignerId: string;
  dateCreated: string;
  lastUpdate: string;
  agency: string;
  type: string;
  name: string;
  status: string;
  pending: string;
  draftSubmissionId?: string;
};

type RecordsResponse = {
  records: Record[];
  total: number;
  page: number;
  totalPages: number;
};

// Helper function to get badge color based on status
function getStatusBadgeColor(status: string) {
  switch (status.toLowerCase()) {
    case "for review":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "submitted":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "pending":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
}

// Helper function to format date for display
function formatDate(dateString: string) {
  try {
    return format(new Date(dateString), "MMM d, yyyy h:mm a");
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}

export default function EditRecordsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [records, setRecords] = useState<Record[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch records from the API
  const fetchRecords = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: rowsPerPage.toString(),
        search: searchQuery,
        isDraft: "true", // Only fetch draft records
      });

      const response = await fetch(`/api/records?${params}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch records");
      }

      const data: RecordsResponse = await response.json();
      setRecords(data.records);
      setTotalRecords(data.total);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch records when component mounts or when search/pagination changes
  useEffect(() => {
    fetchRecords();
  }, [currentPage, searchQuery]);

  return (
    <div className="container mx-auto px-3 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          Update Medical Records Drafts
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          placeholder="Search records"
          className="max-w-xs"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date created</TableHead>
              <TableHead>Last update</TableHead>
              <TableHead>Agency</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Pending</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  No draft records found
                </TableCell>
              </TableRow>
            ) : (
              records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.foreignerId}</TableCell>
                  <TableCell>{formatDate(record.dateCreated)}</TableCell>
                  <TableCell>{formatDate(record.lastUpdate)}</TableCell>
                  <TableCell>{record.agency}</TableCell>
                  <TableCell>{record.type}</TableCell>
                  <TableCell>{record.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusBadgeColor(record.status)}
                    >
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{record.pending}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      {/* <Button
                        variant="outline"
                        onClick={() => router.push(`/records/${record.id}`)}
                      >
                        View
                      </Button> */}
                      <Button
                        onClick={() => {
                          // Redirect to FME form with draft ID for editing
                          if (record.draftSubmissionId) {
                            router.push(
                              `/medical-exam/fme?draftId=${record.draftSubmissionId}`
                            );
                          }
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {!isLoading && records.length > 0 && (
          <div className="flex justify-between items-center px-4 py-4 border-t">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
              {Math.min(currentPage * rowsPerPage, totalRecords)} of{" "}
              {totalRecords} records
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
