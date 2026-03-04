import { getIssue } from "@/server-actions/issues";
import { Suspense } from "react";
import IssueDetails from "@/app/(protected)/[slug]/(dashboard)/_components/issues/issue-details";

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
    return <h2>No Issue: {error.message}</h2>;
  }
};

const IssueDetailsPage = async ({ params }: Props) => {
  const { issueId } = await params;

  return (
    <Suspense fallback={<h2>Loading issue....</h2>}>
      <Content issueId={issueId} />
    </Suspense>
  );
};

export default IssueDetailsPage;
