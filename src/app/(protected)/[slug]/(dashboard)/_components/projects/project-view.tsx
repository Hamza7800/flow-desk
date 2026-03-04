import PrioritySelect from "../input-fields/priority-select";
import StatusSelect from "../input-fields/status-select";
import AssigneeSelect from "../input-fields/assignee-select";
import { Card } from "@heroui/react";
import { useParams, useRouter } from "next/navigation";
import type { Projects } from "@/lib/dnd-config/project-groups";
import { useProjectViewStore } from "@/store/project-view-store";
import { useUpdateProjects } from "@/hooks/use-projects";
import type { Priority, Status } from "@/lib/contants";

const ProjectView = ({ project }: { project: Projects[number] }) => {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const { displayProperties, viewMode } = useProjectViewStore();
  const updateProject = useUpdateProjects(project.organizationId);

  switch (viewMode) {
    case "board":
      return (
        <Card
          onClick={() => router.push(`/${slug}/project/${project.id}/overview`)}
          className="rounded-lg p-4"
          variant="secondary"
        >
          {/* Header with icon and priority */}
          <div className="flex items-start justify-between">
            {project.priority === "high" && (
              <span className="rounded border border-yellow-500/30 bg-yellow-500/20 px-2 py-0.5 text-xs font-semibold text-yellow-400">
                HP
              </span>
            )}
          </div>

          {/* Task ID and title */}
          <div className="space-y-1">
            <p className="text-xs text-gray-500">{project.identifier}</p>
            <h3 className="text-sm font-medium text-white">{project.name}</h3>
          </div>

          <div className="flex flex-col gap-2 pt-1">
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
            {displayProperties.showLead && (
              <AssigneeSelect
                label="Lead"
                value={[project.leadId ?? ""]}
                onChange={(values) =>
                  updateProject.mutate({
                    values: {
                      leadId: values,
                    },
                    teamId: project.teamId ?? "",
                    projectId: project.id,
                  })
                }
              />
            )}

            {displayProperties.showMembers && (
              <AssigneeSelect
                label="Members"
                value={project.members.map((user) => user.userId) ?? []}
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
            )}

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

          {/* <p className="text-xs text-gray-500">Created {new Date(issue.createdAt)}</p> */}
        </Card>
      );

    case "list":
      return (
        <Card
          onClick={() => router.push(`/${slug}/project/${project.id}/overview`)}
          variant="tertiary"
          className="group mb-1 grid grid-cols-2 items-center gap-3 rounded border-b border-zinc-800/50 px-2 py-1.5 hover:bg-zinc-800/90"
        >
          <span className="w-16 shrink-0 text-xs text-zinc-500">
            {project.identifier}
            <span className="w-full flex-1 truncate text-sm">
              {project.name}
            </span>
          </span>

          <div className="flex w-full items-center gap-1 transition-opacity">
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
            {/* {displayProperties.showAssignee && (
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
            )} */}
            {/* {displayProperties.showProject && issue?.project && (
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
            )} */}
          </div>
        </Card>
      );
  }
};

export default ProjectView;
