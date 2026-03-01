"use client";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useState, useEffect, type ReactNode } from "react";
import type { Issues } from "@/lib/issue-config/issue-groups";
import { useIssueViewStore } from "@/store/issue-view-store";
import { useUpdateIssue } from "@/hooks/use-issues";
import { useOrganizationContext } from "./organization-client-context";

type Props = {
  issues: Issues;
  children: (orderedIssues: Issues) => ReactNode;
  renderOverlay?: (issue: Issues[number]) => ReactNode;
};

export const IssueDndContext = ({ issues, children, renderOverlay }: Props) => {
  const { groupBy } = useIssueViewStore();
  const { org } = useOrganizationContext();
  const [activeIssue, setActiveIssue] = useState<Issues[number] | null>(null);
  const isDragging = activeIssue !== null;

  const [orderedIssues, setOrderedIssues] = useState<Issues>(issues);

  useEffect(() => {
    if (!isDragging) {
      setOrderedIssues(issues);
    }
  }, [issues, isDragging]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const updateIssue = useUpdateIssue({ orgId: org?.id ?? "" });

  const handleDragStart = ({ active }: DragStartEvent) => {
    const issue = orderedIssues.find((i) => i.id === active.id);
    if (issue) setActiveIssue(issue);
  };

  // onDragOver fires continuously while dragging — use it for live reorder preview
  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over || active.id === over.id) return;

    const activeIndex = orderedIssues.findIndex((i) => i.id === active.id);
    const overIndex = orderedIssues.findIndex((i) => i.id === over.id);

    // Only reorder if both are issues (overIndex !== -1) and in the same group
    if (activeIndex === -1 || overIndex === -1) return;

    const activeIssue = orderedIssues[activeIndex];
    const overIssue = orderedIssues[overIndex];

    if (activeIssue?.[groupBy] === overIssue?.[groupBy]) {
      // Same group → reorder locally for live preview
      setOrderedIssues((prev) => arrayMove(prev, activeIndex, overIndex));
    }
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveIssue(null);
    if (!over || active.id === over.id) return;

    const draggedIssue = orderedIssues.find((i) => i.id === active.id);
    if (!draggedIssue) return;

    const overId = over.id as string;
    const overIssue = orderedIssues.find((i) => i.id === overId);
    const newGroupValue = overIssue ? overIssue[groupBy] : overId;
    const currentValue = draggedIssue[groupBy];

    if (newGroupValue === currentValue) return;

    setOrderedIssues((prev) =>
      prev.map((issue) =>
        issue.id === draggedIssue.id
          ? { ...issue, [groupBy]: newGroupValue }
          : issue,
      ),
    );

    updateIssue.mutate({
      issueId: draggedIssue.id,
      values: { [groupBy]: newGroupValue },
      teamId: draggedIssue.teamId ?? "",
    });
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* Render prop passes orderedIssues down so views use the local order */}
      {children(orderedIssues)}

      <DragOverlay>
        {activeIssue && renderOverlay ? renderOverlay(activeIssue) : null}
      </DragOverlay>
    </DndContext>
  );
};

// import {
//   DndContext,
//   DragOverlay,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   type DragEndEvent,
//   type DragStartEvent,
// } from "@dnd-kit/core";
// import { useState, type ReactNode } from "react";
// import { useUpdateIssue } from "@/hooks/use-issues";
// import { useIssueViewStore } from "@/store/issue-view-store";
// import type { Issues } from "@/lib/issue-config/issue-groups";
// import { useGroupedIssues } from "@/hooks/use-grouped-issues";

// type Props = {
//   issues: Issues;
//   orgId: string;
//   children: ReactNode;
//   renderOverlay?: (issue: Issues[number]) => ReactNode;
// };

// export const IssueDndContext = ({
//   issues,
//   orgId,
//   children,
//   renderOverlay,
// }: Props) => {
//   const { groupBy } = useIssueViewStore();
//   const [activeIssue, setActiveIssue] = useState<Issues[number] | null>(null);

//   const sensors = useSensors(
//     useSensor(PointerSensor, {
//       activationConstraint: { distance: 0 },
//     }),
//   );

//   const updateIssue = useUpdateIssue({ orgId });

//   const handleDragStart = ({ active }: DragStartEvent) => {
//     const issue = issues.find((i) => i.id === active.id);
//     if (issue) setActiveIssue(issue);
//   };

//   const handleDragEnd = ({ active, over }: DragEndEvent) => {
//     setActiveIssue(null);
//     if (!over || active.id === over.id) return;

//     const draggedIssue = issues.find((i) => i.id === active.id);
//     if (!draggedIssue) return;

//     const overId = over.id as string;
//     const overIssue = issues.find((i) => i.id === overId);

//     const newGroupValue = overIssue ? overIssue[groupBy] : overId;
//     const currentValue = draggedIssue[groupBy];

//     if (newGroupValue === currentValue) return;

//     // console.log({
//     //   [groupBy]: newGroupValue,
//     //   id: draggedIssue.id,
//     //   orgId,
//     //   teamId: draggedIssue.teamId ?? undefined,
//     //   projectId: draggedIssue.projectId ?? undefined,
//     // });

//     console.log(newGroupValue);

//     updateIssue.mutate({
//       issueId: draggedIssue.id,
//       values: { [groupBy]: newGroupValue },
//       teamId: draggedIssue.teamId ?? "",
//     });
//   };

//   return (
//     <DndContext
//       sensors={sensors}
//       onDragStart={handleDragStart}
//       onDragEnd={handleDragEnd}
//     >
//       {children}
//       <DragOverlay>
//         {activeIssue && renderOverlay ? renderOverlay(activeIssue) : null}
//       </DragOverlay>
//     </DndContext>
//   );
// };
