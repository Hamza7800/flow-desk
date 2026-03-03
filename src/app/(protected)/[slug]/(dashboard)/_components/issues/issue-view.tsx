import { useUpdateIssue } from "@/hooks/use-issues";
import type { IssuesType } from "@/server-actions/issues";
import { useIssueViewStore } from "@/store/issue-view-store";
import PrioritySelect from "../input-fields/priority-select";
import StatusSelect from "../input-fields/status-select";
import AssigneeSelect from "../input-fields/assignee-select";
import type { Priority, Status } from "@/lib/contants";
import { MoreHorizontal } from "lucide-react";
import { Card } from "@heroui/react";
import { useParams, useRouter } from "next/navigation";
import ProjectSelect from "../input-fields/project-select";
import InlineBlockNote from "../input-fields/block-note-input";
import { issueSchema } from "@/zod-schema/issue-schema";

type Issue = {
  status:
    | "backlog"
    | "planned"
    | "in-progress"
    | "completed"
    | "canceled"
    | null;
  priority: "no-priority" | "urgent" | "high" | "medium" | "low" | null;
};

const statusColumns = [
  "backlog",
  "planned",
  "in-progress",
  "completed",
  "canceled",
] as const;

const priorityColor = (priority: Issue["priority"]) => {
  switch (priority) {
    case "urgent":
      return "danger";
    case "high":
      return "warning";
    case "medium":
      return "accent";
    case "low":
      return "success";
    default:
      return "default";
  }
};

const statusColor = (status: Issue["status"]) => {
  switch (status) {
    case "completed":
      return "success";
    case "in-progress":
      return "accent";
    case "planned":
      return "warning";
    case "backlog":
      return "default";
    case "canceled":
      return "danger";
    default:
      return "default";
  }
};

const IssueView = ({
  issue,
}: {
  issue: NonNullable<IssuesType["data"]>[number];
}) => {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const { displayProperties, viewMode } = useIssueViewStore();
  const updateIssue = useUpdateIssue({ orgId: issue.organizationId });

  switch (viewMode) {
    case "board":
      return (
        <Card
          onClick={() => router.push(`/${slug}/issue/${issue.id}`)}
          className="rounded-lg p-4"
          variant="secondary"
        >
          {/* Header with icon and priority */}
          <div className="flex items-start justify-between">
            {issue.priority === "high" && (
              <span className="rounded border border-yellow-500/30 bg-yellow-500/20 px-2 py-0.5 text-xs font-semibold text-yellow-400">
                HP
              </span>
            )}
          </div>

          {/* Task ID and title */}
          <div className="space-y-1">
            <p className="text-xs text-gray-500">{issue.identifier}</p>
            <h3 className="text-sm font-medium text-white">{issue.title}</h3>
          </div>
          {/* <div className="space-y-1">
            <InlineBlockNote
              schema={issueSchema.shape.description}
              initialValue={issue.description ?? ""}
              onSave={(val) => console.log(val)}
              debounceMs={700}
              placeholder="Issue Description"
            />
          </div> */}

          <div className="flex flex-col gap-2 pt-1">
            {displayProperties.showPriority && (
              <PrioritySelect
                onChange={(value) =>
                  updateIssue.mutate({
                    values: {
                      priority: value as Priority,
                    },
                    teamId: issue.teamId ?? "",
                    issueId: issue.id,
                  })
                }
                value={issue.priority ?? ""}
              />
            )}
            {displayProperties.showStatus && (
              <StatusSelect
                onChange={(value) =>
                  updateIssue.mutate({
                    values: {
                      status: value as Status,
                    },
                    teamId: issue.teamId ?? "",
                    issueId: issue.id,
                  })
                }
                value={issue.status ?? ""}
              />
            )}
            {/* TODO: */}
            {/* {displayProperties.showLabels &&
          issue.labels?.map((l) => (
            <span
              key={l.label.id}
              className="rounded-full px-1.5 py-0.5 text-xs"
              style={{
                backgroundColor: l.label.color + "30",
                color: l.label.color,
              }}
            >
              {l.label.name}
            </span>
          ))} */}
            {displayProperties.showAssignee && (
              <AssigneeSelect
                label="Assignee"
                value={issue.assignees?.map((a) => a.userId) ?? []}
                onChange={(values) =>
                  updateIssue.mutate({
                    values: {
                      assigneeIds: values,
                    },
                    teamId: issue.teamId ?? "",
                    issueId: issue.id,
                  })
                }
              />
            )}

            {displayProperties.showProject && (
              <ProjectSelect
                teamId={issue.teamId ?? ""}
                orgId={issue.organizationId}
                onChange={(value) =>
                  updateIssue.mutate({
                    values: {
                      projectId: value,
                    },
                    teamId: issue.teamId ?? "",
                    issueId: issue.id,
                  })
                }
                value={issue.projectId ?? ""}
              />
            )}
          </div>

          {/* <p className="text-xs text-gray-500">Created {new Date(issue.createdAt)}</p> */}
        </Card>
      );

    case "list":
      return (
        <Card
          onClick={() => router.push(`/${slug}/issue/${issue.id}`)}
          variant="tertiary"
          className="group mb-1 grid grid-cols-2 items-center gap-3 rounded border-b border-zinc-800/50 px-2 py-1.5 hover:bg-zinc-800/90"
        >
          <span className="w-16 shrink-0 text-xs text-zinc-500">
            {issue.identifier}
            <span className="w-full flex-1 truncate text-sm">
              {issue.title}
            </span>
          </span>

          <div className="flex w-full items-center gap-1 transition-opacity">
            {displayProperties.showPriority && (
              <PrioritySelect
                onChange={(value) =>
                  updateIssue.mutate({
                    values: {
                      priority: value as Priority,
                    },
                    teamId: issue.teamId ?? "",
                    issueId: issue.id,
                  })
                }
                value={issue.priority ?? ""}
              />
            )}
            {displayProperties.showStatus && (
              <StatusSelect
                onChange={(value) =>
                  updateIssue.mutate({
                    values: {
                      status: value as Status,
                    },
                    teamId: issue.teamId ?? "",
                    issueId: issue.id,
                  })
                }
                value={issue.status ?? ""}
              />
            )}
            {displayProperties.showAssignee && (
              <AssigneeSelect
                label="Assignee"
                value={issue.assignees?.map((a) => a.userId) ?? []}
                onChange={(values) =>
                  updateIssue.mutate({
                    values: {
                      assigneeIds: values,
                    },
                    teamId: issue.teamId ?? "",
                    issueId: issue.id,
                  })
                }
              />
            )}
            {displayProperties.showProject && issue?.project && (
              <ProjectSelect
                teamId={issue.teamId ?? ""}
                orgId={issue.organizationId}
                onChange={(value) =>
                  updateIssue.mutate({
                    values: {
                      projectId: value,
                    },
                    teamId: issue.teamId ?? "",
                    issueId: issue.id,
                  })
                }
                value={issue.status ?? ""}
              />
            )}
          </div>
        </Card>
      );
  }
};

export default IssueView;
