import { getIssue } from "@/server-actions/issues";
import IssueDetails from "@/app/(protected)/[slug]/(dashboard)/_components/issues/issue-details";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

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
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.issues.detail(issueId),
    queryFn: async () => {
      const result = await getIssue(issueId, teamId);
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <IssueDetails issueId={issueId} teamId={teamId} />
    </HydrationBoundary>
  );
};

const IssueDetailsPage = async ({ params }: Props) => {
  const { issueId, teamId } = await params;

  return <Content issueId={issueId} teamId={teamId} />;
};

export default IssueDetailsPage;
