import type { Priority, Status } from "@/lib/contants";
import { useParams } from "next/navigation";
import AssigneeSelect from "../input-fields/assignee-select";
import PrioritySelect from "../input-fields/priority-select";
import StatusSelect from "../input-fields/status-select";
import DeleteIssue from "./delete-issue";
import { useIssueDetails, useUpdateIssue } from "@/hooks/use-issues";
import PermissionGate from "@/components/permission-gate";
import { usePermissions } from "@/hooks/use-permissions";

const IssueProperties = () => {
  const { issueId } = useParams<{ issueId: string }>();
  const { data: issue, isError, error } = useIssueDetails(issueId);
  const { canEditIssue } = usePermissions();
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
          isDisabled={!canEditIssue}
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
          isDisabled={!canEditIssue}
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
          isDisabled={!canEditIssue}
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

        <PermissionGate permission="canDeleteIssue">
          <DeleteIssue
            teamId={issue.teamId ?? ""}
            projectId={issue.projectId ?? ""}
            issueId={issue.id}
          />
        </PermissionGate>
      </div>
    </div>
  );
};

export default IssueProperties;
