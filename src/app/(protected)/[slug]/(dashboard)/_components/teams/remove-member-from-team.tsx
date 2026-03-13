"use client";

import { ConfirmModal } from "@/components/confirm-modal";
import { useRemoveMemberFromTeam } from "@/hooks/use-teams";
import { Button, Spinner } from "@heroui/react";
import { X } from "lucide-react";

interface TeamRemoveProps {
  teamId: string;
  userId: string;
}
// TODO: NEED TO ADD PERMISSION SO USER CAN LEAVE BUT CANT REMOVE
export function RemoveMemberFromTeam({ teamId, userId }: TeamRemoveProps) {
  const removeMutation = useRemoveMemberFromTeam(teamId);

  return (
    <ConfirmModal
      title="Remove Member"
      description="Are you sure you want to remove member."
      confirmText="Yes"
      isLoading={removeMutation.isPending}
      onConfirm={(close) => {
        removeMutation.mutate(
          { teamId, userId },
          {
            onSuccess: () => {
              close();
            },
          },
        );
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
                  <span>Remove</span>
                </div>
              )}
            </>
          )}
        </Button>
      }
    />
  );
}
