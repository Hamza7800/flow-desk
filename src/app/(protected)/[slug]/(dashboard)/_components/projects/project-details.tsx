"use client";
import { useProjectDetails, useUpdateProjects } from "@/hooks/use-projects";
import type { ProjectType } from "@/server-actions/projects";
import InlineBlockNote from "../input-fields/block-note-input";
import { projectSchema } from "@/zod-schema/project-schema";
import InlineInput from "../input-fields/input";
import { Label } from "@heroui/react";

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
    <div className="scrollbar-thin h-screen overflow-y-auto p-2 pb-28">
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

      <Label>Description</Label>
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
