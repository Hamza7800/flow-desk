"use client";
import { useProjectDetails, useUpdateProjects } from "@/hooks/use-projects";
import InlineBlockNote from "../input-fields/block-note-input";
import { projectSchema } from "@/zod-schema/project-schema";
import InlineInput from "../input-fields/input";
import { Label } from "@heroui/react";
import { EmptyState } from "@/components/empty-state";
import { Box } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const ProjectDetails = ({
  projectId,
  teamId,
}: {
  projectId: string;
  teamId: string;
}) => {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();

  const {
    data: project,
    isError,
    error,
  } = useProjectDetails(projectId, teamId);
  const updateProject = useUpdateProjects(project?.organizationId ?? "");

  if (isError) {
    return null;
  }

  if (!project) {
    return (
      <EmptyState
        icon={Box}
        title="No Project Found"
        description="The project you're looking for doesn't exist."
        action={{
          label: "My Issues",
          onClick: () => router.push(`/${slug}/my-issues/assigned`),
        }}
      />
    );
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
