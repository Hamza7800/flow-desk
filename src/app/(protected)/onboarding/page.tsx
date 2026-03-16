import OrganizationForm from "@/components/forms/organization-form";
import { getUserListOrganizations } from "@/server-actions/organization";
import { auth } from "@/server/better-auth";
import { Card } from "@heroui/react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Content = async () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0c0c0e] px-4">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div>
            <h1 className="text-3xl font-semibold text-white">
              Create your workspace
            </h1>
          </div>
        </div>

        <Card className="p-6">
          <Card.Content>
            <OrganizationForm mode="create" />
          </Card.Content>
          <Card.Footer className="items-center justify-center">
            <p className="mt-6 text-center text-xs text-zinc-600">
              You can create more workspaces or invite teammates after setup
            </p>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
};

export default async function OnboardingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const orgsRes = await getUserListOrganizations();
  if (orgsRes.success && orgsRes.data && orgsRes.data.length > 0) {
    await auth.api.setActiveOrganization({
      body: {
        organizationId: orgsRes.data[0]?.id,
        organizationSlug: orgsRes.data[0]?.slug,
      },
      headers: await headers(),
    });
    redirect(`/${orgsRes.data[0]?.slug}`);
  }

  return <Content />;
}
