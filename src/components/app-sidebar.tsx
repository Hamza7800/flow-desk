import { ChevronDown, ChevronRight } from "lucide-react";

// import { SearchForm } from "@/components/search-form"
// import { VersionSwitcher } from "@/components/version-switcher"
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Accordion, Button } from "@heroui/react";
import Link from "next/link";
import { OrganizationSwitcher } from "./organization-switcher";
import { LinkButton } from "./link-button";
import type { ComponentProps } from "react";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Getting Started",
      url: "#",
      items: [
        {
          title: "Installation",
          url: "#",
        },
        {
          title: "Project Structure",
          url: "#",
        },
      ],
    },
    {
      title: "Build Your Application",
      url: "#",
      items: [
        {
          title: "Routing",
          url: "#",
        },
        {
          title: "Data Fetching",
          url: "#",
          isActive: true,
        },
        {
          title: "Rendering",
          url: "#",
        },
        {
          title: "Caching",
          url: "#",
        },
        {
          title: "Styling",
          url: "#",
        },
      ],
    },
    {
      title: "API Reference",
      url: "#",
      items: [
        {
          title: "Components",
          url: "#",
        },
        {
          title: "File Conventions",
          url: "#",
        },
        {
          title: "Functions",
          url: "#",
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
      <SidebarContent className="scrollbar-hide gap-0">
        {data.navMain.map((item) => (
          <Accordion
            key={item.title}
            className={"py-0"}
            // title={item.title}
            // defaultOpen
          >
            <Accordion.Item>
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
                    href={item.url}
                  >
                    {item.title}
                  </LinkButton>
                ))}
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        ))}
        <SidebarMenu>
          <SidebarMenuItem>
            <LinkButton
              className={"justify-start text-left shadow-none"}
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
