import { useOrganizationContext } from "@/components/context/organization-client-context";
import { useTeamMembers } from "@/hooks/use-teams";
import { getInitials } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  ListBox,
  Select,
  type Key,
} from "@heroui/react";
import { UserRound } from "lucide-react";
import { useState } from "react";

type Props = {
  value: string[];
  onChange: (values: string[]) => void;
  selection?: "multiple" | "single";
  isDisabled?: boolean;
  mode?: "create" | "edit";
  placeholderText?: string;
  teamId: string;
};

const NO_ASSIGNEE = "no-assignee";

const TeamMembersSelect = ({
  value,
  onChange,
  isDisabled = false,
  selection = "multiple",
  mode = "edit",
  placeholderText = "No Assignee",
  teamId,
}: Props) => {
  const { org: organization } = useOrganizationContext();
  const [selected, setSelected] = useState<Key[]>(value);
  const { data: teamMembers } = useTeamMembers(teamId);
  const members = organization?.members;

  const handleChange = (keys: Key[]) => {
    const keysArray = Array.from(keys);

    if (keysArray.includes(NO_ASSIGNEE) || keysArray.length === 0) {
      setSelected([]);
      onChange([]);
      return;
    }

    const previous = new Set(selected);
    const newest = keysArray.find((k) => !previous.has(k));
    const next = newest ? [newest] : [keysArray[keysArray.length - 1]];

    setSelected(next as string[]);
    onChange(next as string[]);
  };

  const teamUserIds = new Set(teamMembers?.map((m) => m.userId));

  const membersInTeam = members?.filter((member) =>
    teamUserIds.has(member.userId),
  );

  return (
    <Select
      isDisabled={isDisabled}
      selectionMode={selection}
      value={selected}
      aria-label="Assignee"
      onChange={(keys) => handleChange(keys as Key[])}
    >
      <Select.Trigger className="flex items-center justify-center rounded-md border-0 bg-transparent hover:bg-zinc-800 data-[pressed]:bg-zinc-800">
        <Select.Value className="w-fit p-0">
          {({ state, isPlaceholder, defaultChildren }) => {
            if (isPlaceholder || state.selectedItems.length === 0) {
              return (
                <div className="flex items-center gap-1 text-white">
                  <UserRound size={16} />
                  {mode === "create" && <span>{placeholderText}</span>}
                </div>
              );
            }

            const visible = state.selectedItems.slice(0, 3);
            const remaining = state.selectedItems.length - 3;

            return (
              <div className="flex items-center space-x-2">
                {visible.map((item, index) => {
                  const member = membersInTeam?.find(
                    (m) => m.user.id === item.key,
                  );
                  if (!member) return null;
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <Avatar
                        key={item.key}
                        className="size-4 border border-white"
                        size="sm"
                      >
                        <AvatarFallback>
                          {getInitials(member.user.email)}
                        </AvatarFallback>
                      </Avatar>
                      {mode === "create" && (
                        <h2 className="max-w-[80px] truncate text-sm">
                          {member.user.email}
                        </h2>
                      )}
                    </div>
                  );
                })}
                {/* {remaining > 0 && (
                  <div className="flex size-6 items-center justify-center rounded-full border-2 border-white bg-zinc-200 text-xs font-semibold">
                    +{remaining}
                  </div>
                )} */}
              </div>
            );
          }}
        </Select.Value>
      </Select.Trigger>

      <Select.Popover className="w-full max-w-[300px]" placement="bottom right">
        <ListBox selectionMode={selection}>
          <ListBox.Item
            key={NO_ASSIGNEE}
            id={NO_ASSIGNEE}
            textValue={placeholderText}
          >
            <span className="flex items-center gap-2">
              <UserRound size={14} />
              {placeholderText}
            </span>
            <ListBox.ItemIndicator />
          </ListBox.Item>

          {membersInTeam?.map((member) => (
            <ListBox.Item
              key={member.user.id}
              id={member.user.id}
              textValue={member.user.email}
            >
              <span className="flex items-center gap-2">
                <Avatar className="size-5" size="sm">
                  <AvatarFallback>
                    {getInitials(member.user.email)}
                  </AvatarFallback>
                </Avatar>
                {member.user.email}
              </span>
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
};

export default TeamMembersSelect;
