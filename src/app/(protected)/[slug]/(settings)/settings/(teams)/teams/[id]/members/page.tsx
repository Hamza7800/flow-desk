"use client";
import AddMembers from "@/app/(protected)/[slug]/(dashboard)/_components/teams/add-members";
import { RemoveMemberFromTeam } from "@/app/(protected)/[slug]/(dashboard)/_components/teams/remove-member-from-team";
import { useAuth } from "@/components/context/auth-context";
import { useOrganizationContext } from "@/components/context/organization-client-context";
import { useTeamMembers, useUserTeams } from "@/hooks/use-teams";
import { Card } from "@heroui/react";
import { useParams } from "next/navigation";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const { data: teamMembers, isPending, isError, error } = useTeamMembers(id);
  const { user } = useAuth();
  const { org } = useOrganizationContext();

  console.log(teamMembers);

  if (isPending) {
    return <h2>Loading Team Members</h2>;
  }

  if (isError) {
    return <h2>Error :{error.message}</h2>;
  }

  const teamUserIds = new Set(teamMembers?.map((m) => m.userId));

  const membersInTeam = org?.members.filter((member) =>
    teamUserIds.has(member.userId),
  );

  return (
    <div>
      <AddMembers teamId={id} />
      <Card>
        <Card.Content>
          {membersInTeam?.map((member) => (
            <div key={member.id}>
              <div>
                <h2>{member.user.email}</h2>
                <h2>{member.role}</h2>
                <h2>{member.user.name}</h2>
              </div>
              {user?.id !== member.userId && (
                <RemoveMemberFromTeam userId={member.userId} teamId={id} />
              )}
            </div>
          ))}
        </Card.Content>
      </Card>
    </div>
  );
};

export default Page;
