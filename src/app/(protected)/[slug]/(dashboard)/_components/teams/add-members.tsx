"use client";

import { useOrganizationContext } from "@/components/context/organization-client-context";
import { useTeamMembers } from "@/hooks/use-teams";
import { getInitials } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  ListBox,
  Popover,
  Button,
  type Selection,
  Surface,
  Description,
  Label,
} from "@heroui/react";
import { useState, useMemo } from "react";
import { ChevronDown, UserPlus } from "lucide-react";
import InviteMembers from "../../../(settings)/_components/invite-members";
import { Check } from "@gravity-ui/icons";

const AddMembers = ({ teamId }: { teamId: string }) => {
  const { data: teamMembers, isPending } = useTeamMembers(teamId);
  const { org } = useOrganizationContext();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Controlled selection state
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

  // Determine the display label based on selection
  const selectedMember = useMemo(() => {
    const firstKey = Array.from(selectedKeys)[0];
    return org?.members?.find((m) => m.user.id === firstKey);
  }, [selectedKeys, org]);

  console.log(selectedMember);

  const teamUserIds = new Set(teamMembers?.map((m) => m.userId));
  const membersNotInTeam =
    org?.members?.filter((member) => !teamUserIds.has(member.userId)) ?? [];

  const handleOpenInvite = () => {
    setIsPopoverOpen(false);
    setIsInviteModalOpen(true);
  };

  return (
    <div className="flex items-center justify-end">
      <Popover isOpen={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <Popover.Trigger>
          <Button>Add Members</Button>
        </Popover.Trigger>
        <Popover.Content
          placement="bottom right"
          className="w-[280px] overflow-hidden border border-zinc-800 bg-zinc-950 p-0 shadow-xl"
        >
          <Popover.Dialog className={"p-0"}>
            {membersNotInTeam.length ? (
              <ListBox
                aria-label="Users"
                selectedKeys={selectedKeys}
                selectionMode="single"
                onSelectionChange={(keys) => {
                  setSelectedKeys(keys);
                  const firstKey = Array.from(keys);
                  const fk = org?.members?.find(
                    (m) => m.userId === firstKey[0],
                  );
                }}
              >
                {membersNotInTeam.map((member) => {
                  return (
                    <ListBox.Item
                      id={member.userId}
                      textValue={member.userId}
                      key={member.userId}
                    >
                      <div className="flex flex-col">
                        <Label>{member.user.name}</Label>
                        <Description>{member.user.email}</Description>
                      </div>
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  );
                })}
              </ListBox>
            ) : null}
            <Button fullWidth size="sm" onPress={handleOpenInvite}>
              Invite Members
            </Button>
          </Popover.Dialog>
        </Popover.Content>
      </Popover>

      <InviteMembers
        isOpen={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
        orgId={org?.id ?? ""}
        slug={org?.slug ?? ""}
        setOpen={setIsInviteModalOpen}
        teamId={teamId}
      />
    </div>
  );
};

export default AddMembers;

// import { useOrganizationContext } from "@/components/context/organization-client-context";
// import { useTeamMembers } from "@/hooks/use-teams";
// import { getInitials } from "@/lib/utils";
// import {
//   Avatar,
//   AvatarFallback,
//   ListBox,
//   Select,
//   type Key,
// } from "@heroui/react";
// import { useState } from "react";
// import InviteMembers from "../../../(settings)/_components/invite-members";

// const AddMembers = ({ teamId }: { teamId: string }) => {
//   const {
//     data: teamMembers,
//     isPending,
//     isError,
//     error,
//   } = useTeamMembers(teamId);
//   const { org } = useOrganizationContext();

//   if (isPending) {
//     return <h2>Loading Team Members</h2>;
//   }

//   if (isError) {
//     return <h2>Error :{error.message}</h2>;
//   }

//   const teamUserIds = new Set(teamMembers?.map((m) => m.userId));

//   const membersNotInTeam =
//     org?.members?.filter((member) => !teamUserIds.has(member.userId)) ?? [];

//   const [selected, setSelected] = useState<Key | null>(null);
//   const members = membersNotInTeam;

//   return (
//     <Select
//       placeholder="Select"
//       className={"w-full"}
//       selectionMode={"single"}
//       value={selected}
//       onChange={(key) => {
//         // TODO: FIX SINGLE MODE
//         setSelected(key);
//         // onChange(keys as string[]);
//       }}
//     >
//       <Select.Trigger>
//         <Select.Value>
//           {({ state, isPlaceholder, defaultChildren }) => {
//             if (isPlaceholder || state.selectedItems.length === 0) {
//               return defaultChildren;
//             }

//             const selectedItems = state.selectedItems;
//             const maxToShow = 3;

//             const visible = selectedItems.slice(0, maxToShow);
//             const remaining = selectedItems.length - maxToShow;

//             return (
//               <div className="flex items-center -space-x-2">
//                 {visible.map((item) => {
//                   const member = members?.find((m) => m.user.id === item.key);

//                   if (!member) return null;

//                   return (
//                     <Avatar
//                       key={item.key}
//                       className="size-6 border border-white"
//                       size="sm"
//                     >
//                       <AvatarFallback>
//                         {getInitials(member.user.email)}
//                       </AvatarFallback>
//                     </Avatar>
//                   );
//                 })}

//                 {remaining > 0 && (
//                   <div className="flex size-6 items-center justify-center rounded-full border-2 border-white bg-zinc-200 text-xs font-semibold text-zinc-700">
//                     +{remaining}
//                   </div>
//                 )}
//               </div>
//             );
//           }}
//         </Select.Value>

//         <Select.Indicator />
//       </Select.Trigger>

//       <Select.Popover>
//         <ListBox selectionMode="multiple">
//           {members?.map((member) => (
//             <ListBox.Item
//               key={member.user.id}
//               id={member.user.id}
//               textValue={member.user.email}
//             >
//               {member.user.email}
//               <ListBox.ItemIndicator />
//             </ListBox.Item>
//           ))}
//         </ListBox>
//       </Select.Popover>
//     </Select>
//   );
// };

// export default AddMembers;
