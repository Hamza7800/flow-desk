import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import type { ReactNode } from "react";
import { AppSidebar } from "./_components/app-sidebar";
import { Separator } from "@/components/ui/separator";

type Props = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

// TODO: WILL FIX SETTINGS LATER
const SettingsLayout = async ({ children, params }: Props) => {
  const { slug } = await params;

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
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default SettingsLayout;
