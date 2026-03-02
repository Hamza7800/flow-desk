import { getIssues } from "@/server-actions/issues";
import { Suspense } from "react";
import TeamIssues from "@/app/(protected)/[slug]/(dashboard)/_components/issues/team-issues";

type Props = {
  params: Promise<{ id: string }>;
};

const Content = async ({ teamId }: { teamId: string }) => {
  try {
    const issues = await getIssues(teamId);
    if (!issues.success) {
      throw new Error(issues.message);
    }

    return <TeamIssues teamId={teamId} initialData={issues.data} />;
  } catch (error: any) {
    return <h2>No Issues For Team: {error.message}</h2>;
  }
};

const IssuesPage = async ({ params }: Props) => {
  const { id: teamId } = await params;

  return (
    <Suspense fallback={<h2>Loading issues....</h2>}>
      <Content teamId={teamId} />
    </Suspense>
  );
};

export default IssuesPage;
