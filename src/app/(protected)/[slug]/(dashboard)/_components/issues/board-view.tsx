"use client";

import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import type { GroupedIssues } from "@/hooks/use-grouped-issues";
import { cn } from "@/lib/utils";
import { DraggableIssue, DroppableGroup } from "@/components/dnd-primitives";
import IssueView from "./issue-view";
import type { ListGroup } from "@/lib/types";

type Props = {
  groupedIssues: GroupedIssues;
};

export const BoardView = ({ groupedIssues }: Props) => {
  return (
    <div className="flex h-full gap-4 overflow-x-auto pb-4">
      {groupedIssues.map((group) => (
        <BoardColumn key={group.key} group={group} />
      ))}
    </div>
  );
};

const BoardColumn = ({ group }: ListGroup) => {
  return (
    <div className="flex w-72 shrink-0 flex-col">
      {/* Column header */}
      <div className="mb-3 flex items-center gap-2 px-1">
        <span className={cn("text-sm font-medium", group.color)}>
          {group.icon} {group.label}
        </span>
        <span className="ml-auto text-xs text-zinc-500">
          {group.issues.length}
        </span>
      </div>

      {/* Droppable + sortable column */}
      <DroppableGroup
        groupKey={group.key}
        className="min-h-24 flex-1 space-y-2 rounded-lg bg-zinc-900/50 p-2"
      >
        <SortableContext
          items={group.issues.map((i) => i.id)}
          strategy={rectSortingStrategy}
        >
          {group.issues.map((issue) => (
            <DraggableIssue key={issue.id} issueId={issue.id}>
              <IssueView issue={issue} />
            </DraggableIssue>
          ))}

          {group.issues.length === 0 && (
            <div className="flex h-16 items-center justify-center rounded border border-dashed border-zinc-700/50 text-xs text-zinc-600">
              Drop here
            </div>
          )}
        </SortableContext>
      </DroppableGroup>
    </div>
  );
};
