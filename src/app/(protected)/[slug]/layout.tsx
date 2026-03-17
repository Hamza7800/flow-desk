import OrganizationProvider from "@/components/context/organization-client-context";
import { LinkButton } from "@/components/link-button";
import WorkspaceLayoutSkeleton from "@/components/skeletons/workspace-layout-skeleton";
import { getOrganization } from "@/server-actions/organization";
import { Card } from "@heroui/react";
import { Suspense, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

const Content = async ({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) => {
  try {
    const [orgRes] = await Promise.all([
      getOrganization(slug),
      // getUserListOrganizations(),
      // getUserTeamsCurrentOrg(),
    ]);

    if (!orgRes.success) {
      throw Error(orgRes.message);
    }

    if (!orgRes.data) {
      throw new Error("Organization not found");
    }

    return (
      <OrganizationProvider
        slug={slug}
        initialData={{
          initialOrg: orgRes.data,
          // initialUserOrgs: userOrgsRes.data,
          // initialTeams: userTeamsRes.data,
        }}
      >
        {children}
      </OrganizationProvider>
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
};

const WorkspaceMainLayout = async ({ children, params }: Props) => {
  const { slug } = await params;
  return (
    <Suspense fallback={<WorkspaceLayoutSkeleton />}>
      <Content slug={slug}>{children}</Content>
    </Suspense>
  );
};

export default WorkspaceMainLayout;
