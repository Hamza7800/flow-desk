"use client";
import { useOrganizationContext } from "@/components/context/organization-client-context";
import { LinkButton } from "@/components/link-button";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useOrgTeams } from "@/hooks/use-teams";
import { Spinner } from "@heroui/react";

const data = {
  title: "Teams",
  items: [
    {
      title: "One",
      url: "one",
    },
    {
      title: "Two",
      url: "two",
    },
  ],
};

const SideBarTeams = ({ slug }: { slug?: string }) => {
  const { org } = useOrganizationContext();

  const { data: teams, isPending, isError } = useOrgTeams(org?.id ?? "");

  if (!org) return null;

  if (isPending) {
    return (
      <div className="flex justify-center py-4">
        <Spinner size="sm" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="px-4 py-2 text-sm text-slate-400">Failed to load teams</p>
    );
  }

  console.log(teams);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{data.title}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {!teams?.length ? (
            <p className="px-4 py-2 text-sm text-slate-500">No teams</p>
          ) : (
            teams?.map((team) => (
              <SidebarMenuItem key={team.id}>
                <LinkButton
                  fullWidth
                  variant="ghost"
                  className="justify-start shadow-none"
                  href={`/${slug}/settings/teams/${team.id}`}
                >
                  {team.name}
                </LinkButton>
              </SidebarMenuItem>
            ))
          )}
        </SidebarMenu>

        <SidebarMenu>
          <SidebarMenuItem>
            <LinkButton
              fullWidth
              variant="ghost"
              className="justify-start shadow-none"
              href={`/${slug}/settings/new-team`}
            >
              Create Team
            </LinkButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SideBarTeams;
