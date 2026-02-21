"use client";

import { useCancelInvitation } from "@/hooks/use-invitations";
import { Button, Spinner } from "@heroui/react";
import { X } from "lucide-react";

const CancelInvitation = ({
  slug,
  inviteId,
}: {
  inviteId: string;
  slug: string;
}) => {
  const acceptMutation = useCancelInvitation(slug);
  return (
    <Button
      isPending={acceptMutation.isPending}
      onPress={() => acceptMutation.mutate(inviteId)}
    >
      {({ isPending }) => (
        <>{isPending ? <Spinner color="current" size="sm" /> : <X />}</>
      )}
    </Button>
  );
};

export default CancelInvitation;
