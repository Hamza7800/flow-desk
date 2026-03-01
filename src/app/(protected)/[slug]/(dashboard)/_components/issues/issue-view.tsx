import { useUpdateIssue } from "@/hooks/use-issues";
import type { IssuesType } from "@/server-actions/issues";
import { useIssueViewStore } from "@/store/issue-view-store";
import PrioritySelect from "../input-fields/priority-select";
import StatusSelect from "../input-fields/status-select";
import AssigneeSelect from "../input-fields/assignee-select";
import type { Priority, Status } from "@/lib/contants";

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
        <div className="space-y-2 rounded-md border border-zinc-700/50 bg-zinc-800/80 p-3 transition-colors hover:border-zinc-600">
          {/* Top row */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">{issue.identifier}</span>
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
          </div>

          {/* Title */}
          <p className="line-clamp-2 text-sm leading-snug">{issue.title}</p>

          {/* Bottom row */}
          <div className="flex items-center gap-2 pt-1">
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
              <div className="ml-auto">
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
              </div>
            )}
          </div>
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
