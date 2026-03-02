"use client";

import { useTeamIssues } from "@/hooks/use-issues";

import type { IssuesType } from "@/server-actions/issues";
import { IssueBoard } from "@/app/(protected)/[slug]/(dashboard)/_components/issues/issue-board";
import { DisplayControls } from "./display-controls";
import { Separator } from "@heroui/react";

const TeamIssues = ({
  initialData,
  teamId,
}: {
  teamId: string;
  initialData: IssuesType["data"];
}) => {
  const { data: issues, isError, error } = useTeamIssues(teamId, initialData);

  if (isError) {
    return <h2>Error : {error.message}</h2>;
  }

  return (
    <div className="">
      <div className="flex items-center justify-end py-2">
        <DisplayControls />
      </div>
      <Separator className="mb-2" />
      <IssueBoard issues={issues ?? []} />
    </div>
  );
};

export default TeamIssues;
