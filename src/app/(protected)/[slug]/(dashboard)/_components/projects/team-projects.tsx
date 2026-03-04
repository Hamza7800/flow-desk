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

const TeamProjects = ({
  teamId,
  initialData,
}: {
  teamId: string;
  initialData: ProjectsType["data"];
}) => {
  const {
    data: projects,
    isError,
    error,
  } = useTeamProjects(undefined, teamId, initialData);

  if (isError) {
    return <h2>{error.message}</h2>;
  }

  if (!projects?.length) {
    return (
      <div>
        <h2>No Projects</h2>
        <CreateProjectModal teamId={teamId} />
      </div>
    );
  }

  return (
    <div className="">
      <CreateProjectModal teamId={teamId} />
      <div className="flex items-center justify-end py-2">
        <DisplayControls />
      </div>
      <Separator className="mb-2" />
      <ProjectBoard projects={projects ?? []} />
    </div>
  );
};

export default TeamProjects;
