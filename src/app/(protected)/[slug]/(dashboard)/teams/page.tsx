import { Suspense } from "react";
import { getOrgTeams } from "@/server-actions/teams";
import OrgTeams from "../_components/teams/org-teams";
import { SiteHeader } from "@/components/site-header";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";

const Content = async () => {
  try {
    const teams = await getOrgTeams();
    if (!teams.success) {
      throw new Error(teams.message);
    }

    return <OrgTeams initialData={teams.data} />;
  } catch (error: any) {
    return <ErrorState title="Failed to load teams" message={error?.message} />;
  }
};

const TeamsPage = () => {
  return (
    <Suspense fallback={<LoadingState label="Loading teams" />}>
      <SiteHeader heading="Teams" />
      <Content />
    </Suspense>
  );
};

export default TeamsPage;
