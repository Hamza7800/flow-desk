"use client";

import { useRemoveMemberFromTeam } from "@/hooks/use-teams";
import { Button, Spinner } from "@heroui/react";

interface TeamRemoveProps {
  teamId: string;
  userId: string;
}
// TODO: NEED TO ADD PERMISSION SO USER CAN LEAVE BUT CANT REMOVE
export function RemoveMemberFromTeam({ teamId, userId }: TeamRemoveProps) {
  const removeMutation = useRemoveMemberFromTeam(teamId);

  const handleToggle = async () => {
    removeMutation.mutate({ teamId, userId });
  };

  const loading = removeMutation.isPending;

  return (
    <Button onClick={handleToggle} isPending={loading}>
      {({ isPending }) => (
        <>
          {isPending ? <Spinner color="current" size="sm" /> : null}
          Remove Member
        </>
      )}
    </Button>
  );
}
