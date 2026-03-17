import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { OrganizationSwitcher } from "@/components/organization-switcher";
import { LinkButton } from "@/components/link-button";
import type { ComponentProps } from "react";
import UserTeams from "./teams/user-teams";
import { Layers2Icon, Mail } from "lucide-react";

export function AppSidebar({ slug, ...props }: ComponentProps<typeof Sidebar>) {
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

        {/* <WorkspaceSettings slug={`${slug}`} /> */}

        <UserTeams />

        <SidebarMenu>
          <SidebarMenuItem>
            <LinkButton
              variant="ghost"
              className={"justify-start gap-3 pl-4.5 text-left shadow-none"}
              fullWidth
              href={`/${slug}/invitations`}
            >
              <Mail size={14} /> <span> Invitations</span>
            </LinkButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
