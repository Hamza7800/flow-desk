import DeleteWorkspaceCard from "@/app/(protected)/[slug]/(settings)/settings/_components/delete-workspace-card";
type Props = {
  params: Promise<{ slug: string }>;
};

const Page = async ({ params }: Props) => {
  const { slug } = await params;

  return (
    <div>
      <DeleteWorkspaceCard slug={slug} />
    </div>
  );
};

export default Page;
