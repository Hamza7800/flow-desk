import { getUserCreatedIssues } from "@/server-actions/issues";
import { Suspense } from "react";
import UserCreatedIssues from "@/app/(protected)/[slug]/(dashboard)/_components/issues/user-created-issues";

type Props = {
  params: Promise<{ id: string }>;
};

const Content = async ({ teamId }: { teamId: string }) => {
  try {
    const issues = await getUserCreatedIssues();
    if (!issues.success) {
      throw new Error(issues.message);
    }

    return <UserCreatedIssues teamId={teamId} initialData={issues.data} />;
  } catch (error: any) {
    return <h2>No Issues: {error.message}</h2>;
  }
};

const MyCreatedIssues = async ({ params }: Props) => {
  const { id: teamId } = await params;

  return (
    <Suspense fallback={<h2>Loading issues....</h2>}>
      <Content teamId={teamId} />
    </Suspense>
  );
};

export default MyCreatedIssues;
