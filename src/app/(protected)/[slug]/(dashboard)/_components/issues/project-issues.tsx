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
    <div className="flex h-full flex-1 flex-col">
      <IssueBoard issues={issues ?? []} />
    </div>
  );
};

export default ProjectIssues;
