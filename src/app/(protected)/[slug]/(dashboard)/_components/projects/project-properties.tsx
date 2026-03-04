import { useProjectDetails, useUpdateProjects } from "@/hooks/use-projects";
import type { Priority, Status } from "@/lib/contants";
import { projectSchema } from "@/zod-schema/project-schema";
import { useParams } from "next/navigation";
import AssigneeSelect from "../input-fields/assignee-select";
import InlineBlockNote from "../input-fields/block-note-input";
import InlineInput from "../input-fields/input";
import PrioritySelect from "../input-fields/priority-select";
import StatusSelect from "../input-fields/status-select";
import DateSelect from "../input-fields/date-picker";
import DeleteProject from "./delete-project";

const ProjectProperties = () => {
  const { id } = useParams<{ id: string }>();
  const { data: project, isError, error } = useProjectDetails(id);

  const updateProject = useUpdateProjects(project?.organizationId ?? "");

  if (isError) {
    return <h2>Error : {error.message}</h2>;
  }

  if (!project) {
    return <h2>No Project available</h2>;
  }

  return (
    <div>
      <div className="p-2">
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

        {/* Project Members */}
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

        <DateSelect
          label="Start Date"
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

        <DateSelect
          label="End Date"
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

        <DeleteProject
          orgId={project.organizationId}
          projectId={project.id}
          teamId={project?.teamId ?? ""}
        />
      </div>
    </div>
  );
};

export default ProjectProperties;
