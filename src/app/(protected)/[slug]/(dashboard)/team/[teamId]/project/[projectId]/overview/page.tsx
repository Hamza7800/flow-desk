import { getProject } from "@/server-actions/projects";
import ProjectDetails from "@/app/(protected)/[slug]/(dashboard)/_components/projects/project-details";
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
  projectId: string;
  teamId: string;
}) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.projects.detail(projectId),
    queryFn: async () => {
      const result = await getProject(projectId, teamId);
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectDetails teamId={teamId} projectId={projectId} />
    </HydrationBoundary>
  );
};

const ProjectDetailsPage = async ({ params }: Props) => {
  const { projectId, teamId } = await params;

  return <Content projectId={projectId} teamId={teamId} />;
};

export default ProjectDetailsPage;
