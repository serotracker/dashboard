"use client";

import * as React from "react";
import { format, utcToZonedTime } from "date-fns-tz";
import { Calendar as CalendarIcon, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date: Date | undefined;
  labelText: string;
  onChange: (date: Date | undefined) => void;
  clearDateFilter: () => void;
}

export function DatePicker({
  onChange,
  date,
  labelText,
  clearDateFilter,
}: DatePickerProps) {
  // Added state variable to control the visibility of the calendar modal
  const [isCalendarOpen, setCalendarOpen] = React.useState(false);

  // Check if date is a valid Date object
  const isValidDate = date instanceof Date && !isNaN(date.getTime());

  // Function to handle date selection
  const handleDateSelect = (selectedDate: Date | undefined) => {
    onChange(selectedDate);
    setCalendarOpen(false); // Close the calendar modal after date selection
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          onClick={() => setCalendarOpen(true)} // Open the calendar modal
          variant={"outline"}
          className={cn(
            "w-full justify-between text-left font-normal",
            !date && "text-muted-foreground",
            "bg-white border border-gray-300"
          )}
        >
          <div className="flex justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {isValidDate ? (
              format(date, "EEE, dd MMM yyyy", { timeZone: "GMT" })
            ) : (
              <span> {labelText} </span>
            )}
          </div>
          <XCircle
            onClick={(event) => {
              event.stopPropagation();
              clearDateFilter();
            }}
            className={date ? "" : "hidden"}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        {isCalendarOpen && ( // Render the calendar only if isCalendarOpen is true
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect} // Call handleDateSelect when a date is selected
            initialFocus
          />
        )}
      </PopoverContent>
    </Popover>
  );
}