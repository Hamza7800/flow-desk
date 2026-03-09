"use client";

import { Calendar, DateField, DatePicker, Label } from "@heroui/react";
import type { DateValue } from "@heroui/react";
import {
  parseDate,
  getLocalTimeZone,
  CalendarDate,
} from "@internationalized/date";
import { format } from "date-fns";

type DateSelectProps = {
  value?: string | Date | null;
  onChange: (date: string | undefined) => void;
};

const DateSelect = ({ value, onChange }: DateSelectProps) => {
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

  return (
    <DatePicker
      className="w-full"
      value={toCalendarDate(value)}
      onChange={handleChange}
      aria-label="Date select"
    >
      <DateField.Group className="flex items-center gap-2 rounded-md border bg-transparent px-2 py-1">
        <DateField.Input className="flex-1 text-sm outline-none">
          {(segment) => <DateField.Segment segment={segment} />}
        </DateField.Input>
        <DateField.Suffix>
          <DatePicker.Trigger>
            <DatePicker.TriggerIndicator />
          </DatePicker.Trigger>
        </DateField.Suffix>
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
