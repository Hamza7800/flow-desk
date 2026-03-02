import { useUpdateIssue } from "@/hooks/use-issues";
import type { IssuesType } from "@/server-actions/issues";
import { useIssueViewStore } from "@/store/issue-view-store";
import PrioritySelect from "../input-fields/priority-select";
import StatusSelect from "../input-fields/status-select";
import AssigneeSelect from "../input-fields/assignee-select";
import type { Priority, Status } from "@/lib/contants";
import { MoreHorizontal } from "lucide-react";
import { Card } from "@heroui/react";

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
  const { displayProperties, viewMode } = useIssueViewStore();
  const updateIssue = useUpdateIssue({ orgId: issue.organizationId });

  switch (viewMode) {
    case "board":
      return (
        <Card className="rounded-lg p-4" variant="secondary">
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

          <div className="flex gap-2 pt-1">
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
          </div>
          {/* <p className="text-xs text-gray-500">Created {new Date(issue.createdAt)}</p> */}
        </Card>
      );
      return (
        <div className="space-y-2 rounded-md border border-zinc-700/50 bg-zinc-800/80 p-3 transition-colors hover:border-zinc-600">
          {/* Top row */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">{issue.identifier}</span>
          </div>

          {/* Title */}
          <p className="line-clamp-2 text-sm leading-snug">{issue.title}</p>

          {/* Bottom row */}
        </div>
      );

    case "list":
      return (
        <div className="group flex items-center gap-3 rounded border-b border-zinc-800/50 px-2 py-1.5 hover:bg-zinc-800/50">
          <span className="w-16 shrink-0 text-xs text-zinc-500">
            {issue.identifier}
          </span>
          <span className="flex-1 truncate text-sm">{issue.title}</span>

          <div className="ml-auto flex items-center gap-1 transition-opacity">
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
            {/* {displayProperties.showProject && issue?.project && (
          <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-400">
            {issue?.project?.name}
          </span>
        )} */}
          </div>
        </div>
      );
  }
};

export default IssueView;
