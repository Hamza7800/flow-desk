"use client";

import type { ProjectsType } from "@/server-actions/projects";
import { ProjectBoard } from "./project-board";
import { useOrganizationContext } from "@/components/context/organization-client-context";
import { DisplayControls } from "./project-display-controls";
import { Separator } from "@heroui/react";

const OrganizationProjects = ({
  initialData,
  teamId,
}: {
  teamId?: string;
  initialData: ProjectsType["data"];
}) => {
  return (
    <div className="">
      <div className="flex items-center justify-end py-2">
        <DisplayControls />
      </div>
      <Separator className="mb-2" />
    </div>
  );
};

export default OrganizationProjects;
