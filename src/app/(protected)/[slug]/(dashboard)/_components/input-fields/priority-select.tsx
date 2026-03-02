import { PRIORITY_OPTIONS } from "@/lib/contants";
import type { SelectProps } from "@/lib/types";
import { Label, ListBox, Select } from "@heroui/react";

const PrioritySelect = ({ value, onChange }: SelectProps) => {
  const currentStatus = PRIORITY_OPTIONS.find((s) => s.key === value);

  return (
    <Select
      placeholder="Priority"
      className={"w-full"}
      value={currentStatus?.key}
      onChange={(value) => {
        onChange(value as string);
      }}
    >
      <Label>Priority</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {PRIORITY_OPTIONS.map((status) => (
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

export default PrioritySelect;
