import { queryKeys } from "@/lib/query-keys";
import { getUserTeamsCurrentOrg } from "@/server-actions/teams";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";
import { UserTeamsDropdown } from "./user-teams-dropdown";

const Content = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.teams.userList(),
    queryFn: async () => {
      const result = await getUserTeamsCurrentOrg();
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserTeamsDropdown />
    </HydrationBoundary>
  );
};

const UserTeams = async () => {
  return (
    <Suspense fallback={null}>
      <Content />
    </Suspense>
  );
};

export default UserTeams;
