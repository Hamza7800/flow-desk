"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Accordion } from "@heroui/react";
import { OrganizationSwitcher } from "@/components/organization-switcher";
import { LinkButton } from "@/components/link-button";
import type { ComponentProps } from "react";
import { ChevronDown } from "@gravity-ui/icons";
import UserTeams from "./teams/user-teams";
import {
  Layers2Icon,
  Settings,
  SettingsIcon,
  UserSquare2,
  UsersRoundIcon,
} from "lucide-react";
import { useCurrentMemberRole } from "@/hooks/use-member-role";

const data = {
  navMain: [
    {
      title: "Workspace",
      items: [
        {
          title: "Members",
          url: "/members",
          icon: <UsersRoundIcon size={14} />,
        },
        {
          title: "Teams",
          url: "/teams",
          icon: <UserSquare2 size={14} />,
        },
      ],
    },
  ],
};

export function AppSidebar({ slug, ...props }: ComponentProps<typeof Sidebar>) {
  const { data: userRole, isPending } = useCurrentMemberRole();

  if (isPending) {
    return null;
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        {/* <Button fullWidth>Switch Organization</Button> */}
        <OrganizationSwitcher />
        {/* <SearchForm /> */}
      </SidebarHeader>
      <SidebarContent className="scrollbar-thin gap-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <LinkButton
              variant="ghost"
              className={"justify-start gap-3 pl-4.5 text-left shadow-none"}
              fullWidth
              href={`/${slug}/my-issues/assigned`}
            >
              <Layers2Icon size={14} /> <span> My Issues</span>
            </LinkButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {userRole !== "member" &&
          data.navMain.map((item) => (
            <Accordion
              key={item.title}
              className={"py-0"}
              defaultExpandedKeys={["workspace"]}
            >
              <Accordion.Item id={"workspace"}>
                <Accordion.Heading>
                  <Accordion.Trigger>
                    {item.title}
                    <Accordion.Indicator>
                      <ChevronDown />
                    </Accordion.Indicator>
                  </Accordion.Trigger>
                </Accordion.Heading>
                <Accordion.Panel className={""}>
                  {item.items.map((item) => (
                    <LinkButton
                      className={"justify-start gap-3 text-left shadow-none"}
                      fullWidth
                      variant="ghost"
                      key={item.title}
                      href={`/${slug}/${item.url}`}
                    >
                      {item.icon} {item.title}
                    </LinkButton>
                  ))}
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          ))}

        <UserTeams />

        <SidebarMenu>
          <SidebarMenuItem>
            <LinkButton
              variant="ghost"
              className={"justify-start gap-3 pl-4.5 text-left shadow-none"}
              fullWidth
              href={`/${slug}/settings/account/profile`}
            >
              <SettingsIcon size={14} />
              <span> Settings</span>
            </LinkButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
