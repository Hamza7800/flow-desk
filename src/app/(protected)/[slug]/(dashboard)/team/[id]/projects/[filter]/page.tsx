import { getProjects } from "@/server-actions/projects";
import { Suspense } from "react";
import TeamProjects from "@/app/(protected)/[slug]/(dashboard)/_components/projects/team-projects";
import { SiteHeader } from "@/components/site-header";

type Props = {
  params: Promise<{ id: string }>;
};

const Content = async ({ teamId }: { teamId: string }) => {
  try {
    const projects = await getProjects(teamId);
    if (!projects.success) {
      throw new Error(projects.message);
    }

    return <TeamProjects initialData={projects.data} teamId={teamId} />;
  } catch (error: any) {
    return <h2>No Projects {error.message}</h2>;
  }
};

const ProjectsPage = async ({ params }: Props) => {
  const { id: teamId } = await params;

  return (
    <Suspense fallback={<h2>Loading... Projects</h2>}>
      <SiteHeader heading="Team Projects" />
      <Content teamId={teamId} />
    </Suspense>
  );
};

export default ProjectsPage;
