"use client";
import { useProjectDetails, useUpdateProjects } from "@/hooks/use-projects";
import type { ProjectType } from "@/server-actions/projects";
import AssigneeSelect from "../input-fields/assignee-select";
import PrioritySelect from "../input-fields/priority-select";
import StatusSelect from "../input-fields/status-select";
import InlineBlockNote from "../input-fields/block-note-input";
import { projectSchema } from "@/zod-schema/project-schema";
import InlineInput from "../input-fields/input";
import type { Priority, Status } from "@/lib/contants";
import DateSelect from "../input-fields/date-picker";
import type { IssueType } from "@/server-actions/issues";
import { useIssueDetails, useUpdateIssue } from "@/hooks/use-issues";
import DeleteIssue from "./delete-issue";
import { issueSchema } from "@/zod-schema/issue-schema";
import type { project } from "@/server/db/schema";
import { IssueActivities } from "./issue-activities";

const IssueDetails = ({
  initialData,
  issueId,
}: {
  issueId: string;
  initialData: IssueType["data"];
}) => {
  const { data: issue, isError, error } = useIssueDetails(issueId, initialData);

  const updateIssue = useUpdateIssue({ projectId: issue?.projectId });

  if (isError) {
    return <h2>Error : {error.message}</h2>;
  }

  if (!issue) {
    return <h2>No Issue available</h2>;
  }

  return (
    <div className="scrollbar-thin h-screen overflow-y-auto p-2 pb-28">
      {/* <pre className="max-h-92 overflow-auto rounded bg-zinc-900 p-2 text-zinc-400">
        {JSON.stringify(issue, null, 2)}
      </pre> */}

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

      <IssueActivities activities={issue.activities} />
    </div>
  );
};

export default IssueDetails;
