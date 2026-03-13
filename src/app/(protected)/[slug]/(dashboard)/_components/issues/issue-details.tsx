"use client";
import InlineBlockNote from "../input-fields/block-note-input";
import InlineInput from "../input-fields/input";
import type { IssueType } from "@/server-actions/issues";
import { useIssueDetails, useUpdateIssue } from "@/hooks/use-issues";
import { issueSchema } from "@/zod-schema/issue-schema";
import { IssueActivities } from "./issue-activities";
import { ErrorState } from "@/components/error-state";
import { TicketX } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@heroui/react";

const IssueDetails = ({
  initialData,
  issueId,
}: {
  issueId: string;
  initialData: IssueType["data"];
}) => {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const {
    data: issue,
    isError,
    error,
    refetch,
  } = useIssueDetails(issueId, initialData);

  const updateIssue = useUpdateIssue({ projectId: issue?.projectId });

  if (isError) {
    return (
      <ErrorState
        title="Failed to load issue"
        message={error?.message}
        onRetry={() => refetch()}
        homeHref={`/${slug}`}
      />
    );
  }

  if (!issue) {
    return (
      <EmptyState
        icon={TicketX}
        title="No Issue Found"
        description="The issue you're looking for doesn't exist."
        action={{
          label: "My Issues",
          onClick: () => router.push(`/${slug}/my-issues/assigned`),
        }}
      />
    );
  }

  return (
    <div className="scrollbar-thin h-screen overflow-y-auto p-8 py-4 pb-28">
      <InlineInput
        initialValue={issue.title}
        onSave={(value) =>
          updateIssue.mutate({
            issueId: issue.id,
            values: { title: value },
            teamId: issue.teamId ?? "",
          })
        }
        schema={issueSchema.shape.title}
      />

      <InlineBlockNote
        initialValue={issue.description ?? ""}
        onSave={(value) =>
          updateIssue.mutate({
            issueId: issue.id,
            values: { description: value },
            teamId: issue.teamId ?? "",
          })
        }
        schema={issueSchema.shape.description}
      />
      <Separator className="my-2" />
      <h2>Activity</h2>
      <IssueActivities activities={issue.activities} />
    </div>
  );
};

export default IssueDetails;
