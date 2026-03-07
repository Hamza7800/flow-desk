"use client";

import { useOrganizationContext } from "@/components/context/organization-client-context";
import { LinkButton } from "@/components/link-button";
import { useOrgTeams } from "@/hooks/use-teams";
import type { TeamsType } from "@/server-actions/teams";
import { Card } from "@heroui/react";
import { TeamJoinButton } from "./remove-member-from-team";

const OrgTeams = ({ initialData }: { initialData: TeamsType["data"] }) => {
  const { org } = useOrganizationContext();
  const { data: teams, isError } = useOrgTeams(org?.id ?? "", initialData);

  if (isError) {
    return (
      <p className="px-4 py-6 text-center text-sm text-slate-400">
        Failed to load teams
      </p>
    );
  }

  return (
    <div className="space-y-4 px-6 py-6">
      {!teams?.length ? (
        <div className="rounded-xl border border-dashed border-slate-700 p-10 text-center text-slate-500">
          No teams yet
        </div>
      ) : (
        teams.map((team) => (
          <Card key={team.id} className="w-full">
            <Card.Header className="flex flex-row items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {team.name}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {/* View */}
                <LinkButton
                  href={`/${org?.slug}/settings/teams/${team.id}`}
                  size="sm"
                  variant="ghost"
                  className="shadow-none"
                >
                  View
                </LinkButton>
                <TeamJoinButton
                  teamId={team.id}
                  orgId={org?.id ?? ""}
                  isMember={false}
                />
              </div>
            </Card.Header>
          </Card>
        ))
      )}
    </div>
  );
};

export default OrgTeams;
