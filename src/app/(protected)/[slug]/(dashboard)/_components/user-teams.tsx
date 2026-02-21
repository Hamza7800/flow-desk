"use client";

import { useOrganizationContext } from "@/components/context/organization-client-context";
import { LinkButton } from "@/components/link-button";
import { useOrgTeams } from "@/hooks/use-teams";
import { ChevronDown } from "@gravity-ui/icons";
import { Accordion, Spinner } from "@heroui/react";

const items = [
  { title: "Projects", url: "projects" },
  { title: "Issues", url: "issues" },
];

const UserTeams = () => {
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

  return (
    <Accordion className="py-0">
      <Accordion.Item>
        <Accordion.Heading>
          <Accordion.Trigger className="rounded-md px-4 py-2">
            <span className="font-medium">Your Teams</span>
            <Accordion.Indicator>
              <ChevronDown />
            </Accordion.Indicator>
          </Accordion.Trigger>
        </Accordion.Heading>

        <Accordion.Panel className="mt-2">
          <div className="ml-5 space-y-3 border-l border-white/50 pl-3">
            {!teams.data?.length ? (
              <p className="px-4 py-2 text-sm text-slate-500">No teams</p>
            ) : (
              teams?.data?.map((team) => (
                <Accordion key={team.id} className="py-0">
                  <Accordion.Item>
                    <Accordion.Heading>
                      <Accordion.Trigger className="rounded-md px-2 py-1 text-sm">
                        {team.name}
                        <Accordion.Indicator>
                          <ChevronDown />
                        </Accordion.Indicator>
                      </Accordion.Trigger>
                    </Accordion.Heading>

                    <Accordion.Panel className="mt-2">
                      <div className="ml-4 space-y-1 border-l border-white/50">
                        {items.map((item) => (
                          <LinkButton
                            key={item.title}
                            href={`/${org.slug}/team/${team.id}/${item.title.toLowerCase()}/all`}
                            fullWidth
                            variant="ghost"
                            className="justify-start text-left text-sm shadow-none"
                          >
                            {item.title}
                          </LinkButton>
                        ))}
                      </div>
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion>
              ))
            )}
          </div>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default UserTeams;
