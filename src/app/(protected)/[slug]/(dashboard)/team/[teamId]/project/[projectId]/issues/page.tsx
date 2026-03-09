import { getIssues } from "@/server-actions/issues";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import ProjectIssues from "@/app/(protected)/[slug]/(dashboard)/_components/issues/project-issues";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";

type Props = {
  params: Promise<{ projectId: string }>;
};

const Content = async ({ projectId }: { projectId: string }) => {
  try {
    const issues = await getIssues(undefined, projectId);
    if (!issues.success) {
      throw new Error(issues.message);
    }

    return <ProjectIssues projectId={projectId} initialData={issues.data} />;
  } catch (error: any) {
    return <ErrorState title="Issues" message={error.message} />;
  }
};

const ProjectIssuesPage = async ({ params }: Props) => {
  const { projectId } = await params;

  return (
    <Suspense fallback={<LoadingState label="Loading Issues" />}>
      <Content projectId={projectId} />
    </Suspense>
  );
};

export default ProjectIssuesPage;
