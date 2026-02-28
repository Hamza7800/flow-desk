"use client";
import { format } from "date-fns";
import { Lock, Archive, Calendar, Layers } from "lucide-react";
import { useTeamProjects } from "@/hooks/use-projects";
import { CreateProjectModal } from "./create-project";
import type { ProjectsType } from "@/server-actions/projects";
import { ProjectsCards } from "./project-cards";

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

  return (
    <div>
      <ProjectsCards projects={projects} />
      {/* <CreateProjectModal teamId={teamId} /> */}
    </div>
  );
};

export default TeamProjects;
