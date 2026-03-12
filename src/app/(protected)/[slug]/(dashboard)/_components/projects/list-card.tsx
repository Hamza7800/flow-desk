import { useUpdateProjects } from "@/hooks/use-projects";
import { useProjectViewStore } from "@/store/project-view-store";
import { Card } from "@heroui/react";
import { useParams, useRouter } from "next/navigation";
import PrioritySelect from "../input-fields/priority-select";
import StatusSelect from "../input-fields/status-select";
import type { Projects } from "@/lib/dnd-config/project-groups";
import type { Priority, Status } from "@/lib/contants";
import AssigneeSelect from "../input-fields/assignee-select";

const ListCard = ({
  project,
  isPlaceholder,
}: {
  project: Projects[number];
  isPlaceholder?: boolean;
}) => {
  const router = useRouter();
  const { slug, teamId } = useParams<{ slug: string; teamId: string }>();
  const { displayProperties, viewMode } = useProjectViewStore();
  const updateProject = useUpdateProjects(project.organizationId);

  if (isPlaceholder) {
    return (
      <Card className="group ring-surface-secondary hover:bg-surface max-h-14 min-h-14 w-fit flex-row items-center rounded bg-[#101012] px-2 ring-1">
        <div className="grid grid-cols-2 gap-6">
          <span className="w-[130px] shrink-0 text-sm text-white/70">
            {project.identifier}
          </span>
          <span className="shrink-0 text-sm">{project.name}</span>
        </div>
      </Card>
    );
  }
  return (
    <Card
      onClick={() =>
        router.push(`/${slug}/team/${teamId}/project/${project.id}/overview`)
      }
      className="group hover:bg-surface max-h-14 min-h-14 flex-row items-center rounded bg-[#101012] px-2"
    >
      <div className="grid grid-cols-2 gap-6">
        <span className="w-[130px] shrink-0 text-sm text-white/70">
          {project.identifier}
        </span>
        <span className="shrink-0 text-sm">{project.name}</span>
      </div>

      <div className="ml-auto flex items-center justify-end gap-3">
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
        {displayProperties.showMembers && (
          // TODO: SELECT MULTIPLE MEMBERS
          <AssigneeSelect
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
        )}

        {/* {displayProperties.showCreatedAt && (
          <div>
            <span>{format(new Date(project.createdAt), "MMM d")}</span>
          </div>
        )}

        {displayProperties.showUpdatedAt && (
          <div>
            <span>{format(new Date(project.updatedAt), "MMM d")}</span>
          </div>
        )} */}
      </div>
    </Card>
  );
};

export default ListCard;
