import { ConfirmModal } from "@/components/confirm-modal";
import { useDeleteIssue } from "@/hooks/use-issues";
import { Button } from "@heroui/react";

const DeleteIssue = ({
  issueId,
  teamId,
}: {
  teamId: string;
  issueId: string;
}) => {
  const { mutate, isPending } = useDeleteIssue(teamId);

  return (
    <ConfirmModal
      title="Delete Issue Permanently"
      description="This action will delete your issue and all related data."
      confirmText="Delete Issue"
      isLoading={isPending}
      onConfirm={(close) => {
        mutate(issueId, {
          onSuccess: () => {
            close();
          },
        });
      }}
      trigger={<Button variant="danger-soft">Delete Issue</Button>}
    />
  );
};

export default DeleteIssue;
