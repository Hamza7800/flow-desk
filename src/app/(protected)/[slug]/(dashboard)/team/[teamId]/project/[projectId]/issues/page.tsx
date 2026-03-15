import { getIssues } from "@/server-actions/issues";
import ProjectIssues from "@/app/(protected)/[slug]/(dashboard)/_components/issues/project-issues";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

type Props = {
  params: Promise<{ projectId: string; teamId: string }>;
};

const Content = async ({
  projectId,
  teamId,
}: {
  teamId: string;
  projectId: string;
}) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.issues.byProject(projectId),
    queryFn: async () => {
      const result = await getIssues(undefined, projectId);
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectIssues projectId={projectId} />
    </HydrationBoundary>
  );
};

const ProjectIssuesPage = async ({ params }: Props) => {
  const { projectId, teamId } = await params;

  return <Content projectId={projectId} teamId={teamId} />;
};

export default ProjectIssuesPage;
