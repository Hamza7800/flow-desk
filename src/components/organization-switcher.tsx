import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { OrganizationSwitcherDropdown } from "./organization-switcher-dropdown";
import { queryKeys } from "@/lib/query-keys";
import { getUserListOrganizations } from "@/server-actions/organization";
import { Suspense } from "react";

const Content = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.organizations.list(),
    queryFn: async () => {
      const result = await getUserListOrganizations();
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrganizationSwitcherDropdown />
    </HydrationBoundary>
  );
};

export const OrganizationSwitcher = async () => {
  return (
    <Suspense fallback={null}>
      <Content />
    </Suspense>
  );
};
