"use client";

import { ConfirmModal } from "@/components/confirm-modal";
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
  const cancelMutation = useCancelInvitation(slug);
  return (
    <ConfirmModal
      title="Cancel Invitation"
      description="Are you sure you want to cancel invitation."
      confirmText="Yes"
      isLoading={cancelMutation.isPending}
      onConfirm={(close) => {
        cancelMutation.mutate(inviteId, {
          onSuccess: () => {
            close();
          },
        });
      }}
      trigger={
        <Button variant="outline">
          {({ isPending }) => (
            <>
              {isPending ? (
                <Spinner color="current" size="sm" />
              ) : (
                <div className="flex items-center gap-2">
                  <X />
                  <span>Cancel</span>
                </div>
              )}
            </>
          )}
        </Button>
      }
    />
  );
};

export default CancelInvitation;
