"use client";

import { Calendar, DateField, DatePicker } from "@heroui/react";
import type { DateValue } from "@heroui/react";
import {
  parseDate,
  getLocalTimeZone,
  CalendarDate,
} from "@internationalized/date";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

type DateSelectProps = {
  value?: string | Date | null;
  onChange: (date: string | undefined) => void;
  placeholderText?: string;
};

const DateSelect = ({ value, onChange, placeholderText }: DateSelectProps) => {
  const toCalendarDate = (val?: string | Date | null): CalendarDate | null => {
    if (!val) return null;
    try {
      // Take only the date portion — avoids timezone shifts and invalid formats
      const iso =
        val instanceof Date
          ? format(val, "yyyy-MM-dd")
          : (val as string).slice(0, 10); // "2026-03-05 18:00:00" → "2026-03-05"

      return parseDate(iso); // CalendarDate is date-only, no time needed
    } catch {
      return null;
    }
  };

  const handleChange = (heroValue: DateValue | null) => {
    if (!heroValue) {
      onChange(undefined);
      return;
    }

    const jsDate = heroValue.toDate(getLocalTimeZone());

    const dbFormat = format(jsDate, "yyyy-MM-dd HH:mm:ss");
    onChange(dbFormat);
  };

  const calendarDate = toCalendarDate(value);

  const displayLabel = calendarDate
    ? format(calendarDate.toDate(getLocalTimeZone()), "MMM d")
    : placeholderText;

  return (
    <DatePicker
      value={calendarDate as DateValue | null}
      onChange={handleChange}
      aria-label="Date select"
    >
      <DateField.Group className="flex items-center rounded-md bg-transparent px-2 hover:bg-zinc-800 data-[pressed]:bg-zinc-800">
        <DatePicker.Trigger>
          <div className="flex items-center gap-2">
            <CalendarIcon size={15} />
            {placeholderText && <h2>{displayLabel}</h2>}
          </div>
        </DatePicker.Trigger>
      </DateField.Group>

      <DatePicker.Popover placement="bottom left" className={"min-w-[250px]"}>
        <Calendar aria-label="Choose date" className="w-full rounded-lg">
          <Calendar.Header className="flex items-center justify-between pb-4">
            <Calendar.YearPickerTrigger className="flex items-center gap-1 font-medium">
              <Calendar.YearPickerTriggerHeading />
              <Calendar.YearPickerTriggerIndicator />
            </Calendar.YearPickerTrigger>
            <div className="flex gap-1">
              <Calendar.NavButton slot="previous" />
              <Calendar.NavButton slot="next" />
            </div>
          </Calendar.Header>
          <Calendar.Grid className="border-collapse">
            <Calendar.GridHeader>
              {(day) => (
                <Calendar.HeaderCell className="pb-2 text-xs font-normal text-zinc-500">
                  {day}
                </Calendar.HeaderCell>
              )}
            </Calendar.GridHeader>
            <Calendar.GridBody>
              {(date) => <Calendar.Cell date={date} className="p-1" />}
            </Calendar.GridBody>
          </Calendar.Grid>
        </Calendar>
      </DatePicker.Popover>
    </DatePicker>
  );
};

export default DateSelect;
