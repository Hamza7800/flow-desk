"use client";

import { useRemoveMember } from "@/hooks/use-organizations";
import { useRemoveMemberFromTeam } from "@/hooks/use-teams";
import { Button, Spinner } from "@heroui/react";

interface Props {
  userId: string;
}
// TODO: NEED TO ADD PERMISSION SO USER CAN LEAVE BUT CANT REMOVE
export function RemoveMemberFromOrg({ userId }: Props) {
  const removeMutation = useRemoveMember();

  const handleToggle = async () => {
    removeMutation.mutate({ userId });
  };

  const loading = removeMutation.isPending;

  return (
    <Button onClick={handleToggle} isPending={loading}>
      {({ isPending }) => (
        <>
          {isPending ? <Spinner color="current" size="sm" /> : null}
          Remove
        </>
      )}
    </Button>
  );
}
