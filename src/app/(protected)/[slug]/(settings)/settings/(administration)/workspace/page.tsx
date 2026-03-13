import DeleteWorkspaceCard from "@/app/(protected)/[slug]/(settings)/settings/_components/delete-workspace-card";
import Form from "./_components/form";
import { Card } from "@heroui/react";

const Page = () => {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <main className="scrollbar-thin mx-auto min-h-0 w-full max-w-lg flex-1 overflow-y-auto pb-20">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-white">Workspace</h1>
            </div>
          </div>
        </div>

        <div className="px-2">
          <Card className="p-0 px-2">
            <Card.Content className="pt-3">
              <Form />
            </Card.Content>
          </Card>
          <Card className="mt-3 p-0 px-2">
            <Card.Content className="">
              <DeleteWorkspaceCard />
            </Card.Content>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Page;
