import { AppSidebar } from "@/app/(protected)/[slug]/(dashboard)/_components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

export default async function SlugLayout({ children, params }: Props) {
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
      <SidebarInset className="overflow-hidden border bg-[#101012]">
        <div className="@container/main flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
