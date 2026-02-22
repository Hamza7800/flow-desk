import { useAddMemberToTeam } from "@/hooks/use-teams";
import { Button, Spinner } from "@heroui/react";

// TODO: ADD COMPONENTS TO THE CORRECT FILES
const JoinTeam = ({ teamId, orgId }: { orgId: string; teamId: string }) => {
  const addMutate = useAddMemberToTeam(orgId);
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
          Join
        </>
      )}
    </Button>
  );
};

export default JoinTeam;
