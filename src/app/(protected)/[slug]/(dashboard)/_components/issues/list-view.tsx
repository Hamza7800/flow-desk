import { cn } from "@/lib/utils";
import { DraggableIssue, DroppableGroup } from "@/components/dnd-primitives";
import IssueView from "./issue-view";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { IssueContainer } from "@/components/context/issue-dnd-context";
import { Button } from "@heroui/react";

export const ListView = ({ containers }: { containers: IssueContainer[] }) => (
  <div className="scrollbar-thin h-full space-y-4 overflow-y-auto px-2">
    {containers.map((container) => (
      <CollapsibleListGroup key={container.id} container={container} />
    ))}
  </div>
);

const CollapsibleListGroup = ({ container }: { container: IssueContainer }) => {
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
          {container.items.map((issue) => (
            <DraggableIssue key={issue.id} issueId={issue.id}>
              <IssueView issue={issue} />
            </DraggableIssue>
          ))}
        </DroppableGroup>
      )}
    </div>
  );
};
