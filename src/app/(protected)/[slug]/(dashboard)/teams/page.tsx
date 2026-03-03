import { Suspense } from "react";
import { getOrgTeams } from "@/server-actions/teams";
import OrgTeams from "../_components/teams/org-teams";
import { SiteHeader } from "@/components/site-header";

const Content = async () => {
  try {
    const teams = await getOrgTeams();
    if (!teams.success) {
      throw new Error(teams.message);
    }

    return <OrgTeams initialData={teams.data} />;
  } catch (error: any) {
    return <h2>No Teams {error.message}</h2>;
  }
};

const TeamsPage = () => {
  return (
    <Suspense fallback={<h2>Loading... Teams</h2>}>
      <SiteHeader heading="Teams" />
      <Content />
    </Suspense>
  );
};

export default TeamsPage;
