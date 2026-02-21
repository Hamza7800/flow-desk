import { ConfirmModal } from "@/components/confirm-modal";
import { useRemoveTeam } from "@/hooks/use-teams";
import { Button } from "@heroui/react";

const DeleteTeams = ({ teamId, orgId }: { orgId: string; teamId: string }) => {
  const { mutate, isPending } = useRemoveTeam(orgId ?? "");

  return (
    <ConfirmModal
      title="Delete Team Permanently"
      description="This action will delete your team and all related data including members, and projects."
      confirmText="Delete Team"
      isLoading={isPending}
      onConfirm={(close) => {
        mutate(teamId, {
          onSuccess: () => {
            close();
          },
        });
      }}
      trigger={<Button variant="danger-soft">Delete Team</Button>}
    />
  );
};

export default DeleteTeams;
