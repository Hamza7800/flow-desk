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
    <SidebarProvider>
      <AppSidebar slug={slug} />
      {/* 1. Make the Inset a flex column that fills the viewport */}
      <SidebarInset className="flex h-svh flex-col overflow-hidden">
        <header className="sticky top-0 z-[10] flex h-16 w-full shrink-0 items-center gap-2 border-b bg-[#161616] px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h2>Settings</h2>
        </header>

        {/* 2. Remove h-screen here. Use flex-1 and min-h-0 so it's constrained by the parent */}
        <div className="mx-auto flex min-h-0 w-full flex-1 flex-col overflow-hidden">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default SettingsLayout;
