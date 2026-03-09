import { getIssues } from "@/server-actions/issues";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import TeamIssues from "@/app/(protected)/[slug]/(dashboard)/_components/issues/team-issues";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";

type Props = {
  params: Promise<{ teamId: string }>;
};

const Content = async ({ teamId }: { teamId: string }) => {
  try {
    const issues = await getIssues(teamId);
    if (!issues.success) {
      throw new Error(issues.message);
    }

    return <TeamIssues teamId={teamId} initialData={issues.data} />;
  } catch (error: any) {
    return <ErrorState title="No Issues for team" message={error.message} />;
  }
};

const IssuesPage = async ({ params }: Props) => {
  const { teamId } = await params;

  return (
    <Suspense fallback={<LoadingState label="Loading Issues" />}>
      <Content teamId={teamId} />
    </Suspense>
  );
};

export default IssuesPage;
