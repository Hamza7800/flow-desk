import { getUserCreatedIssues } from "@/server-actions/issues";
import { Suspense } from "react";
import UserCreatedIssues from "@/app/(protected)/[slug]/(dashboard)/_components/issues/user-created-issues";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

const Content = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.issues.byUserCreated(),
    queryFn: async () => {
      const result = await getUserCreatedIssues();
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserCreatedIssues />
    </HydrationBoundary>
  );
};

const MyCreatedIssues = () => {
  return <Content />;
};

export default MyCreatedIssues;
