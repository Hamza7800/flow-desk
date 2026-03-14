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
import { format } from "date-fns";

const ListCard = ({
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

  if (isPlaceholder) {
    return (
      <Card className="group ring-surface-secondary hover:bg-surface max-h-14 min-h-14 w-fit flex-row items-center rounded bg-[#101012] px-2 ring-1">
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

        <span className="shrink-0 text-sm text-white/70">
          {issue.identifier}
        </span>

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

        <span className="min-w-0 flex-1 truncate text-sm">{issue.title}</span>
      </Card>
    );
  }
  return (
    <Card
      onClick={() =>
        router.push(`/${slug}/team/${issue.teamId}/issue/${issue.id}`)
      }
      className="group hover:bg-surface max-h-14 min-h-14 flex-row items-center rounded bg-[#101012] px-2"
    >
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

      <span className="shrink-0 truncate text-sm text-white/70">
        {issue.identifier}
      </span>

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

      <span className="min-w-0 flex-1 truncate text-sm">{issue.title}</span>

      <div className="ml-auto flex items-center justify-end gap-3">
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

        {displayProperties.showCreatedAt && (
          <div className="hidden md:block">
            <span>{format(new Date(issue.createdAt), "MMM d")}</span>
          </div>
        )}

        {displayProperties.showUpdatedAt && (
          <div className="hidden md:block">
            <span>{format(new Date(issue.updatedAt), "MMM d")}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ListCard;
