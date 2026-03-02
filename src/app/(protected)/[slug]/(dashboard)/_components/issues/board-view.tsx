"use client";

import { cn } from "@/lib/utils";
import { DraggableIssue, DroppableGroup } from "@/components/dnd-primitives";
import IssueView from "./issue-view";
import type { IssueContainer } from "@/components/context/issue-dnd-context";

export const BoardView = ({ containers }: { containers: IssueContainer[] }) => (
  <div className="scrollbar-thin flex h-full w-full max-w-7xl gap-4 overflow-x-auto overflow-y-hidden px-2 pb-4">
    {containers.map((container) => (
      <div
        key={container.id}
        className="flex w-full max-w-md shrink-0 flex-col"
      >
        <BoardColumnHeader container={container} />
        <DroppableGroup
          containerId={container.id}
          items={container.items}
          className="scrollbar-thin flex-1 space-y-2 overflow-y-auto rounded-lg p-2"
        >
          {container.items.map((issue) => (
            <DraggableIssue key={issue.id} issueId={issue.id}>
              <IssueView issue={issue} />
            </DraggableIssue>
          ))}
        </DroppableGroup>
      </div>
    ))}
  </div>
);

export const BoardColumnHeader = ({
  container,
}: {
  container: IssueContainer;
}) => (
  <div className="mb-2 flex items-center gap-2 px-1">
    <span className={cn("text-sm", container.color)}>{container.icon}</span>
    <span className="text-sm font-medium text-zinc-200">{container.label}</span>
    <span className="ml-auto rounded-full bg-zinc-800/80 px-1.5 py-0.5 text-xs text-zinc-500">
      {container.items.length}
    </span>
  </div>
);
