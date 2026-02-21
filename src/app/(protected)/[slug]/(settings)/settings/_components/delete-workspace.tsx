"use client";

import { ConfirmModal } from "@/components/confirm-modal";
import { useOrganizationDelete } from "@/hooks/use-organizations";
import { Button } from "@heroui/react";

const DeleteWorkspace = ({ slug }: { slug: string }) => {
  const { mutate, isPending } = useOrganizationDelete();
  return (
    <ConfirmModal
      title="Delete Workspace Permanently"
      description="This action will delete your workspace and all related data including members, teams, and projects."
      confirmText="Delete Workspace"
      isLoading={isPending}
      onConfirm={(close) => {
        mutate(slug, {
          onSuccess: () => {
            close();
          },
        });
      }}
      trigger={<Button variant="danger-soft">Delete Workspace</Button>}
    />
  );
};
export default DeleteWorkspace;
