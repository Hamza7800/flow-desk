import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { LinkButton } from "@/components/link-button";
import type { ComponentProps } from "react";
import SideBarTeams from "./side-bar-teams";

const data = {
  navMain: [
    {
      title: "Personal",
      items: [
        {
          title: "Account",
          url: "account/profile",
        },
      ],
    },
    {
      title: "Administration",
      items: [
        {
          title: "Teams",
          url: "teams",
        },
        {
          title: "Members",
          url: "members",
        },

        {
          title: "Invitations",
          url: "invitations",
        },
        {
          title: "Billing",
          url: "billing",
        },
        {
          title: "Workspace",
          url: "workspace",
        },
      ],
    },
  ],
};

export function AppSidebar({ slug, ...props }: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="bg-[#161616]" {...props}>
      <SidebarHeader>
        <LinkButton fullWidth href={`/${slug}`}>
          Go Back
        </LinkButton>
      </SidebarHeader>
      <SidebarContent className="scrollbar-hide gap-0">
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <LinkButton
                      fullWidth
                      variant="ghost"
                      className="justify-start shadow-none"
                      href={`/${slug}/settings/${item.url}`}
                    >
                      {item.title}
                    </LinkButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <SideBarTeams slug={slug} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
