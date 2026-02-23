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
    <Button
      isPending={acceptMutation.isPending}
      onPress={() => acceptMutation.mutate(inviteId)}
      className={"bg-emerald-600"}
    >
      {({ isPending }) => (
        <>{isPending ? <Spinner color="current" size="sm" /> : <Check />}</>
      )}
    </Button>
  );
};

export default AcceptInvitation;
