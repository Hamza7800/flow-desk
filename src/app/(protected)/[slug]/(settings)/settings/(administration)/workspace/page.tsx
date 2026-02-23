import DeleteWorkspaceCard from "@/app/(protected)/[slug]/(settings)/settings/_components/delete-workspace-card";
import Form from "./_components/form";

const Page = () => {
  return (
    <div className="space-y-6">
      <Form />
      <DeleteWorkspaceCard />
    </div>
  );
};

export default Page;
