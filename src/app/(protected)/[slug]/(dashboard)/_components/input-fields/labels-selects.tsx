import { useOrgLabels } from "@/hooks/use-labels";
import { ListBox, Select, type Key } from "@heroui/react";
import { Tag } from "lucide-react";
import { useState } from "react";

type Props = {
  value: string[];
  onChange: (values: string[]) => void;
  selection?: "multiple" | "single";
  isDisabled?: boolean;
  mode?: "create" | "edit";
  placeholderText?: string;
};

const NO_LABEL = "no-label";

const LabelsSelect = ({
  value,
  onChange,
  isDisabled = false,
  selection = "multiple",
  mode = "edit",
  placeholderText = "No Label",
}: Props) => {
  const [selected, setSelected] = useState<Key[]>(value);
  const { data: labels } = useOrgLabels();

  const handleChange = (keys: Key[]) => {
    const keysArray = Array.from(keys);

    if (keysArray.includes(NO_LABEL) || keysArray.length === 0) {
      setSelected([]);
      onChange([]);
      return;
    }

    setSelected(keysArray);
    onChange(keysArray as string[]);
  };

  return (
    <Select
      isDisabled={isDisabled}
      selectionMode={selection}
      value={selected}
      aria-label="Labels"
      onChange={(keys) => handleChange(keys as Key[])}
    >
      <Select.Trigger className="flex items-center justify-center rounded-md border-0 bg-transparent hover:bg-zinc-800 data-[pressed]:bg-zinc-800">
        <Select.Value className="w-fit p-0">
          {({ state, isPlaceholder }) => {
            if (isPlaceholder || state.selectedItems.length === 0) {
              return (
                <div className="flex items-center gap-2 text-white">
                  <Tag size={16} />
                  {mode === "create" && (
                    <span className="">{placeholderText}</span>
                  )}
                </div>
              );
            }

            const visible = state.selectedItems.slice(0, 3);
            const remaining = state.selectedItems.length - 3;

            return (
              <div className="flex items-center gap-1">
                <div className="flex -space-x-1">
                  {visible.map((item) => {
                    const label = labels?.find((l) => l.id === item.key);
                    if (!label) return null;
                    return (
                      <div
                        key={item.key}
                        className="h-3.5 w-3.5 rounded-full border border-zinc-800"
                        style={{ backgroundColor: label.color ?? "#71717a" }}
                        title={label.name}
                      />
                    );
                  })}
                </div>

                {remaining > 0 && <span className="text-xs">+{remaining}</span>}

                {mode === "create" && state.selectedItems.length === 1 && (
                  <span className="max-w-[80px] truncate text-sm">
                    {
                      labels?.find((l) => l.id === state.selectedItems[0]?.key)
                        ?.name
                    }
                  </span>
                )}
              </div>
            );
          }}
        </Select.Value>
      </Select.Trigger>

      <Select.Popover className="w-full max-w-[300px]" placement="bottom right">
        <ListBox selectionMode={selection}>
          <ListBox.Item
            key={NO_LABEL}
            id={NO_LABEL}
            textValue={placeholderText}
          >
            <span className="flex items-center gap-2">
              <Tag size={14} />
              {placeholderText}
            </span>
            <ListBox.ItemIndicator />
          </ListBox.Item>

          {labels?.map((label) => (
            <ListBox.Item key={label.id} id={label.id} textValue={label.name}>
              <span className="flex items-center gap-2">
                <div
                  style={{
                    backgroundColor: `${label.color}`,
                  }}
                  className={`h-4 w-4 rounded-full`}
                ></div>
                {label.name}
              </span>
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
};

export default LabelsSelect;
