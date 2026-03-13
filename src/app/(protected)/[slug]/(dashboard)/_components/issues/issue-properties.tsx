import type { Priority, Status } from "@/lib/contants";
import { useParams } from "next/navigation";
import PrioritySelect from "../input-fields/priority-select";
import StatusSelect from "../input-fields/status-select";
import DeleteIssue from "./delete-issue";
import { useIssueDetails, useUpdateIssue } from "@/hooks/use-issues";
import PermissionGate from "@/components/permission-gate";
import { usePermissions } from "@/hooks/use-permissions";
import { Label, Separator } from "@heroui/react";
import ProjectSelect from "../input-fields/project-select";
import TeamMembersSelect from "../input-fields/team-members-select";

const IssueProperties = () => {
  const { issueId, teamId } = useParams<{ issueId: string; teamId: string }>();
  const { data: issue, isError } = useIssueDetails(issueId, teamId);
  const { canEditIssue } = usePermissions();
  const updateIssue = useUpdateIssue({ projectId: issue?.projectId });

  if (isError) {
    return null;
  }

  if (!issue) {
    return null;
  }

  return (
    <div className="flex w-full min-w-[250px] flex-col gap-2 p-2">
      <div className="flex items-center gap-4">
        <Label className="w-[100px]">Priority</Label>
        <div className="w-full">
          <PrioritySelect
            mode="create"
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
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Label className="w-[100px]">Status</Label>
        <div className="w-full">
          <StatusSelect
            mode="create"
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
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Label className="w-[100px]">Assign</Label>
        <div className="w-full">
          <TeamMembersSelect
            teamId={issue.teamId ?? ""}
            mode="create"
            isDisabled={!canEditIssue}
            value={issue.assignees.map((user) => user.userId) ?? []}
            onChange={(values) =>
              updateIssue.mutate({
                issueId: issue.id,
                values: { assigneeIds: values },
                teamId: issue.teamId ?? "",
              })
            }
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Label className="w-[100px]">Project</Label>
        <div className="w-full">
          <ProjectSelect
            mode="create"
            orgId={issue?.organizationId ?? ""}
            teamId={issue?.teamId ?? ""}
            value={issue.projectId ?? ""}
            onChange={(value) =>
              updateIssue.mutate({
                issueId: issue.id,
                values: { projectId: value },
                teamId: issue.teamId ?? "",
              })
            }
          />
        </div>
      </div>

      <Separator className="mt-4 mb-2" />

      <PermissionGate permission="canDeleteIssue">
        <DeleteIssue
          teamId={issue.teamId ?? ""}
          projectId={issue.projectId ?? ""}
          issueId={issue.id}
        />
      </PermissionGate>
    </div>
  );
};

export default IssueProperties;
