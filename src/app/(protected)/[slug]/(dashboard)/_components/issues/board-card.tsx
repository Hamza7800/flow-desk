import { useUpdateIssue } from "@/hooks/use-issues";
import type { IssuesType } from "@/server-actions/issues";
import { useIssueViewStore } from "@/store/issue-view-store";
import PrioritySelect from "../input-fields/priority-select";
import StatusSelect from "../input-fields/status-select";
import AssigneeSelect from "../input-fields/assignee-select";
import type { Priority, Status } from "@/lib/contants";
import { Card } from "@heroui/react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";

const BoardCard = ({
  issue,
  isPlaceholder,
}: {
  issue: NonNullable<IssuesType["data"]>[number];
  isPlaceholder?: boolean;
}) => {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const { displayProperties, viewMode } = useIssueViewStore();
  const updateIssue = useUpdateIssue({
    teamId: issue.teamId,
    projectId: issue.projectId,
    orgId: issue.organizationId,
  });

  return (
    <Card
      onClick={() => router.push(`/${slug}/issue/${issue.id}`)}
      className="gap-1 rounded-lg bg-[#17181b] p-1 px-2"
      // variant="secondary"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">{issue.identifier}</p>
        <div className="flex gap-1">
          <div className="flex items-center justify-between">
            {issue.priority === "high" && (
              <span className="rounded border border-yellow-500/30 bg-yellow-500/20 px-2 py-0.5 text-xs font-semibold text-yellow-400">
                HP
              </span>
            )}
          </div>{" "}
          {displayProperties.showAssignee && (
            <AssigneeSelect
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
      </div>
      {/* Header with icon and priority */}

      <h3 className="text-sm font-medium text-white">{issue.title}</h3>

      <div className="flex">
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

        {/* {displayProperties.showProject && (
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
            )} */}
      </div>

      <div className="flex gap-3">
        {displayProperties.showCreatedAt && (
          <div>
            <span className="text-xs">
              Created {format(new Date(issue.createdAt), "MMM d")}
            </span>
          </div>
        )}
        {displayProperties.showUpdatedAt && (
          <div>
            <span className="text-xs">
              Updated {format(new Date(issue.updatedAt), "MMM d")}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default BoardCard;
