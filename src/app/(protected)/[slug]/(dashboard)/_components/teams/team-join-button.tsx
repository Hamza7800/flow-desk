"use client";

import { useAddMemberToTeam, useRemoveMemberFromTeam } from "@/hooks/use-teams";
import { Button, Spinner } from "@heroui/react";

interface TeamJoinButtonProps {
  teamId: string;
  orgId: string;
  isMember: boolean;
}

export function TeamJoinButton({
  teamId,
  orgId,
  isMember,
}: TeamJoinButtonProps) {
  const addMutation = useAddMemberToTeam(orgId);
  const removeMutation = useRemoveMemberFromTeam(orgId);

  const handleToggle = async () => {
    if (isMember) {
      removeMutation.mutate(teamId);
      return;
    }
    addMutation.mutate(teamId);
  };

  const loading = addMutation.isPending || removeMutation.isPending;

  return (
    <Button onClick={handleToggle} isPending={loading}>
      {({ isPending }) => (
        <>
          {isPending ? <Spinner color="current" size="sm" /> : null}
          {isMember ? "Leave Team" : "Join Team"}
        </>
      )}
    </Button>
  );
}
