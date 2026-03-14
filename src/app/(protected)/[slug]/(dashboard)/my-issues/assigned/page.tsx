import { getUserAssignedIssues } from "@/server-actions/issues";
import UserAssignedIssues from "@/app/(protected)/[slug]/(dashboard)/_components/issues/user-assigned-issues";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

const Content = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.issues.byUserAssigned(),
    queryFn: async () => {
      const result = await getUserAssignedIssues();
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserAssignedIssues />
    </HydrationBoundary>
  );
};

const AssignedIssuesPage = () => {
  return <Content />;
};

export default AssignedIssuesPage;
