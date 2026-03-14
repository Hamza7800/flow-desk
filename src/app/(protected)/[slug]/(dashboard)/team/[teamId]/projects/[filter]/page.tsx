import { getProjects } from "@/server-actions/projects";
import TeamProjects from "@/app/(protected)/[slug]/(dashboard)/_components/projects/team-projects";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

type Props = {
  params: Promise<{ teamId: string }>;
};

const Content = async ({ teamId }: { teamId: string }) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.projects.teamList(teamId),
    queryFn: async () => {
      const result = await getProjects(teamId);
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TeamProjects teamId={teamId} />
    </HydrationBoundary>
  );
};

const ProjectsPage = async ({ params }: Props) => {
  const { teamId } = await params;

  return <Content teamId={teamId} />;
};

export default ProjectsPage;
