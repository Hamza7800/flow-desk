"use client";

import {
  Check,
  ChevronsUpDown,
  GalleryVerticalEnd,
  LogOut,
  Plus,
  Settings,
  UserSquare2,
  UsersRoundIcon,
} from "lucide-react";

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import {
  Button,
  Dropdown,
  ErrorMessage,
  Header,
  Label,
  Skeleton,
  Spinner,
} from "@heroui/react";
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
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";

export function OrganizationSwitcherDropdown() {
  const action = useSetOrgActive();
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const { org: activeOrg } = useOrganizationContext();
  const { user, logout } = useAuth();
  const { data: memberRole } = useCurrentMemberRole();
  const { data: organizations, isPending, isError } = useOrganizationsList();
  // const { data: activeOrganization } = authClient.useActiveOrganization();

  if (isPending) {
    return <Skeleton className="h-10 w-full rounded-sm" />;
  }

  if (isError) {
    <ErrorMessage>Unable to get Organizations</ErrorMessage>;
  }

  if (action.isError) {
    <ErrorMessage>Unable to set Organization active</ErrorMessage>;
  }

  const isAllowed = memberRole === "admin" || memberRole === "owner";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dropdown>
          {/* Trigger */}
          <Button variant="outline" size="lg" fullWidth>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <div className="flex min-w-0 flex-col gap-1 text-left leading-none">
              <span className="max-w-sm truncate font-medium">
                {activeOrg?.name}
              </span>
            </div>
            <ChevronsUpDown className="ml-auto" />
          </Button>

          <Dropdown.Popover className="w-[230px]">
            <Dropdown.Menu>
              <Dropdown.Section>
                <Header className="px-2 py-1 text-xs text-zinc-500">
                  {user?.email}
                </Header>
                {organizations?.map((org) => (
                  <Dropdown.Item
                    key={org.id}
                    id={org.slug}
                    textValue={org.slug}
                    onPress={() => {
                      if (activeOrg?.id === org.id) return;
                      action.mutate({ id: org.id, slug: org.slug });
                    }}
                  >
                    <div className="flex w-full items-center gap-2">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-zinc-700 text-[10px] font-bold text-white">
                        {org.name[0]?.toUpperCase()}
                      </div>
                      <span className="flex-1 truncate text-sm">
                        {org.name}
                      </span>
                      {activeOrg?.id === org.id && (
                        <Check size={13} className="text-blue-400" />
                      )}
                    </div>
                  </Dropdown.Item>
                ))}

                <Dropdown.Item
                  id="create-org"
                  textValue="create-org"
                  onPress={() => router.push("/create-new-org")}
                >
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Plus size={13} />
                    <span className="text-sm">New workspace</span>
                  </div>
                </Dropdown.Item>
              </Dropdown.Section>

              {/* Settings + Logout */}

              {isAllowed && (
                <Dropdown.Section>
                  <Header className="px-2 py-1 text-xs text-zinc-500">
                    Workspace
                  </Header>

                  <Dropdown.Item
                    id="members"
                    textValue="members"
                    onPress={() => router.push(`/${slug}/members`)}
                  >
                    <div className="flex items-center gap-2">
                      <UsersRoundIcon size={13} />
                      <span className="text-sm">Members</span>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item
                    id="teams"
                    textValue="teams"
                    onPress={() => router.push(`/${slug}/teams`)}
                  >
                    <div className="flex items-center gap-2">
                      <UserSquare2 size={13} />
                      <span className="text-sm">Teams</span>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item
                    id="settings"
                    textValue="settings"
                    onPress={() => router.push(`/${slug}/settings`)}
                  >
                    <div className="flex items-center gap-2">
                      <Settings size={13} />
                      <Label>Settings</Label>
                    </div>
                  </Dropdown.Item>
                </Dropdown.Section>
              )}
              <Dropdown.Item id="logout" textValue="logout" onPress={logout}>
                <div className="flex items-center gap-2 text-red-400">
                  <LogOut size={13} />
                  <Label>Logout</Label>
                </div>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
