import { useTeamProjects } from "@/hooks/use-projects";
import type { SelectProps } from "@/lib/types";
import { Label, ListBox, Select, Spinner } from "@heroui/react";

interface Props extends SelectProps {
  orgId: string;
  teamId: string;
}

const ProjectSelect = ({ orgId, teamId, value, onChange }: Props) => {
  const { data: projects, isError, isPending } = useTeamProjects(orgId, teamId);

  if (isPending) {
    return <Spinner />;
  }

  if (isError) {
    return <h2>Unable to get team projects</h2>;
  }

  const currentProject = projects?.find((p) => p.id === value);

  return (
    <Select
      placeholder="Project"
      className={"w-full"}
      value={currentProject?.id}
      onChange={(value) => {
        onChange(value as string);
      }}
    >
      <Label>Project</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {projects && projects?.length > 0 ? (
            projects?.map((project) => (
              <ListBox.Item
                key={project.id}
                id={project.id}
                textValue={project.name}
              >
                {project.name}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))
          ) : (
            <ListBox.Item
              key={"no-project"}
              isDisabled
              id={"no-project"}
              textValue={"No Projects"}
            >
              No Projects
              <ListBox.ItemIndicator />
            </ListBox.Item>
          )}
        </ListBox>
      </Select.Popover>
    </Select>
  );
};

export default ProjectSelect;
