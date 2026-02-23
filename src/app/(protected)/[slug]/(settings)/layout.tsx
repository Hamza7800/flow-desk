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
      <SidebarInset>
        <header className="sticky top-0 z-[10] flex h-16 w-full shrink-0 items-center gap-2 border-b bg-[#161616] px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </header>
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default SettingsLayout;
