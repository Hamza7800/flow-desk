import { AppSidebar } from "@/components/app-sidebar";
import OrganizationProvider from "@/components/context/organization-client-context";
import { LinkButton } from "@/components/link-button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getOrganization } from "@/server-actions/organization";
import { Breadcrumbs, Card } from "@heroui/react";
import { Suspense, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

export default async function SlugLayout({ children, params }: Props) {
  try {
    const { slug } = await params;
    const result = await getOrganization(slug);

    if (!result.success) {
      throw Error(result.error);
    }

    if (!result.organization) {
      throw new Error("Organization not found");
    }

    return (
      <Suspense fallback={<h2>Loading....</h2>}>
        <OrganizationProvider slug={slug} initialOrg={result.organization}>
          <SidebarProvider>
            <AppSidebar slug={slug} />
            <SidebarInset>
              <header className="sticky top-0 flex h-16 w-full shrink-0 items-center gap-2 border-b bg-[#161616] px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumbs>
                  <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
                  {/* <Breadcrumbs.Item>Products</Breadcrumbs.Item> */}
                  {/* <Breadcrumbs.Item>Electronics</Breadcrumbs.Item> */}
                  <Breadcrumbs.Item>
                    {result.organization.name}
                  </Breadcrumbs.Item>
                </Breadcrumbs>
              </header>
              <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
            </SidebarInset>
          </SidebarProvider>
        </OrganizationProvider>
      </Suspense>
    );
  } catch (error: any) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="mx-auto flex w-lg items-center justify-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            !
          </div>

          <h2 className="text-xl font-semibold">No Found</h2>

          <p className="text-muted-foreground mt-2 text-sm">{error?.message}</p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <LinkButton href="/">Home</LinkButton>
          </div>
        </Card>
      </div>
    );
  }
}
