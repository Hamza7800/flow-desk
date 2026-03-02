import { cn } from "@/lib/utils";
import { DraggableIssue, DroppableGroup } from "@/components/dnd-primitives";
import IssueView from "./issue-view";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { IssueContainer } from "@/components/context/issue-dnd-context";

export const ListGroupHeader = ({
  container,
}: {
  container: IssueContainer;
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <button
      onClick={() => setCollapsed((c) => !c)}
      className="group mb-1 flex w-full items-center gap-2 rounded px-1 py-1 text-left hover:bg-zinc-800/40"
    >
      <span className={cn("text-sm", container.color)}>{container.icon}</span>
      <span className="text-sm font-medium text-zinc-200">
        {container.label}
      </span>
      <span className="rounded-full bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-500">
        {container.items.length}
      </span>
      <ChevronDown
        size={14}
        className={cn(
          "ml-auto text-zinc-500 transition-transform duration-200",
          collapsed && "-rotate-90",
        )}
      />
    </button>
  );
};

// Updated ListView with collapse support
export const ListView = ({ containers }: { containers: IssueContainer[] }) => (
  <div className="space-y-4">
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
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="group mb-1 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-zinc-800/40"
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
      </button>

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

// const ListGroup = ({ group }: ListGroup) => {
//   return (
//     <div>
//       <Accordion>
//         <Accordion.Item>
//           <Accordion.Heading>
//             <Accordion.Trigger>
//               <span className={cn("text-sm font-medium", group.color)}>
//                 {group.icon} {group.label}
//               </span>
//               <span className="text-xs text-zinc-500">
//                 {group.issues.length}
//               </span>
//               <Accordion.Indicator />
//             </Accordion.Trigger>
//           </Accordion.Heading>
//           <Accordion.Panel>
//             <Accordion.Body>
//               <DroppableGroup groupKey={group.key}>
//                 <SortableContext
//                   items={group.issues.map((i) => i.id)}
//                   strategy={verticalListSortingStrategy}
//                 >
//                   {group.issues.map((issue) => (
//                     <DraggableIssue key={issue.id} issueId={issue.id}>
//                       <IssueView issue={issue} />
//                     </DraggableIssue>
//                   ))}

//                   {/* Empty drop target when group is empty */}
//                   {group.issues.length === 0 && (
//                     <div className="flex h-12 items-center justify-center rounded border border-dashed border-zinc-700/50 text-xs text-zinc-600">
//                       Drop here
//                     </div>
//                   )}
//                 </SortableContext>
//               </DroppableGroup>
//             </Accordion.Body>
//           </Accordion.Panel>
//         </Accordion.Item>
//       </Accordion>
//     </div>
//   );
// };
