import type { Priority, Status } from "@/lib/contants";
import { useParams } from "next/navigation";
import AssigneeSelect from "../input-fields/assignee-select";
import PrioritySelect from "../input-fields/priority-select";
import StatusSelect from "../input-fields/status-select";
import DeleteIssue from "./delete-issue";
import { useIssueDetails, useUpdateIssue } from "@/hooks/use-issues";

const IssueProperties = () => {
  const { issueId } = useParams<{ issueId: string }>();
  const { data: issue, isError, error } = useIssueDetails(issueId);

  const updateIssue = useUpdateIssue({ projectId: issue?.projectId });

  if (isError) {
    return <h2>Error : {error.message}</h2>;
  }

  if (!issue) {
    return <h2>No Issue available</h2>;
  }

  return (
    <div>
      <div className="p-2">
        <PrioritySelect
          onChange={(value) =>
            updateIssue.mutate({
              issueId: issue.id,
              values: { priority: value as Priority },
              teamId: issue.teamId ?? "",
            })
          }
          value={issue.priority ?? ""}
        />
        <StatusSelect
          onChange={(value) =>
            updateIssue.mutate({
              issueId: issue.id,
              values: { status: value as Status },
              teamId: issue.teamId ?? "",
            })
          }
          value={issue.status ?? ""}
        />

        <AssigneeSelect
          label="Members"
          value={issue.assignees.map((user) => user.userId) ?? []}
          onChange={(values) =>
            updateIssue.mutate({
              issueId: issue.id,
              values: { assigneeIds: values },
              teamId: issue.teamId ?? "",
            })
          }
        />

        <DeleteIssue
          teamId={issue.teamId ?? ""}
          projectId={issue.projectId ?? ""}
          issueId={issue.id}
        />
      </div>
    </div>
  );
};

export default IssueProperties;
