import { getUserAssignedIssues } from "@/server-actions/issues";
import { Suspense } from "react";
import UserAssignedIssues from "@/app/(protected)/[slug]/(dashboard)/_components/issues/user-assigned-issues";
import { ErrorState } from "@/components/error-state";
import { wait } from "@/lib/utils";
import { Spinner } from "@heroui/react";
import { LoadingState } from "@/components/loading-state";

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
    return <ErrorState title="No Issues" message={error.message} />;
  }
};

const AssignedIssuesPage = async ({ params }: Props) => {
  const { id: teamId } = await params;

  return (
    <Suspense fallback={<LoadingState label="Loading Issues" />}>
      <Content teamId={teamId} />
    </Suspense>
  );
};

export default AssignedIssuesPage;
