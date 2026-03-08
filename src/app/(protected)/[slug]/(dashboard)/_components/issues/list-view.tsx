import { cn } from "@/lib/utils";
import { Draggable, DroppableGroup } from "@/components/dnd-primitives";
import IssueView from "./issue-view";

import type { IssueContainer } from "@/components/context/issue-dnd-context";
import { Button } from "@heroui/react";

export const ListView = ({ containers }: { containers: IssueContainer[] }) => (
  <div className="scrollbar-thin mb-14 h-full overflow-y-auto px-2">
    {containers.map((container) => (
      <CollapsibleListGroup key={container.id} container={container} />
    ))}
  </div>
);

const CollapsibleListGroup = ({ container }: { container: IssueContainer }) => {
  // const [collapsed, setCollapsed] = useState(false);

  return (
    <div>
      <DroppableGroup
        containerId={container.id}
        items={container.items}
        headerOnly
      >
        <Button
          variant="tertiary"
          // isDisabled
          // onClick={() => setCollapsed((c) => !c)}
          className="group flex w-full items-center justify-start text-white"
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
          {/* <ChevronDown
            size={13}
            className={cn(
              "ml-auto text-zinc-600 transition-transform duration-200 group-hover:text-zinc-400",
              collapsed && "-rotate-90",
            )}
          /> */}
        </Button>
      </DroppableGroup>

      {/* {!collapsed && ( */}
      <DroppableGroup containerId={container.id} items={container.items}>
        {container.items.map((issue) => (
          <Draggable key={issue.id} id={issue.id}>
            <IssueView issue={issue} />
          </Draggable>
        ))}
      </DroppableGroup>
      {/* )} */}
    </div>
  );
};
