"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format, subMonths, subYears } from "date-fns";
import { CalendarIcon } from "lucide-react";
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

// Available statuses
const statuses = ["For Review", "Submitted", "Pending", "Draft"];

// Helper function to get badge color based on status
const getStatusBadgeColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "submitted":
      return "bg-green-100 text-green-800 hover:bg-green-100/80";
    case "for review":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80";
    case "pending":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100/80";
    case "draft":
      return "bg-violet-100 text-violet-800 hover:bg-violet-100/80";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
  }
};

// Helper function to format date for display
const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return format(date, "dd MMM yyyy");
};

interface RecordsTableProps {
  excludeDrafts?: boolean;
  showDraftsOnly?: boolean;
  title?: string;
}

export default function RecordsTable({
  excludeDrafts = false,
  showDraftsOnly = false,
  title = "Medical Examination Records",
}: RecordsTableProps) {
  const router = useRouter();
  const [records, setRecords] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState<
    [Date | undefined, Date | undefined]
  >([undefined, undefined]);

  useEffect(() => {
    fetchRecords();
  }, [currentPage, searchQuery, statusFilter, selectedDate]);

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: rowsPerPage.toString(),
        search: searchQuery,
      });

      if (excludeDrafts) {
        params.append("excludeDrafts", "true");
      }

      if (showDraftsOnly) {
        params.append("isDraft", "true");
      }

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      if (selectedDate[0] && selectedDate[1]) {
        // Set end date to end of day to include the entire day
        const endDate = new Date(selectedDate[1]);
        endDate.setHours(23, 59, 59, 999);
        params.set(
          "dateRange",
          `${selectedDate[0].toISOString()},${endDate.toISOString()}`
        );
      }

      const response = await fetch(`/api/records?${params.toString()}`);
      const data: RecordsResponse = await response.json();

      setRecords(data.records);
      setTotalPages(data.totalPages);
      setTotalRecords(data.total);
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Date range filter handlers
  const handleDateRangeSelect = (range: "year" | "3months" | "month") => {
    const endDate = new Date();
    let startDate: Date;

    switch (range) {
      case "year":
        startDate = subYears(endDate, 1);
        break;
      case "3months":
        startDate = subMonths(endDate, 3);
        break;
      case "month":
        startDate = subMonths(endDate, 1);
        break;
      default:
        return;
    }

    setSelectedDate([startDate, endDate]);
    setCurrentPage(1);
  };

  // Reset date range
  const clearDateRange = () => {
    setSelectedDate([undefined, undefined]);
    setCurrentPage(1);
  };

  const handleEditRecord = (record: Record) => {
    if (record.draftSubmissionId) {
      router.push(`/medical-exam/fme?draftId=${record.draftSubmissionId}`);
    } else {
      router.push(`/records/${record.id}`);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{title}</h2>

      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search records..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />

        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant={
            selectedDate[0] &&
            selectedDate[1] &&
            format(selectedDate[0], "yyyy") ===
              format(subYears(new Date(), 1), "yyyy") &&
            format(selectedDate[0], "MM/yyyy") !==
              format(subMonths(new Date(), 3), "MM/yyyy") &&
            format(selectedDate[0], "MM/yyyy") !==
              format(subMonths(new Date(), 1), "MM/yyyy")
              ? "default"
              : "outline"
          }
          className="whitespace-nowrap"
          onClick={() => handleDateRangeSelect("year")}
        >
          Past year
        </Button>
        <Button
          variant={
            selectedDate[0] &&
            selectedDate[1] &&
            format(selectedDate[0], "MM/yyyy") ===
              format(subMonths(new Date(), 3), "MM/yyyy")
              ? "default"
              : "outline"
          }
          className="whitespace-nowrap"
          onClick={() => handleDateRangeSelect("3months")}
        >
          Past 3 months
        </Button>
        <Button
          variant={
            selectedDate[0] &&
            selectedDate[1] &&
            format(selectedDate[0], "MM/yyyy") ===
              format(subMonths(new Date(), 1), "MM/yyyy")
              ? "default"
              : "outline"
          }
          className="whitespace-nowrap"
          onClick={() => handleDateRangeSelect("month")}
        >
          Past 1 month
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !selectedDate[0] && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate[0] && selectedDate[1]
                ? `${format(selectedDate[0], "dd/MM/yy")} - ${format(
                    selectedDate[1],
                    "dd/MM/yy"
                  )}`
                : "Custom range"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={{
                from: selectedDate[0],
                to: selectedDate[1],
              }}
              onSelect={(range) => {
                setSelectedDate([range?.from, range?.to]);
                setCurrentPage(1);
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Foreigner ID</TableHead>
              <TableHead>Date Created</TableHead>
              <TableHead>Last Update</TableHead>
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
                <TableCell colSpan={10} className="text-center py-8">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  No records found
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
                      <Button
                        variant="outline"
                        onClick={() => handleEditRecord(record)}
                      >
                        {record.draftSubmissionId ? "Continue" : "View"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-4 border-t gap-4">
          <div className="text-sm text-gray-500">
            {records.length} of {totalRecords} row(s)
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm whitespace-nowrap">Rows per page</span>
              <Select
                value={rowsPerPage.toString()}
                onValueChange={(value) => {
                  setRowsPerPage(Number.parseInt(value));
                  setCurrentPage(1);
                }}
                disabled={isLoading}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
              <span className="text-sm whitespace-nowrap">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1 || isLoading}
                >
                  {"<<"}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    setCurrentPage((curr) => Math.max(1, curr - 1))
                  }
                  disabled={currentPage === 1 || isLoading}
                >
                  {"<"}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    setCurrentPage((curr) => Math.min(totalPages, curr + 1))
                  }
                  disabled={currentPage === totalPages || isLoading}
                >
                  {">"}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages || isLoading}
                >
                  {">>"}
                </Button>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
