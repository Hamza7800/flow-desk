import { getProjects } from "@/server-actions/projects";
import { Suspense } from "react";
import OrganizationProjects from "@/app/(protected)/[slug]/(dashboard)/_components/projects/organization-projects";

type Props = {
  params: Promise<{ id: string }>;
};

const Content = async ({ teamId }: { teamId: string }) => {
  try {
    const projects = await getProjects();
    if (!projects.success) {
      throw new Error(projects.message);
    }

    return <OrganizationProjects initialData={projects.data} teamId={teamId} />;
  } catch (error: any) {
    return <h2>No Projects {error.message}</h2>;
  }
};

const OrganizationProjectsPage = async ({ params }: Props) => {
  const { id: teamId } = await params;

  return (
    <Suspense fallback={<h2>Loading...Org Projects</h2>}>
      <Content teamId={teamId} />
    </Suspense>
  );
};

export default OrganizationProjectsPage;
