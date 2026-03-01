import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { GroupedIssues } from "@/hooks/use-grouped-issues";
import { cn } from "@/lib/utils";
import { DraggableIssue, DroppableGroup } from "@/components/dnd-primitives";
import { Accordion } from "@heroui/react";
import IssueView from "./issue-view";
import type { ListGroup } from "@/lib/types";

type Props = {
  groupedIssues: GroupedIssues;
};

export const ListView = ({ groupedIssues }: Props) => {
  return (
    <div className="space-y-6">
      {groupedIssues.map((group) => (
        <ListGroup key={group.key} group={group} />
      ))}
    </div>
  );
};

const ListGroup = ({ group }: ListGroup) => {
  return (
    <div>
      <Accordion>
        <Accordion.Item>
          <Accordion.Heading>
            <Accordion.Trigger>
              <span className={cn("text-sm font-medium", group.color)}>
                {group.icon} {group.label}
              </span>
              <span className="text-xs text-zinc-500">
                {group.issues.length}
              </span>
              <Accordion.Indicator />
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>
            <Accordion.Body>
              <DroppableGroup groupKey={group.key}>
                <SortableContext
                  items={group.issues.map((i) => i.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {group.issues.map((issue) => (
                    <DraggableIssue key={issue.id} issueId={issue.id}>
                      <IssueView issue={issue} />
                    </DraggableIssue>
                  ))}

                  {/* Empty drop target when group is empty */}
                  {group.issues.length === 0 && (
                    <div className="flex h-12 items-center justify-center rounded border border-dashed border-zinc-700/50 text-xs text-zinc-600">
                      Drop here
                    </div>
                  )}
                </SortableContext>
              </DroppableGroup>
            </Accordion.Body>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};
