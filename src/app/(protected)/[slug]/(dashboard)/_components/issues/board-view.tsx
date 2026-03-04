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

export const BoardView = ({ containers }: { containers: IssueContainer[] }) => (
  <div className="scrollbar-thin flex h-full min-h-0 w-full flex-1 gap-4 overflow-x-auto overflow-y-hidden px-2 pb-4">
    {containers.map((container) => (
      <div
        key={container.id}
        className="flex h-full min-h-0 w-full max-w-md shrink-0 flex-col"
      >
        <BoardColumnHeader container={container} />

        <DroppableGroup
          containerId={container.id}
          items={container.items}
          className="scrollbar-thin flex-1 space-y-2 overflow-x-hidden overflow-y-auto rounded-lg p-2"
        >
          {container.items.map((issue) => (
            <Draggable key={issue.id} id={issue.id}>
              <IssueView issue={issue} />
            </Draggable>
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
}) => {
  const { teamId } = useParams<{ teamId: string }>();
  const { groupBy } = useIssueViewStore();

  const getDefaultValue = () => {
    switch (groupBy) {
      case "priority":
        return {
          priority: PRIORITY_OPTIONS.find((p) => p.label === container.label)
            ?.key! as Priority,
        };
      case "status":
        return {
          status: STATUS_OPTIONS.find((s) => s.label === container.label)
            ?.key! as Status,
        };
    }
  };
  return (
    <div className="mb-2 flex items-center gap-2 px-1">
      <span className={cn("text-sm", container.color)}>{container.icon}</span>
      <span className="text-sm font-medium text-zinc-200">
        {container.label}
      </span>
      <span className="ml-auto rounded-full bg-zinc-800/80 px-1.5 py-0.5 text-xs text-zinc-500">
        {container.items.length}
      </span>
      <CreateIssueModal
        defaultValues={getDefaultValue()}
        triggerText="+"
        teamId={teamId}
      />
    </div>
  );
};
