import { getIssues } from "@/server-actions/issues";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import ProjectIssues from "@/app/(protected)/[slug]/(dashboard)/_components/issues/project-issues";

type Props = {
  params: Promise<{ id: string }>;
};

const Content = async ({ projectId }: { projectId: string }) => {
  try {
    const issues = await getIssues(projectId);
    if (!issues.success) {
      throw new Error(issues.message);
    }

    return (
      <div className="flex h-full flex-1 flex-col">
        <ProjectIssues projectId={projectId} initialData={issues.data} />
      </div>
    );
  } catch (error: any) {
    return <h2>No Issues For Project: {error.message}</h2>;
  }
};

const ProjectIssuesPage = async ({ params }: Props) => {
  const { id: projectId } = await params;

  return (
    <Suspense fallback={<h2>Loading issues....</h2>}>
      <Content projectId={projectId} />
    </Suspense>
  );
};

export default ProjectIssuesPage;
