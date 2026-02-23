"use client";

import { useRejectInvitation } from "@/hooks/use-invitations";
import { Button, CloseIcon, Spinner } from "@heroui/react";

const RejectInvitation = ({
  slug,
  inviteId,
}: {
  inviteId: string;
  slug: string;
}) => {
  const rejectMutation = useRejectInvitation(slug);
  return (
    <Button
      isPending={rejectMutation.isPending}
      onPress={() => rejectMutation.mutate(inviteId)}
    >
      {({ isPending }) => (
        <>{isPending ? <Spinner color="current" size="sm" /> : <CloseIcon />}</>
      )}
    </Button>
  );
};

export default RejectInvitation;
