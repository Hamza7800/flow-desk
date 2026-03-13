import { getIssue } from "@/server-actions/issues";
import { Suspense } from "react";
import IssueDetails from "@/app/(protected)/[slug]/(dashboard)/_components/issues/issue-details";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";

type Props = {
  params: Promise<{ issueId: string; teamId: string }>;
};

const Content = async ({
  issueId,
  teamId,
}: {
  teamId: string;
  issueId: string;
}) => {
  try {
    const issue = await getIssue(issueId, teamId);
    if (!issue.success) {
      throw new Error(issue.message);
    }

    return (
      <IssueDetails
        issueId={issueId}
        initialData={issue.data}
        teamId={teamId}
      />
    );
  } catch (error: any) {
    return <ErrorState title="No Issue" message={error.message} />;
  }
};

const IssueDetailsPage = async ({ params }: Props) => {
  const { issueId, teamId } = await params;

  return (
    <Suspense fallback={<LoadingState label="Loading Issue" />}>
      <Content issueId={issueId} teamId={teamId} />
    </Suspense>
  );
};

export default IssueDetailsPage;
