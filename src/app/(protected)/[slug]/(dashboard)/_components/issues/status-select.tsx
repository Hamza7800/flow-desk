import { STATUS_OPTIONS } from "@/lib/contants";
import type { SelectProps } from "@/lib/types";
import { Label, ListBox, Select } from "@heroui/react";

const StatusSelect = ({ value, onChange }: SelectProps) => {
  const currentStatus = STATUS_OPTIONS.find((s) => s.key === value);

  return (
    <Select
      placeholder="Select Status"
      value={currentStatus?.key}
      onChange={(value) => {
        onChange(value as string);
      }}
    >
      <Label>Status</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {STATUS_OPTIONS.map((status) => (
            <ListBox.Item
              key={status.key}
              id={status.key}
              textValue={status.label}
            >
              {status.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
};

export default StatusSelect;
