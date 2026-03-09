"use client";

import { useTeamIssues } from "@/hooks/use-issues";

import type { IssuesType } from "@/server-actions/issues";
import { IssueBoard } from "@/app/(protected)/[slug]/(dashboard)/_components/issues/issue-board";
import { Separator } from "@heroui/react";
import { ErrorState } from "@/components/error-state";
import { useParams, useRouter } from "next/navigation";
import { EmptyState } from "@/components/empty-state";
import { TicketX } from "lucide-react";

const TeamIssues = ({
  initialData,
  teamId,
}: {
  teamId: string;
  initialData: IssuesType["data"];
}) => {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const {
    data: issues,
    isError,
    error,
    refetch,
  } = useTeamIssues(teamId, initialData);

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

  if (!issues?.length) {
    return (
      <EmptyState
        icon={TicketX}
        title="No Issues for team"
        description="Team have no issues yet."
        action={{
          label: "My Issues",
          onClick: () => router.push(`/${slug}/my-issues/assigned`),
        }}
      />
    );
  }

  return (
    <div className="relative min-h-0 w-full flex-1">
      <div className="absolute inset-0 flex flex-col pt-2">
        <IssueBoard issues={issues ?? []} />
      </div>
    </div>
  );
};

export default TeamIssues;
