import { useOrganizationContext } from "@/components/context/organization-client-context";
import { getInitials } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Dropdown,
  Header,
  Label,
  ListBox,
  Select,
  type Key,
} from "@heroui/react";
import { useState } from "react";

type Props = {
  value: string[];
  onChange: (values: string[]) => void;
  selection?: "multiple" | "single";
  isDisabled?: boolean;
};

const AssigneeSelect = ({
  value,
  onChange,
  isDisabled = false,
  selection = "multiple",
}: Props) => {
  const { org: organization } = useOrganizationContext();
  const [selected, setSelected] = useState<Key[]>(value);
  const members = organization?.members;

  return (
    <Select
      isDisabled={isDisabled}
      placeholder="Select"
      selectionMode={selection}
      value={selected}
      onChange={(keys) => {
        // TODO: FIX SINGLE MODE
        setSelected(keys as Key[]);
        onChange(keys as string[]);
      }}
    >
      <Select.Trigger>
        <Select.Value className={"w-fit p-0"}>
          {({ state, isPlaceholder, defaultChildren }) => {
            if (isPlaceholder || state.selectedItems.length === 0) {
              return defaultChildren;
            }

            const selectedItems = state.selectedItems;
            const maxToShow = 3;

            const visible = selectedItems.slice(0, maxToShow);
            const remaining = selectedItems.length - maxToShow;

            return (
              <div className="flex items-center -space-x-2">
                {visible.map((item) => {
                  const member = members?.find((m) => m.user.id === item.key);

                  if (!member) return null;

                  return (
                    <Avatar
                      key={item.key}
                      className="size-4 border border-white"
                      size="sm"
                    >
                      <AvatarFallback>
                        {getInitials(member.user.email)}
                      </AvatarFallback>
                    </Avatar>
                  );
                })}

                {remaining > 0 && (
                  <div className="flex size-6 items-center justify-center rounded-full border-2 border-white bg-zinc-200 text-xs font-semibold text-zinc-700">
                    +{remaining}
                  </div>
                )}
              </div>
            );
          }}
        </Select.Value>

        {/* <Select.Indicator /> */}
      </Select.Trigger>

      <Select.Popover
        className={"w-full max-w-[300px]"}
        placement="bottom right"
      >
        <ListBox selectionMode="multiple">
          {members?.map((member) => (
            <ListBox.Item
              key={member.user.id}
              id={member.user.id}
              textValue={member.user.email}
            >
              {member.user.email}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
};

export default AssigneeSelect;
