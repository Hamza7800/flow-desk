"use client";

import { useProjectIssues } from "@/hooks/use-issues";

import type { IssuesType } from "@/server-actions/issues";
import { IssueBoard } from "@/app/(protected)/[slug]/(dashboard)/_components/issues/issue-board";
import { DisplayControls } from "./issues-display-controls";
import { Separator } from "@heroui/react";

const ProjectIssues = ({
  initialData,
  projectId,
}: {
  projectId: string;
  initialData: IssuesType["data"];
}) => {
  const {
    data: issues,
    isError,
    error,
  } = useProjectIssues("", projectId, initialData);

  if (isError) {
    return <h2>Error : {error.message}</h2>;
  }

  return (
    <div className="relative min-h-0 w-full flex-1">
      <div className="absolute inset-0 flex flex-col">
        <IssueBoard issues={issues ?? []} />
      </div>
    </div>
  );
};

export default ProjectIssues;
