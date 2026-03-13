import DeleteWorkspaceCard from "@/app/(protected)/[slug]/(settings)/settings/_components/delete-workspace-card";
import { Card } from "@heroui/react";

const Page = async () => {
  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="px-2">
        <Card className="mt-3 p-0 px-2">
          <Card.Content className="">
            <DeleteWorkspaceCard />
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default Page;
