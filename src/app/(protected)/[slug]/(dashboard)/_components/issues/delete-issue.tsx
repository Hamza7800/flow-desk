import { ConfirmModal } from "@/components/confirm-modal";
import { useDeleteIssue } from "@/hooks/use-issues";
import { Button } from "@heroui/react";
import { useParams, useRouter } from "next/navigation";

const DeleteIssue = ({
  issueId,
  teamId,
  projectId,
}: {
  teamId: string;
  projectId: string;
  issueId: string;
}) => {
  const { slug } = useParams<{ slug: string }>();

  const router = useRouter();

  const { mutate, isPending } = useDeleteIssue(teamId, projectId);

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
            // router.push(`/${slug}/my-issues/assigned`);
            router.back();
          },
        });
      }}
      trigger={
        <Button fullWidth variant="danger-soft">
          Delete Issue
        </Button>
      }
    />
  );
};

export default DeleteIssue;
