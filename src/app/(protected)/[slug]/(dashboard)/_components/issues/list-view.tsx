import { cn } from "@/lib/utils";
import { Draggable, DroppableGroup } from "@/components/dnd-primitives";
import IssueView from "./issue-view";

import type { IssueContainer } from "@/components/context/issue-dnd-context";
import { Button, Card } from "@heroui/react";
import CreateIssueButton from "./create-issue-button";
import { usePathname } from "next/navigation";

export const ListView = ({ containers }: { containers: IssueContainer[] }) => (
  <div className="scrollbar-thin h-full overflow-y-auto px-2 pb-10">
    {containers.map((container) => (
      <CollapsibleListGroup key={container.id} container={container} />
    ))}
  </div>
);

const CollapsibleListGroup = ({ container }: { container: IssueContainer }) => {
  const pathname = usePathname();
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
          <div className="ml-auto">
            {pathname.includes("my-issues") ? null : (
              <CreateIssueButton label={container.label} />
            )}
          </div>
        </Card>
      </DroppableGroup>

      <DroppableGroup containerId={container.id} items={container.items}>
        {container.items.map((issue) => (
          <Draggable key={issue.id} id={issue.id}>
            <IssueView issue={issue} />
          </Draggable>
        ))}
      </DroppableGroup>
    </div>
  );
};
