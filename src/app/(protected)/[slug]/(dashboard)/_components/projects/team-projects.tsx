"use client";
import { Layers } from "lucide-react";
import { useTeamProjects } from "@/hooks/use-projects";
import { ProjectBoard } from "./project-board";
import { ErrorState } from "@/components/error-state";
import { useParams, useRouter } from "next/navigation";
import { EmptyState } from "@/components/empty-state";

const TeamProjects = ({ teamId }: { teamId: string }) => {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const { data: projects, isError, error, refetch } = useTeamProjects(teamId);

  if (isError) {
    return (
      <ErrorState
        title="Failed to load projects"
        message={error?.message}
        onRetry={() => refetch()}
        homeHref={`/${slug}`}
      />
    );
  }

  if (!projects?.length) {
    return (
      <EmptyState
        icon={Layers}
        title="No Projects for team"
        description="Team have no projects yet."
        action={{
          label: "My Issues",
          onClick: () => router.push(`/${slug}/my-issues/assigned`),
        }}
      />
    );
  }

  return (
    <div className="relative min-h-0 w-full flex-1">
      <div className="absolute inset-0 flex flex-col pt-2">
        <ProjectBoard projects={projects ?? []} />
      </div>
    </div>
  );
};

export default TeamProjects;
