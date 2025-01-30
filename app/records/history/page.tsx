"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format, subMonths, subYears, parseISO, isWithinInterval } from "date-fns"
import { CalendarIcon, MoreHorizontal, Plus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// interface Record {
//   id: string
//   foreignerId: string
//   dateCreated: string
//   lastUpdate: string
//   agency: string
//   type: string
//   name: string
//   status: string
//   pending: string
// }

// Function to generate a random ID
const generateForeignerId = () => {
  const letters = "FGST"
  const firstLetter = letters[Math.floor(Math.random() * letters.length)]
  const numbers = Math.floor(Math.random() * 9000000) + 1000000
  const lastLetter = "XNFM"[Math.floor(Math.random() * 4)]
  return `${firstLetter}${numbers}${lastLetter}`
}

// List of sample names
const sampleNames = [
  "Tan Wei Ming",
  "Muhammad Ismail",
  "Rajesh Kumar",
  "Liu Mei Ling", 
  "Siti Nurhaliza",
  "Zhang Wei",
  "Priya Sharma",
  "Abdullah Rahman",
  "Wong Mei Fen",
  "Suresh Patel",
  "Nurul Huda",
  "Chen Xiao Ming",
  "Deepa Krishnan",
  "Ahmad Yusof",
  "Li Wei",
  "Kavitha Raj",
  "Zainab Binti Ali",
  "Lim Ah Beng",
  "Ramesh Singh",
  "Fatimah Abdullah"
]


// List of statuses
const statuses = ["For Review", "Submitted", "Pending"]

// Generate sample data with different dates, IDs, and statuses
const generateRecords = () => {
  return Array(100)
    .fill(null)
    .map((_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 365)) // Random date within the last year
      const dateString = format(date, "yyyy-MM-dd HH:mm")
      return {
        id: `${i}`,
        foreignerId: generateForeignerId(),
        dateCreated: dateString,
        lastUpdate: dateString,
        agency: "MOM",
        type: "Migrant workers work permit",
        name: sampleNames[Math.floor(Math.random() * sampleNames.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        pending: "3 / 3",
      }
    })
}

const allRecords = generateRecords()

export default function ExaminationRecords() {
  const [selectedDate, setSelectedDate] = useState<[Date | undefined, Date | undefined]>([undefined, undefined])
  const [selectedRecords, setSelectedRecords] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter records based on date range, search query, and status
  const filteredRecords = useMemo(() => {
    return allRecords.filter((record) => {
      const recordDate = parseISO(record.dateCreated)

      // If we have a date range, filter by it
      if (selectedDate[0] && selectedDate[1]) {
        if (
          !isWithinInterval(recordDate, {
            start: selectedDate[0],
            end: selectedDate[1],
          })
        ) {
          return false
        }
      }

      // Filter by search query
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase()
        if (
          !(
            record.name.toLowerCase().includes(searchLower) ||
            record.foreignerId.toLowerCase().includes(searchLower) ||
            record.type.toLowerCase().includes(searchLower) ||
            record.agency.toLowerCase().includes(searchLower)
          )
        ) {
          return false
        }
      }

      // Filter by status
      if (statusFilter !== "all" && record.status !== statusFilter) {
        return false
      }

      return true
    })
  }, [selectedDate, searchQuery, statusFilter])

  // Calculate pagination
  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage)
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  // Date range filter handlers
  const handleDateRangeSelect = (range: "year" | "3months" | "month") => {
    const endDate = new Date()
    let startDate: Date

    switch (range) {
      case "year":
        startDate = subYears(endDate, 1)
        break
      case "3months":
        startDate = subMonths(endDate, 3)
        break
      case "month":
        startDate = subMonths(endDate, 1)
        break
      default:
        return
    }

    setSelectedDate([startDate, endDate])
    setCurrentPage(1)
  }

  // Reset date range
  const clearDateRange = () => {
    setSelectedDate([undefined, undefined])
    setCurrentPage(1)
  }

  // Function to get badge color based on status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "For Review":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "Submitted":
        return "bg-green-50 text-green-700 border-green-200"
      case "Pending":
        return "bg-blue-50 text-blue-700 border-blue-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Examination Records</h1>
        <Button className="bg-black hover:bg-black/90">
          <Plus className="mr-2 h-4 w-4" />
          New Clinical Exam
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search records"
          className="max-w-xs"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentPage(1)
          }}
        />
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value)
            setCurrentPage(1)
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
          format(selectedDate[0], "yyyy") === format(subYears(new Date(), 1), "yyyy") &&
          format(selectedDate[0], "MM/yyyy") !== format(subMonths(new Date(), 3), "MM/yyyy") &&
          format(selectedDate[0], "MM/yyyy") !== format(subMonths(new Date(), 1), "MM/yyyy")
            ? "default"
            : "outline"
        }
        onClick={() => handleDateRangeSelect("year")}
      >
        Past year
      </Button>
        <Button
          variant={
            selectedDate[0] &&
            selectedDate[1] &&
            format(selectedDate[0], "MM/yyyy") === format(subMonths(new Date(), 3), "MM/yyyy")
              ? "default"
              : "outline"
          }
          onClick={() => handleDateRangeSelect("3months")}
        >
          Past 3 months
        </Button>
        <Button
          variant={
            selectedDate[0] &&
            selectedDate[1] &&
            format(selectedDate[0], "MM/yyyy") === format(subMonths(new Date(), 1), "MM/yyyy")
              ? "default"
              : "outline"
          }
          onClick={() => handleDateRangeSelect("month")}
        >
          Past 1 month
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("justify-start text-left font-normal", !selectedDate[0] && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate[0] && selectedDate[1]
                ? `${format(selectedDate[0], "MM/dd/yy")} - ${format(selectedDate[1], "MM/dd/yy")}`
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
                setSelectedDate([range?.from, range?.to])
                setCurrentPage(1)
              }}
              numberOfMonths={2}
              initialFocus
            />
            {selectedDate[0] && (
              <Button variant="ghost" className="w-full" onClick={clearDateRange}>
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
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedRecords.length === paginatedRecords.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedRecords(paginatedRecords.map((r) => r.id))
                    } else {
                      setSelectedRecords([])
                    }
                  }}
                />
              </TableHead>
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
            {paginatedRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedRecords.includes(record.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedRecords([...selectedRecords, record.id])
                      } else {
                        setSelectedRecords(selectedRecords.filter((id) => id !== record.id))
                      }
                    }}
                  />
                </TableCell>
                <TableCell>{record.foreignerId}</TableCell>
                <TableCell>{record.dateCreated}</TableCell>
                <TableCell>{record.lastUpdate}</TableCell>
                <TableCell>{record.agency}</TableCell>
                <TableCell>{record.type}</TableCell>
                <TableCell>{record.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusBadgeColor(record.status)}>
                    {record.status}
                  </Badge>
                </TableCell>
                <TableCell>{record.pending}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center gap-2">
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Download</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between px-4 py-4 border-t">
          <div className="text-sm text-gray-500">
            {selectedRecords.length} of {filteredRecords.length} row(s) selected
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">Rows per page</span>
              <Select
                value={rowsPerPage.toString()}
                onValueChange={(value) => {
                  setRowsPerPage(Number.parseInt(value))
                  setCurrentPage(1)
                }}
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
            <div className="flex items-center gap-2">
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  {"<<"}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage((curr) => Math.max(1, curr - 1))}
                  disabled={currentPage === 1}
                >
                  {"<"}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage((curr) => Math.min(totalPages, curr + 1))}
                  disabled={currentPage === totalPages}
                >
                  {">"}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  {">>"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

