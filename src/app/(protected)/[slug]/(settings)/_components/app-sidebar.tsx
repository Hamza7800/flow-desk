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
import { Box, Mail, Receipt, User, Users } from "lucide-react";

const data = {
  navMain: [
    // {
    //   title: "Personal",
    //   items: [
    //     {
    //       title: "Account",
    //       url: "account/profile",
    //       icon: <User size={14} />,
    //     },
    //   ],
    // },
    {
      title: "Administration",
      items: [
        {
          title: "Members",
          url: "members",
          icon: <Users size={14} />,
        },

        {
          title: "Invitations",
          url: "invitations",
          icon: <Mail size={14} />,
        },
        // {
        //   title: "Billing",
        //   url: "billing",
        //   icon: <Receipt size={14} />,
        // },
        {
          title: "Workspace",
          url: "workspace",
          icon: <Box size={14} />,
        },
      ],
    },
  ],
};

export function AppSidebar({ slug, ...props }: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
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
                      {item.icon} {item.title}
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
