import { useTeamProjects } from "@/hooks/use-projects";
import type { SelectProps } from "@/lib/types";
import { ListBox, Select, Spinner } from "@heroui/react";
import { FolderOpen } from "lucide-react";

interface Props extends SelectProps {
  orgId: string;
  teamId: string;
  mode?: "create" | "edit";
}

const NO_PROJECT = "no-project";
const ProjectSelect = ({
  orgId,
  teamId,
  value,
  mode = "edit",
  onChange,
}: Props) => {
  const { data: projects, isError, isPending } = useTeamProjects(teamId);

  if (isPending) return null;
  if (isError) return null;

  const currentProject = projects?.find((p) => p.id === value);

  return (
    <Select
      value={currentProject?.id ?? NO_PROJECT}
      aria-label="project"
      onChange={(key) => {
        onChange(key === NO_PROJECT ? "" : (key as string));
      }}
    >
      <Select.Trigger className="flex items-center justify-center rounded-md border-0 bg-transparent hover:bg-zinc-800 data-[pressed]:bg-zinc-800">
        <Select.Value>
          {({ isPlaceholder }) => {
            if (isPlaceholder || !currentProject) {
              return (
                <div className="flex items-center gap-2">
                  <FolderOpen size={16} />
                  {mode === "create" && <span>No Project</span>}
                </div>
              );
            }
            return (
              <span className="flex items-center gap-2 text-sm">
                <FolderOpen size={14} />
                {currentProject.name}
              </span>
            );
          }}
        </Select.Value>
      </Select.Trigger>

      <Select.Popover className="w-full max-w-[300px]" placement="bottom left">
        <ListBox>
          <ListBox.Item
            key={NO_PROJECT}
            id={NO_PROJECT}
            textValue="No Project"
            className=""
          >
            <span className="flex items-center gap-2">
              <FolderOpen size={14} />
              No Project
            </span>
            <ListBox.ItemIndicator />
          </ListBox.Item>

          {projects && projects.length > 0 ? (
            projects.map((project) => (
              <ListBox.Item
                key={project.id}
                id={project.id}
                textValue={project.name}
              >
                <span className="flex items-center gap-2">
                  <FolderOpen size={14} />
                  {project.name}
                </span>
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))
          ) : (
            <ListBox.Item
              key="empty"
              isDisabled
              id="empty"
              textValue="No Projects"
            >
              No Projects available
            </ListBox.Item>
          )}
        </ListBox>
      </Select.Popover>
    </Select>
  );
};

export default ProjectSelect;
