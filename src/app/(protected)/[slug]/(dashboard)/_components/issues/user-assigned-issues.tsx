"use client";

import { useUserAssignedIssues } from "@/hooks/use-issues";

import type { IssuesType } from "@/server-actions/issues";
import { IssueBoard } from "@/app/(protected)/[slug]/(dashboard)/_components/issues/issue-board";

const UserAssignedIssues = ({
  initialData,
  teamId,
}: {
  teamId?: string;
  initialData: IssuesType["data"];
}) => {
  const { data: issues, isError, error } = useUserAssignedIssues(initialData);

  if (isError) {
    return <h2>Error : {error.message}</h2>;
  }

  return <IssueBoard issues={issues ?? []} />;
};

export default UserAssignedIssues;
