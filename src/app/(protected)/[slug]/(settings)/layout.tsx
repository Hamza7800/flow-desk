"use client";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import type { ReactNode } from "react";
import { AppSidebar } from "./_components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import { useCurrentMemberRole } from "@/hooks/use-member-role";
import { ErrorState } from "@/components/error-state";

type Props = {
  children: ReactNode;
  // params: Promise<{ slug: string }>;
};

const SettingsLayout = ({ children }: Props) => {
  const { slug } = useParams<{ slug: string }>();
  const { data: memberRole, isPending } = useCurrentMemberRole();

  const isAllowed = memberRole === "admin" || memberRole === "owner";

  return (
    <SidebarProvider
      style={
        {
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar slug={slug} variant="inset" />
      <SidebarInset className="flex h-screen flex-col overflow-hidden border bg-[#101012]">
        <div className="p-2">
          <SidebarTrigger />
        </div>
        <Separator />
        <div className="@container/main flex min-h-0 flex-1 flex-col overflow-hidden p-2">
          {isAllowed
            ? children
            : !isPending && (
                <ErrorState
                  title="Access Denied"
                  message={"You don't have permission to view this page"}
                  // onRetry={() => refetch()}
                  homeHref={`/${slug}`}
                />
              )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default SettingsLayout;
