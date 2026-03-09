import { getIssue } from "@/server-actions/issues";
import { Suspense } from "react";
import IssueDetails from "@/app/(protected)/[slug]/(dashboard)/_components/issues/issue-details";
import { LoadingState } from "@/components/loading-state";
import { wait } from "@/lib/utils";
import { ErrorState } from "@/components/error-state";

type Props = {
  params: Promise<{ issueId: string }>;
};

const Content = async ({ issueId }: { issueId: string }) => {
  try {
    const issue = await getIssue(issueId);
    if (!issue.success) {
      throw new Error(issue.message);
    }

    return <IssueDetails issueId={issueId} initialData={issue.data} />;
  } catch (error: any) {
    return <ErrorState title="No Issue" message={error.message} />;
  }
};

const IssueDetailsPage = async ({ params }: Props) => {
  const { issueId } = await params;

  return (
    <Suspense fallback={<LoadingState label="Loading Issue" />}>
      <Content issueId={issueId} />
    </Suspense>
  );
};

export default IssueDetailsPage;
