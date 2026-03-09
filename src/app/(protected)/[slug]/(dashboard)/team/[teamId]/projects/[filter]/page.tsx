import { getProjects } from "@/server-actions/projects";
import { Suspense } from "react";
import TeamProjects from "@/app/(protected)/[slug]/(dashboard)/_components/projects/team-projects";
import { SiteHeader } from "@/components/site-header";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";

type Props = {
  params: Promise<{ teamId: string }>;
};

const Content = async ({ teamId }: { teamId: string }) => {
  try {
    const projects = await getProjects(teamId);
    if (!projects.success) {
      throw new Error(projects.message);
    }

    return <TeamProjects initialData={projects.data} teamId={teamId} />;
  } catch (error: any) {
    return <ErrorState title="No Projects for team" message={error.message} />;
  }
};

const ProjectsPage = async ({ params }: Props) => {
  const { teamId } = await params;

  return (
    <Suspense fallback={<LoadingState label="Loading... Projects" />}>
      <Content teamId={teamId} />
    </Suspense>
  );
};

export default ProjectsPage;
