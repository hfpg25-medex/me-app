'use client'

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "./label"

interface DatepickerProps {
  date?: Date
  onSelect: (date: Date | undefined) => void
  label?: string
  disabled?: (date: Date) => boolean
}

export function Datepicker({ date, onSelect, label, disabled }: DatepickerProps) {
  return (
    <div>
      <div>{label && <Label className="inline-block mb-2">{label}</Label>}</div>
      <div><Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] pl-3 text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onSelect}
            disabled={disabled}
            initialFocus
            modifiers={{ today: new Date() }}
            modifiersStyles={{ today: { fontWeight: 'bold', textDecoration: 'underline' } }}
          />
        </PopoverContent>
      </Popover>
      </div>
    </div>
  )
}