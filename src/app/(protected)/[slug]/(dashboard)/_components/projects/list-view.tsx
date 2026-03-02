import { cn } from "@/lib/utils";
import { Draggable, DroppableGroup } from "@/components/dnd-primitives";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@heroui/react";
import type { ProjectContainer } from "@/components/context/project-dnd-context";
import ProjectView from "./project-view";

export const ListView = ({
  containers,
}: {
  containers: ProjectContainer[];
}) => (
  <div className="scrollbar-thin h-full space-y-4 overflow-y-auto px-2">
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
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div>
      {/* Header */}
      <Button
        variant="ghost"
        onClick={() => setCollapsed((c) => !c)}
        className="group mb-1 flex w-full items-center hover:bg-zinc-800/40"
      >
        <span className={cn("text-sm", container.color)}>{container.icon}</span>
        <span className="text-sm font-medium text-zinc-200">
          {container.label}
        </span>
        <span className="ml-1 rounded-full bg-zinc-800/80 px-1.5 py-0.5 text-xs text-zinc-500">
          {container.items.length}
        </span>
        <ChevronDown
          size={13}
          className={cn(
            "ml-auto text-zinc-600 transition-transform duration-200 group-hover:text-zinc-400",
            collapsed && "-rotate-90",
          )}
        />
      </Button>

      {/* Droppable rows */}
      {!collapsed && (
        <DroppableGroup containerId={container.id} items={container.items}>
          {container.items.map((project) => (
            <Draggable key={project.id} id={project.id}>
              <ProjectView project={project} />
            </Draggable>
          ))}
        </DroppableGroup>
      )}
    </div>
  );
};
