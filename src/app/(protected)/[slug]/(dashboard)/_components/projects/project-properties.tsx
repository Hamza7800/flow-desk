import { useProjectDetails, useUpdateProjects } from "@/hooks/use-projects";
import type { Priority, Status } from "@/lib/contants";
import { useParams } from "next/navigation";
import AssigneeSelect from "@/app/(protected)/[slug]/(dashboard)/_components/input-fields/assignee-select";
import PrioritySelect from "@/app/(protected)/[slug]/(dashboard)/_components/input-fields/priority-select";
import StatusSelect from "@/app/(protected)/[slug]/(dashboard)/_components/input-fields/status-select";
import DateSelect from "@/app/(protected)/[slug]/(dashboard)/_components/input-fields/date-picker";
import DeleteProject from "@/app/(protected)/[slug]/(dashboard)/_components/projects/delete-project";
import PermissionGate from "@/components/permission-gate";
import { ErrorMessage, Label, Separator } from "@heroui/react";
import { useProjectLead } from "@/hooks/use-member-role";
import { usePermissions } from "@/hooks/use-permissions";

const ProjectProperties = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project, isError, error } = useProjectDetails(projectId);
  const { data: isProjectLead } = useProjectLead(projectId);
  const { canManageProjectMembers } = usePermissions({
    projectLead: isProjectLead || false,
  });
  const updateProject = useUpdateProjects(project?.organizationId ?? "");

  if (isError) {
    return <ErrorMessage>Error : {error?.message}</ErrorMessage>;
  }

  if (!project) {
    return null;
  }

  return (
    <div className="space-y-2 p-1">
      <div className="flex items-center gap-4">
        <Label className="w-[100px]">Priority</Label>
        <div className="w-full">
          <PrioritySelect
            mode="create"
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
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Label className="w-[100px]">Status</Label>
        <div className="w-full">
          <StatusSelect
            mode="create"
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
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Label className="w-[100px]">Lead</Label>
        <div className="w-full">
          <AssigneeSelect
            isDisabled={!canManageProjectMembers}
            mode="create"
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
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Label className="w-[100px]">Members</Label>
        <div className="w-full">
          <AssigneeSelect
            isDisabled={!canManageProjectMembers}
            mode="create"
            selection="multiple"
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
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Label className="w-[100px]">Start Date</Label>
        <div className="w-full">
          <DateSelect
            placeholderText="Start"
            value={project.startDate}
            onChange={(value) =>
              updateProject.mutate({
                values: {
                  startDate: value,
                },
                teamId: project.teamId ?? "",
                projectId: project.id,
              })
            }
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Label className="w-[100px]">End Date</Label>
        <div className="w-full">
          <DateSelect
            placeholderText="End"
            value={project.endDate}
            onChange={(value) =>
              updateProject.mutate({
                values: {
                  endDate: value,
                },
                teamId: project.teamId ?? "",
                projectId: project.id,
              })
            }
          />
        </div>
      </div>

      <Separator className="my-4 mb-2" />

      <PermissionGate permission="canDeleteProject">
        <DeleteProject
          orgId={project.organizationId}
          projectId={project.id}
          teamId={project?.teamId ?? ""}
        />
      </PermissionGate>
    </div>
  );
};

export default ProjectProperties;
