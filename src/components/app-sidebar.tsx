import * as React from "react";
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

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        {/* <Button fullWidth>Switch Organization</Button> */}
        <OrganizationSwitcher versions={data.versions} />
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
              <Accordion.Panel className={"space-y-2 px-2 py-1"}>
                {item.items.map((item) => (
                  <Button
                    className={"block text-left"}
                    fullWidth
                    variant="ghost"
                    key={item.title}
                  >
                    <Link href={item.url}>{item.title}</Link>
                  </Button>
                ))}
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
