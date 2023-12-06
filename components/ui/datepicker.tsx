"use client"
 
import * as React from "react"
import { format, utcToZonedTime } from 'date-fns-tz';
import { Calendar as CalendarIcon } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date: Date | undefined;
  onChange: (date: Date | undefined) => void;
}
 
export function DatePicker({ onChange, date }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[200px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
            "bg-white border border-gray-300" 
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "EEE, dd MMM yyyy HH:mm:ss 'GMT'", { timeZone: 'GMT' }) : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}