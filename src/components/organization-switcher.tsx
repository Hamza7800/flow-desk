"use client";

import { Check, ChevronsUpDown, GalleryVerticalEnd } from "lucide-react";

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Button, Dropdown, Header, Label, Spinner } from "@heroui/react";
import {
  useOrganizationsList,
  useSetOrgActive,
} from "@/hooks/use-organizations";
import { authClient } from "@/server/better-auth/client";
import { useOrganizationContext } from "./context/organization-client-context";
import { useAuth } from "./context/auth-context";
import { useCurrentMemberRole } from "@/hooks/use-member-role";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export function OrganizationSwitcher() {
  const action = useSetOrgActive();
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const { userOrgs } = useOrganizationContext();
  const { user, logout } = useAuth();
  const { data: memberRole } = useCurrentMemberRole();
  const {
    data: organizations,
    isPending,
    isError,
  } = useOrganizationsList(userOrgs);
  const { data: activeOrganization } = authClient.useActiveOrganization();

  if (isPending) {
    return <Spinner />;
  }

  if (isError) {
    <h2>Unable to get Organizations</h2>;
  }

  if (action.isError) {
    <h2>Unable to set Organization active</h2>;
  }

  const isAllowed = memberRole === "admin" || memberRole === "owner";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dropdown>
          <Button variant="outline" size="lg" fullWidth>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <div className="flex flex-col gap-1 text-left leading-none">
              <span className="font-medium">{activeOrganization?.name}</span>
            </div>
            <ChevronsUpDown className="ml-auto" />
          </Button>
          <Dropdown.Popover className={"w-[230px]"}>
            <Dropdown.Menu
              className="w-(--radix-dropdown-menu-trigger-width)"
              onAction={(key) => console.log(`Selected: ${key}`)}
            >
              {isAllowed && (
                <Dropdown.Item
                  onClick={() => router.push(`/${slug}/settings`)}
                  id="settings"
                  textValue="settings"
                >
                  <Label>Settings</Label>
                </Dropdown.Item>
              )}
              <Dropdown.SubmenuTrigger>
                <Dropdown.Item id="org-info" textValue="org-info">
                  <Label>Switch Workspace</Label>
                  <Dropdown.SubmenuIndicator />
                </Dropdown.Item>
                <Dropdown.Popover>
                  <Dropdown.Menu>
                    <Dropdown.Section>
                      <Header>{user?.email}</Header>
                      {organizations?.map((org) => (
                        <Dropdown.Item
                          key={org.id}
                          textValue={org.slug}
                          id={org.slug}
                          onClick={() => {
                            if (activeOrganization?.id === org.id) {
                              return;
                            }
                            action.mutate({ id: org.id, slug: org.slug });
                          }}
                          // onSelect={() => setSelectedVersion(version)}
                        >
                          {org.name}{" "}
                          {org.slug === activeOrganization?.slug && (
                            <Check className="ml-auto" size={14} />
                          )}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Section>
                    <Dropdown.Section>
                      <Header>Account</Header>
                      <Dropdown.Item>Join or create organization</Dropdown.Item>
                    </Dropdown.Section>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown.SubmenuTrigger>
              <Dropdown.Item onClick={logout} id="logout" textValue="logout">
                <Label>Logout</Label>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
