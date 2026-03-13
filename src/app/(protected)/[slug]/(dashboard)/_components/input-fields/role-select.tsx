"use client";

import { Label, ListBox, Select, type Key } from "@heroui/react";
import { useUpdateMemberRole } from "@/hooks/use-member-role";
import { usePermissions } from "@/hooks/use-permissions";
import { Shield, User, Crown } from "lucide-react";

type Role = "owner" | "admin" | "member";

const roles = [
  {
    id: "member",
    name: "Member",
    icon: User,
  },
  {
    id: "admin",
    name: "Admin",
    icon: Shield,
  },
];

type Props = {
  memberId: string;
  currentRole: Role;
  memberUserId: string;
};

const RoleSelect = ({ memberId, currentRole, memberUserId }: Props) => {
  const { mutate, isPending } = useUpdateMemberRole();
  const { isOwner, currentUserId } = usePermissions();

  const isSelf = memberUserId === currentUserId;

  const isDisabled = currentRole === "owner" || isSelf || isPending;

  const handleChange = (value: Key | null) => {
    if (!value || value === currentRole) return;
    mutate({ memberId, role: value as "admin" | "member" });
  };

  // Show owner as read-only badge — not in the select
  if (currentRole === "owner") {
    return (
      <div className="flex items-center gap-1.5 text-sm text-amber-400">
        <Crown size={13} />
        <span>Owner</span>
      </div>
    );
  }

  return (
    <Select
      className="w-[140px]"
      isDisabled={isDisabled}
      value={currentRole}
      onChange={handleChange}
    >
      <Select.Trigger className="h-8 text-sm">
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>

      <Select.Popover>
        <ListBox>
          {roles.map((role) => {
            const Icon = role.icon;
            // Admins cannot assign admin role — only owners can
            const isRoleDisabled = role.id === "admin" && !isOwner;

            return (
              <ListBox.Item
                key={role.id}
                id={role.id}
                textValue={role.name}
                isDisabled={isRoleDisabled}
              >
                <div className="flex items-center gap-2 py-0.5">
                  <Icon size={13} className="shrink-0 text-zinc-400" />
                  <div className="flex flex-col">
                    <span className="text-sm">{role.name}</span>
                  </div>
                </div>
                <ListBox.ItemIndicator />
              </ListBox.Item>
            );
          })}
        </ListBox>
      </Select.Popover>
    </Select>
  );
};

export default RoleSelect;
