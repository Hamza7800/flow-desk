import { getUserCreatedIssues } from "@/server-actions/issues";
import { Suspense } from "react";
import UserCreatedIssues from "@/app/(protected)/[slug]/(dashboard)/_components/issues/user-created-issues";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";

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
    return <ErrorState title="No Issues" message={error.message} />;
  }
};

const MyCreatedIssues = async ({ params }: Props) => {
  const { id: teamId } = await params;

  return (
    <Suspense fallback={<LoadingState label="Loading Issues" />}>
      <Content teamId={teamId} />
    </Suspense>
  );
};

export default MyCreatedIssues;
