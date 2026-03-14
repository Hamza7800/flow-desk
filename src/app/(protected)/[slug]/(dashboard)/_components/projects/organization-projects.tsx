"use client";

import type { ProjectsType } from "@/server-actions/projects";
// import { useOrgProjects } from "@/hooks/use-projects";
import { ProjectBoard } from "./project-board";
import { useOrganizationContext } from "@/components/context/organization-client-context";
import { DisplayControls } from "./project-display-controls";
import { Separator } from "@heroui/react";
import { CreateProjectModal } from "./create-project";

const OrganizationProjects = ({
  initialData,
  teamId,
}: {
  teamId?: string;
  initialData: ProjectsType["data"];
}) => {
  const { org } = useOrganizationContext();
  // const {
  //   data: projects,
  //   isError,
  //   error,
  // } = useOrgProjects(org?.id ?? "", initialData);

  // if (isError) {
  //   return <h2>Error : {error.message}</h2>;
  // }

  // if (!projects?.length) {
  //   return (
  //     <div>
  //       <h2>No Projects</h2>
  //       <p>Create a project in a team</p>
  //     </div>
  //   );
  // }

  return (
    <div className="">
      <div className="flex items-center justify-end py-2">
        <DisplayControls />
      </div>
      <Separator className="mb-2" />
      {/* <ProjectBoard projects={projects ?? []} /> */}
    </div>
  );
};

export default OrganizationProjects;
