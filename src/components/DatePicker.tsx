"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  placeHolder?: string;
  className?: string;
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
  popoverClassName?: string;
}

export function DatePicker({
  placeHolder = "Pick a date",
  className,
  value,
  onChange,
  side = "bottom",
  sideOffset = 4,
  popoverClassName,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>{placeHolder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("w-auto p-4", popoverClassName)}
        side={side}
        sideOffset={sideOffset}
      >
        <Calendar
          mode="single"
          selected={value || undefined}
          onSelect={(newValue) => {
            onChange?.(newValue ?? null);
            setOpen(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
