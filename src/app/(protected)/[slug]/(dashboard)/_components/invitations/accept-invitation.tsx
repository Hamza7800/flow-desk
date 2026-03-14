import { ConfirmModal } from "@/components/confirm-modal";
import { useAcceptInvitation } from "@/hooks/use-invitations";
import { Button, Spinner } from "@heroui/react";
import { Check } from "lucide-react";

const AcceptInvitation = ({
  slug,
  inviteId,
}: {
  inviteId: string;
  slug: string;
}) => {
  const acceptMutation = useAcceptInvitation(slug);

  return (
    <ConfirmModal
      title="Accept Invitation"
      description="Are you sure you want to accept invitation."
      confirmText="Yes"
      isLoading={acceptMutation.isPending}
      onConfirm={(close) => {
        acceptMutation.mutate(inviteId, {
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
                  <Check />
                  <span>Accept</span>
                </div>
              )}
            </>
          )}
        </Button>
      }
    />
  );
};

export default AcceptInvitation;
