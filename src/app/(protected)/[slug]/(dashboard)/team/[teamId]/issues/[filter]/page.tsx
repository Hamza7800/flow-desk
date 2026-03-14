import { getIssues } from "@/server-actions/issues";
import TeamIssues from "@/app/(protected)/[slug]/(dashboard)/_components/issues/team-issues";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

type Props = {
  params: Promise<{ teamId: string }>;
};

const Content = async ({ teamId }: { teamId: string }) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.issues.byTeam(teamId),
    queryFn: async () => {
      const result = await getIssues(teamId);
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TeamIssues teamId={teamId} />
    </HydrationBoundary>
  );
};

const IssuesPage = async ({ params }: Props) => {
  const { teamId } = await params;

  return <Content teamId={teamId} />;
};

export default IssuesPage;
