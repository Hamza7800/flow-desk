"use client";

import { useUserCreatedIssues } from "@/hooks/use-issues";

import type { IssuesType } from "@/server-actions/issues";
import { IssueBoard } from "@/app/(protected)/[slug]/(dashboard)/_components/issues/issue-board";

const UserCreatedIssues = ({
  initialData,
  teamId,
}: {
  teamId?: string;
  initialData: IssuesType["data"];
}) => {
  const { data: issues, isError, error } = useUserCreatedIssues(initialData);

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

export default UserCreatedIssues;
