"use client";

import * as React from "react";
import { Check, ChevronsUpDown, GalleryVerticalEnd } from "lucide-react";

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Button, Dropdown } from "@heroui/react";

export function OrganizationSwitcher({ versions }: { versions: string[] }) {
  const [selectedVersion, setSelectedVersion] = React.useState(versions[0]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dropdown className="">
          {/* <Button aria-label="Menu" variant="secondary"> */}
          <Button size="lg" fullWidth>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <div className="flex flex-col gap-1 text-left leading-none">
              <span className="font-medium">Organization</span>
            </div>
            <ChevronsUpDown className="ml-auto" />
          </Button>
          {/* </Button> */}
          <Dropdown.Popover className={"w-[230px]"}>
            <Dropdown.Menu
              className="w-(--radix-dropdown-menu-trigger-width)"
              // align="start"
              onAction={(key) => setSelectedVersion(`${key}`)}
            >
              {versions.map((version) => (
                <Dropdown.Item
                  key={version}
                  textValue={version}
                  id={version}
                  // onSelect={() => setSelectedVersion(version)}
                >
                  v{version}{" "}
                  {version === selectedVersion && <Check className="ml-auto" />}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
