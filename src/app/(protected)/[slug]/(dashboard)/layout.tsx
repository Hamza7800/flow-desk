import { AppSidebar } from "@/app/(protected)/[slug]/(dashboard)/_components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  getActiveOrg,
  getOrganization,
  getOrganizationById,
  setActiveOrganization,
} from "@/server-actions/organization";
import { redirect } from "next/navigation";
import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

export default async function SlugLayout({ children, params }: Props) {
  const { slug } = await params;

  const [orgRes, activeOrgRes] = await Promise.all([
    getOrganization(slug),
    getActiveOrg(),
  ]);

  if (!activeOrgRes.success || !activeOrgRes.data) {
    redirect("/");
  }

  const activeOrgId = activeOrgRes.data;

  if (!orgRes.success || !orgRes.data || orgRes.data.id !== activeOrgId) {
    const activeOrgByIdRes = await getOrganizationById(activeOrgId);

    if (!activeOrgByIdRes.success || !activeOrgByIdRes.data) {
      redirect("/");
    }
    await setActiveOrganization(
      activeOrgByIdRes.data.id,
      activeOrgByIdRes.data.slug,
    );

    redirect(`/${activeOrgByIdRes.data.slug}/my-issues/assigned`);
  }

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
        <div className="@container/main flex h-full min-h-0 flex-1 flex-col">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
