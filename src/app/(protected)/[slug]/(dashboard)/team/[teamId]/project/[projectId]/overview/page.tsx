import { Suspense } from "react";
import { getProject } from "@/server-actions/projects";
import ProjectDetails from "@/app/(protected)/[slug]/(dashboard)/_components/projects/project-details";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";

type Props = {
  params: Promise<{ projectId: string; teamId: string }>;
};

const Content = async ({
  projectId,
  teamId,
}: {
  projectId: string;
  teamId: string;
}) => {
  try {
    const project = await getProject(projectId, teamId);
    if (!project.success) {
      throw new Error(project.message);
    }

    return (
      <ProjectDetails
        teamId={teamId}
        projectId={projectId}
        initialData={project.data}
      />
    );
  } catch (error: any) {
    return <ErrorState title="No Project" message={error.message} />;
  }
};

const ProjectDetailsPage = async ({ params }: Props) => {
  const { projectId, teamId } = await params;

  return (
    <Suspense fallback={<LoadingState label="Loading Project" />}>
      <Content projectId={projectId} teamId={teamId} />
    </Suspense>
  );
};

export default ProjectDetailsPage;
