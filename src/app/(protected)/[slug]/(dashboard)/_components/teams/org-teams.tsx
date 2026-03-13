"use client";

import { useOrganizationContext } from "@/components/context/organization-client-context";
import { ErrorState } from "@/components/error-state";
import { LinkButton } from "@/components/link-button";
import { useCurrentMemberRole } from "@/hooks/use-member-role";
import { useOrgTeams } from "@/hooks/use-teams";
import type { TeamsType } from "@/server-actions/teams";
import { Card, Chip } from "@heroui/react";
import { ArrowRight, Box, UserSquare } from "lucide-react";
import { useRouter } from "next/navigation";

const OrgTeams = ({ initialData }: { initialData: TeamsType["data"] }) => {
  const { org } = useOrganizationContext();
  const { data: userRole, isPending } = useCurrentMemberRole();

  const {
    data: teams,
    isError,
    error,
    refetch,
  } = useOrgTeams(org?.id ?? "", initialData);
  const router = useRouter();

  if (isError) {
    return (
      <ErrorState
        title="Failed to load teams"
        message={error?.message}
        onRetry={() => refetch()}
        homeHref={`/${org?.slug}`}
      />
    );
  }

  if (isPending) {
    return null;
  }

  if (userRole === "member") {
    return (
      <ErrorState
        title="Access Denied"
        message={"You don't have permission to view this page"}
        // onRetry={() => refetch()}
        homeHref={`/${org?.slug}`}
      />
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <main className="scrollbar-thin min-h-0 flex-1 overflow-y-auto pb-20">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-semibold text-white">Teams</h1>
              <p className="text-xs text-zinc-500">
                {teams?.length} team
                {teams?.length !== 1 ? "s" : ""}
              </p>
            </div>
            {/* <PermissionGate permission="canInviteMembers">
              <Button
                variant="outline"
                size="sm"
                onPress={() => setIsInviteModalOpen(true)}
              >
                <UserPlus size={14} className="mr-1" />
                Invite
              </Button>
            </PermissionGate> */}
          </div>
        </div>

        <div className="space-y-6 px-2">
          <Card className="p-0">
            <Card.Header className="p-4 pb-0">
              <div className="flex items-center gap-2">
                <UserSquare size={15} className="text-zinc-400" />
                <Card.Title className="text-sm font-medium text-white">
                  Teams
                </Card.Title>
                <Chip variant="secondary" size="sm" className="ml-auto text-xs">
                  {teams?.length}
                </Chip>
              </div>
            </Card.Header>

            <Card.Content className="pt-3">
              <div>
                {teams?.map((team) => (
                  <Card
                    onClick={() =>
                      router.push(`/${org?.slug}/settings/teams/${team.id}`)
                    }
                    key={team.id}
                    className="group items-center gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-zinc-800/30"
                  >
                    <div className="flex w-full items-center justify-between">
                      <p className="flex items-center gap-2 truncate text-sm font-medium text-white">
                        <Box /> {team?.name}
                      </p>
                      <ArrowRight />
                    </div>
                  </Card>
                ))}
              </div>
            </Card.Content>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default OrgTeams;
