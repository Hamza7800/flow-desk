"use client";

import { useProjectIssues } from "@/hooks/use-issues";

import type { IssuesType } from "@/server-actions/issues";
import { IssueBoard } from "@/app/(protected)/[slug]/(dashboard)/_components/issues/issue-board";
import { DisplayControls } from "./issues-display-controls";
import { Separator } from "@heroui/react";
import { ErrorState } from "@/components/error-state";
import { useParams } from "next/navigation";

const ProjectIssues = ({
  initialData,
  projectId,
}: {
  projectId: string;
  initialData: IssuesType["data"];
}) => {
  const { slug } = useParams<{ slug: string }>();
  const {
    data: issues,
    isError,
    error,
    refetch,
  } = useProjectIssues("", projectId, initialData);

  if (isError) {
    return (
      <ErrorState
        title="Failed to load issues"
        message={error?.message}
        onRetry={() => refetch()}
        homeHref={`/${slug}`}
      />
    );
  }

  return (
    <div className="relative min-h-0 w-full flex-1">
      <div className="absolute inset-0 flex flex-col py-2">
        <IssueBoard issues={issues ?? []} />
      </div>
    </div>
  );
};

export default ProjectIssues;
