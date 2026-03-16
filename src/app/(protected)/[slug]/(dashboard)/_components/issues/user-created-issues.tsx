"use client";

import { useUserCreatedIssues } from "@/hooks/use-issues";

import type { IssuesType } from "@/server-actions/issues";
import { IssueBoard } from "@/app/(protected)/[slug]/(dashboard)/_components/issues/issue-board";
import { ErrorState } from "@/components/error-state";
import { EmptyState } from "@/components/empty-state";
import { Ticket } from "lucide-react";

const UserCreatedIssues = ({}: {}) => {
  const { data: issues, isError, error, refetch } = useUserCreatedIssues();

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

  if (!issues?.length) {
    return (
      <EmptyState
        icon={Ticket}
        title="No created issues"
        description="You don't have any created issues."
        // action={{ label: "Home", onClick: () => router.push(`/${slug}/`) }}
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

export default UserCreatedIssues;
