"use client";

import {
  Check,
  ChevronsUpDown,
  LogOut,
  Plus,
  Settings,
  UserSquare2,
  UsersRoundIcon,
} from "lucide-react";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Button, Skeleton } from "@heroui/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useOrganizationsList,
  useSetOrgActive,
} from "@/hooks/use-organizations";
import { useOrganizationContext } from "./context/organization-client-context";
import { useAuth } from "./context/auth-context";
import { useCurrentMemberRole } from "@/hooks/use-member-role";
import { useParams, useRouter } from "next/navigation";

export function OrganizationSwitcherDropdown() {
  const action = useSetOrgActive();
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const { org: activeOrg } = useOrganizationContext();
  const { user, logout } = useAuth();
  const { data: memberRole } = useCurrentMemberRole();
  const { data: organizations, isPending } = useOrganizationsList();

  const isAllowed = memberRole === "admin" || memberRole === "owner";

  if (isPending) return <Skeleton className="h-10 w-full rounded-md" />;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-10 w-full justify-start gap-2 px-3 text-left hover:bg-zinc-800 hover:text-white"
            >
              <div className="flex aspect-square size-6 shrink-0 items-center justify-center rounded-md bg-zinc-700 text-xs font-bold text-white">
                {activeOrg?.name?.[0]?.toUpperCase()}
              </div>
              <span className="flex-1 truncate text-sm font-medium text-zinc-200">
                {activeOrg?.name}
              </span>
              <ChevronsUpDown size={14} className="shrink-0 text-zinc-500" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[260px] border-zinc-800 bg-zinc-900 text-zinc-200"
            align="start"
            side="bottom"
          >
            <DropdownMenuLabel className="text-xs font-normal text-zinc-500">
              {user?.email}
            </DropdownMenuLabel>

            {organizations?.map((org) => (
              <DropdownMenuItem
                key={org.id}
                className="mb-1 gap-2 focus:bg-zinc-800 focus:text-white"
                onSelect={() => {
                  if (org.id === activeOrg?.id) return;
                  action.mutate({ id: org.id, slug: org.slug });
                }}
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-zinc-700 text-[10px] font-bold text-white">
                  {org.name[0]?.toUpperCase()}
                </div>
                <span className="flex-1 truncate text-sm">{org.name}</span>
                {activeOrg?.id === org.id && (
                  <Check size={12} className="text-blue-400" />
                )}
              </DropdownMenuItem>
            ))}

            <DropdownMenuItem
              className="gap-2 text-zinc-400 focus:bg-zinc-800 focus:text-zinc-300"
              onSelect={() => router.push("/create-new-org")}
            >
              <Plus size={13} />
              <span className="text-sm">New workspace</span>
            </DropdownMenuItem>

            {/* Workspace settings */}
            {isAllowed && (
              <>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuLabel className="text-xs font-normal text-zinc-500">
                  Workspace
                </DropdownMenuLabel>

                <DropdownMenuItem
                  className="gap-2 focus:bg-zinc-800 focus:text-white"
                  onSelect={() => router.push(`/${slug}/members`)}
                >
                  <UsersRoundIcon size={13} />
                  <span className="text-sm">Members</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="gap-2 focus:bg-zinc-800 focus:text-white"
                  onSelect={() => router.push(`/${slug}/teams`)}
                >
                  <UserSquare2 size={13} />
                  <span className="text-sm">Teams</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="gap-2 focus:bg-zinc-800 focus:text-white"
                  onSelect={() => router.push(`/${slug}/settings`)}
                >
                  <Settings size={13} />
                  <span className="text-sm">Settings</span>
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuSeparator className="bg-zinc-800" />

            <DropdownMenuItem
              className="gap-2 text-red-400 focus:bg-zinc-800 focus:text-red-400"
              onSelect={logout}
            >
              <LogOut size={13} />
              <span className="text-sm">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
