"use client";
import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DateFilterProps {
  filterDates: { start: string; end: string };
  setFilterDates: (dates: { start: string; end: string }) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({
  filterDates,
  setFilterDates,
}) => {
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  const parseDate = (dateStr: string) => (dateStr ? parseISO(dateStr) : null);

  const formatLocalDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 rounded text-[#99aabb]">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Start:</label>

        <Popover open={startOpen} onOpenChange={setStartOpen}>
          <PopoverTrigger>
            <Button
              onClick={() => setStartOpen(!startOpen)}
              className={cn(
                "w-56 justify-start text-left font-normal border border-[#99aabb] hover:bg-white/5 hover:text-white",
                !filterDates.start && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filterDates.start ? (
                format(parseDate(filterDates.start)!, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              defaultMonth={parseDate(filterDates.start) || undefined}
              selected={parseDate(filterDates.start) || undefined}
              initialFocus
              onSelect={(date) => {
                if (date) {
                  setFilterDates({
                    ...filterDates,
                    start: formatLocalDate(date),
                  });
                } else {
                  setFilterDates({ ...filterDates, start: "" });
                }
                setStartOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">End:</label>
        <Popover open={endOpen} onOpenChange={setEndOpen}>
          <PopoverTrigger>
            <Button
              onClick={() => setEndOpen(!endOpen)}
              className={cn(
                "w-56 justify-start text-left font-normal border border-[#99aabb] hover:bg-white/5 hover:text-white",
                !filterDates.end && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filterDates.end ? (
                format(parseDate(filterDates.end)!, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              defaultMonth={parseDate(filterDates.end) || undefined}
              selected={parseDate(filterDates.end) || undefined}
              initialFocus
              onSelect={(date) => {
                if (date) {
                  setFilterDates({
                    ...filterDates,
                    end: formatLocalDate(date),
                  });
                } else {
                  setFilterDates({ ...filterDates, end: "" });
                }
                setEndOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DateFilter;
