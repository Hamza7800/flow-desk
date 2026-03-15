"use client";

import { useUserAssignedIssues } from "@/hooks/use-issues";

import { IssueBoard } from "@/app/(protected)/[slug]/(dashboard)/_components/issues/issue-board";
import { ErrorState } from "@/components/error-state";

const UserAssignedIssues = () => {
  const { data: issues, isError, error, refetch } = useUserAssignedIssues();

  if (isError) {
    return (
      <ErrorState
        title="Failed to load issues"
        message={error?.message}
        onRetry={() => refetch()}
        homeHref="/"
      />
    );
  }

  return (
    <div className="relative min-h-0 w-full flex-1">
      <div className="absolute inset-0 flex flex-col">
        <IssueBoard issues={issues ?? []} />
      </div>
    </div>
  );
};

export default UserAssignedIssues;
