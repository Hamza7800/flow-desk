"use client";

import { useOrganizationContext } from "@/components/context/organization-client-context";
import { LinkButton } from "@/components/link-button";
import { useOrgTeams } from "@/hooks/use-teams";
import { Card, Spinner } from "@heroui/react";
import DeleteTeams from "@/app/(protected)/[slug]/(settings)/settings/_components/delete-teams";

// TODO: EDIT TEAM
const Page = () => {
  const { org } = useOrganizationContext();
  const { data: teams, isPending, isError } = useOrgTeams(org?.id ?? "");

  if (!org) return null;

  if (isPending) {
    return (
      <div className="flex justify-center py-10">
        <Spinner size="md" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="px-4 py-6 text-center text-sm text-slate-400">
        Failed to load teams
      </p>
    );
  }

  return (
    <div className="space-y-4 px-6 py-6">
      {!teams?.data?.length ? (
        <div className="rounded-xl border border-dashed border-slate-700 p-10 text-center text-slate-500">
          No teams yet
        </div>
      ) : (
        teams.data.map((team) => (
          <Card key={team.id} className="">
            <Card.Header className="flex flex-row items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {team.name}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {/* View */}
                <LinkButton
                  href={`/${org.slug}/settings/teams/${team.id}`}
                  size="sm"
                  variant="ghost"
                  className="shadow-none"
                >
                  View
                </LinkButton>

                {/* Delete */}
                <DeleteTeams teamId={team.id} orgId={team.organizationId} />
              </div>
            </Card.Header>
          </Card>
        ))
      )}
    </div>
  );
};

export default Page;
