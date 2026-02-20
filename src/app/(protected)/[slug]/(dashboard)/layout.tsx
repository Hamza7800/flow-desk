import { AppSidebar } from "@/app/(protected)/[slug]/(dashboard)/_components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

export default async function SlugLayout({ children, params }: Props) {
  const { slug } = await params;

  return (
    <SidebarProvider>
      <AppSidebar slug={slug} />
      <SidebarInset>
        <header className="sticky top-0 z-[100] flex h-16 w-full shrink-0 items-center gap-2 border-b bg-[#161616] px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </header>
        <div className="mx-auto flex max-w-7xl flex-1 flex-col gap-4 p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
