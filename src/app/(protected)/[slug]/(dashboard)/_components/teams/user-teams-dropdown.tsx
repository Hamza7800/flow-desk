"use client";

import { LinkButton } from "@/components/link-button";
import { useUserTeams } from "@/hooks/use-teams";
import { Spinner, ErrorMessage, Accordion } from "@heroui/react";
import { BoxIcon, Layers2Icon, ChevronDown, UserSquare2 } from "lucide-react";
import { useParams } from "next/navigation";

const items = [
  { title: "Projects", url: "projects", icon: <BoxIcon size={14} /> },
  { title: "Issues", url: "issues", icon: <Layers2Icon size={14} /> },
];

export const UserTeamsDropdown = () => {
  const { slug } = useParams<{ slug: string }>();
  // const { userTeams } = useOrganizationContext();
  const { data: teams, isPending, isError } = useUserTeams();

  if (isPending) {
    return (
      <div className="flex justify-center py-4">
        <Spinner size="sm" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorMessage className="px-4 py-2 text-sm">
        Failed to load teams
      </ErrorMessage>
    );
  }

  return (
    <Accordion defaultExpandedKeys={["teams"]} className="py-0">
      <Accordion.Item id={"teams"}>
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
            {!teams?.length ? (
              <p className="px-4 py-2 text-sm text-slate-500">No teams</p>
            ) : (
              teams?.map((team) => (
                <Accordion
                  key={team.id}
                  defaultExpandedKeys={[team.id]}
                  className="py-0"
                >
                  <Accordion.Item id={team.id}>
                    <Accordion.Heading>
                      <Accordion.Trigger className="rounded-md px-2 py-1 text-sm">
                        <div className="flex items-center gap-2">
                          <UserSquare2 size={16} /> <span>{team.name}</span>
                        </div>
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
                            href={`/${slug}/team/${team.id}/${item.title.toLowerCase()}/all`}
                            fullWidth
                            variant="ghost"
                            className="justify-start text-left text-sm shadow-none"
                          >
                            {item.icon} {item.title}
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
