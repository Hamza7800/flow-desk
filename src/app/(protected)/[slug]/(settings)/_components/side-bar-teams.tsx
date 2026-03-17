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
import { ErrorMessage } from "@heroui/react";
import { BoxIcon } from "lucide-react";

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
    return null;
  }

  if (isError) {
    return <ErrorMessage>Failed to load teams</ErrorMessage>;
  }

  // console.log(teams);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{data.title}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {!teams?.length ? (
            <ErrorMessage className="px-4 py-2 text-sm text-slate-500">
              No teams
            </ErrorMessage>
          ) : (
            teams?.map((team) => (
              <SidebarMenuItem key={team.id}>
                <LinkButton
                  fullWidth
                  variant="ghost"
                  className="justify-start shadow-none"
                  href={`/${slug}/settings/teams/${team.id}`}
                >
                  <BoxIcon size={14} /> {team.name}
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
