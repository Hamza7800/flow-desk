import { useAddMemberToTeam, useRemoveMemberFromTeam } from "@/hooks/use-teams";
import { Button, Spinner } from "@heroui/react";

// TODO: ADD COMPONENTS TO THE CORRECT FILES
const LeaveTeam = ({ teamId, orgId }: { orgId: string; teamId: string }) => {
  const addMutate = useRemoveMemberFromTeam(orgId);
  return (
    <Button
      onPress={() => addMutate.mutate(teamId)}
      isPending={addMutate.isPending}
      type="submit"
      className="w-full"
    >
      {({ isPending }) => (
        <>
          {isPending ? <Spinner color="current" size="sm" /> : null}
          Leave
        </>
      )}
    </Button>
  );
};

export default LeaveTeam;
