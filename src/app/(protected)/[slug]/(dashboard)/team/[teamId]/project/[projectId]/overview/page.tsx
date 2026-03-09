import { Suspense } from "react";
import { getProject } from "@/server-actions/projects";
import ProjectDetails from "@/app/(protected)/[slug]/(dashboard)/_components/projects/project-details";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";

type Props = {
  params: Promise<{ projectId: string }>;
};

const Content = async ({ projectId }: { projectId: string }) => {
  try {
    const project = await getProject(projectId);
    if (!project.success) {
      throw new Error(project.message);
    }

    return <ProjectDetails projectId={projectId} initialData={project.data} />;
  } catch (error: any) {
    return <ErrorState title="No Project" message={error.message} />;
  }
};

const ProjectDetailsPage = async ({ params }: Props) => {
  const { projectId } = await params;

  return (
    <Suspense fallback={<LoadingState label="Loading Project" />}>
      <Content projectId={projectId} />
    </Suspense>
  );
};

export default ProjectDetailsPage;
