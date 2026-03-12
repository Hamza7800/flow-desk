import { cn } from "@/lib/utils";
import { Draggable, DroppableGroup } from "@/components/dnd-primitives";
import { Card } from "@heroui/react";
import type { ProjectContainer } from "@/components/context/project-dnd-context";
import ProjectView from "./project-view";
import CreateProjectButton from "./create-project-button";

export const ListView = ({
  containers,
}: {
  containers: ProjectContainer[];
}) => (
  <div className="scrollbar-thin h-full overflow-y-auto px-2 pb-10">
    {containers.map((container) => (
      <CollapsibleListGroup key={container.id} container={container} />
    ))}
  </div>
);

const CollapsibleListGroup = ({
  container,
}: {
  container: ProjectContainer;
}) => {
  return (
    <div>
      <DroppableGroup
        containerId={container.id}
        items={container.items}
        headerOnly
      >
        <Card
          variant="default"
          className="group flex w-full flex-row items-center justify-start p-2 px-4 text-white"
        >
          <span className={cn("text-sm", container.color)}>
            {container.icon}
          </span>
          <span className="text-sm font-medium text-zinc-200">
            {container.label}
          </span>
          <span className="ml-1 text-xs text-zinc-500">
            {container.items.length}
          </span>
        </Card>
      </DroppableGroup>

      <DroppableGroup containerId={container.id} items={container.items}>
        {container.items.map((project) => (
          <Draggable key={project.id} id={project.id}>
            <ProjectView project={project} />
          </Draggable>
        ))}
      </DroppableGroup>
    </div>
  );
};
