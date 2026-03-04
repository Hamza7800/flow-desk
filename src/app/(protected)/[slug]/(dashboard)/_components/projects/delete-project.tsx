import { ConfirmModal } from "@/components/confirm-modal";
import { useDeleteProject } from "@/hooks/use-projects";
import { Button } from "@heroui/react";

const DeleteProject = ({
  projectId,
  orgId,
  teamId,
}: {
  projectId: string;
  orgId: string;
  teamId: string;
}) => {
  const { mutate, isPending } = useDeleteProject(orgId, teamId);

  return (
    <ConfirmModal
      title="Delete Project Permanently"
      description="This action will delete your project."
      confirmText="Delete"
      isLoading={isPending}
      onConfirm={(close) => {
        mutate(projectId, {
          onSuccess: () => {
            close();
          },
        });
      }}
      trigger={<Button variant="danger-soft">Delete Team</Button>}
    />
  );
};

export default DeleteProject;
