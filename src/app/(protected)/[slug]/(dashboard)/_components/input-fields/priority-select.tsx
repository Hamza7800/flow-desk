import { PRIORITY_OPTIONS } from "@/lib/contants";
import type { SelectProps } from "@/lib/types";
import { Label, ListBox, Select } from "@heroui/react";

const PrioritySelect = ({
  value,
  onChange,
  isDisabled = false,
}: SelectProps) => {
  const current =
    PRIORITY_OPTIONS.find((p) => p.key === value) ?? PRIORITY_OPTIONS[0];
  const CurrentIcon = current?.icon;

  return (
    <Select
      isDisabled={isDisabled}
      aria-label="Priority"
      className="w-auto"
      value={current?.key}
      onChange={(value) => {
        onChange(value as string);
      }}
    >
      <Select.Trigger className="flex items-center justify-center rounded-md border-0 bg-transparent hover:bg-zinc-800 data-[pressed]:bg-zinc-800">
        {/* <Select.Value /> */}
        {CurrentIcon && <CurrentIcon className={`h-4 w-4 ${current.color}`} />}
        {/* <Select.Indicator /> */}
      </Select.Trigger>
      <Select.Popover
        placement="bottom left"
        className={"w-full max-w-[250px]"}
      >
        <ListBox className="mt-1 outline-none">
          {PRIORITY_OPTIONS.map((p) => {
            const Icon = p.icon;
            const isSelected = p.key === current?.key;

            return (
              <ListBox.Item
                key={p.key}
                id={p.key}
                textValue={p.label}
                className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-zinc-300 outline-none hover:bg-zinc-800 data-[focused]:bg-zinc-800"
              >
                <Icon className={`h-4 w-4 shrink-0 ${p.color}`} />
                <span className="flex-1">{p.label}</span>
                {isSelected && <span className="text-zinc-400">✓</span>}
                <span className="text-xs text-zinc-600">{p.order}</span>
              </ListBox.Item>
            );
          })}
        </ListBox>
      </Select.Popover>
    </Select>
  );
};

export default PrioritySelect;
