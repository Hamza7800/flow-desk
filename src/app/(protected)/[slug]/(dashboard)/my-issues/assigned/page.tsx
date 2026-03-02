import { getUserAssignedIssues } from "@/server-actions/issues";
import { Suspense } from "react";
import UserAssignedIssues from "@/app/(protected)/[slug]/(dashboard)/_components/issues/user-assigned-issues";

type Props = {
  params: Promise<{ id: string }>;
};

const Content = async ({ teamId }: { teamId: string }) => {
  try {
    const issues = await getUserAssignedIssues();
    if (!issues.success) {
      throw new Error(issues.message);
    }

    return <UserAssignedIssues teamId={teamId} initialData={issues.data} />;
  } catch (error: any) {
    return <h2>No Issues: {error.message}</h2>;
  }
};

const AssignedIssuesPage = async ({ params }: Props) => {
  const { id: teamId } = await params;

  return (
    <Suspense fallback={<h2>Loading issues....</h2>}>
      <Content teamId={teamId} />
    </Suspense>
  );
};

export default AssignedIssuesPage;
