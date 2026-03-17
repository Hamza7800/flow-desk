import { useUpdateProjects } from "@/hooks/use-projects";
import type { Projects } from "@/lib/dnd-config/project-groups";
import { useProjectViewStore } from "@/store/project-view-store";
import { Card } from "@heroui/react";
import PrioritySelect from "../input-fields/priority-select";
import type { Priority, Status } from "@/lib/contants";
import StatusSelect from "../input-fields/status-select";
import AssigneeSelect from "../input-fields/assignee-select";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import ProjectMembersSelect from "../input-fields/project-members-select";
import PermissionGate from "@/components/permission-gate";

const BoardCard = ({
  project,
  isPlaceholder,
}: {
  project: Projects[number];
  isPlaceholder?: boolean;
}) => {
  const router = useRouter();
  const { slug, teamId } = useParams<{ teamId: string; slug: string }>();

  const { displayProperties, viewMode } = useProjectViewStore();

  const updateProject = useUpdateProjects(project.organizationId);

  return (
    <Card
      onClick={
        () =>
          router.push(`/${slug}/team/${teamId}/project/${project.id}/overview`)
        // router.push(`/${slug}/issue/${issue.id}`)
      }
      className="gap-1 rounded-lg bg-[#17181b] p-1 px-2"
      // variant="secondary"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">{project.identifier}</p>
        <div className="flex gap-1">
          <div className="flex items-center justify-between">
            {project.priority === "high" && (
              <span className="rounded border border-yellow-500/30 bg-yellow-500/20 px-2 py-0.5 text-xs font-semibold text-yellow-400">
                HP
              </span>
            )}
          </div>{" "}
          {displayProperties.showMembers && (
            <PermissionGate permission="canManageProjectMembers">
              <ProjectMembersSelect
                teamId={teamId}
                selection="multiple"
                value={project.members?.map((a) => a.userId) ?? []}
                onChange={(values) =>
                  updateProject.mutate({
                    values: {
                      members: values,
                    },
                    teamId: project.teamId ?? "",
                    projectId: project.id,
                  })
                }
              />
            </PermissionGate>
          )}
        </div>
      </div>
      {/* Header with icon and priority */}

      <h3 className="text-sm font-medium text-white">{project.name}</h3>

      <div className="flex">
        {displayProperties.showPriority && (
          <PrioritySelect
            onChange={(value) =>
              updateProject.mutate({
                values: {
                  priority: value as Priority,
                },
                teamId: project.teamId ?? "",
                projectId: project.id,
              })
            }
            value={project.priority ?? ""}
          />
        )}
        {displayProperties.showStatus && (
          <StatusSelect
            onChange={(value) =>
              updateProject.mutate({
                values: {
                  status: value as Status,
                },
                teamId: project.teamId ?? "",
                projectId: project.id,
              })
            }
            value={project.status ?? ""}
          />
        )}
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
              Created {format(new Date(project.createdAt), "MMM d")}
            </span>
          </div>
        )}
        {displayProperties.showUpdatedAt && (
          <div>
            <span className="text-xs">
              Updated {format(new Date(project.updatedAt), "MMM d")}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default BoardCard;
