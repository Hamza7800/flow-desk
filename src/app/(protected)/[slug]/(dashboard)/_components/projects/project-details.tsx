"use client";
import { useProjectDetails, useUpdateProjects } from "@/hooks/use-projects";
import type { ProjectType } from "@/server-actions/projects";
import AssigneeSelect from "../input-fields/assignee-select";
import PrioritySelect from "../input-fields/priority-select";
import StatusSelect from "../input-fields/status-select";
import InlineBlockNote from "../input-fields/block-note-input";
import { projectSchema } from "@/zod-schema/project-schema";
import InlineInput from "../input-fields/input";
import type { Priority, Status } from "@/lib/contants";
import DateSelect from "../input-fields/date-picker";

const ProjectDetails = ({
  initialData,
  projectId,
}: {
  projectId: string;
  initialData: ProjectType["data"];
}) => {
  const {
    data: project,
    isError,
    error,
  } = useProjectDetails(projectId, undefined, initialData);
  const updateProject = useUpdateProjects(project?.organizationId ?? "");

  if (isError) {
    return <h2>Error : {error.message}</h2>;
  }

  if (!project) {
    return <h2>No Project available</h2>;
  }

  return (
    <div className="scrollbar-thin h-full overflow-y-auto p-2 pb-28">
      <InlineInput
        initialValue={project.name}
        onSave={(val) =>
          updateProject.mutate({
            values: {
              name: val,
            },
            teamId: project.teamId ?? "",
            projectId: project.id,
          })
        }
        schema={projectSchema.shape.name}
        debounceMs={700}
        placeholder="Project Name"
        label="Name"
      />

      <InlineInput
        initialValue={project.summary ?? ""}
        onSave={(val) =>
          updateProject.mutate({
            values: {
              summary: val,
            },
            teamId: project.teamId ?? "",
            projectId: project.id,
          })
        }
        schema={projectSchema.shape.summary}
        debounceMs={700}
        placeholder="Summary"
        label="Summary"
      />

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

      <InlineBlockNote
        initialValue={project.description ?? ""}
        onSave={(value) => {
          updateProject.mutate({
            values: {
              description: value,
            },
            teamId: project.teamId ?? "",
            projectId: project.id,
          });
        }}
        schema={projectSchema.shape.description}
        debounceMs={700}
        label="Description"
        placeholder="Description"
      />
    </div>
  );
};

export default ProjectDetails;
