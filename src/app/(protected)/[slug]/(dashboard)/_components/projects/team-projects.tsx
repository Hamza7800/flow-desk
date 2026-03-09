"use client";
import { format } from "date-fns";
import { Lock, Archive, Calendar, Layers } from "lucide-react";
import { useTeamProjects } from "@/hooks/use-projects";
import { CreateProjectModal } from "./create-project";
import type { ProjectsType } from "@/server-actions/projects";
import { ProjectsCards } from "./project-cards";
import { DisplayControls } from "./project-display-controls";
import { Separator } from "@heroui/react";
import { ProjectBoard } from "./project-board";
import { ErrorState } from "@/components/error-state";
import { useParams, useRouter } from "next/navigation";
import { EmptyState } from "@/components/empty-state";
import CreateProjectButton from "./create-project-button";

const TeamProjects = ({
  teamId,
  initialData,
}: {
  teamId: string;
  initialData: ProjectsType["data"];
}) => {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const {
    data: projects,
    isError,
    error,
    refetch,
  } = useTeamProjects(undefined, teamId, initialData);

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
