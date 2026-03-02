import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Accordion, Button } from "@heroui/react";
import { OrganizationSwitcher } from "@/components/organization-switcher";
import { LinkButton } from "@/components/link-button";
import type { ComponentProps } from "react";
import { ChevronDown } from "@gravity-ui/icons";
import UserTeams from "./teams/user-teams";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Workspace",
      items: [
        {
          title: "Members",
          url: "/members",
        },
        {
          title: "Teams",
          url: "/teams",
        },
      ],
    },
  ],
};

export function AppSidebar({ slug, ...props }: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="bg-[#161616]" {...props}>
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
              className={"justify-start pl-4.5 text-left shadow-none"}
              fullWidth
              href={`/${slug}/my-issues/assigned`}
            >
              My Issues
            </LinkButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {data.navMain.map((item) => (
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
                    className={"justify-start text-left shadow-none"}
                    fullWidth
                    variant="ghost"
                    key={item.title}
                    href={`/${slug}/${item.url}`}
                  >
                    {item.title}
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
              className={"justify-start pl-4.5 text-left shadow-none"}
              fullWidth
              href={`/${slug}/settings/account/profile`}
            >
              Settings
            </LinkButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
