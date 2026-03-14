"use client";

import { ConfirmModal } from "@/components/confirm-modal";
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
    <ConfirmModal
      title="Reject Invitation"
      description="Are you sure you want to reject invitation."
      confirmText="Yes"
      isLoading={rejectMutation.isPending}
      onConfirm={(close) => {
        rejectMutation.mutate(inviteId, {
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
                  <CloseIcon />
                  <span>Reject</span>
                </div>
              )}
            </>
          )}
        </Button>
      }
    />
  );
};

export default RejectInvitation;
