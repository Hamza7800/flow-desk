"use client";

import { useOrganizationContext } from "@/components/context/organization-client-context";
import { useAddMemberToTeam, useTeamMembers } from "@/hooks/use-teams";
import {
  ListBox,
  Popover,
  Button,
  type Selection,
  Description,
  Label,
} from "@heroui/react";
import { useState, useMemo } from "react";
import InviteMembers from "@/app/(protected)/[slug]/(settings)/_components/invite-members";

const AddMembers = ({ teamId }: { teamId: string }) => {
  const { data: teamMembers, isPending } = useTeamMembers(teamId);
  const addMember = useAddMemberToTeam(teamId);
  const { org } = useOrganizationContext();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

  const selectedMember = useMemo(() => {
    const firstKey = Array.from(selectedKeys)[0];
    return org?.members?.find((m) => m.user.id === firstKey);
  }, [selectedKeys, org]);

  const teamUserIds = new Set(teamMembers?.map((m) => m.userId));
  const membersNotInTeam =
    org?.members?.filter((member) => !teamUserIds.has(member.userId)) ?? [];

  const handleOpenInvite = () => {
    setIsPopoverOpen(false);
    setIsInviteModalOpen(true);
  };

  const onSelect = (keys: Selection) => {
    const selectedId = Array.from(keys)[0] as string;
    if (!selectedId) return;
    const member = org?.members?.find((m) => m.userId === selectedId);

    if (member) {
      addMember.mutate({
        teamId,
        userId: member.user.id,
      });

      setIsPopoverOpen(false);
    }

    setSelectedKeys(new Set([]));
  };

  return (
    <div className="flex items-center justify-end">
      <Popover isOpen={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <Popover.Trigger>
          <Button variant="outline">Add Members</Button>
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
                onSelectionChange={onSelect}
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
        heading="Invite Members to your Team"
      />
    </div>
  );
};

export default AddMembers;
