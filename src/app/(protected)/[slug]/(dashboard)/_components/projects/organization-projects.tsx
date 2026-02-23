"use client";
import { useOrgProjects, useTeamProjects } from "@/hooks/use-projects";
import { CreateProjectModal } from "./create-project";
import type { ProjectsType } from "@/server-actions/projects";
import { ProjectsCards } from "./project-cards";
import { useOrganizationContext } from "@/components/context/organization-client-context";

const OrganizationProjects = ({
  teamId,
  initialData,
}: {
  teamId: string;
  initialData: ProjectsType["data"];
}) => {
  const { org } = useOrganizationContext();
  const {
    data: projects,
    isError,
    error,
  } = useOrgProjects(org?.id ?? "", initialData);

  if (isError) {
    return <h2>{error.message}</h2>;
  }

  return (
    <div>
      <ProjectsCards projects={projects} />
      <CreateProjectModal teamId={teamId} />
    </div>
  );
};

export default OrganizationProjects;
