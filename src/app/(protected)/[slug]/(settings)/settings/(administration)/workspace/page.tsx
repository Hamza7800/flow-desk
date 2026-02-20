import DeleteWorkspaceCard from "@/app/(protected)/[slug]/(settings)/settings/_components/delete-workspace-card";
import OrganizationForm from "@/components/forms/organization-form";
import { getOrganization } from "@/server-actions/organization";
import Form from "./_components/form";

type Props = {
  params: Promise<{ slug: string }>;
};

const Page = async ({ params }: Props) => {
  const { slug } = await params;

  return (
    <div className="space-y-6">
      <Form slug={slug} />
      <DeleteWorkspaceCard slug={slug} />
    </div>
  );
};

export default Page;
