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
const statuses = ["For Review", "Submitted", "Pending"];

// Helper function to get badge color based on status
// const getStatusBadgeColor = (status: string) => {
//   switch (status) {
//     case "For Review":
//       return "bg-yellow-100 text-yellow-800 border-yellow-200";
//     case "Submitted":
//       return "bg-green-100 text-green-800 border-green-200";
//     case "Pending":
//       return "bg-blue-100 text-blue-800 border-blue-200";
//     default:
//       return "";
//   }
// };

// Helper function to format date for display
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return format(date, "MMM dd, yyyy HH:mm");
  } catch (error) {
    console.log(error);
    return dateString;
  }
};

export default function ExaminationRecords() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<
    [Date | undefined, Date | undefined]
  >([undefined, undefined]);
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
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
      });

      if (statusFilter !== "all") {
        params.set("status", statusFilter);
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
      // You might want to add a toast notification here
      setRecords([]);
      setTotalRecords(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch records when filters change
  useEffect(() => {
    fetchRecords();
  }, [currentPage, searchQuery, statusFilter, selectedDate]);

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

  // Function to get badge color based on status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "For Review":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Submitted":
        return "bg-green-50 text-green-700 border-green-200";
      case "Pending":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Draft":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="container mx-auto px-3 w-full pt-8 pb-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Examination Records</h1>
        {/* <Button className="bg-black hover:bg-black/90">
          <Plus className="mr-2 h-4 w-4" />
          New Medical Examination
        </Button> */}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 overflow-x-auto">
        <Input
          placeholder="Search records"
          className="max-w-xs"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
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
                ? `${format(selectedDate[0], "MM/dd/yy")} - ${format(
                    selectedDate[1],
                    "MM/dd/yy"
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
              initialFocus
            />
            {selectedDate[0] && (
              <Button
                variant="ghost"
                className="w-full"
                onClick={clearDateRange}
              >
                Clear Range
              </Button>
            )}
          </PopoverContent>
        </Popover>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {/* <TableHead className="w-12"> */}
              {/* <Checkbox
                  checked={selectedRecords.length === records.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedRecords(records.map((r) => r.id));
                    } else {
                      setSelectedRecords([]);
                    }
                  }}
                  disabled={isLoading}
                /> */}
              {/* </TableHead> */}
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
                  {/* <TableCell>
                    <Checkbox
                      checked={selectedRecords.includes(record.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedRecords([...selectedRecords, record.id]);
                        } else {
                          setSelectedRecords(
                            selectedRecords.filter((id) => id !== record.id)
                          );
                        }
                      }}
                    />
                  </TableCell> */}
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
                        size="sm"
                        onClick={() => {
                          if (record.status === "For Review") {
                            // Handle review action
                          } else if (record.status === "Draft" && 'draftSubmissionId' in record) {
                            // For draft records, redirect to FME form with draft ID
                            router.push(`/medical-exam/fme?draftId=${record.draftSubmissionId}`);
                          } else {
                            router.push(`/records/${record.id}`);
                          }
                        }}
                      >
                        {record.status === "For Review"
                          ? "Review"
                          : record.status === "Draft"
                            ? "Continue"
                            : "View"}
                      </Button>
                      {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              window.open(
                                `/api/records/${record.id}/pdf`,
                                "_blank"
                              )
                            }
                          >
                            Download PDF
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu> */}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-4 border-t gap-4">
          <div className="text-sm text-gray-500">
            {selectedRecords.length} of {totalRecords} row(s) selected
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
    </div>
  );
}
