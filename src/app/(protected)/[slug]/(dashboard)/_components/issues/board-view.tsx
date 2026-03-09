import { cn } from "@/lib/utils";
import { Draggable, DroppableGroup } from "@/components/dnd-primitives";
import IssueView from "./issue-view";
import type { IssueContainer } from "@/components/context/issue-dnd-context";
import { CreateIssueModal } from "./create-issue";
import { useParams } from "next/navigation";
import { useIssueViewStore } from "@/store/issue-view-store";
import {
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
  type Priority,
  type Status,
} from "@/lib/contants";
import { Button, Card } from "@heroui/react";
import { useState } from "react";
import { PlusIcon } from "lucide-react";
import CreateIssueButton from "./create-issue-button";

export const BoardView = ({ containers }: { containers: IssueContainer[] }) => (
  <div className="scrollbar-thin flex h-full min-h-0 w-full flex-1 gap-2 overflow-x-auto overflow-y-hidden px-2">
    {containers.map((container) => (
      <Card
        // variant="tertiary"
        key={container.id}
        className="flex h-full min-h-0 w-full max-w-[340px] shrink-0 flex-col bg-[#0e0e0f] p-0"
      >
        <BoardColumnHeader container={container} />

        <DroppableGroup
          containerId={container.id}
          items={container.items}
          className="scrollbar-thin flex-1 space-y-2 overflow-x-hidden overflow-y-auto rounded-lg p-1.5"
        >
          {container.items.map((issue) => (
            <Draggable key={issue.id} id={issue.id}>
              <IssueView issue={issue} />
            </Draggable>
          ))}
        </DroppableGroup>
      </Card>
    ))}
  </div>
);

export const BoardColumnHeader = ({
  container,
}: {
  container: IssueContainer;
}) => {
  return (
    <>
      <div className="flex items-center gap-2 p-1">
        <span className={cn("text-sm", container.color)}>{container.icon}</span>
        <span className="text-sm font-medium text-zinc-200">
          {container.label}
        </span>
        <span className="ml-auto rounded-full bg-zinc-800/80 px-1.5 py-0.5 text-xs text-zinc-500">
          {container.items.length}
        </span>
        <CreateIssueButton container={container} />
      </div>
    </>
  );
};
