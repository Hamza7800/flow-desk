"use client";

import { ConfirmModal } from "@/components/confirm-modal";
import { useRemoveMember } from "@/hooks/use-organizations";
import { useRemoveMemberFromTeam } from "@/hooks/use-teams";
import { Button, Spinner } from "@heroui/react";
import { X } from "lucide-react";

interface Props {
  userId: string;
}
// TODO: NEED TO ADD PERMISSION SO USER CAN LEAVE BUT CANT REMOVE
export function RemoveMemberFromOrg({ userId }: Props) {
  const removeMutation = useRemoveMember();

  return (
    <ConfirmModal
      title="Remove Member"
      description="Are you sure you want to remove this member."
      confirmText="Yes"
      isLoading={removeMutation.isPending}
      onConfirm={(close) => {
        removeMutation.mutate(
          { userId },
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
