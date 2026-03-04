import { Suspense } from "react";
import { getProject } from "@/server-actions/projects";
import ProjectDetails from "@/app/(protected)/[slug]/(dashboard)/_components/projects/project-details";

type Props = {
  params: Promise<{ id: string }>;
};

const Content = async ({ projectId }: { projectId: string }) => {
  try {
    const project = await getProject(projectId);
    if (!project.success) {
      throw new Error(project.message);
    }

    return <ProjectDetails projectId={projectId} initialData={project.data} />;
  } catch (error: any) {
    return <h2>No Project: {error.message}</h2>;
  }
};

const ProjectDetailsPage = async ({ params }: Props) => {
  const { id: projectId } = await params;

  return (
    <Suspense fallback={<h2>Loading Project....</h2>}>
      <Content projectId={projectId} />
    </Suspense>
  );
};

export default ProjectDetailsPage;
