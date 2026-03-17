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

const ProjectMembersSelect = ({
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

    setSelected(keysArray);
    onChange(keysArray as string[]);
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
          {({ state, isPlaceholder }) => {
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
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {visible.map((item) => {
                    const member = membersInTeam?.find(
                      (m) => m.user.id === item.key,
                    );
                    if (!member) return null;
                    return (
                      <Avatar
                        key={item.key}
                        className="size-5"
                        size="sm"
                        color="success"
                      >
                        <AvatarFallback>
                          {getInitials(member.user.email)}
                        </AvatarFallback>
                      </Avatar>
                    );
                  })}
                </div>
                {remaining > 0 && (
                  <span className="ml-1.5 text-xs text-zinc-400">
                    +{remaining}
                  </span>
                )}
                {mode === "create" && state.selectedItems.length === 1 && (
                  <span className="ml-2 max-w-[80px] truncate text-sm">
                    {
                      membersInTeam?.find(
                        (m) => m.user.id === state?.selectedItems[0]?.key,
                      )?.user.email
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

export default ProjectMembersSelect;
