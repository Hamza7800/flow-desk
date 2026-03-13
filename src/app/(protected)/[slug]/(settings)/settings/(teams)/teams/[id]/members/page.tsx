"use client";
import AddMembers from "@/app/(protected)/[slug]/(dashboard)/_components/teams/add-members";
import { RemoveMemberFromTeam } from "@/app/(protected)/[slug]/(dashboard)/_components/teams/remove-member-from-team";
import { Avatar } from "@/components/avatar";
import { useAuth } from "@/components/context/auth-context";
import { useOrganizationContext } from "@/components/context/organization-client-context";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import PermissionGate from "@/components/permission-gate";
import { useTeamMembers, useUserTeams } from "@/hooks/use-teams";
import { Button, Card, Chip } from "@heroui/react";
import { Mail, Users } from "lucide-react";
import { useParams } from "next/navigation";

const TeamMembers = () => {
  const { id, slug } = useParams<{ id: string; slug: string }>();
  const {
    data: teamMembers,
    isPending,
    isError,
    error,
    refetch,
  } = useTeamMembers(id);
  const { user } = useAuth();
  const { org } = useOrganizationContext();
  // const { user } = useAuth();
  if (isPending) {
    return <LoadingState label="Loading Members" />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load members"
        message={error?.message}
        onRetry={() => refetch()}
        homeHref={`/${slug}`}
      />
    );
  }

  const teamUserIds = new Set(teamMembers?.map((m) => m.userId));

  const membersInTeam = org?.members.filter((member) =>
    teamUserIds.has(member.userId),
  );

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <main className="scrollbar-thin min-h-0 flex-1 overflow-y-auto pb-20">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-semibold text-white">Members</h1>
              <p className="text-xs text-zinc-500">
                {membersInTeam?.length} member
                {membersInTeam?.length !== 1 ? "s" : ""} in Team
              </p>
            </div>
            <PermissionGate permission="canManageTeamMembers">
              <AddMembers teamId={id} />
            </PermissionGate>
          </div>
        </div>

        <div className="space-y-6 px-2">
          <Card className="p-0">
            <Card.Header className="p-4 pb-0">
              <div className="flex items-center gap-2">
                <Users size={15} className="text-zinc-400" />
                <Card.Title className="text-sm font-medium text-white">
                  Team Members
                </Card.Title>
                <Chip variant="secondary" size="sm" className="ml-auto text-xs">
                  {membersInTeam?.length}
                </Chip>
              </div>
            </Card.Header>

            <Card.Content className="pt-3">
              <div className="mb-2 grid grid-cols-[1fr_auto_1fr] gap-4 px-3 text-[11px] font-medium tracking-wider text-zinc-600 uppercase">
                <span>Member</span>
                <span>Role</span>
                <span></span>
              </div>

              <div>
                {membersInTeam?.map((member) => (
                  <div
                    key={member.id}
                    className="group grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-zinc-800/30"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar
                        name={member.user.name}
                        email={member.user.email}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">
                          {member.user.name}
                          {member.userId === user?.id && (
                            <span className="ml-1.5 text-[10px] font-normal text-zinc-500">
                              (you)
                            </span>
                          )}
                        </p>
                        <p className="flex items-center gap-1 truncate text-xs text-zinc-500">
                          <Mail size={10} />
                          {member.user.email}
                        </p>
                      </div>
                    </div>

                    <Chip
                      variant="secondary"
                      // color={roleColor(member.role) as any}
                      size="sm"
                      className="gap-1 text-xs"
                    >
                      {/* {roleIcon(member.role)} */}
                      {member.role}
                    </Chip>

                    <PermissionGate permission={"canInviteMembers"}>
                      <div className="ml-auto">
                        {member.role !== "owner" && (
                          <RemoveMemberFromTeam
                            userId={member.userId}
                            teamId={id}
                          />
                        )}
                      </div>
                    </PermissionGate>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TeamMembers;
