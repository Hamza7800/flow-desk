import { STATUS_OPTIONS } from "@/lib/contants";
import type { SelectProps } from "@/lib/types";
import { ListBox, Select } from "@heroui/react";

const StatusIcon = ({
  option,
}: {
  option: (typeof STATUS_OPTIONS)[number];
}) => (
  <span
    className={`flex h-4 w-4 shrink-0 items-center justify-center text-[10px] font-bold ${option.iconClass} ${option.color}`}
  >
    {option.icon}
  </span>
);

const StatusSelect = ({
  value,
  onChange,
  isDisabled = false,
  mode = "edit",
}: SelectProps) => {
  const current =
    STATUS_OPTIONS.find((s) => s.key === value) ?? STATUS_OPTIONS[0];

  return (
    <Select
      className="w-auto"
      isDisabled={isDisabled}
      aria-label="Status"
      value={current?.key}
      onChange={(value) => {
        onChange(value as string);
      }}
    >
      <Select.Trigger className="flex items-center rounded-md border-0 bg-transparent hover:bg-zinc-800 data-[pressed]:bg-zinc-800">
        <StatusIcon option={current!} />
        {mode === "create" && <span className="ml-1">{current?.label}</span>}
      </Select.Trigger>
      <Select.Popover
        placement="bottom left"
        className={"w-full max-w-[250px]"}
      >
        <ListBox className="mt-1 outline-none">
          {STATUS_OPTIONS.map((s) => {
            const isSelected = s.key === current?.key;
            return (
              <ListBox.Item
                key={s.key}
                id={s.key}
                textValue={s.label}
                className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-zinc-300 outline-none hover:bg-zinc-800 data-[focused]:bg-zinc-800"
              >
                <StatusIcon option={s} />
                <span className="flex-1 font-medium">{s.label}</span>
                {isSelected && <span className="text-xs text-zinc-400">✓</span>}
                <span className="text-xs text-zinc-600">{s.order}</span>
              </ListBox.Item>
            );
          })}
        </ListBox>
      </Select.Popover>
    </Select>
  );
};

export default StatusSelect;
